"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CaseTablePDF from "../pdf/CaseTablePDF";
import { pdf } from "@react-pdf/renderer";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

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
  Link,
} from "lucide-react";

export interface CaseData {
  id: string;
  title: string;
  court: string;
  bench: string;
  date: string;
  category: "ITAT" | "GST" | "INCOME_TAX" | "HIGH_COURT" | "SUPREME_COURT" | "TRIBUNAL_COURT";
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
  taxSection?: string;
}

// Cache interface
interface CacheEntry {
  data: CaseData[];
  timestamp: number;
}

interface CacheKey {
  page: number;
  category: string;
  year: string;
}

// Category count cache interface
interface CategoryCountCacheEntry {
  counts: Record<string, number>;
  total: number;
  timestamp: number;
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
  const [activeTab, setActiveTab] = useState("search"); // Track active tab

  const router = useRouter();

  // Cache implementation
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const categoryCountCacheRef = useRef<Map<string, CategoryCountCacheEntry>>(
    new Map()
  );

  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  const maxButtons = 10;
  const startPage = Math.floor((currentPage - 1) / maxButtons) * maxButtons + 1;

  // Helper function to generate cache key
  const generateCacheKey = (
    page: number,
    category: string,
    year: string
  ): string => {
    return `${page}-${category}-${year}`;
  };

  // Helper function to generate category count cache key
  const generateCategoryCountCacheKey = (year: string): string => {
    return `category-counts-${year}`;
  };

  // Helper function to check if cache entry is valid
  const isCacheValid = (entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  };

  // Helper function to check if category count cache entry is valid
  const isCategoryCountCacheValid = (
    entry: CategoryCountCacheEntry
  ): boolean => {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  };

  // Helper function to get data from cache
  const getCachedData = (
    page: number,
    category: string,
    year: string
  ): CaseData[] | null => {
    const cacheKey = generateCacheKey(page, category, year);
    const cachedEntry = cacheRef.current.get(cacheKey);

    if (cachedEntry && isCacheValid(cachedEntry)) {
      console.log(
        `Cache hit for page ${page}, category ${category}, year ${year}`
      );
      return cachedEntry.data;
    }

    // Remove expired cache entry
    if (cachedEntry) {
      cacheRef.current.delete(cacheKey);
    }

    return null;
  };

  // Helper function to get category counts from cache
  const getCachedCategoryCounts = (
    year: string
  ): { counts: Record<string, number>; total: number } | null => {
    const cacheKey = generateCategoryCountCacheKey(year);
    const cachedEntry = categoryCountCacheRef.current.get(cacheKey);

    if (cachedEntry && isCategoryCountCacheValid(cachedEntry)) {
      console.log(`Category count cache hit for year ${year}`);
      return {
        counts: cachedEntry.counts,
        total: cachedEntry.total,
      };
    }

    // Remove expired cache entry
    if (cachedEntry) {
      categoryCountCacheRef.current.delete(cacheKey);
    }

    return null;
  };

  // Helper function to set data in cache
  const setCachedData = (
    page: number,
    category: string,
    year: string,
    data: CaseData[]
  ): void => {
    const cacheKey = generateCacheKey(page, category, year);
    const cacheEntry: CacheEntry = {
      data: data,
      timestamp: Date.now(),
    };
    cacheRef.current.set(cacheKey, cacheEntry);
    console.log(
      `Data cached for page ${page}, category ${category}, year ${year}`
    );
  };

  // Helper function to set category counts in cache
  const setCachedCategoryCounts = (
    year: string,
    counts: Record<string, number>,
    total: number
  ): void => {
    const cacheKey = generateCategoryCountCacheKey(year);
    const cacheEntry: CategoryCountCacheEntry = {
      counts: counts,
      total: total,
      timestamp: Date.now(),
    };
    categoryCountCacheRef.current.set(cacheKey, cacheEntry);
    console.log(`Category counts cached for year ${year}`);
  };

  // Helper function to clear cache when filters change
  const clearCache = (): void => {
    cacheRef.current.clear();
    console.log("Cache cleared");
  };

  // Helper function to clear category count cache (optional - can be used for manual cache clearing)
  const clearCategoryCountCache = (): void => {
    categoryCountCacheRef.current.clear();
    console.log("Category count cache cleared");
  };

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
    // When selecting "all" category, just use an empty string to get all results
    // or use a very broad search query that will match most legal documents
    if (category === "all") {
      if (selectedYear === "all") {
        return ""; // Empty query to get all results
      } else {
        return `year:${selectedYear}`; // Just filter by year
      }
    }
    
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
        case "TRIBUNAL_COURT":
          return "(tribunal)";
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
        case "TRIBUNAL_COURT":
          return `(tribunal OR appellate authority) AND year:${selectedYear}`;
        default:
          return `year:${selectedYear}`;
      }
    }
  };

  // Helper function to categorize court source
  const categorizeSource = (docsource: string): string => {
    const source = docsource?.toLowerCase() || "";
    if (source.includes("itat") || source.includes("income tax appellate tribunal")) {
      return "ITAT";
    }
    if (source.includes("gst") || source.includes("goods and services tax") || source.includes("cestat")) {
      return "GST";
    }
    if (source.includes("income tax") || source.includes("income-tax")) {
      return "INCOME_TAX";
    }
    if (source.includes("high court")) {
      return "HIGH_COURT";
    }
    if (source.includes("supreme court")) {
      return "SUPREME_COURT";
    }
    if (source.includes("tribunal") || source.includes("appellate authority")) {
      return "TRIBUNAL_COURT";
    }
    return "OTHER";
  };

  useEffect(() => {
    const fetchAllCategoryCounts = async () => {
      setStatsLoading(true);
      // Check cache first
      const cachedCounts = getCachedCategoryCounts(selectedYear);
      if (cachedCounts) {
        setCategoryCounts(cachedCounts.counts);
        setOverallTotal(cachedCounts.total);
        setStatsLoading(false);
        return;
      }
      
      try {
        // Use the statistics API endpoint
        const res = await fetch('/api/cases/statistics');
        const data = await res.json();
        
        if (!data.success) {
          throw new Error('Failed to fetch statistics');
        }
        
        const { categoryCounts: counts, total } = data.data;
        
        console.log("Fetched category counts from database:", counts);
        
        // Ensure all expected categories are present
        const categories = [
          "ITAT",
          "GST",
          "INCOME_TAX",
          "HIGH_COURT",
          "SUPREME_COURT",
        ];
        
        // Ensure all categories have at least 0 as count
        const formattedCounts: Record<string, number> = {};
        for (const cat of categories) {
          formattedCounts[cat] = counts[cat] || 0;
        }
        
        // Cache the results
        setCachedCategoryCounts(selectedYear, formattedCounts, total);

        setCategoryCounts(formattedCounts);
        setOverallTotal(total);
      } catch (error) {
        console.error("Error fetching category counts:", error);
        
        // Set empty counts in case of error
        const emptyCounts: Record<string, number> = {
          "ITAT": 0,
          "GST": 0, 
          "INCOME_TAX": 0,
          "HIGH_COURT": 0,
          "SUPREME_COURT": 0
        };
        
        setCategoryCounts(emptyCounts);
        setOverallTotal(0);
        
        toast({
          title: "Error",
          description: "Failed to load case statistics",
          variant: "destructive"
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAllCategoryCounts();
  }, []);

  // Separate useEffect that only runs when the page changes, not when filters change
  useEffect(() => {
    // Skip loading data when page changes if we're also changing filters
    // The filter change effect will handle data loading
    const loadData = async () => {
      try {
        // Check cache first
        const cachedData = getCachedData(
          currentPage,
          selectedCategory,
          selectedYear
        );
        if (cachedData) {
          setCases(cachedData);
          setFilteredCases(cachedData);
          return;
        }
        setLoading(true);

        // Build query parameters for API call
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '20',
          sortBy: 'date',
          sortOrder: 'desc'
        });

        // Add optional parameters
        if (selectedCategory && selectedCategory !== 'all') {
          queryParams.append('category', selectedCategory);
        }

        if (selectedYear && selectedYear !== 'all') {
          queryParams.append('year', selectedYear);
        }
        
        // Fetch data from our API endpoint
        const response = await fetch(`/api/case-laws?${queryParams.toString()}`);
        const data = await response.json();
        
        console.log("Fetched data from API", data);

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Invalid API response format", data);
          setLoading(false);
          return;
        }

        // Map API results to our CaseData format
        const mappedCases = data.data.map((item: any) => {
          const cleanHeadline = item.headline?.replace(/<[^>]+>/g, "") ?? "";
          const cleanTitle = item.title?.replace(/<[^>]+>/g, "") ?? "";
          return {
            id: item.id || item.tid?.toString(),
            title: cleanTitle,
            court: item.docsource ?? "Unknown",
            date: item.publishdate ?? "",
            bench: item.bench ?? "",
            category: (item.category ? item.category.toString() : categorizeSource(item.docsource ?? "")) as "ITAT" | "GST" | "INCOME_TAX" | "HIGH_COURT" | "SUPREME_COURT" | "TRIBUNAL_COURT",
            outcome: "allowed" as "allowed", // Type assertion for the union type
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

        // Cache the data
        setCachedData(currentPage, selectedCategory, selectedYear, mappedCases);

        setCases(mappedCases);
        setFilteredCases(mappedCases);
        
        // Calculate total pages based on total count and limit per page
        const calculatedTotalPages = Math.ceil(data.total / 20);
        setTotalPages(calculatedTotalPages || 1);
        
        // Update lastPageReached flag
        setLastPageReached(currentPage >= calculatedTotalPages);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch case data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, selectedCategory, selectedYear]);

  // This effect has been replaced with direct handlers in the Select components
  // to ensure immediate UI updates
  
  // Update lastPageReached state whenever currentPage or totalPages changes
  useEffect(() => {
    setLastPageReached(currentPage >= totalPages);
  }, [currentPage, totalPages]);
  // Add cache management functions for potential future use
  // const getCacheStats = () => {
  //   const cacheSize = cacheRef.current.size;
  //   const validEntries = Array.from(cacheRef.current.values()).filter((entry) =>
  //     isCacheValid(entry)
  //   ).length;

  //   return {
  //     totalEntries: cacheSize,
  //     validEntries: validEntries,
  //     expiredEntries: cacheSize - validEntries,
  //   };
  // };

  // const clearExpiredCache = () => {
  //   const keysToDelete: string[] = [];

  //   cacheRef.current.forEach((entry, key) => {
  //     if (!isCacheValid(entry)) {
  //       keysToDelete.push(key);
  //     }
  //   });

  //   keysToDelete.forEach((key) => {
  //     cacheRef.current.delete(key);
  //   });

  //   console.log(`Cleared ${keysToDelete.length} expired cache entries`);
  // };

  // Navigation with cache awareness
  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  useEffect(() => {
    // Only run client-side filtering for specific filters that don't trigger a server request
    if (cases.length > 0) {
      filterCases();
    }
  }, [
    // We now handle these server-side, so they don't need to trigger client-side filtering
    // selectedCategory, 
    // selectedYear,
    // selectedSection,
    
    // Keep these for client-side filtering
    selectedCourt,
    selectedOutcome,
    cases,
  ]);

  const filterCases = () => {
    // Skip expensive filtering if no client-side filters are active
    if (selectedCourt === "all" && selectedOutcome === "all") {
      setFilteredCases(cases);
      return;
    }
    
    let filtered = [...cases];

    // Search query is now handled server-side through the searchCases function
    
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

    // Year and Section are now handled server-side
    // This makes the UI more responsive

    setFilteredCases(filtered);
  };

  const searchCases = async (query: string) => {
    setLoading(true);
    try {
      // Build query parameters for API call
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '20',
        query: query.trim(),
        sortBy: 'date',
        sortOrder: 'desc'
      });
      
      // Add tax section filter if selected
      if (selectedSection !== 'all') {
        queryParams.append('taxSection', selectedSection);
        console.log("🔍 Filtering by tax section:", selectedSection);
      }
      
      // Fetch data from our API endpoint
      console.log("🚀 Sending request with params:", queryParams.toString());
      const response = await fetch(`/api/case-laws?${queryParams.toString()}`);
      const data = await response.json();

      if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      
        setLoading(false);
        return;
      }

      // Map API results to our CaseData format
      const mappedCases = data.data.map((item: any) => {
        const cleanHeadline = item.headline?.replace(/<[^>]+>/g, "") ?? "";
        const cleanTitle = item.title?.replace(/<[^>]+>/g, "") ?? "";
        
        console.log("API item:", {
          id: item.id,
          tid: item.tid,
          taxSection: item.taxSection
        });
        
        return {
          id: item.id || item.tid?.toString(),
          title: cleanTitle,
          court: item.docsource ?? "Unknown",
          date: item.publishdate ?? "",
          bench: item.bench ?? "",
          category: (item.category ? item.category.toString() : categorizeSource(item.docsource ?? "")) as "ITAT" | "GST" | "INCOME_TAX" | "HIGH_COURT" | "SUPREME_COURT" | "TRIBUNAL_COURT",
          outcome: "allowed" as "allowed",
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
          taxSection: item.taxSection || null,
        };
      });

      setCases(mappedCases); // Update cases for filtering and UI
      setFilteredCases(mappedCases); // Optional: If filtering manually too
      
      // Reset to first page when performing a search
      setCurrentPage(1); 
      
      // Calculate total pages based on total count and limit per page
      const calculatedTotalPages = Math.ceil(data.total / 20);
      setTotalPages(calculatedTotalPages || 1);
      
      // Set lastPageReached flag (useful for disabling the "Next" button)
      // Since we're on page 1, we need to check if 1 >= totalPages
      setLastPageReached(1 >= calculatedTotalPages);
      
      // Show success toast with found count when explicitly searching (not when changing filters)
      if (query.trim() !== "" && !query.includes("year:") && !query.includes("(")) {
        toast({
          title: "Success", 
          description: `Found ${data.total} case(s).`
        });
      }
   
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: "Error during search. Please try again.",
        variant: "destructive"
      });
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
    categoryCounts["SUPREME_COURT"] +
    (categoryCounts["TRIBUNAL_COURT"] ?? 0);
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
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();

      // Clean up data cache
      for (const [key, entry] of cacheRef.current.entries()) {
        if (now - entry.timestamp >= CACHE_DURATION) {
          cacheRef.current.delete(key);
          console.log(`Expired cache entry removed: ${key}`);
        }
      }

      // Clean up category count cache
      for (const [key, entry] of categoryCountCacheRef.current.entries()) {
        if (now - entry.timestamp >= CACHE_DURATION) {
          categoryCountCacheRef.current.delete(key);
          console.log(`Expired category count cache entry removed: ${key}`);
        }
      }
    }, CACHE_DURATION); // Clean up every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  const handleDownloadPDF = async () => {
    try {
      // Set loading state for better UX
      setLoading(true);
      
      // Generate a professional filename with date
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      const categoryStr = selectedCategory !== 'all' ? `-${selectedCategory}` : '';
      const yearStr = selectedYear !== 'all' ? `-${selectedYear}` : '';
      const filename = `Legal_Cases${categoryStr}${yearStr}_${dateStr}.pdf`;
      
      // Generate PDF
      const blob = await pdf(<CaseTablePDF cases={filteredCases} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      // Create and trigger download link
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL object
      URL.revokeObjectURL(url);
      
      // Show success message
      toast({
        title: "PDF Generated Successfully",
        description: `${filteredCases.length} cases exported to ${filename}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                      onValueChange={(value) => {
                        // Show loading indicator
                        setLoading(true);
                        
                        // First clear the cache to ensure we get fresh data
                        clearCache();
                        
                        // Reset pagination and current page
                        setCurrentPage(1);
                        setTotalPages(1); // Reset total pages to ensure UI updates immediately
                        
                        // Update the selected category
                        setSelectedCategory(value);
                        
                        // Use setTimeout to ensure state updates are processed before fetching data
                        setTimeout(() => {
                          // Trigger a search with the new category to update results
                          const formInput = getFormInputByCategory(value);
                          searchCases(formInput);
                        }, 10);
                      }}
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
                        <SelectItem value="TRIBUNAL_COURT">Tribunal</SelectItem>
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
                      onValueChange={(value) => {
                        // CRITICAL: Capture the selected value in local variable to prevent closure issues
                        const selectedTaxSection = value;
                        
                        // Show loading indicator
                        setLoading(true);
                        
                        // First clear the cache to ensure we get fresh data
                        clearCache();
                        
                        // Reset pagination and current page
                        setCurrentPage(1);
                        setTotalPages(1); // Reset total pages to ensure UI updates immediately
                        
                        // Update the selected section
                        setSelectedSection(selectedTaxSection);
                        
                        // Enhanced debugging
                        console.log("🔍 Tax Section Filter Changed:");
                        console.log(`   - Selected: ${selectedTaxSection}`);
                        console.log(`   - Category: ${selectedCategory}`);
                        console.log(`   - Year: ${selectedYear}`);
                        
                        // Directly make the API call with the new section filter
                        // Don't wait for state updates to avoid timing issues
                        const queryParams = new URLSearchParams({
                          page: '1',
                          limit: '20',
                          sortBy: 'date',
                          sortOrder: 'desc'
                        });
                        
                        // Add necessary filters
                        if (selectedCategory !== "all") {
                          queryParams.append('category', selectedCategory);
                        }
                        
                        if (selectedYear !== "all") {
                          queryParams.append('year', selectedYear);
                        }
                        
                        // IMPORTANT: Always use the local selectedTaxSection variable, not the state variable
                        // Add the tax section filter if it's not "all"
                        if (selectedTaxSection !== "all") {
                          queryParams.append('taxSection', selectedTaxSection);
                          console.log(`🔎 IMPORTANT: Filtering by taxSection=${selectedTaxSection}`);
                          
                          // Add visual indicator for debugging
                          
                        }
                        
                        // Execute the filtered fetch
                        const apiUrl = `/api/case-laws?${queryParams.toString()}`;
                        console.log(`📊 Making API request: ${apiUrl}`);
                        
                        fetch(apiUrl)
                          .then(response => {
                            if (!response.ok) {
                              throw new Error(`API responded with status ${response.status}`);
                            }
                            return response.json();
                          })
                          .then(data => {
                            if (data.success && Array.isArray(data.data)) {
                              const resultCount = data.data.length;
                              console.log(`✅ Received ${resultCount} cases with section ${selectedTaxSection}`);
                              
                              // No results warning
                              if (resultCount === 0 && selectedTaxSection !== "all") {
                              
                                
                                console.log(`⚠️ WARNING: No cases found with tax section ${selectedTaxSection}`);
                                console.log("   This likely means no cases in your database have this tax section assigned.");
                                console.log("   Run the enhanced-tax-sections.js script to analyze and assign tax sections.");
                              }
                              
                              // Check if any of the results have the correct taxSection
                              const withTaxSection = data.data.filter(item => item.taxSection === selectedTaxSection);
                              console.log(`📋 Cases with exact taxSection=${selectedTaxSection}: ${withTaxSection.length}/${data.data.length}`);
                              
                              // Show a sample of the returned data for debugging
                              if (data.data.length > 0) {
                                const sample = data.data[0];
                                console.log("📝 Sample case:", {
                                  id: sample.id, 
                                  tid: sample.tid,
                                  title: sample.title?.substring(0, 50),
                                  taxSection: sample.taxSection,
                                  category: sample.category
                                });
                              }
                              
                              // Map API results to our CaseData format
                              const mappedCases = data.data.map((item: any) => {
                                const cleanHeadline = item.headline?.replace(/<[^>]+>/g, "") ?? "";
                                const cleanTitle = item.title?.replace(/<[^>]+>/g, "") ?? "";
                                
                                return {
                                  id: item.id || item.tid?.toString(),
                                  title: cleanTitle,
                                  court: item.docsource ?? "Unknown",
                                  date: item.publishdate ?? "",
                                  bench: item.bench ?? "",
                                  category: (item.category ? item.category.toString() : categorizeSource(item.docsource ?? "")) as "ITAT" | "GST" | "INCOME_TAX" | "HIGH_COURT" | "SUPREME_COURT" | "TRIBUNAL_COURT",
                                  outcome: "allowed" as "allowed",
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
                                  taxSection: item.taxSection || null,
                                };
                              });
                              
                              // Update the UI with filtered cases
                              setCases(mappedCases);
                              setFilteredCases(mappedCases);
                              
                              // Update pagination
                              setTotalPages(Math.ceil(data.total / 20) || 1);
                            } else {
                              // Handle empty results
                              setCases([]);
                              setFilteredCases([]);
                              console.log("No cases found with section:", selectedTaxSection);
                            }
                            setLoading(false);
                          })
                          .catch(error => {
                            console.error("Error fetching filtered cases:", error);
                            setLoading(false);
                            toast({
                              title: "Error",
                              description: "Failed to load cases with the selected filter",
                              variant: "destructive"
                            });
                          });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        
                        {/* GST Act Sections */}
                        <SelectItem value="SECTION_7_GST">Section 7 (CGST Act): Supply</SelectItem>
                        <SelectItem value="SECTION_16_GST">Section 16: Input Tax Credit</SelectItem>
                        <SelectItem value="SECTION_17_GST">Section 17: Apportionment of Credit</SelectItem>
                        <SelectItem value="SECTION_22_24_GST">Section 22-24: Registration</SelectItem>
                        <SelectItem value="SECTION_31_GST">Section 31: Tax Invoice</SelectItem>
                        <SelectItem value="SECTION_35_36_GST">Section 35-36: Accounts & Records</SelectItem>
                        <SelectItem value="SECTION_37_39_GST">Section 37-39: GST Returns</SelectItem>
                        <SelectItem value="SECTION_49_GST">Section 49: Payment of Tax</SelectItem>
                        <SelectItem value="SECTION_54_GST">Section 54: Refunds</SelectItem>
                        <SelectItem value="SECTION_73_74_GST">Section 73-74: Tax Determination</SelectItem>
                        <SelectItem value="SECTION_122_GST">Section 122: Penalties</SelectItem>
                        <SelectItem value="SECTION_129_GST">Section 129: Detention of goods</SelectItem>
                        <SelectItem value="SECTION_140_GST">Section 140: Transitional Provisions</SelectItem>
                        
                        {/* Income Tax Act Sections */}
                        <SelectItem value="SECTION_2_IT">Section 2: Definitions</SelectItem>
                        <SelectItem value="SECTION_10_IT">Section 10: Exempt Income</SelectItem>
                        <SelectItem value="SECTION_14_IT">Section 14: Heads of Income</SelectItem>
                        <SelectItem value="SECTION_15_17_IT">Section 15-17: Salary Income</SelectItem>
                        <SelectItem value="SECTION_28_44_IT">Section 28-44: Business Profits</SelectItem>
                        <SelectItem value="SECTION_80C_80U_IT">Section 80C-80U: Deductions</SelectItem>
                        <SelectItem value="SECTION_139_IT">Section 139: Return Filing</SelectItem>
                        <SelectItem value="SECTION_143_IT">Section 143: Assessment</SelectItem>
                        <SelectItem value="SECTION_147_IT">Section 147: Escaped Income</SelectItem>
                        <SelectItem value="SECTION_194_206_IT">Section 194-206: TDS</SelectItem>
                        <SelectItem value="SECTION_234_IT">Section 234A/B/C: Interest</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedYear}
                      onValueChange={(value) => {
                        // Show loading indicator
                        setLoading(true);
                        
                        // First clear the cache to ensure we get fresh data
                        clearCache();
                        
                        // Reset pagination and current page
                        setCurrentPage(1);
                        setTotalPages(1); // Reset total pages to ensure UI updates immediately
                        
                        // Update the selected year
                        setSelectedYear(value);
                        
                        // Use setTimeout to ensure state updates are processed before fetching data
                        setTimeout(() => {
                          // Trigger a search with the new year to update results
                          const formInput = getFormInputByCategory(selectedCategory);
                          searchCases(formInput);
                        }, 10);
                      }}
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
                        // Show loading indicator
                        setLoading(true);
                        
                        // Clear all search filters
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedCourt("all");
                        setSelectedOutcome("all");
                        setSelectedYear("all");
                        setSelectedSection("all");
                        
                        // Reset pagination
                        setCurrentPage(1);
                        
                        // Clear cache
                        clearCache();
                        
                        // Reload data with default settings using a delay to ensure state changes are processed
                        setTimeout(() => {
                          searchCases(""); // Empty search to get default results
                        }, 10);
                      }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button 
                      onClick={handleDownloadPDF} 
                      className="mb-4"
                      disabled={loading || filteredCases.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? "Generating..." : "Download PDF"}
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
                                        e.stopPropagation(); // prevent row toggle
                                        router.push(
                                          `/case-laws/${caseItem.caseNumber}`
                                        ); // navigate to dynamic route
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
              {statsLoading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <Card
                      key={`skeleton-${idx}`}
                      className="p-6 space-y-4 animate-pulse"
                    >
                      <div className="h-5 w-1/2 bg-gray-300 rounded" />
                      <div className="h-8 w-1/3 bg-gray-300 rounded" />
                      <div className="h-10 w-full bg-gray-200 rounded mt-2" />
                    </Card>
                  ))
                : [
                    "ITAT",
                    "GST",
                    "INCOME_TAX",
                    "HIGH_COURT",
                    "SUPREME_COURT",
                  ].map((category) => (
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
                          <p className="text-sm text-gray-600">
                            Available cases
                          </p>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              // Set the selected category
                              setSelectedCategory(category);
                              
                              // Switch to search tab
                              setActiveTab("search");
                              
                              // Reset search query and other filters for clean search
                              setSearchQuery("");
                              setCurrentPage(1);
                              
                              // Optionally trigger a search with this category
                              // This will help populate results immediately
                              const formInput = getFormInputByCategory(category);
                              searchCases(formInput);
                            }}
                          >
                            Browse Cases
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Distribution by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="w-24 h-4 bg-gray-200 rounded" />
                            <div className="w-16 h-4 bg-gray-200 rounded" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
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
                                {count.toLocaleString()} (
                                {percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Outcome Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="w-24 h-4 bg-gray-200 rounded" />
                            <div className="w-16 h-4 bg-gray-200 rounded" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
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
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <div className="flex justify-between items-center mt-4 mb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <span className="text-sm text-gray-600">
          Showing page {currentPage} of {totalPages}
        </span>

        <nav className="inline-flex items-center space-x-1">
          {/* Previous Button */}
          <button
            onClick={handlePreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {/* First Page */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                1
              </button>
              
              {/* Ellipsis if needed */}
              {currentPage > 4 && (
                <span className="px-2">...</span>
              )}
            </>
          )}
          
          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Calculate the page numbers to show
            let pageNum;
            if (currentPage <= 3) {
              // If near start, show first 5 pages
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // If near end, show last 5 pages
              pageNum = totalPages - 4 + i;
            } else {
              // Otherwise show 2 before and 2 after current
              pageNum = currentPage - 2 + i;
            }
            
            // Only render if the page is valid
            if (pageNum > 0 && pageNum <= totalPages) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border rounded ${
                    pageNum === currentPage 
                      ? "bg-blue-700 text-white font-semibold" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            return null;
          })}
          
          {/* Ellipsis and Last Page */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-2">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}
          
          {/* Next Button */}
          <button
            onClick={handleNextPage}
            className={`px-3 py-1 border rounded hover:bg-gray-100 ${
              currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
