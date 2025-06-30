import { type LegalDocument, DocumentType, LegalCategory } from "@/models/legal-document"
import { documentService } from "@/services/document-service"
import { fileUploadService } from "@/services/file-upload-service"

export class DocumentController {
  async getAllDocuments(filters?: {
    type?: DocumentType
    category?: LegalCategory
    year?: string
  }): Promise<LegalDocument[]> {
    try {
      return await documentService.getDocuments(filters)
    } catch (error) {
      console.error("Error fetching documents:", error)
      throw new Error("Failed to fetch documents")
    }
  }

  async createDocument(documentData: Partial<LegalDocument>, file?: File): Promise<LegalDocument> {
    try {
      let fileUrl = ""
      if (file) {
        const uploadResult = await fileUploadService.uploadFile(file)
        fileUrl = uploadResult.url
      }

      const document: LegalDocument = {
        id: this.generateId(),
        title: documentData.title || "",
        type: documentData.type || DocumentType.REPLY_LETTER,
        category: documentData.category || LegalCategory.INCOME_TAX,
        fileUrl,
        uploadDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        fileSize: file?.size || 0,
        tags: documentData.tags || [],
        metadata: documentData.metadata || {},
        status: documentData.status || ("draft" as any),
      }

      return await documentService.createDocument(document)
    } catch (error) {
      console.error("Error creating document:", error)
      throw new Error("Failed to create document")
    }
  }

  async updateDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument> {
    try {
      return await documentService.updateDocument(id, {
        ...updates,
        lastModified: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error updating document:", error)
      throw new Error("Failed to update document")
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      return await documentService.deleteDocument(id)
    } catch (error) {
      console.error("Error deleting document:", error)
      throw new Error("Failed to delete document")
    }
  }

  async generatePDF(documentId: string, formData: any): Promise<string> {
    try {
      return await documentService.generatePDF(documentId, formData)
    } catch (error) {
      console.error("Error generating PDF:", error)
      throw new Error("Failed to generate PDF")
    }
  }

  private generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const documentController = new DocumentController()
