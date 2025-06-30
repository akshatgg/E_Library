export enum DocumentType {
  PARTNERSHIP_DEED = "partnership_deed",
  FAMILY_SETTLEMENT_DEED = "family_settlement_deed",
  SALE_DEED = "sale_deed",
  CREDIT_NOTE = "credit_note",
  DEBIT_NOTE = "debit_note",
  HUF_DEED = "huf_deed",
  REPLY_LETTER = "reply_letter",
  CASH_FLOW_STATEMENT = "cash_flow_statement",
  TAX_RETURN = "tax_return",
  ASSESSMENT_ORDER = "assessment_order",
}

export enum LegalCategory {
  INCOME_TAX = "income_tax",
  GST = "gst",
  ITAT = "itat",
  CUSTOMS = "customs",
  EXCISE = "excise",
  SERVICE_TAX = "service_tax",
}

export enum DocumentStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  FILED = "filed",
  ARCHIVED = "archived",
}

export interface LegalDocument {
  id: string
  title: string
  type: DocumentType
  category: LegalCategory
  fileUrl: string
  uploadDate: string
  lastModified: string
  fileSize: number
  tags: string[]
  metadata: Record<string, any>
  status: DocumentStatus
  description?: string
  clientId?: string
  caseNumber?: string
  financialYear?: string
  dueDate?: string
  priority?: "low" | "medium" | "high"
}

export interface DocumentFilter {
  type?: DocumentType
  category?: LegalCategory
  status?: DocumentStatus
  year?: string
  clientId?: string
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
}
