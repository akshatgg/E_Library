import { renderHook } from "@testing-library/react"
import { useCaseLawService } from "@/services/case-law-service"

describe("useCaseLawService Hook", () => {
  describe("searchCaseLaws", () => {
    it("should return all case laws when no filters applied", async () => {
      const { result } = renderHook(() => useCaseLawService())

      const searchResult = await result.current.searchCaseLaws({})

      expect(searchResult.caseLaws).toHaveLength(10)
      expect(searchResult.total).toBe(10)
    })

    it("should filter by search query", async () => {
      const { result } = renderHook(() => useCaseLawService())

      const searchResult = await result.current.searchCaseLaws({
        searchQuery: "Income Tax",
      })

      expect(searchResult.caseLaws.length).toBeGreaterThan(0)
      expect(
        searchResult.caseLaws.every(
          (caseLaw) => caseLaw.title.includes("Income Tax") || caseLaw.summary.includes("Income Tax"),
        ),
      ).toBe(true)
    })

    it("should filter by section", async () => {
      const { result } = renderHook(() => useCaseLawService())

      const searchResult = await result.current.searchCaseLaws({
        section: "80C",
      })

      expect(searchResult.caseLaws.every((caseLaw) => caseLaw.section === "80C")).toBe(true)
    })

    it("should filter by court", async () => {
      const { result } = renderHook(() => useCaseLawService())

      const searchResult = await result.current.searchCaseLaws({
        court: "ITAT Delhi",
      })

      expect(searchResult.caseLaws.every((caseLaw) => caseLaw.court === "ITAT Delhi")).toBe(true)
    })

    it("should filter by decision", async () => {
      const { result } = renderHook(() => useCaseLawService())

      const searchResult = await result.current.searchCaseLaws({
        decision: "Allowed",
      })

      expect(searchResult.caseLaws.every((caseLaw) => caseLaw.decision === "Allowed")).toBe(true)
    })

    it("should apply multiple filters", async () => {
      const { result } = renderHook(() => useCaseLawService())

      const searchResult = await result.current.searchCaseLaws({
        section: "80C",
        court: "ITAT Delhi",
        decision: "Allowed",
      })

      expect(
        searchResult.caseLaws.every(
          (caseLaw) => caseLaw.section === "80C" && caseLaw.court === "ITAT Delhi" && caseLaw.decision === "Allowed",
        ),
      ).toBe(true)
    })

    it("should return empty results for non-matching filters", async () => {
      const { result } = renderHook(() => useCaseLawService())

      const searchResult = await result.current.searchCaseLaws({
        searchQuery: "NonExistentCase",
      })

      expect(searchResult.caseLaws).toHaveLength(0)
      expect(searchResult.total).toBe(0)
    })
  })

  describe("getFilterOptions", () => {
    it("should return all available filter options", () => {
      const { result } = renderHook(() => useCaseLawService())

      const options = result.current.getFilterOptions()

      expect(options.sections).toContain("80C")
      expect(options.sections).toContain("143(1)")
      expect(options.courts).toContain("ITAT Delhi")
      expect(options.courts).toContain("Supreme Court")
      expect(options.decisions).toContain("Allowed")
      expect(options.decisions).toContain("Dismissed")
    })
  })
})
