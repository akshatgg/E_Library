import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { LegalDocument, DocumentFilter } from "@/types/document"
import { documentService } from "@/services/document-service"

interface DocumentState {
  documents: LegalDocument[]
  loading: boolean
  error: string | null
  filters: DocumentFilter
  selectedDocument: LegalDocument | null

  // Actions
  fetchDocuments: () => Promise<void>
  createDocument: (document: Partial<LegalDocument>) => Promise<void>
  updateDocument: (id: string, updates: Partial<LegalDocument>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  setFilters: (filters: Partial<DocumentFilter>) => void
  setSelectedDocument: (document: LegalDocument | null) => void
  clearError: () => void
}

export const useDocumentStore = create<DocumentState>()(
  devtools(
    persist(
      (set, get) => ({
        documents: [],
        loading: false,
        error: null,
        filters: {},
        selectedDocument: null,

        fetchDocuments: async () => {
          set({ loading: true, error: null })
          try {
            const documents = await documentService.getDocuments(get().filters)
            set({ documents, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch documents",
              loading: false,
            })
          }
        },

        createDocument: async (documentData) => {
          set({ loading: true, error: null })
          try {
            const document = await documentService.createDocument(documentData)
            set((state) => ({
              documents: [document, ...state.documents],
              loading: false,
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to create document",
              loading: false,
            })
            throw error
          }
        },

        updateDocument: async (id, updates) => {
          set({ loading: true, error: null })
          try {
            const document = await documentService.updateDocument(id, updates)
            set((state) => ({
              documents: state.documents.map((d) => (d.id === id ? document : d)),
              loading: false,
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to update document",
              loading: false,
            })
            throw error
          }
        },

        deleteDocument: async (id) => {
          set({ loading: true, error: null })
          try {
            await documentService.deleteDocument(id)
            set((state) => ({
              documents: state.documents.filter((d) => d.id !== id),
              loading: false,
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to delete document",
              loading: false,
            })
            throw error
          }
        },

        setFilters: (filters) => {
          set((state) => ({ filters: { ...state.filters, ...filters } }))
          get().fetchDocuments()
        },

        setSelectedDocument: (document) => {
          set({ selectedDocument: document })
        },

        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: "document-store",
        partialize: (state) => ({ filters: state.filters }),
      },
    ),
    { name: "document-store" },
  ),
)
