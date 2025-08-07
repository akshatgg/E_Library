// app/api/cases/statistics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCaseStatistics } from "@/lib/case-service";

export async function GET(req: NextRequest) {
  try {
    const statistics = await getCaseStatistics();
    
    console.log("Statistics API returned:", {
      total: statistics.total,
      categoryCounts: statistics.categoryCounts
    });
    
    return NextResponse.json({ 
      success: true, 
      data: statistics
    });
  } catch (error) {
    console.error("Error fetching case statistics:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch case statistics",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
