"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, Loader, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCaseDetail } from "../actions";

interface CaseData {
  success: boolean;
  data: {
    tid: number;
    publishdate: string;
    title: string;
    doc: string;
    numcites: number;
    numcitedby: number;
    docsource: string;
    citetid: number;
    divtype: string;
    courtcopy: boolean;
    query_alert: any;
    agreement: boolean;
  };
  error?: string;
}
import { pdf } from "@react-pdf/renderer";
import JudgmentPDF from "@/components/pdf/JudgementPDF";

export default function CasePage({ params }: { params: { tid: string } }) {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const stripHtmlTags = (html: string) => {
    // Special handling for legal document structure
    let text = html
      // Proper paragraph handling
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      // Heading handling
      .replace(/<h1[^>]*>/gi, '\n\n')
      .replace(/<\/h1>/gi, '\n\n')
      .replace(/<h2[^>]*>/gi, '\n\n')
      .replace(/<\/h2>/gi, '\n\n')
      .replace(/<h3[^>]*>/gi, '\n\n')
      .replace(/<\/h3>/gi, '\n\n')
      .replace(/<h[4-6][^>]*>/gi, '\n')
      .replace(/<\/h[4-6]>/gi, '\n')
      // List handling for legal points
      .replace(/<ul[^>]*>|<ol[^>]*>/gi, '\n')
      .replace(/<\/ul>|<\/ol>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n   • ')
      .replace(/<\/li>/gi, '')
      // Table handling - important for legal documents
      .replace(/<tr[^>]*>/gi, '\n')
      .replace(/<td[^>]*>/gi, '\t')
      .replace(/<\/td>|<\/tr>/gi, '')
      // Line breaks and divs
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')
      // Special legal document elements
      .replace(/<blockquote[^>]*>/gi, '\n\n"')
      .replace(/<\/blockquote>/gi, '"\n\n')
      // Bold and emphasis often used for case names and citations
      .replace(/<b[^>]*>|<strong[^>]*>/gi, '')
      .replace(/<\/b>|<\/strong>/gi, '')
      .replace(/<i[^>]*>|<em[^>]*>/gi, '')
      .replace(/<\/i>|<\/em>/gi, '');
      
    // Remove all remaining HTML tags
    text = text.replace(/<[^>]*>?/gm, '');
    
    // Fix common HTML entities - legal documents have many special characters
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&rsquo;|&#39;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&ndash;/g, '–')
      .replace(/&mdash;/g, '—')
      .replace(/&sect;/g, '§')
      .replace(/&para;/g, '¶')
      .replace(/&reg;/g, '®')
      .replace(/&copy;/g, '©')
      .replace(/&trade;/g, '™');
    
    // Legal document specific formatting
    text = text
      // Format paragraph numbers and section references properly
      .replace(/(\d+)\.(\d+)\.(\d+)/g, '$1.$2.$3 ') // Multi-level numbering
      .replace(/(\d+)\.(\d+)/g, '$1.$2 ') // Two-level numbering
      .replace(/(\d+)\./g, '\n$1. ') // Single-level numbering
      .replace(/\(([ivx]+)\)/gi, '($1) ') // Roman numerals in parentheses
      .replace(/\(([a-z])\)/g, '($1) ') // Lettered points
      
      // Fix spacing issues
      .replace(/\n{3,}/g, '\n\n')  // Limit consecutive line breaks
      .replace(/\s{2,}/g, ' ')      // Limit consecutive spaces
      .trim(); // Remove leading/trailing whitespace
      
    return text;
  };


  const handleDownloadJudgmentPDF = async () => {
  if (!caseData) return;

  // Prepare the document for better PDF formatting
  const prepareDocumentForPDF = (htmlContent: string) => {
    // First extract the important text using our HTML stripper
    let textContent = stripHtmlTags(htmlContent);
    
    // Legal document specific formatting
    textContent = textContent
      // Normalize all whitespace first
      .replace(/\s+/g, ' ')
      // Ensure proper spacing after punctuation
      .replace(/\.(?=\S)/g, '. ')
      .replace(/,(?=\S)/g, ', ')
      .replace(/;(?=\S)/g, '; ')
      .replace(/:(?=\S)/g, ': ')
      // Special handling for citations
      .replace(/\[\d+\]/g, match => ` ${match} `)
      // Handle section and paragraph formatting
      .replace(/(\([a-z]\)|\d+\.)(?=\S)/g, match => `\n${match} `)
      // Handle quoted text
      .replace(/"([^"]*)"/g, ' "$1" ')
      // Remove any excessive spacing that might have been added
      .replace(/\s{2,}/g, ' ');
    
    return textContent;
  };
  
  // Process the content for PDF
  let textContent = prepareDocumentForPDF(caseData.data.doc);
  
  // Extract case info
  const extractedCaseInfo = extractCaseInfo(caseData.data.doc);
  
  // Generate a professional filename with court type and year
  const courtType = caseData.data.docsource.includes('supreme') ? 'SC' : 
                    caseData.data.docsource.includes('high') ? 'HC' : 
                    caseData.data.docsource.includes('itat') ? 'ITAT' : 'TRIB';
                    
  const year = new Date(caseData.data.publishdate).getFullYear();
  
  // Create case name from parties or use first part of title
  let caseName = "";
  if (extractedCaseInfo.parties) {
    // Extract first word from each party
    const parties = extractedCaseInfo.parties.split(' vs ');
    if (parties.length >= 2) {
      caseName = `${parties[0].split(' ')[0]}_v_${parties[1].split(' ')[0]}`;
    } else {
      caseName = extractedCaseInfo.parties.substring(0, 20).replace(/\s+/g, '_');
    }
  } else {
    // Use safe title
    caseName = caseData.data.title
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
  }
  
  const fileName = `${courtType}_${year}_${caseName}.pdf`;
  
  const blob = await pdf(
    <JudgmentPDF
      title={caseData.data.title}
      caseNumber={extractedCaseInfo.caseNumber || ""}
      date={formatDate(caseData.data.publishdate)}
      content={textContent}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};


  // Unwrap params using use() for future Next.js compatibility
  // This works with both current params object and future Promise-based params
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const tid = parseInt(resolvedParams.tid, 10);

  useEffect(() => {
    async function fetchCase() {
      try {
        setLoading(true);
        const result = await getCaseDetail(tid);
        if (result.success) {
          setCaseData(result);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error fetching case data:", error);
        setError(error instanceof Error ? error.message : "Failed to load case data");
      } finally {
        setLoading(false);
      }
    }

    if (tid) {
      fetchCase();
    }
  }, [tid]);

  const extractCaseInfo = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Extract key information from HTML
    const titleElement = doc.querySelector(".doc_title");
    const preElements = doc.querySelectorAll("pre");

    let caseTitle = titleElement?.textContent || "";
    let parties = "";
    let caseNumber = "";
    let assessmentYear = "";
    let judges = "";
    let hearingDate = "";
    let pronouncementDate = "";

    // Extract information from the first pre element which usually contains case details
    if (preElements.length > 0) {
      const firstPre = preElements[0].textContent || "";

      // Extract case details using regex patterns
      const itaMatch = firstPre.match(/ITA No[.\s]*(\d+\/[A-Z]+\/\d+)/i);
      if (itaMatch) caseNumber = itaMatch[1];

      const ayMatch = firstPre.match(/Assessment Years?\s*:\s*(\d{4}-\d{2})/i);
      if (ayMatch) assessmentYear = ayMatch[1];

      const hearingMatch = firstPre.match(/Date of Hearing\s*:\s*([0-9\/]+)/i);
      if (hearingMatch) hearingDate = hearingMatch[1];

      const pronouncementMatch = firstPre.match(
        /Date of Pronouncement\s*:\s*([0-9\/]+)/i
      );
      if (pronouncementMatch) pronouncementDate = pronouncementMatch[1];

      // Extract parties
      const vsMatch = caseTitle.match(/^(.*?)\s+vs?\s+(.*?)\s+on/i);
      if (vsMatch) {
        parties = `${vsMatch[1].trim()} vs ${vsMatch[2].trim()}`;
      }
    }

    return {
      caseTitle,
      parties,
      caseNumber,
      assessmentYear,
      judges,
      hearingDate,
      pronouncementDate,
    };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const cleanHtmlContent = (htmlContent: string) => {
    // Remove unwanted symbols and clean up HTML
    let cleaned = htmlContent
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"');
    
    // Improve paragraph formatting
    cleaned = cleaned.replace(/<p>\s*<\/p>/g, ''); // Remove empty paragraphs
    
    // Add styling to improve readability
    cleaned = cleaned.replace(/<p/g, '<p class="mb-4"');
    cleaned = cleaned.replace(/<h(\d)/g, '<h$1 class="font-semibold text-gray-800 mb-3 mt-6"');
    
    // Format blockquotes properly
    cleaned = cleaned.replace(/<blockquote/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4"');
    
    // Add styling to lists for better readability
    cleaned = cleaned.replace(/<ul/g, '<ul class="list-disc pl-5 my-4"');
    cleaned = cleaned.replace(/<ol/g, '<ol class="list-decimal pl-5 my-4"');
    cleaned = cleaned.replace(/<li/g, '<li class="mb-2"');
    
    return cleaned;
  };

  if (loading) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing...
      </>
    );
  }

  if (error || !caseData?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Case
          </h2>
          <p className="text-gray-600">{error || "Case data not found"}</p>
        </div>
      </div>
    );
  }

  const caseInfo = extractCaseInfo(caseData.data.doc);
  const cleanedContent = cleanHtmlContent(caseData.data.doc);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {caseData.data.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  TID: {caseData.data.tid}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Published: {formatDate(caseData.data.publishdate)}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Source: {caseData.data.docsource}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {caseData.data.divtype}
              </div>
              {caseData.data.courtcopy && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Court Copy
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {caseData.data.numcites}
              </div>
              <div className="text-sm text-gray-600">Citations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {caseData.data.numcitedby}
              </div>
              <div className="text-sm text-gray-600">Cited By</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Date(caseData.data.publishdate).getFullYear().toString() || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Assessment Year</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {caseInfo.caseNumber || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Case Number</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "details", label: "Case Details" },
              { id: "judgment", label: "Full Judgment" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Case Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Case Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Parties:
                    </span>
                    <p className="text-sm text-gray-900">
                      {caseInfo.parties || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Assessment Year:
                    </span>
                    <p className="text-sm text-gray-900">
                      {new Date(caseData.data.publishdate).getFullYear().toString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Case Number:
                    </span>
                    <p className="text-sm text-gray-900">
                      {caseInfo.caseNumber || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Important Dates
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Published:
                    </span>
                    <p className="text-sm text-gray-900">
                      {formatDate(caseData.data.publishdate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Hearing Date:
                    </span>
                    <p className="text-sm text-gray-900">
                      {caseInfo.hearingDate || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Pronouncement:
                    </span>
                    <p className="text-sm text-gray-900">
                      {caseInfo.pronouncementDate || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Citation Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Total Citations:
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {caseData.data.numcites}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Cited By Others:
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {caseData.data.numcitedby}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Court Copy:
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        caseData.data.courtcopy
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {caseData.data.courtcopy ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Source Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Source & Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Document Source:
                  </span>
                  <p className="text-sm text-gray-900 mt-1">
                    {caseData.data.docsource}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Document Type:
                  </span>
                  <p className="text-sm text-gray-900 mt-1 capitalize">
                    {caseData.data.divtype}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Case Details Summary
              </h3>
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Case Title:</h4>
                  <p className="text-gray-700">{caseData.data.title}</p>
                </div>

                {caseInfo.parties && (
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">Parties Involved:</h4>
                    <p className="text-gray-700">{caseInfo.parties}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Assessment Year:</h4>
                    <p className="text-gray-700">{new Date(caseData.data.publishdate).getFullYear().toString()}</p>
                  </div>

                  {caseInfo.caseNumber && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Case Number:</h4>
                      <p className="text-gray-700">{caseInfo.caseNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "judgment" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Full Judgment Text
                </h3>
                <Button onClick={handleDownloadJudgmentPDF} className="ml-4">
                  Download PDF
                </Button>
              </div>
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Case Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Title:</span> {caseData.data.title}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {formatDate(caseData.data.publishdate)}
                  </div>
                  <div>
                    <span className="font-medium">Source:</span> {caseData.data.docsource}
                  </div>
                </div>
              </div>
              <div
                className="prose prose-headings:font-semibold prose-headings:text-gray-800 
                           prose-p:text-justify prose-p:my-4 max-w-none text-sm leading-relaxed 
                           border-t border-gray-200 pt-6"
                dangerouslySetInnerHTML={{ __html: cleanedContent }}
                style={{
                  fontFamily: "Georgia, serif",
                  lineHeight: "1.8",
                  color: "#333",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
