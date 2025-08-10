// app/api/case-laws/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCaseLaws } from "@/lib/case-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Parse query parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const category = searchParams.get("category") || undefined;
  const year = searchParams.get("year") || undefined;
  const searchQuery = searchParams.get("query") || undefined;
  const taxSection = searchParams.get("taxSection") || undefined;
  const sortBy = (searchParams.get("sortBy") as 'date' | 'tid' | 'createdAt') || 'date';
  const sortOrder = (searchParams.get("sortOrder") as 'asc' | 'desc') || 'desc';
  
  console.log("🔄 API Request received with params:", { 
    page, limit, category, year, searchQuery, taxSection, sortBy, sortOrder 
  });

  try {
    // Enhanced debugging for tax section filtering
    if (taxSection && taxSection !== 'all') {
      console.log(`
🔍 TAX SECTION FILTER DETAILS:
   - Filtering by: ${taxSection}
   - Category: ${category || 'all'}
   - Year: ${year || 'all'}
      `);
      
      // Check if we have any cases with this tax section in the database
      const prisma = await import('@/lib/prisma').then(mod => mod.prisma);
      const taxSectionCount = await prisma.caseLaw.count({
        where: {
          taxSection: taxSection as any // Type assertion to fix type error
        }
      });
      
      console.log(`📊 Database has ${taxSectionCount} cases with taxSection=${taxSection}`);
      
      if (taxSectionCount === 0) {
        console.log(`⚠️ WARNING: No cases found in database with taxSection=${taxSection}`);
        console.log('   Consider running the enhanced-tax-sections.js script to populate tax sections.');
      }
    }
    
    // Use the getCaseLaws function that accesses Prisma
    console.log(`🔎 Executing database query with filters...`);
    const result = await getCaseLaws({
      page,
      limit,
      category: category !== 'all' ? category : undefined,
      year: year !== 'all' ? year : undefined,
      taxSection: taxSection !== 'all' ? taxSection : undefined,
      searchQuery,
      sortBy,
      sortOrder
    });
    
    console.log(`✅ Database query complete. Found ${result.cases.length} cases out of total ${result.total}`);
    
    // Check if we're filtering by tax section and got expected results
    if (taxSection && taxSection !== 'all') {
      const casesWithCorrectSection = result.cases.filter(c => c.taxSection === taxSection).length;
      console.log(`
📊 TAX SECTION FILTER RESULTS:
   - Requested section: ${taxSection}
   - Total cases returned: ${result.cases.length}
   - Cases with exact matching taxSection: ${casesWithCorrectSection}
   - Match percentage: ${result.cases.length > 0 ? Math.round((casesWithCorrectSection / result.cases.length) * 100) : 0}%
      `);
    }
    
    // Log the first case to see its structure
    if (result.cases.length > 0) {
      const firstCase = result.cases[0];
      console.log('📝 Sample case from results:', {
        id: firstCase.id,
        tid: firstCase.tid,
        category: firstCase.category,
        taxSection: firstCase.taxSection,
        title: firstCase.title?.substring(0, 50) + '...'
      });
    } else if (taxSection && taxSection !== 'all') {
      console.log(`⚠️ No cases returned when filtering by taxSection=${taxSection}`);
    }

    return NextResponse.json({ 
      success: true, 
      data: result.cases,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error("Error fetching case laws from database:", error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch case laws from database", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
