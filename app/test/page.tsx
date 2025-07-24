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
  Send,
  Save,
} from "lucide-react";
import {
  formTemplates,
  generateFormContent,
  hasTemplate,
  type FormData,
  type FormTemplate,
} from "../../lib/formtemplate";

interface Document {
  id: number;
  name: string;
  category: string;
  createdOn: string;
  nature: string;
  fileName: string;
  filedDate: string;
  assYear: string;
  software: string;
  dms: string;
}

interface PreviewContent {
  title: string;
  content: string;
}

interface FormCategories {
  [key: string]: string[];
}

export default function EnhancedDepartmentalLetters() {
  const [selectedTab, setSelectedTab] = useState("Tax");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeDocument, setActiveDocument] = useState<number | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [partyCode, setPartyCode] = useState("");
  const [partyName, setPartyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [assYear, setAssYear] = useState("2026 - 2027");
  const [gstNumber, setGstNumber] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [firmName, setFirmName] = useState("");
  const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState<FormData>({});
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [place, setPlace] = useState("");
  const [creationDate, setCreationDate] = useState(new Date().toISOString().split('T')[0]);
  const [filedDate, setFiledDate] = useState("");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editableTemplate, setEditableTemplate] = useState("");
  const [customTemplates, setCustomTemplates] = useState<{[key: string]: string}>({});
  // Add missing state variables for PAN, bank details, etc.
  const [panNumber, setPanNumber] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [tdsAmount, setTdsAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [showMultiEmailDialog, setShowMultiEmailDialog] = useState(false);
  const [selectedEmailDocuments, setSelectedEmailDocuments] = useState<number[]>([]);
  // Toast notification system
  const [notifications, setNotifications] = useState<Array<{id: number, message: string, type: 'success' | 'error' | 'info'}>>([]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const tabs = [
    { id: "Tax", label: "Tax", icon: Calculator },
    { id: "Tds", label: "TDS", icon: Receipt },
    { id: "Serve", label: "Serve", icon: Gavel },
    { id: "Val", label: "Val", icon: TrendingUp },
    { id: "Roc", label: "ROC", icon: Building },
    { id: "GST", label: "GST", icon: DollarSign },
  ];

  const formCategories: FormCategories = {
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
  };

  const handleFormSelect = (form: string) => {
    // Simply add to documents list without complex selection logic
    const docExists = documents.some(
      (doc) => doc.name === form && doc.category === selectedCategory
    );
    if (!docExists) {
      const newDoc: Document = {
        id: Date.now(),
        name: form,
        category: selectedCategory,
        createdOn: new Date(creationDate).toLocaleDateString(),
        nature: selectedCategory,
        fileName: `${form.replace(/\s+/g, "_")}.pdf`,
        filedDate: filedDate ? new Date(filedDate).toLocaleDateString() : "",
        assYear: assYear,
        software: "CompuTax",
        dms: "Pending",
      };
      setDocuments([...documents, newDoc]);
      showNotification(`"${form}" added to Documents List!`, 'success');
    } else {
      showNotification(`"${form}" already exists in Documents List!`, 'error');
    }
  };

  const handleDocumentSelect = (docId: number) => {
    const document = documents.find(doc => doc.id === docId);
    if (!document) return;

    if (selectedDocuments.includes(docId)) {
      // Remove from selection if already selected
      const newSelectedDocs = selectedDocuments.filter(id => id !== docId);
      setSelectedDocuments(newSelectedDocs);
      
      // Update active document
      if (newSelectedDocs.length > 0) {
        if (activeDocument === docId) {
          setActiveDocument(newSelectedDocs[0]);
        }
      } else {
        setActiveDocument(null);
      }
    } else {
      // Add to selection
      const newSelectedDocs = [...selectedDocuments, docId];
      setSelectedDocuments(newSelectedDocs);
      
      // Set as active document if it's the first one or no active document
      if (!activeDocument) {
        setActiveDocument(docId);
      }
    }
  };

  const getActiveDocumentForm = () => {
    if (activeDocument) {
      const doc = documents.find(d => d.id === activeDocument);
      return doc?.name || null;
    }
    return null;
  };

  const getFormData = () => {
    return {
      gstNumber: editFormData.gstNumber || gstNumber,
      partnerName: editFormData.partnerName || partnerName,
      firmName: editFormData.firmName || firmName,
      partyName: editFormData.partyName || partyName,
      address: editFormData.address || address,
      email: editFormData.email || email,
      assYear: editFormData.assYear || assYear,
      panNumber: editFormData.panNumber || panNumber,
      refundAmount: editFormData.refundAmount || refundAmount,
      refundReason: editFormData.refundReason || "",
      place: editFormData.place || place,
      wardNumber: editFormData.wardNumber || wardNumber,
      tdsAmount: editFormData.tdsAmount || tdsAmount,
      bankName: editFormData.bankName || bankName,
      accountNumber: editFormData.accountNumber || accountNumber,
      ifscCode: editFormData.ifscCode || ifscCode,
      currentDate: new Date(creationDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      }),
    };
  };

  const generateCustomFormContent = (formName: string, formData: FormData) => {
    // Check if we have a custom template for this form
    if (customTemplates[formName]) {
      return {
        title: formName,
        content: customTemplates[formName]
      };
    }
    
    // Otherwise use the original template
    return generateFormContent(formName, formData);
  };

  const handleCreate = () => {
    const formToUse = getActiveDocumentForm();
    if (formToUse && hasTemplate(formToUse)) {
      const formData = getFormData();

      const generatedForm = generateCustomFormContent(formToUse, formData);
      console.log("Creating form:", generatedForm);
      showNotification(`Form "${formToUse}" created successfully!`, 'success');
    } else {
      showNotification("Please select a document first or template not available", 'error');
    }
  };

  const handlePreview = () => {
    const formToUse = getActiveDocumentForm();
    if (formToUse && hasTemplate(formToUse)) {
      const formData = getFormData();

      // Store the generated content for preview
      const generatedForm = generateCustomFormContent(formToUse, formData);
      setPreviewContent(generatedForm);
      setShowPreview(true);
    } else {
      showNotification("Please select a document first or template not available", 'error');
    }
  };

  const handlePrint = () => {
    const formToUse = getActiveDocumentForm();
    if (formToUse && hasTemplate(formToUse)) {
      const formData = getFormData();

      const generatedForm = generateCustomFormContent(formToUse, formData);

      if (generatedForm) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
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
      }
    } else {
      showNotification("Please select a document first or template not available", 'error');
    }
  };

  const handleEdit = () => {
    const formToUse = getActiveDocumentForm();
    if (formToUse) {
      // Initialize edit form with current data - now includes all fields
      const currentFormData: FormData = {
        gstNumber: gstNumber || "",
        partnerName: partnerName || "",
        firmName: firmName || "",
        partyName: partyName || "",
        address: address || "",
        email: email || "",
        assYear,
        panNumber: panNumber || "",
        refundAmount: refundAmount || "",
        refundReason: "",
        place: place || "",
        wardNumber: wardNumber || "",
        tdsAmount: tdsAmount || "",
        bankName: bankName || "",
        accountNumber: accountNumber || "",
        ifscCode: ifscCode || "",
        currentDate: new Date(creationDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric'
        }),
      };
      setEditFormData(currentFormData);
      
      // Generate current template content for editing
      if (hasTemplate(formToUse)) {
        const generatedForm = generateCustomFormContent(formToUse, currentFormData);
        if (generatedForm) {
          setEditableTemplate(generatedForm.content);
        }
      }
      
      setShowEditForm(true);
    } else {
      showNotification("Please select a document first", 'error');
    }
  };

  const handleSendMail = () => {
    if (documents.length === 0) {
      showNotification("No documents available to send", 'error');
      return;
    }
    
    if (documents.length === 1) {
      // If only one document, send it directly
      setEmailAddress(email || "example@gmail.com");
      setShowEmailDialog(true);
    } else {
      // If multiple documents, ask user to choose
      const choice = confirm(
        `You have ${documents.length} documents. Do you want to:\n\n` +
        `✓ OK - Send MULTIPLE documents in one email\n` +
        `✗ Cancel - Send only the SELECTED document`
      );
      
      if (choice) {
        // Send multiple documents
        setSelectedEmailDocuments(documents.map(doc => doc.id));
        setShowMultiEmailDialog(true);
      } else {
        // Send only active document
        if (activeDocument) {
          setEmailAddress(email || "example@gmail.com");
          setShowEmailDialog(true);
        } else {
          showNotification("Please select a document first", 'error');
        }
      }
    }
  };

  const handleEmailSend = () => {
    const formToUse = getActiveDocumentForm();
    if (formToUse && hasTemplate(formToUse) && emailAddress) {
      const formData = {
        ...getFormData(),
        email: emailAddress,
      };

      const generatedForm = generateCustomFormContent(formToUse, formData);
      
      if (generatedForm) {
        // Create mailto link with the form content
        const subject = encodeURIComponent(generatedForm.title);
        const body = encodeURIComponent(`Please find the ${generatedForm.title} below:\n\n${generatedForm.content}`);
        const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
        
        // Open email client
        window.open(mailtoLink);
        
        showNotification(`Email prepared for ${emailAddress}. Your default email client should open.`, 'success');
        setShowEmailDialog(false);
      }
    } else {
      showNotification("Please provide a valid email address", 'error');
    }
  };

  const handleMultiEmailSend = () => {
    if (selectedEmailDocuments.length === 0 || !emailAddress) {
      showNotification("Please select documents and provide an email address", 'error');
      return;
    }

    const formData = {
      ...getFormData(),
      email: emailAddress,
    };

    let combinedContent = "";
    let allTitles: string[] = [];

    selectedEmailDocuments.forEach((docId, index) => {
      const doc = documents.find(d => d.id === docId);
      if (doc && hasTemplate(doc.name)) {
        const generatedForm = generateCustomFormContent(doc.name, formData);
        if (generatedForm) {
          allTitles.push(generatedForm.title);
          combinedContent += `\n\n${'='.repeat(60)}\n`;
          combinedContent += `${index + 1}. ${generatedForm.title}\n`;
          combinedContent += `${'='.repeat(60)}\n\n`;
          combinedContent += generatedForm.content;
        }
      }
    });

    if (combinedContent) {
      const subject = encodeURIComponent(`Multiple Forms: ${allTitles.join(', ')}`);
      const body = encodeURIComponent(`Please find the following ${selectedEmailDocuments.length} forms below:${combinedContent}`);
      const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
      
      // Open email client
      window.open(mailtoLink);
      
      showNotification(`Email with ${selectedEmailDocuments.length} forms prepared for ${emailAddress}. Your default email client should open.`, 'success');
      setShowMultiEmailDialog(false);
      setSelectedEmailDocuments([]);
    } else {
      showNotification("Failed to generate email content", 'error');
    }
  };

  const handleSaveEdit = () => {
    const formToUse = getActiveDocumentForm();
    // Save the edited template content if it was modified
    if (showTemplateEditor && editableTemplate && formToUse) {
      setCustomTemplates(prev => ({
        ...prev,
        [formToUse]: editableTemplate
      }));
    }
    
    // Update the main form data with edited values - now properly saves all fields
    if (editFormData.partyName !== undefined) setPartyName(editFormData.partyName);
    if (editFormData.address !== undefined) setAddress(editFormData.address);
    if (editFormData.email !== undefined) setEmail(editFormData.email);
    if (editFormData.gstNumber !== undefined) setGstNumber(editFormData.gstNumber);
    if (editFormData.partnerName !== undefined) setPartnerName(editFormData.partnerName);
    if (editFormData.firmName !== undefined) setFirmName(editFormData.firmName);
    if (editFormData.assYear !== undefined) setAssYear(editFormData.assYear);
    if (editFormData.place !== undefined) setPlace(editFormData.place);
    if (editFormData.panNumber !== undefined) setPanNumber(editFormData.panNumber);
    if (editFormData.wardNumber !== undefined) setWardNumber(editFormData.wardNumber);
    if (editFormData.refundAmount !== undefined) setRefundAmount(editFormData.refundAmount);
    if (editFormData.tdsAmount !== undefined) setTdsAmount(editFormData.tdsAmount);
    if (editFormData.bankName !== undefined) setBankName(editFormData.bankName);
    if (editFormData.accountNumber !== undefined) setAccountNumber(editFormData.accountNumber);
    if (editFormData.ifscCode !== undefined) setIfscCode(editFormData.ifscCode);
    
    setShowEditForm(false);
    setShowTemplateEditor(false);
    
    const message = showTemplateEditor && editableTemplate && formToUse 
      ? "Form data and template content updated successfully!" 
      : "Form data updated successfully!";
    showNotification(message, 'success');
  };

  const handleDelete = (docId: number) => {
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
                      placeholder="e.g., 127"
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
                      placeholder="127"
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
                    placeholder="e.g., Abha Gaur"
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
                    rows={3}
                    placeholder="e.g., 35 Khurjey Wala Mohalla, Lashker, Gwalior, MADHYA PRADESH, INDIA, 474001"
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
                      placeholder="e.g., example@gmail.com"
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
                      placeholder="e.g., 07AABCU9603R1ZV"
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
                      placeholder="e.g., Raj Kumar Kushwah"
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
                      placeholder="e.g., Anshul Goods Carriers"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-blue-600">
                    Place:
                  </span>
                  <input
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Fatehpur"
                  />
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
                    {selectedCategory.replace(/_/g, " ")} Forms - Click to Add to Documents List:
                  </h3>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 bg-white rounded">
                    {formCategories[selectedCategory]?.map((form: string) => (
                      <button
                        key={form}
                        onClick={() => handleFormSelect(form)}
                        className="w-full px-3 py-2 text-left text-sm border-b border-slate-100 last:border-b-0 transition-colors hover:bg-blue-50 text-slate-600"
                      >
                        <div className="flex items-center justify-between">
                          <span>{form}</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Add to List
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    💡 Click any form above to add it to your Documents List. Then use the Documents List section to select and work with your forms.
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

            {/* Document Selection Dropdown */}
            {documents.length > 0 && (
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700">
                    Select Document to Work With:
                  </label>
                  <select
                    value={activeDocument || ""}
                    onChange={(e) => {
                      const docId = e.target.value ? parseInt(e.target.value) : null;
                      setActiveDocument(docId);
                      if (docId) {
                        setSelectedDocuments([docId]);
                      } else {
                        setSelectedDocuments([]);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">-- Select a document --</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.nature}) - {doc.createdOn}
                      </option>
                    ))}
                  </select>
                  {activeDocument && (
                    <button
                      onClick={() => {
                        setActiveDocument(null);
                        setSelectedDocuments([]);
                      }}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {activeDocument && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    ✓ Selected: {documents.find(d => d.id === activeDocument)?.name} - Ready for operations
                  </div>
                )}
              </div>
            )}

            {/* Document Table */}
            <div className="p-4">
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <div className="bg-blue-50 grid grid-cols-9 gap-1 p-3 text-xs font-semibold text-slate-900 border-b border-slate-200">
                  <div>Select</div>
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
                        No documents available. Create documents by selecting from Form Categories.
                      </p>
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`grid grid-cols-9 gap-1 p-3 text-xs border-b border-slate-100 transition-colors ${
                          activeDocument === doc.id 
                            ? "bg-blue-100 border-blue-300" 
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            type="radio"
                            name="selectedDocument"
                            checked={activeDocument === doc.id}
                            onChange={() => {
                              setActiveDocument(doc.id);
                              setSelectedDocuments([doc.id]);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                        </div>
                        <div>{doc.createdOn}</div>
                        <div>{doc.nature}</div>
                        <div className="truncate" title={doc.fileName}>
                          {doc.fileName}
                          {activeDocument === doc.id && (
                            <span className="ml-1 bg-green-500 text-white px-1 rounded text-xs">
                              Active
                            </span>
                          )}
                        </div>
                        <div>{doc.filedDate || "-"}</div>
                        <div>{doc.assYear}</div>
                        <div>{doc.software}</div>
                        <div>{doc.dms}</div>
                        <div onClick={(e) => e.stopPropagation()}>
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

            {/* Bottom Controls */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Letters Creation Date:</span>
                  <input
                    type="date"
                    value={creationDate}
                    onChange={(e) => setCreationDate(e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => {
                      if (activeDocument) {
                        // Update creation date for only the selected document
                        setDocuments(documents.map(doc => 
                          doc.id === activeDocument 
                            ? { ...doc, createdOn: new Date(creationDate).toLocaleDateString() }
                            : doc
                        ));
                        const selectedDocName = documents.find(d => d.id === activeDocument)?.name;
                        showNotification(`Creation date updated for "${selectedDocName}"!`, 'success');
                      } else {
                        showNotification("Please select a document first!", 'error');
                      }
                    }}
                    className={`px-3 py-1 rounded transition-colors ${
                      activeDocument
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!activeDocument}
                  >
                    U. Update
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Letters Filing Date:</span>
                  <input
                    type="date"
                    value={filedDate}
                    onChange={(e) => setFiledDate(e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => {
                      if (filedDate) {
                        if (activeDocument) {
                          // Update filed date for only the selected document
                          setDocuments(documents.map(doc => 
                            doc.id === activeDocument 
                              ? { ...doc, filedDate: new Date(filedDate).toLocaleDateString() }
                              : doc
                          ));
                          const selectedDocName = documents.find(d => d.id === activeDocument)?.name;
                          showNotification(`Filed date updated for "${selectedDocName}"!`, 'success');
                        } else {
                          showNotification("Please select a document first!", 'error');
                        }
                      } else {
                        showNotification("Please select a filing date first!", 'error');
                      }
                    }}
                    className={`px-3 py-1 rounded transition-colors ${
                      activeDocument && filedDate
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!activeDocument || !filedDate}
                  >
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
                  className={`flex items-center justify-center px-3 py-2 border rounded transition-all duration-200 ${
                    activeDocument 
                      ? "bg-green-100 border-green-300 hover:bg-green-200" 
                      : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!activeDocument}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  C. Create
                </button>
                <button
                  onClick={handlePrint}
                  className={`flex items-center justify-center px-3 py-2 border rounded transition-all duration-200 ${
                    activeDocument 
                      ? "bg-blue-100 border-blue-300 hover:bg-blue-200" 
                      : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!activeDocument}
                >
                  <Printer className="h-3 w-3 mr-1" />
                  P. Print
                </button>
                <button
                  onClick={handlePreview}
                  className={`flex items-center justify-center px-3 py-2 border rounded transition-all duration-200 ${
                    activeDocument 
                      ? "bg-purple-100 border-purple-300 hover:bg-purple-200" 
                      : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!activeDocument}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  V. Preview
                </button>
                <button
                  onClick={handleEdit}
                  className={`flex items-center justify-center px-3 py-2 border rounded transition-all duration-200 ${
                    activeDocument 
                      ? "bg-orange-100 border-orange-300 hover:bg-orange-200" 
                      : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!activeDocument}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  E. Edit
                </button>
                <button 
                  className={`px-3 py-2 border rounded transition-all duration-200 ${
                    activeDocument 
                      ? "bg-red-100 border-red-300 hover:bg-red-200" 
                      : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!activeDocument}
                >
                  D. Delete
                </button>
                <button 
                  onClick={handleSendMail}
                  className={`flex items-center justify-center px-3 py-2 border rounded transition-all duration-200 ${
                    activeDocument 
                      ? "bg-green-100 border-green-300 hover:bg-green-200" 
                      : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!activeDocument}
                >
                  <Send className="h-3 w-3 mr-1" />
                  S. Send Mail
                </button>
                <button className="px-3 py-2 bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-all duration-200">
                  X. Exit
                </button>
                <button className="px-3 py-2 bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-all duration-200">
                  L. Login
                </button>
              </div>

              {!activeDocument && documents.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Please select a document from the dropdown or table above to enable operations
                  </p>
                </div>
              )}

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

      {/* Edit Form Modal */}
      {showEditForm && activeDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Edit Form: {documents.find(d => d.id === activeDocument)?.name}
              </h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Party Name:
                  </label>
                  <input
                    type="text"
                    value={editFormData.partyName || partyName}
                    onChange={(e) => setEditFormData({...editFormData, partyName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Abha Gaur"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address:
                  </label>
                  <textarea
                    value={editFormData.address || address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="e.g., 35 Khurjey Wala Mohalla, Lashker, Gwalior, MADHYA PRADESH, INDIA, 474001"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email:
                    </label>
                    <input
                      type="email"
                      value={editFormData.email || email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., example@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      GST Number:
                    </label>
                    <input
                      type="text"
                      value={editFormData.gstNumber || gstNumber}
                      onChange={(e) => setEditFormData({...editFormData, gstNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 07AABCU9603R1ZV"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Partner Name:
                    </label>
                    <input
                      type="text"
                      value={editFormData.partnerName || partnerName}
                      onChange={(e) => setEditFormData({...editFormData, partnerName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Raj Kumar Kushwah"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Firm Name:
                    </label>
                    <input
                      type="text"
                      value={editFormData.firmName || firmName}
                      onChange={(e) => setEditFormData({...editFormData, firmName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Anshul Goods Carriers"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Assessment Year:
                  </label>
                  <select
                    value={editFormData.assYear || assYear}
                    onChange={(e) => setEditFormData({...editFormData, assYear: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>2026 - 2027</option>
                    <option>2025 - 2026</option>
                    <option>2024 - 2025</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      PAN Number:
                    </label>
                    <input
                      type="text"
                      value={editFormData.panNumber || panNumber}
                      onChange={(e) => setEditFormData({...editFormData, panNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ABCDE1234F"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ward Number:
                    </label>
                    <input
                      type="text"
                      value={editFormData.wardNumber || wardNumber}
                      onChange={(e) => setEditFormData({...editFormData, wardNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Ward-1(1)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Refund Amount:
                    </label>
                    <input
                      type="text"
                      value={editFormData.refundAmount || refundAmount}
                      onChange={(e) => setEditFormData({...editFormData, refundAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ₹50,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      TDS Amount:
                    </label>
                    <input
                      type="text"
                      value={editFormData.tdsAmount || tdsAmount}
                      onChange={(e) => setEditFormData({...editFormData, tdsAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ₹5,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bank Name:
                    </label>
                    <input
                      type="text"
                      value={editFormData.bankName || bankName}
                      onChange={(e) => setEditFormData({...editFormData, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., State Bank of India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Account Number:
                    </label>
                    <input
                      type="text"
                      value={editFormData.accountNumber || accountNumber}
                      onChange={(e) => setEditFormData({...editFormData, accountNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 12345678901234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      IFSC Code:
                    </label>
                    <input
                      type="text"
                      value={editFormData.ifscCode || ifscCode}
                      onChange={(e) => setEditFormData({...editFormData, ifscCode: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., SBIN0001234"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Place:
                  </label>
                  <input
                    type="text"
                    value={editFormData.place || place}
                    onChange={(e) => setEditFormData({...editFormData, place: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter place name"
                  />
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-slate-700">Template Content</h4>
                    <div className="flex gap-2">
                      {customTemplates[documents.find(d => d.id === activeDocument)?.name || ""] && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          Custom Template Active
                        </span>
                      )}
                      <button
                        onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        {showTemplateEditor ? 'Hide Editor' : 'Edit Template'}
                      </button>
                    </div>
                  </div>
                  
                  {showTemplateEditor && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Edit Template Content:
                      </label>
                      <textarea
                        value={editableTemplate}
                        onChange={(e) => setEditableTemplate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        rows={10}
                        placeholder="Edit your template content here..."
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-slate-500">
                          Changes will be saved and persist for this form until reset.
                        </p>
                        {customTemplates[documents.find(d => d.id === activeDocument)?.name || ""] && (
                          <button
                            onClick={() => {
                              const formToReset = documents.find(d => d.id === activeDocument)?.name;
                              if (formToReset && confirm('Reset template to original? This will remove all custom changes.')) {
                                setCustomTemplates(prev => {
                                  const newTemplates = { ...prev };
                                  delete newTemplates[formToReset];
                                  return newTemplates;
                                });
                                // Regenerate original template
                                if (hasTemplate(formToReset)) {
                                  const formData = getFormData();
                                  const generatedForm = generateFormContent(formToReset, formData);
                                  if (generatedForm) {
                                    setEditableTemplate(generatedForm.content);
                                  }
                                }
                                showNotification('Template reset to original!', 'success');
                              }
                            }}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            Reset Template
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
              <button
                onClick={() => {
                  if (showTemplateEditor && editableTemplate) {
                    // Show preview with edited template
                    setPreviewContent({
                      title: documents.find(d => d.id === activeDocument)?.name || "Edited Form",
                      content: editableTemplate
                    });
                    setShowPreview(true);
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
                disabled={!showTemplateEditor || !editableTemplate}
              >
                <Eye className="h-4 w-4" />
                Preview Template
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Email Dialog */}
      {showMultiEmailDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Send Multiple Forms
              </h3>
              <button
                onClick={() => setShowMultiEmailDialog(false)}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Forms to Send:
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-md p-3">
                    {documents.map((doc) => (
                      <label key={doc.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedEmailDocuments.includes(doc.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmailDocuments([...selectedEmailDocuments, doc.id]);
                            } else {
                              setSelectedEmailDocuments(selectedEmailDocuments.filter(id => id !== doc.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm text-slate-700">{doc.name} ({doc.nature})</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>{selectedEmailDocuments.length} of {documents.length} selected</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedEmailDocuments(documents.map(d => d.id))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => setSelectedEmailDocuments([])}
                        className="text-red-600 hover:text-red-800"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter recipient email address"
                  />
                </div>

                <div className="text-xs text-slate-500 bg-blue-50 p-3 rounded">
                  📧 All selected forms will be combined into one email with clear separators between each form.
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
              <button
                onClick={handleMultiEmailSend}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                disabled={!emailAddress || selectedEmailDocuments.length === 0}
              >
                <Send className="h-4 w-4" />
                Send {selectedEmailDocuments.length} Forms
              </button>
              <button
                onClick={() => setShowMultiEmailDialog(false)}
                className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Send Email
              </h3>
              <button
                onClick={() => setShowEmailDialog(false)}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Form to Send:
                  </label>
                  <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                    {documents.find(d => d.id === activeDocument)?.name}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter recipient email address"
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Note: This will open your default email client with the form content pre-filled.
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
              <button
                onClick={handleEmailSend}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                disabled={!emailAddress}
              >
                <Send className="h-4 w-4" />
                Send Email
              </button>
              <button
                onClick={() => setShowEmailDialog(false)}
                className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg border-l-4 max-w-md transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-400 text-green-800'
                : notification.type === 'error'
                ? 'bg-red-50 border-red-400 text-red-800'
                : 'bg-blue-50 border-blue-400 text-blue-800'
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="inline-flex text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        </div>
    </div>
  );
}
