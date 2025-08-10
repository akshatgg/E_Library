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
    // GST Act Sections
    case 'SECTION_7_GST':
    case 'section_7_gst': // Support both formats for backward compatibility
      return "(section 7 CGST Act OR section 7 GST OR section 7 goods and services tax OR supply GST)";
    case 'SECTION_16_GST':
    case 'section_16_gst':
      return "(section 16 CGST Act OR section 16 GST OR section 16 goods and services tax OR input tax credit)";
    case 'SECTION_17_GST':
      return "(section 17 CGST Act OR section 17 GST OR section 17 goods and services tax OR apportionment of credit)";
    case 'SECTION_22_24_GST':
    case 'section_22_24_gst':
      return "(section 22 CGST Act OR section 23 CGST OR section 24 CGST OR registration GST)";
    case 'SECTION_31_GST':
    case 'section_31_gst':
      return "(section 31 CGST Act OR section 31 GST OR tax invoice GST)";
    case 'SECTION_35_36_GST':
    case 'section_35_36_gst':
      return "(section 35 CGST Act OR section 36 CGST OR accounts records GST)";
    case 'SECTION_37_39_GST':
    case 'section_37_39_gst':
      return "(section 37 CGST Act OR section 38 CGST OR section 39 CGST OR GST returns)";
    case 'SECTION_49_GST':
    case 'section_49_gst':
      return "(section 49 CGST Act OR section 49 GST OR payment of tax GST)";
    case 'SECTION_54_GST':
    case 'section_54_gst':
      return "(section 54 CGST Act OR section 54 GST OR refund GST)";
    case 'SECTION_73_74_GST':
    case 'section_73_74_gst':
      return "(section 73 CGST Act OR section 74 CGST OR tax determination GST)";
    case 'SECTION_122_GST':
    case 'section_122_gst':
      return "(section 122 CGST Act OR section 122 GST OR penalties GST)";
    case 'SECTION_129_GST':
    case 'section_129_gst':
      return "(section 129 CGST Act OR section 129 GST OR detention of goods GST)";
    case 'SECTION_140_GST':
    case 'section_140_gst':
      return "(section 140 CGST Act OR section 140 GST OR transitional provisions GST)";
    // Income Tax Act Sections
    case 'SECTION_2_IT':
    case 'section_2_it':
      return "(section 2 income tax act OR section 2 IT Act OR definitions income tax)";
    case 'SECTION_10_IT':
    case 'section_10_it':
      return "(section 10 income tax act OR section 10 IT Act OR exempt income)";
    case 'SECTION_14_IT':
    case 'section_14_it':
      return "(section 14 income tax act OR section 14 IT Act OR heads of income)";
    case 'SECTION_15_17_IT':
    case 'section_15_17_it':
      return "(section 15 income tax act OR section 16 IT Act OR section 17 IT Act OR salary income)";
    case 'SECTION_28_44_IT':
    case 'section_28_44_it':
      return "(section 28 income tax act OR section 44 IT Act OR business profits income tax)";
    case 'SECTION_80C_80U_IT':
    case 'section_80C_80U_it':
      return "(section 80C income tax act OR section 80D IT Act OR section 80G OR deductions income tax)";
    case 'SECTION_139_IT':
    case 'section_139_it':
      return "(section 139 income tax act OR section 139 IT Act OR return filing income tax)";
    case 'SECTION_143_IT':
    case 'section_143_it':
      return "(section 143 income tax act OR section 143 IT Act OR assessment income tax)";
    case 'SECTION_147_IT':
    case 'section_147_it':
      return "(section 147 income tax act OR section 147 IT Act OR escaped income)";
    case 'SECTION_194_206_IT':
    case 'section_194_206_it':
      return "(section 194 income tax act OR section 206 IT Act OR TDS income tax)";
    case 'SECTION_234_IT':
    case 'section_234_it':
      return "(section 234A income tax act OR section 234B IT Act OR section 234C OR interest income tax)";
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

// Helper function to check if the input is a tax section
function isTaxSection(input: string): boolean {
  return input.startsWith('section_') || input.startsWith('SECTION_');
}

// Helper function to identify tax section and its related category
function getTaxSectionInfo(sectionCode: string): { section: string | null, category: string | null } {
  // Default values
  let section = null;
  let category = null;
  
  // Check if it's a valid tax section code
  if (isTaxSection(sectionCode)) {
    // Always convert to uppercase for consistency with Prisma enum
    const upperCode = sectionCode.toUpperCase();
    
    // Check for GST sections
    if (upperCode.endsWith('_GST')) {
      section = upperCode;
      category = 'GST';
    } 
    // Check for Income Tax sections
    else if (upperCode.endsWith('_IT')) {
      section = upperCode;
      category = 'INCOME_TAX';
    } 
    // Fallback for any other format
    else {
      section = upperCode;
    }
  }
  
  console.log(`Tax section mapping: "${sectionCode}" → "${section}" (category: "${category}")`);
  return { section, category };
}

async function syncKanoonData(targetInput?: string) {
  try {
    console.log('🔄 Starting Kanoon data sync...');
    console.log('📅 Sync time:', new Date().toISOString());
    
    let searchQuery: string;
    let categoryFilter: string | null = null;
    let taxSectionFilter: string | null = null;
    
    if (targetInput) {
      searchQuery = getCategorySearchQuery(targetInput);
      
      // Check if it's a tax section
      if (isTaxSection(targetInput)) {
        const { section, category } = getTaxSectionInfo(targetInput);
        taxSectionFilter = section;
        categoryFilter = category; // Also set the associated category
        
        console.log(`🎯 Syncing specific tax section: ${taxSectionFilter} (Category: ${categoryFilter})`);
      } else {
        categoryFilter = targetInput;
        console.log(`🎯 Syncing specific category: ${categoryFilter}`);
      }
      
      console.log(`🔍 Using search query: ${searchQuery}`);
    } else {
      // Default search for all categories
      searchQuery = "(income tax appellate tribunal OR ITAT OR GST OR supreme court OR high court)";
      console.log('🌐 Syncing all categories with default query');
    }
    
    // Fetch cases from pages 1 to 5 for comprehensive data
    const allCases: IKanoonResult[] = [];
    const pagesToFetch = [4]; // Fetching first 10 pages for better coverage

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
        
        // Determine final category and tax section
        let finalCategory: string | null;
        let finalTaxSection: string | null = null;
        
        if (taxSectionFilter) {
          // When targeting a specific tax section, set both the tax section and its associated category
          finalTaxSection = taxSectionFilter;
          finalCategory = categoryFilter || detectedCategory; // Use the associated category, or detected if not available
          console.log(`✅ Processing TID: ${caseData.tid} - Assigning tax section: ${finalTaxSection}, category: ${finalCategory}`);
        } else if (categoryFilter) {
          // When targeting a specific category only, set the category
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
          taxSection: finalTaxSection as any, // Add the tax section field
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
        if (error instanceof Error) {
          console.error(`Error details: ${error.message}`);
          console.error(`Stack trace: ${error.stack}`);
        }
        errors++;
      }
    }

    const summary = {
      category: categoryFilter || 'ALL',
      taxSection: taxSectionFilter || null,
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
  console.log('📅 Scheduling syncs every Saturday starting at 2:47 AM IST with 5 min gap (UTC equivalent)...');

const categories = [
  { name: "ALL", minute: 45, hour: 7 },           // 1:15 PM IST
  { name: "ITAT", minute: 50, hour: 7 },          // 1:20 PM IST
  { name: "GST", minute: 55, hour: 7 },           // 1:25 PM IST
  { name: "INCOME_TAX", minute: 0, hour: 8 },     // 1:30 PM IST
  { name: "HIGH_COURT", minute: 5, hour: 8 },     // 1:35 PM IST
  { name: "SUPREME_COURT", minute: 10, hour: 8 }, // 1:40 PM IST
  { name: "TRIBUNAL_COURT", minute: 15, hour: 8 } // 1:45 PM IST
];





  categories.forEach(({ name, minute, hour }, index) => {
    const cronExpression = `${minute} ${hour} * * 6`; // 5 = Friday UTC

    console.log(`📅 Scheduling ${name} at UTC ${hour}:${minute.toString().padStart(2, '0')} (IST ~${2 + Math.floor((47 + index * 5) / 60)}:${(47 + index * 5) % 60})`);

    cron.schedule(cronExpression, async () => {
      console.log(`⏰ ${name} cron triggered at: ${new Date().toISOString()}`);
      try {
        await syncKanoonData(name === "ALL" ? undefined : name);
        console.log(`✅ ${name} sync completed`);
      } catch (error) {
        console.error(`❌ ${name} sync failed:`, error);
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