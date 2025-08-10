// app/api/debug/check-sections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Get all available tax sections and their counts
    const sectionCounts = await prisma.$queryRaw`
      SELECT "taxSection", COUNT(*) 
      FROM case_laws
      WHERE "taxSection" IS NOT NULL
      GROUP BY "taxSection"
      ORDER BY COUNT(*) DESC
    `;
    
    // Specifically check Section 17 GST
    const section17Count = await prisma.caseLaw.count({
      where: {
        taxSection: "SECTION_17_GST"
      }
    });
    
    // Get a sample of Section 17 cases if any exist
    const section17Sample = await prisma.caseLaw.findMany({
      where: {
        taxSection: "SECTION_17_GST"
      },
      select: {
        id: true,
        tid: true,
        title: true,
        docsource: true,
        taxSection: true
      },
      take: 5
    });
    
    // Get cases that might be section 17 but don't have the taxSection set
    const potentialSection17Cases = await prisma.caseLaw.findMany({
      where: {
        OR: [
          { title: { contains: "section 17", mode: "insensitive" } },
          { headline: { contains: "section 17", mode: "insensitive" } },
          { title: { contains: "apportionment of credit", mode: "insensitive" } },
          { headline: { contains: "apportionment of credit", mode: "insensitive" } },
        ],
        category: "GST",
        taxSection: null
      },
      select: {
        id: true,
        tid: true,
        title: true,
        docsource: true
      },
      take: 5
    });
    
    return NextResponse.json({
      success: true,
      data: {
        availableSections: sectionCounts,
        section17Count,
        section17Sample,
        potentialSection17Cases
      }
    });
  } catch (error) {
    console.error("Error checking tax sections:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
