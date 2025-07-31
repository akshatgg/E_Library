// // app/api/case-laws/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchIndianKanoonData } from "@/lib/kanoon-api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pagenum = parseInt(searchParams.get("pagenum") || "0", 10);
  const formInput = searchParams.get("formInput") || undefined;

  const data = await fetchIndianKanoonData({ pagenum, formInput });

  return NextResponse.json({ success: true, data });
}



// // app/api/case-laws/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { fetchIndianKanoonData } from "@/lib/kanoon-api";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);

//   const pagenum = parseInt(searchParams.get("pagenum") || "0", 10);
//   const formInput = searchParams.get("formInput") || undefined;
//   const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined;

//   try {
//     const data = await fetchIndianKanoonData({ pagenum, formInput, year });
//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     console.error("Error fetching case laws:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch case laws" },
//       { status: 500 }
//     );
//   }
// }
