"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
};


  const handleDownloadJudgmentPDF = async () => {
  if (!caseData) return;

  const textContent = stripHtmlTags(caseData.data.doc);
  const blob = await pdf(
    <JudgmentPDF
      title={caseData.data.title}
      caseNumber={caseInfo.caseNumber || ""}
      date={formatDate(caseData.data.publishdate)}
      content={textContent}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "judgment.pdf");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const tid = parseInt(params.tid, 10);

  useEffect(() => {
    async function fetchCase() {
      try {
        setLoading(true);
        const response = await fetch(`/api/cases/tid?tid=${tid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch case data");
        }
        const data = await response.json();
        setCaseData(data);
      } catch (error) {
        console.error("Error fetching case data:", error);
        setError("Failed to load case data");
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
    return htmlContent
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"');
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
                {caseInfo.assessmentYear || "N/A"}
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
                      {caseInfo.assessmentYear || "Not specified"}
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
                  {caseInfo.assessmentYear && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Assessment Year:</h4>
                      <p className="text-gray-700">{caseInfo.assessmentYear}</p>
                    </div>
                  )}

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
              <div className="flex justify-end">
                <Button onClick={handleDownloadJudgmentPDF} className="mb-4">
                  Download PDF
                </Button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Full Judgment Text
              </h3>
              <div
                className="prose max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cleanedContent }}
                style={{
                  fontFamily: "Georgia, serif",
                  lineHeight: "1.6",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
