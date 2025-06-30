export enum DocumentType {
  PARTNERSHIP_DEED = "partnership_deed",
  HUF_DEED = "huf_deed",
  REPLY_LETTER = "reply_letter",
  WEALTH_CERTIFICATE = "wealth_certificate",
  INCOME_TAX_RETURN = "income_tax_return",
  GST_RETURN = "gst_return",
  ASSESSMENT_ORDER = "assessment_order",
  APPEAL_PETITION = "appeal_petition",
  RECTIFICATION_APPLICATION = "rectification_application",
  ADVANCE_TAX_CHALLAN = "advance_tax_challan",
}

export enum DocumentCategory {
  INCOME_TAX = "income_tax",
  GST = "gst",
  ITAT = "itat",
  WEALTH_TAX = "wealth_tax",
  TDS_TCS = "tds_tcs",
}

export enum DocumentStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  FILED = "filed",
  REJECTED = "rejected",
}

export interface LegalDocument {
  id: string
  title: string
  type: DocumentType
  category: DocumentCategory
  status: DocumentStatus
  fileUrl?: string
  createdAt: string
  updatedAt: string
  fileSize: number
  metadata: Record<string, any>
  tags: string[]
  clientId?: string
  assessmentYear?: string
  panNumber?: string
  priority: "low" | "medium" | "high"
}

export interface DocumentFilter {
  type?: DocumentType
  category?: DocumentCategory
  status?: DocumentStatus
  assessmentYear?: string
  clientId?: string
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
}
