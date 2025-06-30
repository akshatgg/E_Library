import { CaseLawSearch } from "@/components/ui/case-laws/case-law-search"

export default function CaseLawsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Case Law Search</h1>
          <p className="text-muted-foreground">
            Search and explore comprehensive case law database with advanced filtering
          </p>
        </div>

        <CaseLawSearch />
      </div>
    </div>
  )
}
