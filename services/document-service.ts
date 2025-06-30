import type { LegalDocument, DocumentType, LegalCategory } from "@/models/legal-document"

class DocumentService {
  private documents: LegalDocument[] = []

  async getDocuments(filters?: {
    type?: DocumentType
    category?: LegalCategory
    year?: string
  }): Promise<LegalDocument[]> {
    let filteredDocs = [...this.documents]

    if (filters?.type) {
      filteredDocs = filteredDocs.filter((doc) => doc.type === filters.type)
    }

    if (filters?.category) {
      filteredDocs = filteredDocs.filter((doc) => doc.category === filters.category)
    }

    if (filters?.year) {
      filteredDocs = filteredDocs.filter((doc) => new Date(doc.uploadDate).getFullYear().toString() === filters.year)
    }

    return filteredDocs
  }

  async createDocument(document: LegalDocument): Promise<LegalDocument> {
    this.documents.push(document)
    return document
  }

  async updateDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument> {
    const index = this.documents.findIndex((doc) => doc.id === id)
    if (index === -1) {
      throw new Error("Document not found")
    }

    this.documents[index] = { ...this.documents[index], ...updates }
    return this.documents[index]
  }

  async deleteDocument(id: string): Promise<boolean> {
    const index = this.documents.findIndex((doc) => doc.id === id)
    if (index === -1) {
      return false
    }

    this.documents.splice(index, 1)
    return true
  }

  async generatePDF(documentId: string, formData: any): Promise<string> {
    // Mock PDF generation - in real app, use jsPDF or similar
    const pdfUrl = `/api/pdf/generate/${documentId}`
    return pdfUrl
  }

  async getDocumentById(id: string): Promise<LegalDocument | null> {
    return this.documents.find((doc) => doc.id === id) || null
  }

  async searchDocuments(query: string): Promise<LegalDocument[]> {
    const lowercaseQuery = query.toLowerCase()
    return this.documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(lowercaseQuery) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }
}

export const documentService = new DocumentService()
