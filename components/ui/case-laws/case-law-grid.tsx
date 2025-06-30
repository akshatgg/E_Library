"use client"

import { useState } from "react"
import { CaseLawCard } from "./case-law-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, List } from "lucide-react"

export function CaseLawGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [filterBy, setFilterBy] = useState("all")

  const sampleCases = [
    {
      id: "1",
      title: "Commissioner of Income Tax vs. ABC Industries Ltd.",
      court: "ITAT Delhi",
      date: "2024-01-15",
      category: "ITAT",
      status: "ALLOWED" as const,
      sections: ["Section 14A", "Rule 8D", "Section 10(38)"],
      summary:
        "The case deals with disallowance under section 14A of the Income Tax Act. The ITAT held that when no exempt income is earned during the year, no disallowance under section 14A can be made. This landmark judgment clarifies the application of Rule 8D.",
      caseNumber: "ITA No. 1234/Del/2023",
      impact: "High" as const,
      tags: ["Disallowance", "Exempt Income", "Rule 8D", "ITAT"],
      isBookmarked: true,
      viewCount: 1250,
      downloadCount: 340,
    },
    {
      id: "2",
      title: "XYZ Pvt Ltd vs. Commissioner of GST",
      court: "CESTAT Mumbai",
      date: "2024-01-12",
      category: "GST",
      status: "PARTLY ALLOWED" as const,
      sections: ["Section 16", "Rule 36", "Section 17(5)"],
      summary:
        "Appeal against denial of Input Tax Credit. CESTAT held that ITC can be claimed if the supplier has paid tax, even if returns are filed late. The judgment provides clarity on ITC eligibility conditions.",
      caseNumber: "Appeal No. 5678/Mum/2023",
      impact: "Medium" as const,
      tags: ["ITC", "GST", "Late Filing", "CESTAT"],
      isBookmarked: false,
      viewCount: 890,
      downloadCount: 210,
    },
    {
      id: "3",
      title: "Supreme Court ruling on Cash Credits under Section 68",
      court: "Supreme Court of India",
      date: "2024-01-10",
      category: "SUPREME_COURT",
      status: "ALLOWED" as const,
      sections: ["Section 68", "Section 69A", "Section 115BBE"],
      summary:
        "Landmark Supreme Court judgment clarifying the burden of proof in cash credit cases. The court held that mere non-response to summons cannot be the sole basis for addition under Section 68.",
      caseNumber: "Civil Appeal No. 9876/2023",
      impact: "High" as const,
      tags: ["Cash Credits", "Burden of Proof", "Supreme Court", "Section 68"],
      isBookmarked: true,
      viewCount: 2100,
      downloadCount: 650,
    },
    {
      id: "4",
      title: "Partnership Firm Taxation - Delhi High Court",
      court: "Delhi High Court",
      date: "2024-01-08",
      category: "HIGH_COURT",
      status: "DISMISSED" as const,
      sections: ["Section 184", "Section 40(b)", "Partnership Act"],
      summary:
        "High Court judgment on partnership firm taxation and remuneration to partners. The court upheld the AO's decision to disallow excess remuneration paid to partners beyond the limits prescribed.",
      caseNumber: "ITA No. 4567/Del/2023",
      impact: "Medium" as const,
      tags: ["Partnership", "Remuneration", "Section 40(b)", "High Court"],
      isBookmarked: false,
      viewCount: 670,
      downloadCount: 180,
    },
    {
      id: "5",
      title: "HUF Property Transaction - Capital Gains",
      court: "ITAT Bangalore",
      date: "2024-01-05",
      category: "ITAT",
      status: "REMANDED" as const,
      sections: ["Section 54", "Section 2(31)", "HUF"],
      summary:
        "ITAT ruling on HUF property transactions and capital gains exemption. The matter was remanded to AO for fresh consideration of exemption under Section 54 for HUF property purchase.",
      caseNumber: "ITA No. 3456/Bang/2023",
      impact: "Low" as const,
      tags: ["HUF", "Capital Gains", "Section 54", "Property"],
      isBookmarked: false,
      viewCount: 450,
      downloadCount: 95,
    },
    {
      id: "6",
      title: "TDS on Professional Services - Recent Clarification",
      court: "ITAT Chennai",
      date: "2024-01-03",
      category: "ITAT",
      status: "ALLOWED" as const,
      sections: ["Section 194J", "Section 194C", "TDS"],
      summary:
        "ITAT clarification on TDS applicability for professional services. The tribunal held that payments to professionals should be subject to TDS under Section 194J and not 194C.",
      caseNumber: "ITA No. 2345/Chen/2023",
      impact: "Medium" as const,
      tags: ["TDS", "Professional Services", "Section 194J", "ITAT"],
      isBookmarked: true,
      viewCount: 780,
      downloadCount: 220,
    },
  ]

  const handleView = (id: string) => {
    console.log("Viewing case:", id)
  }

  const handleDownload = (id: string) => {
    console.log("Downloading case:", id)
  }

  const handleBookmark = (id: string) => {
    console.log("Bookmarking case:", id)
  }

  const handleShare = (id: string) => {
    console.log("Sharing case:", id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Case Law Database</h2>
          <p className="text-gray-600 dark:text-gray-400">Browse and search legal precedents</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search cases..." className="pl-10" />
          </div>
        </div>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="ITAT">ITAT</SelectItem>
            <SelectItem value="GST">GST/CESTAT</SelectItem>
            <SelectItem value="HIGH_COURT">High Court</SelectItem>
            <SelectItem value="SUPREME_COURT">Supreme Court</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="impact">Impact</SelectItem>
            <SelectItem value="views">Views</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <Badge variant="outline" className="px-3 py-1">
          {sampleCases.length} cases found
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          {sampleCases.filter((c) => c.impact === "High").length} high impact
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          {sampleCases.filter((c) => c.isBookmarked).length} bookmarked
        </Badge>
      </div>

      {/* Case Cards Grid */}
      <div
        className={`
          grid gap-6 transition-all duration-300
          ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"}
        `}
      >
        {sampleCases.map((caseData) => (
          <CaseLawCard
            key={caseData.id}
            caseData={caseData}
            onView={handleView}
            onDownload={handleDownload}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline" size="lg" className="px-8">
          Load More Cases
        </Button>
      </div>
    </div>
  )
}
