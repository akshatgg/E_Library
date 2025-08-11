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
    // Skip expensive debug counts in production
    if (taxSection && taxSection !== 'all' && process.env.NODE_ENV === 'development') {
      console.log(`Filtering by taxSection: ${taxSection}`);
      // Only run expensive counts in development
      /*
      const prisma = await import('@/lib/prisma').then(mod => mod.prisma);
      const taxSectionCount = await prisma.caseLaw.count({
        where: {
          taxSection: taxSection as any
        }
      });
      
      console.log(`Database has ${taxSectionCount} cases with taxSection=${taxSection}`);
      */
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
    
    // Skip expensive filtering and verbose logging in production
    if (process.env.NODE_ENV === 'development') {
      // Only in development - check if we're filtering by tax section
      if (taxSection && taxSection !== 'all') {
        // Only sample first 5 cases instead of filtering entire result set
        const sampleSize = Math.min(5, result.cases.length);
        const sampleCases = result.cases.slice(0, sampleSize);
        const withMatchingSection = sampleCases.filter(c => c.taxSection === taxSection).length;
        
        console.log(`Sample: ${withMatchingSection}/${sampleSize} cases match taxSection=${taxSection}`);
      }
    } else {
      // In production, just log minimal info
      console.log(`Found ${result.cases.length} of ${result.total} cases`);
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
