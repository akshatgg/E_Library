"use server";

import { prisma } from "@/lib/prisma";

// Define interfaces to match the component expectations
interface CaseDataSuccess {
  success: true;
  data: {
    tid: number;
    publishdate: string;
    title: string;
    doc: string;
    numcites: number;
    numcitedby: number;
    docsource: string;
    citetid: number;
    divtype: string;
    courtcopy: boolean;
    query_alert: any;
    agreement: boolean;
  };
}

interface CaseDataError {
  success: false;
  error: string;
}

type CaseDetailResponse = CaseDataSuccess | CaseDataError;

export async function getCaseDetail(tid: number): Promise<CaseDetailResponse> {
  try {
    const caseDetail = await prisma.caseDetail.findUnique({
      where: { tid },
      include: {
        caseLaw: true, // Include the related case law data if needed
      },
    });

    if (!caseDetail) {
      return { success: false, error: "Case not found" };
    }

    // Format the response to match the expected structure
    return {
      success: true,
      data: {
        tid: caseDetail.tid,
        publishdate: caseDetail.publishdate,
        title: caseDetail.title,
        doc: caseDetail.doc,
        numcites: caseDetail.numcites,
        numcitedby: caseDetail.numcitedby,
        docsource: caseDetail.docsource,
        citetid: caseDetail.citetid || 0,
        divtype: caseDetail.divtype || "",
        courtcopy: caseDetail.courtcopy,
        query_alert: caseDetail.queryAlert || null,
        agreement: caseDetail.agreement,
      },
    };
  } catch (error) {
    console.error("Error fetching case detail:", error);
    return { success: false, error: "Failed to fetch case detail" };
  }
}
