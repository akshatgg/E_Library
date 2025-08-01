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

// Helper function to get search query for each category
function getCategorySearchQuery(category: string): string {
  switch (category) {
    case 'ITAT':
      return "(income tax appellate tribunal OR ITAT OR income-tax appellate tribunal OR income tax appellate court)";
    case 'GST':
      return "(GST OR goods and services tax OR goods service tax OR central excise OR customs)";
    case 'INCOME_TAX':
      return "(income tax -appellate -tribunal OR IT department OR income tax officer OR ITO)";
    case 'HIGH_COURT':
      return "(high court OR HC OR delhi high court OR mumbai high court OR calcutta high court)";
    case 'SUPREME_COURT':
      return "(supreme court OR SC OR apex court OR hon'ble supreme court)";
    case 'TRIBUNAL_COURT':
      return "(tribunal OR appellate tribunal OR CESTAT OR NCLAT OR NGT)";
    default:
      return "(income tax appellate tribunal OR ITAT OR GST OR supreme court OR high court)";
  }
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

async function syncKanoonData(targetCategory?: string) {
  try {
    console.log('🔄 Starting Kanoon data sync...');
    console.log('📅 Sync time:', new Date().toISOString());
    
    let searchQuery: string;
    let categoryFilter: string | null = null;
    
    if (targetCategory) {
      searchQuery = getCategorySearchQuery(targetCategory);
      categoryFilter = targetCategory;
      console.log(`🎯 Syncing specific category: ${targetCategory}`);
      console.log(`🔍 Using search query: ${searchQuery}`);
    } else {
      // Default search for all categories
      searchQuery = "(income tax appellate tribunal OR ITAT OR income-tax appellate tribunal OR income tax appellate court)";
      console.log('🌐 Syncing all categories with default query');
    }
    
    // Fetch cases from pages 1 to 3 for comprehensive data
    const allCases: IKanoonResult[] = [];
    const pagesToFetch = [1, 2, 3];
    
    for (const pageNum of pagesToFetch) {
      try {
        console.log(`📄 Fetching page ${pageNum}...`);
        const pageCases: IKanoonResult[] = await fetchIndianKanoonDataWithRetry({ 
          pagenum: pageNum,
          formInput: searchQuery 
        });
        
        allCases.push(...pageCases);
        console.log(`📊 Fetched ${pageCases.length} cases from page ${pageNum}`);
        
        // Add delay between page requests to respect API rate limits
        if (pageNum < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }
      } catch (error) {
        console.error(`❌ Error fetching page ${pageNum}:`, error);
        // Continue with next page even if one fails
      }
    }
    
    const cases = allCases;
    console.log(`📊 Total fetched ${cases.length} cases from pages 1-3`);

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
        const detectedCategory = mapDocSourceToCategory(caseData.docsource);
        
        // Determine final category
        let finalCategory: string | null;
        
        if (categoryFilter) {
          // When targeting a specific category, save all returned cases with that category
          // This ensures we get the cases we searched for
          finalCategory = categoryFilter;
          console.log(`✅ Processing TID: ${caseData.tid} - Assigning target category: ${finalCategory} (detected: ${detectedCategory})`);
        } else {
          // For general sync, use detected category
          finalCategory = detectedCategory;
          console.log(`✅ Processing TID: ${caseData.tid} - Using detected category: ${finalCategory}`);
        }

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
          category: finalCategory as any,
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
      category: targetCategory || 'ALL',
      searchQuery: searchQuery,
      newCaseLaws: newCases,
      updatedCaseLaws: updatedCases,
      newCaseDetails: newDetails,
      updatedCaseDetails: updatedDetails,
      errors: errors,
      totalProcessed: cases.length,
      syncTime: new Date().toISOString()
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

// Schedule cron jobs for each category to run every 48 hours
export function startKanoonSyncCron() {
  console.log('🚀 Starting Kanoon sync cron jobs...');
  console.log('⏰ Each category scheduled to run every 48 hours');
  
  const categories = ["ITAT", "GST", "INCOME_TAX", "HIGH_COURT", "SUPREME_COURT", "TRIBUNAL_COURT"];
  
  categories.forEach((category, index) => {
    // Stagger the start times by 4 hours for each category to avoid API overload
    // ITAT: 2:00 AM, GST: 6:00 AM, INCOME_TAX: 10:00 AM, etc.
    const startHour = 2 + (index * 4);
    const cronExpression = `0 ${startHour} * * *`; // Every days at specific hour
    
    console.log(`📅 Scheduling ${category} sync every 48 hours at ${startHour}:00`);
    
    cron.schedule(cronExpression, async () => {
      console.log(`⏰ ${category} sync cron job triggered at:`, new Date().toISOString());
      try {
        await syncKanoonData(category);
        console.log(`✅ Scheduled ${category} sync completed successfully`);
      } catch (error) {
        console.error(`❌ Scheduled ${category} sync failed:`, error);
      }
    });
  });

  console.log('✅ All category cron jobs scheduled successfully');
}

// Manual sync function for testing
export async function runManualSync(category?: string) {
  console.log('🔧 Running manual Kanoon sync...');
  if (category) {
    console.log(`🎯 Targeting category: ${category}`);
  }
  try {
    const result = await syncKanoonData(category);
    console.log('✅ Manual sync completed successfully');
    return result;
  } catch (error) {
    console.error('❌ Manual sync failed:', error);
    throw error;
  }
}

// Function to get sync status
export async function getSyncStatus(category?: string) {
  try {
    let whereClause = {};
    if (category) {
      whereClause = { category: category as any };
    }

    const totalCases = await prisma.caseLaw.count({ where: whereClause });
    const totalDetails = await prisma.caseDetail.count();
    const lastSync = await prisma.caseLaw.findFirst({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true, category: true }
    });

    return {
      category: category || 'ALL',
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

// Function to get status for all categories
export async function getAllCategoriesStatus() {
  try {
    const categories = ["ITAT", "GST", "INCOME_TAX", "HIGH_COURT", "SUPREME_COURT", "TRIBUNAL_COURT"];
    const statusPromises = categories.map(category => getSyncStatus(category));
    const overallStatus = await getSyncStatus(); // All categories
    
    const categoryStatuses = await Promise.all(statusPromises);
    
    return {
      overall: overallStatus,
      categories: categoryStatuses
    };
  } catch (error) {
    console.error('Error getting all categories status:', error);
    return null;
  }
}

export default { 
  startKanoonSyncCron, 
  runManualSync, 
  getSyncStatus,
  getAllCategoriesStatus
};