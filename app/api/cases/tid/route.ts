// app/api/cases/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchCaseByTid } from "@/lib/kanoon-api"; // Update import path as needed

export async function GET(req: NextRequest) {
  try {
  
    
    const { searchParams } = new URL(req.url);
    const tidParam = searchParams.get("tid");
    
 
    
    // Validate TID parameter exists
    if (!tidParam) {

      return NextResponse.json(
        { success: false, error: "Missing tid parameter" }, 
        { status: 400 }
      );
    }
    
    const tid = parseInt(tidParam, 10);

    
    if (!Number.isInteger(tid) || tid <= 0) {
 
      return NextResponse.json(
        { success: false, error: `Invalid tid parameter: ${tidParam}` }, 
        { status: 400 }
      );
    }

    const data = await fetchCaseByTid(tid);
    
    return NextResponse.json({ success: true, data });
    
  } catch (error: any) {
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch case data",
        details: error.message // Include error details for debugging
      },
      { status: 500 }
    );
  }
}