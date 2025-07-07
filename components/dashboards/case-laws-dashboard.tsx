"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Scale,
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  Download,
  Share2,
  TrendingUp,
  Building,
  Gavel,
  FormInput,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { ca, el } from "date-fns/locale";
import { log } from "util";

interface CaseData {
  id: string;
  title: string;
  court: string;
  bench: string;
  date: string;
  category: "ITAT" | "GST" | "INCOME_TAX" | "HIGH_COURT" | "SUPREME_COURT";
  outcome: "allowed" | "dismissed" | "partly_allowed";
  parties: {
    appellant: string;
    respondent: string;
  };
  caseNumber: string;
  summary: string;
  relevantSections: string[];
  keywords: string[];
  legalPoints: string[];
  url: string;
  pdfUrl?: string;
}

const mockCases: CaseData[] = [];

export function CaseLawsDashboard() {
  const [cases, setCases] = useState<CaseData[]>(mockCases);
  const [filteredCases, setFilteredCases] = useState<CaseData[]>(mockCases);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCourt, setSelectedCourt] = useState<string>("all");
  const [selectedOutcome, setSelectedOutcome] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [foundText, setFoundText] = useState<string | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );
  const [overallTotal, setOverallTotal] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // will increase dynamically
  const [lastPageReached, setLastPageReached] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const maxButtons = 10;
  const startPage = Math.floor((currentPage - 1) / maxButtons) * maxButtons + 1;

  const toggleRow = (caseId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(caseId)) {
      newExpandedRows.delete(caseId);
    } else {
      newExpandedRows.add(caseId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getFormInputByCategory = (category: string): string => {
    if (selectedYear == "all") {
      switch (category) {
        case "ITAT":
          return "(ITAT)";
        case "GST":
          return "(GST)";
        case "INCOME_TAX":
          return "(income tax)";
        case "HIGH_COURT":
          return "(high court order)";
        case "SUPREME_COURT":
          return "(supreme court order)";
        case "TRIBUNAL":
          return "(tribunal)";
        case "all":
        default:
          return "(gst OR income tax OR ITAT)";
      }
    } else {
      switch (category) {
        case "ITAT":
          return `(ITAT) AND year:${selectedYear}`;
        case "GST":
          return `(GST) AND year:${selectedYear}`;
        case "INCOME_TAX":
          return `(income tax) AND year:${selectedYear}`;
        case "HIGH_COURT":
          return `(high court order) AND year:${selectedYear}`;
        case "SUPREME_COURT":
          return `(supreme court order) AND year:${selectedYear}`;
        case "TRIBUNAL":
          return `(tribunal OR appellate authority) AND year:${selectedYear}`;
        case "all":
        default:
          return "(gst OR income tax OR income tax appellate tribunal )";
      }
    }
  };

  const mapDocSourceToCategory = (docsource: string) => {
    const source = docsource?.toLowerCase() || "";
    if (source.includes("itat")) return "ITAT";
    if (source.includes("gst") || source.includes("cestat")) return "GST";
    if (source.includes("income tax") || source.includes("income-tax"))
      return "INCOME_TAX";
    if (source.includes("high court")) return "HIGH_COURT";
    if (source.includes("supreme court")) return "SUPREME_COURT";
    return "OTHER";
  };

  useEffect(() => {
    const fetchAllCategoryCounts = async () => {
      setStatsLoading(true);
      const categories = [
        "ITAT",
        "GST",
        "INCOME_TAX",
        "HIGH_COURT",
        "SUPREME_COURT",
      ];
      const counts: Record<string, number> = {};
      let total = 0;

      for (const cat of categories) {
        const formInput = encodeURIComponent(getFormInputByCategory(cat));
        let url = `/api/cases/total-pages?formInput=${formInput}`;
        if (selectedYear !== "all") {
          url += `&year=${selectedYear}`;
        }

        try {
          const res = await fetch(url);
          const json = await res.json();

          if (json.success) {
            counts[cat] = json.data;
            total += json.data;
          } else {
            counts[cat] = 0;
          }
        } catch (err) {
          console.error(`Failed for ${cat}`, err);
          counts[cat] = 0;
        }
      }

      setCategoryCounts(counts);
      setOverallTotal(total);
      setStatsLoading(false);
    };

    fetchAllCategoryCounts();
  }, [selectedYear]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const formInput = encodeURIComponent(
          getFormInputByCategory(selectedCategory)
        );

        // Build the API URL dynamically based on year selection
        let apiUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/case-laws?pagenum=${currentPage - 1}&formInput=${formInput}`;

        // Only add year parameter if a specific year is selected (not "all")
        if (selectedYear !== "all") {
          apiUrl += `&year=${selectedYear}`;
        }

        const res = await fetch(apiUrl);

        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          console.error("Invalid API response format", json);
          setLoading(false);
          return;
        }

        const mappedCases = json.data.map((item: any, idx: number) => {
          const cleanHeadline = item.headline?.replace(/<[^>]+>/g, "") ?? "";
          const cleanTitle = item.title?.replace(/<[^>]+>/g, "") ?? "";
          return {
            id: item.tid?.toString() ?? String(idx),
            title: cleanTitle,
            court: item.docsource ?? "Unknown",
            date: item.publishdate ?? "",
            bench: item.bench ?? "",
            category: mapDocSourceToCategory(item.docsource ?? ""),
            outcome: "allowed",
            parties: {
              appellant: "",
              respondent: "",
            },
            caseNumber: `${item.tid}`,
            summary: cleanHeadline,
            relevantSections: [],
            keywords: [],
            legalPoints: [],
            url: `https://indiankanoon.org/doc/${item.tid}`,
          };
        });

        setCases(mappedCases);
        setTotalPages(10);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, selectedCategory, selectedYear]);

  useEffect(() => {
    filterCases();
  }, [
    // searchQuery,
    selectedCategory,
    selectedCourt,
    selectedOutcome,
    selectedYear,
    selectedSection,
    cases,
  ]);

  const filterCases = () => {
    let filtered = [...cases];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(query) ||
          caseItem.summary.toLowerCase().includes(query) ||
          caseItem.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query)
          ) ||
          caseItem.relevantSections.some((section) =>
            section.toLowerCase().includes(query)
          )
      );
    }

    // if (selectedCategory !== "all") {
    //   filtered = filtered.filter(
    //     (caseItem) => caseItem.category === selectedCategory
    //   );
    // }

    if (selectedCourt !== "all") {
      filtered = filtered.filter((caseItem) =>
        caseItem.court.toLowerCase().includes(selectedCourt.toLowerCase())
      );
    }

    if (selectedOutcome !== "all") {
      filtered = filtered.filter(
        (caseItem) => caseItem.outcome === selectedOutcome
      );
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (caseItem) =>
          new Date(caseItem.date).getFullYear().toString() === selectedYear
      );
    }
    if (selectedSection !== "all") {
      filtered = filtered.filter((caseItem) =>
        caseItem.relevantSections.includes(selectedSection)
      );
    }

    setFilteredCases(filtered);
  };

  const searchCases = async (query: string) => {
    setLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query.trim());

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/case-laws?pagenum=0&formInput=${encodedQuery}`;
      console.log(`api url: ${apiUrl}`);

      const res = await fetch(apiUrl);
      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) {
        toast.error("No data found or API failed.");
        return;
      }

      const mappedCases = json.data.map((item: any, idx: number) => {
        const cleanHeadline = item.headline?.replace(/<[^>]+>/g, "") ?? "";
        const cleanTitle = item.title?.replace(/<[^>]+>/g, "") ?? "";
        return {
          id: item.tid?.toString() ?? String(idx),
          title: cleanTitle,
          court: item.docsource ?? "Unknown",
          date: item.publishdate ?? "",
          bench: item.bench ?? "",
          category: mapDocSourceToCategory(item.docsource ?? ""),
          outcome: "allowed",
          parties: {
            appellant: "",
            respondent: "",
          },
          caseNumber: `${item.tid}`,
          summary: cleanHeadline,
          relevantSections: [],
          keywords: [],
          legalPoints: [],
          url: `https://indiankanoon.org/doc/${item.tid}`,
        };
      });

      setCases(mappedCases); // Update cases for filtering and UI
      setFilteredCases(mappedCases); // Optional: If filtering manually too
      setCurrentPage(1); // Reset page
      toast.success(`Found ${mappedCases.length} case(s).`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error during search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      ITAT: "bg-blue-100 text-blue-800",
      GST: "bg-green-100 text-green-800",
      INCOME_TAX: "bg-purple-100 text-purple-800",
      HIGH_COURT: "bg-orange-100 text-orange-800",
      SUPREME_COURT: "bg-red-100 text-red-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getOutcomeColor = (outcome: string) => {
    const colors = {
      allowed: "bg-green-100 text-green-800",
      dismissed: "bg-red-100 text-red-800",
      partly_allowed: "bg-yellow-100 text-yellow-800",
    };
    return (
      colors[outcome as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const totalcasescount =
    categoryCounts["ITAT"] +
    categoryCounts["GST"] +
    categoryCounts["INCOME_TAX"] +
    categoryCounts["HIGH_COURT"] +
    categoryCounts["SUPREME_COURT"];
  const stats = [
    {
      label: "Total Cases",
      value: totalcasescount,
      icon: Scale,
      color: "text-blue-600",
    },
    {
      label: "ITAT Cases",
      value: categoryCounts["ITAT"] ?? 0,
      icon: Building,
      color: "text-green-600",
    },
    {
      label: "GST Cases",
      value: categoryCounts["GST"] ?? 0,

      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      label: "This Month",
      value: cases.filter(
        (c) => new Date(c.date).getMonth() === new Date().getMonth()
      ).length,
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Case Law Database
              </h1>
              <p className="text-gray-600 mt-1">
                Search and analyze legal precedents from multiple courts
              </p>
            </div>
            <Button onClick={() => searchCases(searchQuery)} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Advanced Search"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {statsLoading ? (
                      <>
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-8" />
                      </>
                    ) : (
                      <>
                        <p className={`text-3xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Cases</TabsTrigger>
            <TabsTrigger value="browse">Browse by Category</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search cases, sections, keywords..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && searchCases(searchQuery)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => searchCases(searchQuery)}
                      disabled={loading}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="ITAT">ITAT</SelectItem>
                        <SelectItem value="GST">GST/CESTAT</SelectItem>
                        <SelectItem value="INCOME_TAX">Income Tax</SelectItem>
                        <SelectItem value="HIGH_COURT">High Court</SelectItem>
                        <SelectItem value="SUPREME_COURT">
                          Supreme Court
                        </SelectItem>
                        <SelectItem value="TRIBUNAL">Tribunal</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedOutcome}
                      onValueChange={setSelectedOutcome}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Outcomes</SelectItem>
                        <SelectItem value="allowed">Allowed</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                        <SelectItem value="partly_allowed">
                          Partly Allowed
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedSection}
                      onValueChange={setSelectedSection}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="section_1">Section 1</SelectItem>
                        <SelectItem value="section_2">Section 2</SelectItem>
                        <SelectItem value="section_3">Section 3</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedYear}
                      onValueChange={setSelectedYear}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedCourt("all");
                        setSelectedOutcome("all");
                        setSelectedYear("all");
                        setSelectedSection("all");
                      }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div className="space-y-4">
              <div className="space-y-1 text-sm text-gray-700">
                {selectedCategory === "all" ? (
                  <div className="flex justify-between">
                    <span>Found: {totalcasescount} cases</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>
                      Found:{" "}
                      {(categoryCounts[selectedCategory] ?? 0).toLocaleString()}{" "}
                      case
                      {(categoryCounts[selectedCategory] ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <div className="flex gap-2 mb-4">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto bg-white">
                  <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold w-8"></th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                          Case No.
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                          Case Title
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                          Court
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                          Bench
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                          Date
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                          Tags
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading
                        ? // Show 5 skeleton rows with 8 columns each
                          Array.from({ length: 5 }).map((_, idx) => (
                            <tr
                              key={`loading-${idx}`}
                              className="animate-pulse"
                            >
                              {Array.from({ length: 8 }).map((__, colIdx) => (
                                <td
                                  key={colIdx}
                                  className="border border-gray-300 px-4 py-3 h-12"
                                >
                                  <Skeleton className="h-4 w-full" />
                                </td>
                              ))}
                            </tr>
                          ))
                        : filteredCases.map((caseItem) => {
                            const isExpanded = expandedRows.has(caseItem.id);
                            return (
                              <tr
                                key={caseItem.id}
                                className={`hover:bg-gray-50 cursor-pointer ${
                                  isExpanded ? "bg-gray-50" : ""
                                }`}
                                onClick={() => toggleRow(caseItem.id)}
                              >
                                {/* Expand/Collapse Button */}
                                <td className="border border-gray-300 px-4 py-3 text-center align-top">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                  )}
                                </td>

                                {/* Case No. */}
                                <td className="border border-gray-300 px-4 py-3 align-top">
                                  <div className="text-sm font-medium truncate">
                                    {caseItem.caseNumber}
                                  </div>
                                </td>

                                {/* Case Title */}
                                <td className="border border-gray-300 px-4 py-3 align-top max-w-xs">
                                  <div
                                    className={`font-bold text-sm ${
                                      !isExpanded ? "truncate" : ""
                                    }`}
                                    title={caseItem.title}
                                  >
                                    {caseItem.title}
                                  </div>
                                  {isExpanded && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      {caseItem.summary}
                                    </p>
                                  )}
                                </td>

                                {/* Court */}
                                <td className="border border-gray-300 px-4 py-3 align-top max-w-32">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span
                                      className={`text-sm font-medium ${
                                        !isExpanded ? "truncate" : ""
                                      }`}
                                      title={caseItem.court}
                                    >
                                      {caseItem.court}
                                    </span>
                                  </div>
                                </td>

                                {/* Bench */}
                                <td className="border border-gray-300 px-4 py-3 align-top max-w-32">
                                  <div
                                    className={`text-sm ${
                                      !isExpanded ? "truncate" : ""
                                    }`}
                                    title={caseItem.bench}
                                  >
                                    {caseItem.bench}
                                  </div>
                                </td>

                                {/* Date */}
                                <td className="border border-gray-300 px-4 py-3 align-top">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-sm whitespace-nowrap">
                                      {new Date(
                                        caseItem.date
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {isExpanded && (
                                    <div className="mt-2">
                                      <Badge
                                        className={getOutcomeColor(
                                          caseItem.outcome
                                        )}
                                      >
                                        {caseItem.outcome
                                          .replace("_", " ")
                                          .toUpperCase()}
                                      </Badge>
                                    </div>
                                  )}
                                </td>

                                {/* Tags */}
                                <td className="border border-gray-300 px-4 py-3 align-top max-w-36">
                                  <div className="space-y-1">
                                    <Badge
                                      className={`${getCategoryColor(
                                        caseItem.category
                                      )} text-xs`}
                                    >
                                      {caseItem.category}
                                    </Badge>
                                    {isExpanded &&
                                      caseItem.keywords.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {caseItem.keywords.map(
                                            (keyword, index) => (
                                              <Badge
                                                key={index}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {keyword}
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </td>

                                {/* Actions */}
                                <td className="border border-gray-300 px-4 py-3 align-top">
                                  <div className="flex flex-col gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(caseItem.url, "_blank");
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    {isExpanded && (
                                      <>
                                        {caseItem.pdfUrl && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 px-2"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              window.open(
                                                caseItem.pdfUrl,
                                                "_blank"
                                              );
                                            }}
                                          >
                                            <Download className="h-4 w-4 mr-1" />
                                            PDF
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 px-2"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Share2 className="h-4 w-4 mr-1" />
                                          Share
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["ITAT", "GST", "INCOME_TAX", "HIGH_COURT", "SUPREME_COURT"].map(
                (category) => (
                  <Card
                    key={category}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gavel className="h-5 w-5" />
                        {category.replace("_", " ")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">
                          {categoryCounts[category] ?? 0}
                        </p>
                        <p className="text-sm text-gray-600">Available cases</p>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSelectedCategory(category);
                            // Switch to search tab
                          }}
                        >
                          Browse Cases
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Distribution by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "ITAT",
                      "GST",
                      "INCOME_TAX",
                      "HIGH_COURT",
                      "SUPREME_COURT",
                    ].map((category) => {
                      const count = categoryCounts[category] ?? 0;
                      const percentage =
                        totalcasescount > 0
                          ? (count / totalcasescount) * 100
                          : 0;

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {category.replace("_", " ")}
                            </span>
                            <span className="text-sm text-gray-600">
                              {count.toLocaleString()} ({percentage.toFixed(1)}
                              %)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Outcome Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["allowed", "dismissed", "partly_allowed"].map(
                      (outcome) => {
                        const count = cases.filter(
                          (c) => c.outcome === outcome
                        ).length;
                        const percentage = (count / cases.length) * 100;
                        return (
                          <div key={outcome} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                {outcome.replace("_", " ").toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600">
                                {count} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  outcome === "allowed"
                                    ? "bg-green-600"
                                    : outcome === "dismissed"
                                    ? "bg-red-600"
                                    : "bg-yellow-600"
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Showing page {currentPage}
        </span>

        <nav className="inline-flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="px-4 py-1 border rounded font-semibold text-blue-700 bg-gray-100">
            {currentPage}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={lastPageReached}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
