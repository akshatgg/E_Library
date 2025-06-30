import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { CaseLaw, CaseLawFilter } from "@/types/case-law"
import { caseLawService } from "@/services/case-law-service"

interface CaseLawState {
  cases: CaseLaw[]
  loading: boolean
  error: string | null
  searchQuery: string
  filters: CaseLawFilter
  totalResults: number
  currentPage: number

  // Actions
  searchCases: (query: string, filters?: CaseLawFilter) => Promise<void>
  loadMoreCases: () => Promise<void>
  setFilters: (filters: Partial<CaseLawFilter>) => void
  setSearchQuery: (query: string) => void
  clearResults: () => void
  clearError: () => void
}

export const useCaseLawStore = create<CaseLawState>()(
  devtools(
    (set, get) => ({
      cases: [],
      loading: false,
      error: null,
      searchQuery: "",
      filters: {},
      totalResults: 0,
      currentPage: 1,

      searchCases: async (query, filters = {}) => {
        set({ loading: true, error: null, searchQuery: query, currentPage: 1 })
        try {
          const result = await caseLawService.searchCases(query, { ...get().filters, ...filters }, 1)
          set({
            cases: result.cases,
            totalResults: result.total,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to search cases",
            loading: false,
          })
        }
      },

      loadMoreCases: async () => {
        const { searchQuery, filters, currentPage, loading } = get()
        if (loading) return

        set({ loading: true })
        try {
          const nextPage = currentPage + 1
          const result = await caseLawService.searchCases(searchQuery, filters, nextPage)
          set((state) => ({
            cases: [...state.cases, ...result.cases],
            currentPage: nextPage,
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to load more cases",
            loading: false,
          })
        }
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }))
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      clearResults: () => {
        set({ cases: [], totalResults: 0, currentPage: 1, searchQuery: "" })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    { name: "case-law-store" },
  ),
)
