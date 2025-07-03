import { NextRequest,NextResponse } from "next/server";
import { fetchIndianKanoonTotalPages } from "@/lib/kanoon-api";

export async function GET(req: NextRequest) {
  try {
    const totalPages = await fetchIndianKanoonTotalPages();
    return NextResponse.json({ success: true, totalPages });
  } catch (error) {
    console.error("Error fetching total pages:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch total pages" }, { status: 500 });
  }
}