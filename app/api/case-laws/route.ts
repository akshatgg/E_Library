// app/api/case-laws/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchIndianKanoonData } from "@/lib/kanoon-api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pagenum = parseInt(searchParams.get("pagenum") || "0", 10);
  const formInput = searchParams.get("formInput") || undefined;

  const data = await fetchIndianKanoonData({ pagenum, formInput });

  return NextResponse.json({ success: true, data });
}
