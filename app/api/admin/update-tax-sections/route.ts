// app/api/admin/update-tax-sections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") || "SECTION_17_GST";
  const confirm = searchParams.get("confirm") === "true";
  
  if (!confirm) {
    // Dry run mode - just show what would be updated
    const potentialCases = await prisma.caseLaw.findMany({
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
      take: 100
    });
    
    return NextResponse.json({
      success: true,
      message: "Dry run completed. Add ?confirm=true to execute the update.",
      casesFound: potentialCases.length,
      sampleCases: potentialCases.slice(0, 10)
    });
  }
  
  try {
    // Use raw SQL for more direct control over the update
    // This ensures compatibility with PostgreSQL's enum type for taxSection
    const result = await prisma.$executeRaw`
      UPDATE case_laws 
      SET "taxSection" = ${section}::tax_section
      WHERE (
        title ILIKE '%section 17%' OR 
        headline ILIKE '%section 17%' OR
        title ILIKE '%apportionment of credit%' OR
        headline ILIKE '%apportionment of credit%'
      ) 
      AND category = 'GST'
      AND "taxSection" IS NULL
    `;
    
    return NextResponse.json({
      success: true,
      updated: result,
      message: `Updated ${result} cases with taxSection = ${section}`
    });
  } catch (error) {
    console.error("Error updating tax sections:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: String(error),
        message: "Make sure you have the correct enum values in your Prisma schema"
      },
      { status: 500 }
    );
  }
}
