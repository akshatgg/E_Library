"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

interface CaseData {
  id: string;
  title: string;
  court: string;
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

 
const mockCases: CaseData[] = [
  {
    id: "1",
    title: "Commissioner of Income Tax vs. ABC Industries Ltd.",
    court: "ITAT Delhi",
    date: "2024-01-15",
    category: "ITAT",
    outcome: "allowed",
    parties: {
      appellant: "Commissioner of Income Tax",
      respondent: "ABC Industries Ltd.",
    },
    caseNumber: "ITA No. 1234/Del/2023",
    summary:
      "The case deals with disallowance under section 14A of the Income Tax Act. The ITAT held that when no exempt income is earned during the year, no disallowance under section 14A can be made.",
    relevantSections: ["Section 14A", "Rule 8D"],
    keywords: ["disallowance", "exempt income", "section 14A", "rule 8D"],
    legalPoints: [
      "No disallowance under section 14A when no exempt income earned",
      "Rule 8D application requires actual exempt income",
      "Burden of proof on revenue department",
    ],
    url: "https://example.com/case/1",
    pdfUrl: "https://example.com/case/1.pdf",
  },
  {
    id: "2",
    title: "XYZ Pvt. Ltd. vs. Commissioner of GST",
    court: "CESTAT Mumbai",
    date: "2024-01-10",
    category: "GST",
    outcome: "partly_allowed",
    parties: {
      appellant: "XYZ Pvt. Ltd.",
      respondent: "Commissioner of GST",
    },
    caseNumber: "GST Appeal No. 5678/2023",
    summary:
      "Appeal against denial of input tax credit on certain services. The tribunal allowed ITC on legitimate business expenses but denied on personal expenses.",
    relevantSections: ["Section 16", "Section 17", "Rule 36"],
    keywords: [
      "input tax credit",
      "ITC",
      "business expenses",
      "personal expenses",
    ],
    legalPoints: [
      "ITC allowed only on legitimate business expenses",
      "Clear segregation required between business and personal use",
      "Proper documentation mandatory for ITC claims",
    ],
    url: "https://example.com/case/2",
  },
  {
    id: "3",
    title: "Union of India vs. Reliance Industries",
    court: "Supreme Court of India",
    date: "2024-01-05",
    category: "SUPREME_COURT",
    outcome: "dismissed",
    parties: {
      appellant: "Union of India",
      respondent: "Reliance Industries",
    },
    caseNumber: "Civil Appeal No. 9876/2023",
    summary:
      "Constitutional validity of certain provisions of the Income Tax Act challenged. The Supreme Court upheld the constitutional validity of the impugned provisions.",
    relevantSections: ["Article 14", "Article 19", "Section 68"],
    keywords: [
      "constitutional validity",
      "article 14",
      "article 19",
      "cash credits",
    ],
    legalPoints: [
      "Constitutional validity of Section 68 upheld",
      "Reasonable classification does not violate Article 14",
      "Provisions are in public interest",
    ],
    url: "https://example.com/case/3",
    pdfUrl: "https://example.com/case/3.pdf",
  },
];

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




const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1); // will increase dynamically
const [lastPageReached, setLastPageReached] = useState(false);

const maxButtons = 10;
const startPage = Math.floor((currentPage - 1) / maxButtons) * maxButtons + 1;

const getFormInputByCategory = (category: string): string => {
  switch (category) {
    case "ITAT":
      return "(income tax appellate tribunal OR ITAT OR section 253 of income tax act OR section 254 of income tax act)";
    case "GST":
      return "(GST OR g.s.t OR goods and services tax OR CESTAT OR gst act)";
    case "INCOME_TAX":
      return "(income tax OR income-tax act OR income tax return OR section 139 OR section 143 OR section 147)";
    case "HIGH_COURT":
      return "(high court judgment OR high court order)";
    case "SUPREME_COURT":
      return "(supreme court judgment OR supreme court order)";
    case "TRIBUNAL":
      return "(tribunal OR appellate authority)";
    case "all":
    default:
      return "(income tax OR income-tax act OR income tax return OR gst OR g.s.t OR gst act OR section 139 of income tax act OR section 143 of income tax act OR section 147 of income tax act OR section 148 of income tax act OR section 61 of gst act OR section 62 of gst act OR section 63 of gst act OR section 64 of gst act OR section 65 of gst act OR section 66 of gst act OR section 67 of gst act OR section 68 of gst act OR section 69 of gst act OR section 70 of gst act OR section 71 of gst act OR section 72 of gst act OR section 73 of gst act OR section 74 of gst act OR section 75 of gst act OR section 76 of gst act OR section 77 of gst act OR section 78 of gst act)";
  }
};

const mapDocSourceToCategory = (docsource:string) => {
  const source = docsource?.toLowerCase() || "";
  if (source.includes('itat')) return 'ITAT';
  if (source.includes('gst') || source.includes('cestat')) return 'GST';
  if (source.includes('income tax') || source.includes('income-tax')) return 'INCOME_TAX';
  if (source.includes('high court')) return 'HIGH_COURT';
  if (source.includes('supreme court')) return 'SUPREME_COURT';
  return 'OTHER';
};

useEffect(() => {
  const loadData = async () => {
    try {
      const formInput = encodeURIComponent(getFormInputByCategory(selectedCategory));
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/case-laws?pagenum=${currentPage - 1}&formInput=${formInput}`
      );

      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) {
        console.error("Invalid API response format", json);
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
      setTotalPages(10); // Adjust if dynamic totalPages available
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  loadData();
}, [currentPage, selectedCategory]);




  useEffect(() => {
    filterCases();
  }, [
    searchQuery,
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
      // Simulate API call to Indian Kanoon or other legal databases
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, this would call actual APIs
      // const response = await fetch(`/api/case-laws/search?q=${encodeURIComponent(query)}`)
      // const data = await response.json()

      toast.success(`Found ${filteredCases.length} cases matching your search`);
    } catch (error) {
      toast.error("Failed to search cases. Please try again.");
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



   
  const stats = [
    {
      label: "Total Cases",
      value: cases.length,
      icon: Scale,
      color: "text-blue-600",
    },
    {
      label: "ITAT Cases",
      value: cases.filter((c) => c.category === "ITAT").length,
      icon: Building,
      color: "text-green-600",
    },
    {
      label: "GST Cases",
      value: cases.filter((c) => c.category === "GST").length,
      
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
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
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found {filteredCases.length} case
                  {filteredCases.length !== 1 ? "s" : ""}
                </p>
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
                // filteredCases.map((caseItem) => (
                //   <Card
                //     key={caseItem.id}
                //     className="hover:shadow-lg transition-shadow"
                //   >
                //     <CardContent className="p-6">
                //       <div className="flex items-start justify-between mb-4">
                //         <div className="flex-1">
                //           <h3 className="text-xl font-bold mb-2">
                //             {caseItem.title}
                //           </h3>
                //           <div className="flex flex-wrap gap-2 mb-3">
                //             <Badge
                //               className={getCategoryColor(caseItem.category)}
                //             >
                //               {caseItem.category}
                //             </Badge>
                //             <Badge
                //               variant="outline"
                //               className="flex items-center gap-1"
                //             >
                //               <Calendar className="h-3 w-3" />
                //               {new Date(caseItem.date).toLocaleDateString()}
                //             </Badge>
                //             <Badge
                //               className={getOutcomeColor(caseItem.outcome)}
                //             >
                //               {caseItem.outcome.replace("_", " ").toUpperCase()}
                //             </Badge>
                //             <Badge
                //               variant="outline"
                //               className="flex items-center gap-1"
                //             >
                //               <MapPin className="h-3 w-3" />
                //               {caseItem.court}
                //             </Badge>
                //           </div>
                //         </div>
                //         <div className="flex gap-2">
                //           <Button
                //             size="sm"
                //             variant="outline"
                //             onClick={() => window.open(caseItem.url, "_blank")}
                //           >
                //             <Eye className="h-4 w-4" />
                //           </Button>
                //           {caseItem.pdfUrl && (
                //             <Button
                //               size="sm"
                //               variant="outline"
                //               onClick={() =>
                //                 window.open(caseItem.pdfUrl, "_blank")
                //               }
                //             >
                //               <Download className="h-4 w-4" />
                //             </Button>
                //           )}
                //           <Button size="sm" variant="outline">
                //             <Share2 className="h-4 w-4" />
                //           </Button>
                //         </div>
                //       </div>

                //       <p className="text-gray-700 mb-4">{caseItem.summary}</p>

                //       <div className="space-y-3">
                //         <div>
                //           <p className="text-sm font-medium text-gray-600 mb-1">
                //             Case Number:
                //           </p>
                //           <p className="text-sm">{caseItem.caseNumber}</p>
                //         </div>

                //         <div>
                //           <p className="text-sm font-medium text-gray-600 mb-1">
                //             Parties:
                //           </p>
                //           <p className="text-sm">
                //             {caseItem.parties.appellant} vs{" "}
                //             {caseItem.parties.respondent}
                //           </p>
                //         </div>

                //         {caseItem.relevantSections.length > 0 && (
                //           <div>
                //             <p className="text-sm font-medium text-gray-600 mb-1">
                //               Relevant Sections:
                //             </p>
                //             <div className="flex flex-wrap gap-1">
                //               {caseItem.relevantSections.map(
                //                 (section, index) => (
                //                   <Badge
                //                     key={index}
                //                     variant="secondary"
                //                     className="text-xs"
                //                   >
                //                     {section}
                //                   </Badge>
                //                 )
                //               )}
                //             </div>
                //           </div>
                //         )}

                //         {caseItem.keywords.length > 0 && (
                //           <div>
                //             <p className="text-sm font-medium text-gray-600 mb-1">
                //               Keywords:
                //             </p>
                //             <div className="flex flex-wrap gap-1">
                //               {caseItem.keywords
                //                 .slice(0, 5)
                //                 .map((keyword, index) => (
                //                   <Badge
                //                     key={index}
                //                     variant="outline"
                //                     className="text-xs"
                //                   >
                //                     {keyword}
                //                   </Badge>
                //                 ))}
                //               {caseItem.keywords.length > 5 && (
                //                 <Badge variant="outline" className="text-xs">
                //                   +{caseItem.keywords.length - 5} more
                //                 </Badge>
                //               )}
                //             </div>
                //           </div>
                //         )}

                //         {caseItem.legalPoints.length > 0 && (
                //           <div>
                //             <p className="text-sm font-medium text-gray-600 mb-1">
                //               Key Legal Points:
                //             </p>
                //             <ul className="text-sm space-y-1">
                //               {caseItem.legalPoints
                //                 .slice(0, 3)
                //                 .map((point, index) => (
                //                   <li
                //                     key={index}
                //                     className="flex items-start gap-2"
                //                   >
                //                     <span className="text-blue-600 mt-1">
                //                       •
                //                     </span>
                //                     <span>{point}</span>
                //                   </li>
                //                 ))}
                //             </ul>
                //           </div>
                //         )}
                //       </div>
                //     </CardContent>
                //   </Card>
                // ))
                <div className="overflow-x-auto bg-[#ffffff]">
                  <table className="w-full border-collapse border border-gray-300 bg-[#ffffff]">
                    <thead>
                      <tr className="bg-[#ffffff]">
                        <th className="border border-gray-300 bg-[#ffffff] px-4 py-3 text-left font-semibold">
                          Case No.
                        </th>
                        <th className="border border-gray-300 bg-[#ffffff] px-4 py-3 text-left font-semibold">
                          Case Title
                        </th>
                        <th className="border border-gray-300 bg-[#ffffff] px-4 py-3 text-left font-semibold">
                          Court, Bench, Date
                        </th>
                        <th className="border border-gray-300 bg-[#ffffff] px-4 py-3 text-left font-semibold">
                          Full Judgment Text
                        </th>
                        <th className="border border-gray-300 bg-[#ffffff] px-4 py-3 text-left font-semibold">
                          Tags
                        </th>
                        <th className="border border-gray-300 bg-[#ffffff] px-4 py-3 text-left font-semibold">
                          Related Sections
                        </th>
                        <th className="border border-gray-300 bg-[#ffffff] px-4 py-3 text-center font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCases.map((caseItem) => (
                        <tr key={caseItem.id} className="hover:bg-gray-50">
                          {/* Case No. */}
                          <td className="border border-gray-300 px-4 py-3 align-top">
                            <div className="text-sm font-medium">
                              {caseItem.caseNumber}
                            </div>
                          </td>
                          {/* Case Title */}
                          <td className="border border-gray-300 px-4 py-3 align-top">
                            <div>
                              <h3 className="font-bold text-lg mb-1">
                                {caseItem.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {caseItem.summary}
                              </p>
                              <div className="text-sm">
                                <p>
                                  <span className="font-medium">Parties:</span>{" "}
                                  {caseItem.parties.appellant} vs{" "}
                                  {caseItem.parties.respondent}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Court, Bench, Date */}
                          <td className="border border-gray-300 px-4 py-3 align-top">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">
                                  {caseItem.court}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {new Date(caseItem.date).toLocaleDateString()}
                                </span>
                              </div>
                              <Badge
                                className={getOutcomeColor(caseItem.outcome)}
                              >
                                {caseItem.outcome
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </Badge>
                            </div>
                          </td>

                          {/* Full Judgment Text */}
                          <td className="border border-gray-300 px-4 py-3 align-top">
                            <div className="space-y-2">
                              {caseItem.legalPoints.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-1">
                                    Key Legal Points:
                                  </p>
                                  <ul className="text-sm space-y-1">
                                    {caseItem.legalPoints
                                      .slice(0, 2)
                                      .map((point, index) => (
                                        <li
                                          key={index}
                                          className="flex items-start gap-2"
                                        >
                                          <span className="text-blue-600 mt-1">
                                            •
                                          </span>
                                          <span>{point}</span>
                                        </li>
                                      ))}
                                    {caseItem.legalPoints.length > 2 && (
                                      <li className="text-xs text-gray-500">
                                        +{caseItem.legalPoints.length - 2} more
                                        points
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Tags */}
                          <td className="border border-gray-300 px-4 py-3 align-top">
                            <div className="space-y-2">
                              <div className="space-y-1">
  <Badge className={getCategoryColor(caseItem.category)}>
    {caseItem.category}
  </Badge>
  {selectedCategory !== "all" && (
    <Badge className="bg-blue-100 text-blue-800">
      {selectedCategory}
    </Badge>
  )}
</div>
                              {caseItem.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {caseItem.keywords
                                    .slice(0, 3)
                                    .map((keyword, index) => (
                                      <Badge key={index} variant="outline">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  {caseItem.keywords.length > 3 && (
                                    <Badge variant="outline">
                                      +{caseItem.keywords.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Related Cases */}
                          <td className="border border-gray-300 px-4 py-3 align-top">
                            <div className="text-sm text-gray-600">
                              <div className="flex flex-col space-y-1">
                                <div className="flex flex-wrap gap-1">
                                  {caseItem.relevantSections.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {caseItem.relevantSections
                                        .slice(0, 3)
                                        .map((section, index) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                          >
                                            {section}
                                          </Badge>
                                        ))}
                                      {caseItem.relevantSections.length > 3 && (
                                        <Badge variant="outline">
                                          +
                                          {caseItem.relevantSections.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Share/Download buttons */}
                          <td className="border border-gray-300 px-4 py-3 align-top">
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                  window.open(caseItem.url, "_blank")
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {caseItem.pdfUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={() =>
                                    window.open(caseItem.pdfUrl, "_blank")
                                  }
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                              >
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                          {cases.filter((c) => c.category === category).length}
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
                      const count = cases.filter(
                        (c) => c.category === category
                      ).length;
                      const percentage = (count / cases.length) * 100;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {category.replace("_", " ")}
                            </span>
                            <span className="text-sm text-gray-600">
                              {count} ({percentage.toFixed(1)}%)
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
  <span className="text-sm text-gray-600">Showing page {currentPage}</span>

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
