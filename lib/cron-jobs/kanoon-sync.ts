import { PrismaClient } from '@prisma/client';
import { fetchIndianKanoonData, fetchCaseByTid, IKanoonResult } from '../kanoon-api';
import cron from 'node-cron';

const prisma = new PrismaClient();

// Helper function to retry API calls
async function fetchIndianKanoonDataWithRetry(props: any, maxRetries = 3): Promise<IKanoonResult[]> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API attempt ${attempt}/${maxRetries}`);
      const result = await fetchIndianKanoonData(props);
      
      if (result.length > 0) {
        console.log(`✅ API call successful on attempt ${attempt}`);
        return result;
      } else if (attempt === maxRetries) {
        console.warn(`⚠️ No data returned after ${maxRetries} attempts`);
        return [];
      } else {
        console.log(`🔄 No data on attempt ${attempt}, retrying...`);
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    } catch (error) {
      console.error(`❌ API attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        console.error(`💥 All ${maxRetries} attempts failed`);
        return [];
      } else {
        console.log(`🔄 Retrying in ${2 * attempt} seconds...`);
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
  return [];
}

// Helper function to map docsource to category
function mapDocSourceToCategory(docsource: string): string | null {
  const source = docsource.toLowerCase();
  
  if (source.includes('income tax appellate tribunal') || source.includes('itat')) {
    return 'ITAT';
  }
  if (source.includes('gst') || source.includes('goods and services tax')) {
    return 'GST';
  }
  if (source.includes('income tax') && !source.includes('appellate tribunal')) {
    return 'INCOME_TAX';
  }
  if (source.includes('high court')) {
    return 'HIGH_COURT';
  }
  if (source.includes('supreme court')) {
    return 'SUPREME_COURT';
  }
  if (source.includes('tribunal')) {
    return 'TRIBUNAL_COURT';
  }
  
  return null; // Default to null if no match
}

async function syncKanoonData() {
  try {
    console.log('🔄 Starting Kanoon data sync...');
    console.log('📅 Sync time:', new Date().toISOString());
    
    // Fetch cases from page 1 only as requested
    const cases: IKanoonResult[] = await fetchIndianKanoonDataWithRetry({ pagenum: 1 });
    console.log(`📊 Fetched ${cases.length} cases from Indian Kanoon API (page 1)`);

    let newCases = 0;
    let updatedCases = 0;
    let newDetails = 0;
    let updatedDetails = 0;
    let errors = 0;

    for (const caseData of cases) {
      try {
        console.log(`🔍 Processing TID: ${caseData.tid}`);
        
        // Check if case already exists in CaseLaw table
        const existingCaseLaw = await prisma.caseLaw.findUnique({
          where: { tid: caseData.tid }
        });

        // Map docsource to category
        const category = mapDocSourceToCategory(caseData.docsource);

        // Prepare CaseLaw data according to your schema
        const caseLawData = {
          tid: caseData.tid,
          authorid: null, // API doesn't provide this in search results
          bench: null, // API doesn't provide this in search results
          catids: null, // API doesn't provide this in search results
          docsize: caseData.docsize,
          docsource: caseData.docsource,
          doctype: null, // API doesn't provide this in search results
          fragment: true, // Based on your example data
          headline: caseData.headline,
          numcitedby: caseData.numcitedby,
          numcites: 0, // Will be updated from detail API
          publishdate: caseData.publishdate,
          title: caseData.title,
          category: category as any,
        };

        // Create or update CaseLaw
        if (existingCaseLaw) {
          await prisma.caseLaw.update({
            where: { tid: caseData.tid },
            data: caseLawData
          });
          updatedCases++;
          console.log(`✅ Updated CaseLaw TID: ${caseData.tid}`);
        } else {
          await prisma.caseLaw.create({
            data: caseLawData
          });
          newCases++;
          console.log(`🆕 Created new CaseLaw TID: ${caseData.tid}`);
        }

        // Now fetch detailed case information
        try {
          console.log(`📄 Fetching details for TID: ${caseData.tid}`);
          const caseDetail = await fetchCaseByTid(caseData.tid);
          
          if (caseDetail) {
            // Check if detail already exists
            const existingDetail = await prisma.caseDetail.findUnique({
              where: { tid: caseData.tid }
            });

            // Prepare CaseDetail data according to your schema
            const caseDetailData = {
              tid: caseData.tid,
              agreement: caseDetail.agreement || false,
              citetid: caseDetail.citetid || null,
              courtcopy: caseDetail.courtcopy || false,
              divtype: caseDetail.divtype || null,
              doc: caseDetail.doc || '',
              docsource: caseDetail.docsource || caseData.docsource,
              numcitedby: caseDetail.numcitedby || 0,
              numcites: caseDetail.numcites || 0,
              publishdate: caseDetail.publishdate || caseData.publishdate,
              queryAlert: caseDetail.query_alert || null,
              title: caseDetail.title || caseData.title,
              updatedAt: new Date(),
            };

            // Create or update CaseDetail
            if (existingDetail) {
              await prisma.caseDetail.update({
                where: { tid: caseData.tid },
                data: caseDetailData
              });
              updatedDetails++;
              console.log(`✅ Updated CaseDetail TID: ${caseData.tid}`);
            } else {
              await prisma.caseDetail.create({
                data: {
                  ...caseDetailData,
                  createdAt: new Date(),
                }
              });
              newDetails++;
              console.log(`🆕 Created new CaseDetail TID: ${caseData.tid}`);
            }

            // Update numcites in CaseLaw with data from detail if available
            if (caseDetail.numcites && caseDetail.numcites !== caseLawData.numcites) {
              await prisma.caseLaw.update({
                where: { tid: caseData.tid },
                data: { 
                  numcites: caseDetail.numcites,
                }
              });
            }
          }

          // Add delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (detailError) {
          console.warn(`⚠️ Could not fetch details for TID ${caseData.tid}:`, detailError);
          // Continue with next case even if detail fetch fails
        }

      } catch (error) {
        console.error(`❌ Error processing case TID ${caseData.tid}:`, error);
        errors++;
      }
    }

    const summary = {
      newCaseLaws: newCases,
      updatedCaseLaws: updatedCases,
      newCaseDetails: newDetails,
      updatedCaseDetails: updatedDetails,
      errors: errors,
      totalProcessed: cases.length
    };

    console.log('✨ Sync completed successfully!');
    console.log('📊 Summary:', summary);
    
    // Log sync statistics to database (optional)
    await logSyncStats(summary);

    return summary;

  } catch (error) {
    console.error('💥 Fatal error during Kanoon data sync:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Optional: Create a sync log table entry
async function logSyncStats(summary: any) {
  try {
    // You can create a SyncLog model if you want to track sync history
    console.log('📝 Sync statistics logged:', summary);
  } catch (error) {
    console.error('Failed to log sync statistics:', error);
  }
}

// Schedule cron job to run every 24 hours at 2:00 AM IST
export function startKanoonSyncCron() {
  console.log('🚀 Starting Kanoon sync cron job...');
  console.log('⏰ Scheduled to run daily at 2:00 AM IST');
  
  // Run every day at 2:00 AM IST
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Kanoon sync cron job triggered at:', new Date().toISOString());
    try {
      await syncKanoonData();
      console.log('✅ Scheduled sync completed successfully');
    } catch (error) {
      console.error('❌ Scheduled sync failed:', error);
    }
  });

  console.log('✅ Cron job scheduled successfully');
}

// Manual sync function for testing
export async function runManualSync() {
  console.log('🔧 Running manual Kanoon sync...');
  try {
    const result = await syncKanoonData();
    console.log('✅ Manual sync completed successfully');
    return result;
  } catch (error) {
    console.error('❌ Manual sync failed:', error);
    throw error;
  }
}

// Function to get sync status
export async function getSyncStatus() {
  try {
    const totalCases = await prisma.caseLaw.count();
    const totalDetails = await prisma.caseDetail.count();
    const lastSync = await prisma.caseLaw.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true }
    });

    return {
      totalCases,
      totalDetails,
      lastSyncTime: lastSync?.updatedAt || null,
      detailsCoverage: totalCases > 0 ? ((totalDetails / totalCases) * 100).toFixed(2) + '%' : '0%'
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return null;
  }
}

export default { 
  startKanoonSyncCron, 
  runManualSync, 
  getSyncStatus 
};