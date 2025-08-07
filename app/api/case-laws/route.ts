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
  const sortBy = (searchParams.get("sortBy") as 'date' | 'tid' | 'createdAt') || 'date';
  const sortOrder = (searchParams.get("sortOrder") as 'asc' | 'desc') || 'desc';
  
  console.log("API Request params:", { 
    page, limit, category, year, searchQuery, sortBy, sortOrder 
  });

  try {
    // Use the getCaseLaws function that accesses Prisma
    const result = await getCaseLaws({
      page,
      limit,
      category: category !== 'all' ? category : undefined,
      year: year !== 'all' ? year : undefined,
      searchQuery,
      sortBy,
      sortOrder
    });
    
    console.log(`API fetched ${result.cases.length} cases out of total ${result.total}`);

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
