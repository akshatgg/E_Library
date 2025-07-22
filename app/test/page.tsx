"use client";
import React, { useState } from "react";
import {
  FileText,
  Menu,
  X,
  Calculator,
  Receipt,
  Gavel,
  TrendingUp,
  Building,
  DollarSign,
  User,
  Mail,
  Calendar,
  Eye,
  Printer,
  Edit,
  Trash2,
  Plus,
  Download,
} from "lucide-react";
import {
  formTemplates,
  generateFormContent,
  hasTemplate,
} from "../../lib/formtemplate";

export default function EnhancedDepartmentalLetters() {
  const [selectedTab, setSelectedTab] = useState("Tax");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [partyCode, setPartyCode] = useState("127");
  const [partyName, setPartyName] = useState("Abha Gaur");
  const [address, setAddress] = useState(
    "35 Khurjey Wala Mohalla,Khurjey Wala Mohalla,Lashker,Gwalior,MADHYA PRADESH,INDIA,474001"
  );
  const [email, setEmail] = useState("drpukhraj@gmail.com");
  const [assYear, setAssYear] = useState("2026 - 2027");
  const [gstNumber, setGstNumber] = useState("");
  const [partnerName, setPartnerName] = useState("Raj Kumar Kushwah");
  const [firmName, setFirmName] = useState("Anshul Goods Carriers");
  const [previewContent, setPreviewContent] = useState(null);

  const tabs = [
    { id: "Tax", label: "Tax", icon: Calculator },
    { id: "Tds", label: "TDS", icon: Receipt },
    { id: "Serve", label: "Serve", icon: Gavel },
    { id: "Val", label: "Val", icon: TrendingUp },
    { id: "Roc", label: "ROC", icon: Building },
    { id: "GST", label: "GST", icon: DollarSign },
  ];

  const formCategories = {
    Refund: [
      "GST Refund Application",
      "Income Tax Refund",
      "Excess Payment Refund",
      "TDS Refund Application",
    ],
    Gift_Deed: [
      "Property Gift Deed",
      "Cash Gift Declaration",
      "Share Gift Transfer",
    ],
    Stay: ["Stay Application", "Stay Extension Request", "Stay Modification"],
    Appeal_Effect: ["Appeal Filing", "Appeal Effect Request", "Cross Appeal"],
    Will_Deed: ["Will Registration", "Will Amendment", "Will Execution"],
    "154_Application": [
      "Rectification Application",
      "Error Correction",
      "Computational Error",
    ],
    Early_Fixation: [
      "Early Assessment",
      "Fixation Request",
      "Timeline Extension",
    ],
    Authority: ["Authority Letter", "Power of Attorney", "Authorization Form"],
    General: [
      "General Application",
      "Miscellaneous Request",
      "Information Request",
    ],
    Calculation: [
      "Tax Calculation",
      "Interest Calculation",
      "Penalty Calculation",
    ],
    Adjournment: [
      "Hearing Adjournment",
      "Date Extension",
      "Postponement Request",
    ],
    Affidavit: ["General Affidavit", "Income Affidavit", "Asset Declaration"],
    "Partnership/Trust_Deed": [
      "Partnership Deed",
      "Trust Formation",
      "Deed Amendment",
    ],
    Assessment: [
      "Self Assessment",
      "Return Assessment",
      "Reassessment Application",
    ],
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
    setSelectedForm(null);
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    // Add to documents list if not already present
    const docExists = documents.some(
      (doc) => doc.name === form && doc.category === selectedCategory
    );
    if (!docExists) {
      const newDoc = {
        id: Date.now(),
        name: form,
        category: selectedCategory,
        createdOn: new Date().toLocaleDateString(),
        nature: selectedCategory,
        fileName: `${form.replace(/\s+/g, "_")}.pdf`,
        filedDate: "",
        assYear: assYear,
        software: "CompuTax",
        dms: "Pending",
      };
      setDocuments([...documents, newDoc]);
    }
  };

  const handleCreate = () => {
    if (selectedForm && hasTemplate(selectedForm)) {
      const formData = {
        gstNumber,
        partnerName,
        firmName,
        partyName,
        address,
        email,
        assYear,
        panNumber: "", // Add PAN input field if needed
        refundAmount: "",
        refundReason: "",
        place: "Fatehpur",
      };

      const generatedForm = generateFormContent(selectedForm, formData);
      console.log("Creating form:", generatedForm);
      alert(`Form "${selectedForm}" created successfully!`);
    } else {
      alert("Please select a form first or template not available");
    }
  };

  const handlePreview = () => {
    if (selectedForm && hasTemplate(selectedForm)) {
      const formData = {
        gstNumber,
        partnerName,
        firmName,
        partyName,
        address,
        email,
        assYear,
        panNumber: "", // Add PAN input field if needed
        refundAmount: "",
        refundReason: "",
        place: "Fatehpur",
      };

      // Store the generated content for preview
      const generatedForm = generateFormContent(selectedForm, formData);
      setPreviewContent(generatedForm);
      setShowPreview(true);
    } else {
      alert("Please select a form first or template not available");
    }
  };

  const handlePrint = () => {
    if (selectedForm && hasTemplate(selectedForm)) {
      const formData = {
        gstNumber,
        partnerName,
        firmName,
        partyName,
        address,
        email,
        assYear,
        panNumber: "",
        refundAmount: "",
        refundReason: "",
        place: "Fatehpur",
      };

      const generatedForm = generateFormContent(selectedForm, formData);

      if (generatedForm) {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
        <html>
          <head>
            <title>${generatedForm.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { text-align: center; margin-bottom: 30px; }
              pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            <h1>${generatedForm.title}</h1>
            <pre>${generatedForm.content}</pre>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
        printWindow.document.close();
      }
    } else {
      alert("Please select a form first or template not available");
    }
  };

  const handleEdit = () => {
    if (selectedForm) {
      alert(`Editing form: ${selectedForm}`);
      // Implement edit functionality
    } else {
      alert("Please select a form first");
    }
  };

  const handleDelete = (docId) => {
    setDocuments(documents.filter((doc) => doc.id !== docId));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Departmental Letters
                </h1>
                <p className="text-sm text-slate-500">
                  CompuTax Management System
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <nav className="hidden lg:flex space-x-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="hidden xl:inline">{tab.label}</span>
                    <span className="xl:hidden">{index + 1}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-2">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center p-3 rounded-lg font-medium transition-all duration-200 ${
                        selectedTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Party Details */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Party Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-2">
                    Party Code:
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={partyCode}
                      onChange={(e) => setPartyCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-3 py-2 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors">
                      ...
                    </button>
                  </div>
                </div>

                <div className="md:text-right">
                  <label className="block text-sm font-medium text-blue-600 mb-2">
                    Code:
                  </label>
                  <div className="flex md:justify-end gap-2">
                    <input
                      value={partyCode}
                      onChange={(e) => setPartyCode(e.target.value)}
                      className="w-20 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-3 py-2 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors">
                      ...
                    </button>
                  </div>
                  <div className="mt-3 text-sm font-medium text-blue-600">
                    CompuOffice Home
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-blue-600">
                    Party Name:
                  </span>
                  <input
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <span className="text-sm font-medium text-blue-600">
                    Address:
                  </span>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      Email:
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      GST Number:
                    </span>
                    <input
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      Partner Name:
                    </span>
                    <input
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      Firm Name:
                    </span>
                    <input
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <label className="text-sm font-medium text-blue-600">
                    Ass. Year:
                  </label>
                  <select
                    value={assYear}
                    onChange={(e) => setAssYear(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>2026 - 2027</option>
                    <option>2025 - 2026</option>
                    <option>2024 - 2025</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Form Categories
              </h2>

              {/* Category Tabs */}
              <div className="border-b border-slate-200 mb-4">
                <div className="flex flex-wrap gap-1">
                  {Object.keys(formCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-3 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                        selectedCategory === category
                          ? "border-blue-500 text-blue-600 bg-blue-50"
                          : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                      }`}
                    >
                      {category.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Forms List */}
              {selectedCategory && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">
                    {selectedCategory.replace(/_/g, " ")} Forms:
                  </h3>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 bg-white rounded">
                    {formCategories[selectedCategory].map((form) => (
                      <button
                        key={form}
                        onClick={() => handleFormSelect(form)}
                        className={`w-full px-3 py-2 text-left text-sm border-b border-slate-100 last:border-b-0 transition-colors ${
                          selectedForm === form
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        {form}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedForm && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center text-sm text-blue-800">
                    <FileText className="h-4 w-4 mr-2" />
                    Selected:{" "}
                    <span className="font-medium ml-1">{selectedForm}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 text-white text-center py-4">
              <h2 className="text-lg font-bold">Documents List</h2>
            </div>

            {/* Document Table */}
            <div className="p-4">
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <div className="bg-blue-50 grid grid-cols-8 gap-1 p-3 text-xs font-semibold text-slate-900 border-b border-slate-200">
                  <div>Created on</div>
                  <div>Nature</div>
                  <div>File Name</div>
                  <div>Filed Date</div>
                  <div>A.Y.</div>
                  <div>Software</div>
                  <div>DMS</div>
                  <div>Actions</div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {documents.length === 0 ? (
                    <div className="h-40 bg-slate-50 flex items-center justify-center">
                      <p className="text-slate-500 text-sm">
                        No documents available
                      </p>
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-8 gap-1 p-3 text-xs border-b border-slate-100 hover:bg-slate-50"
                      >
                        <div>{doc.createdOn}</div>
                        <div>{doc.nature}</div>
                        <div className="truncate" title={doc.fileName}>
                          {doc.fileName}
                        </div>
                        <div>{doc.filedDate || "-"}</div>
                        <div>{doc.assYear}</div>
                        <div>{doc.software}</div>
                        <div>{doc.dms}</div>
                        <div>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Letters Creation Date:</span>
                  <input
                    type="date"
                    className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    U. Update
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Letters Filing Date:</span>
                  <input
                    type="date"
                    className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    F. Filed
                  </button>
                </div>
              </div>

              <h3 className="text-center font-bold text-slate-900 mb-4">
                Letters
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-4">
                <button
                  onClick={handleCreate}
                  className="flex items-center justify-center px-3 py-2 bg-green-100 border border-green-300 rounded hover:bg-green-200 transition-all duration-200"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  C. Create
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center px-3 py-2 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 transition-all duration-200"
                >
                  <Printer className="h-3 w-3 mr-1" />
                  P. Print
                </button>
                <button
                  onClick={handlePreview}
                  className="flex items-center justify-center px-3 py-2 bg-purple-100 border border-purple-300 rounded hover:bg-purple-200 transition-all duration-200"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  V. Preview
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center px-3 py-2 bg-orange-100 border border-orange-300 rounded hover:bg-orange-200 transition-all duration-200"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  E. Edit
                </button>
                <button className="px-3 py-2 bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-all duration-200">
                  D. Delete
                </button>
                <button className="px-3 py-2 bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-all duration-200">
                  S. Send Mail
                </button>
                <button className="px-3 py-2 bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-all duration-200">
                  X. Exit
                </button>
                <button className="px-3 py-2 bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-all duration-200">
                  L. Login
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Y. PDF for uploading to IT Portal
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  M. Computation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {previewContent.title}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {previewContent.content}
              </pre>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
