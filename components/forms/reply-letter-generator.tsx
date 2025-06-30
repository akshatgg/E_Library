"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Wand2, Copy, Eye } from "lucide-react"
import { toast } from "sonner"

interface ReplyTemplate {
  id: string
  name: string
  category: string
  description: string
  template: string
}

const replyTemplates: ReplyTemplate[] = [
  {
    id: "1",
    name: "Income Tax Notice Reply",
    category: "Income Tax",
    description: "Standard reply to income tax assessment notices",
    template: `Subject: Reply to Notice under Section {section} - Assessment Year {assessmentYear}

Dear Sir/Madam,

With reference to your notice dated {noticeDate} under Section {section} of the Income Tax Act, 1961, I hereby submit my reply as follows:

1. I acknowledge receipt of the above-mentioned notice.

2. The facts mentioned in the notice are noted. However, I would like to submit the following clarifications:

{mainContent}

3. In view of the above submissions, I request you to kindly consider the same and pass appropriate orders.

4. I am enclosing the following documents in support of my submissions:
{documents}

Thanking you,

Yours faithfully,
{senderName}
{designation}
Date: {currentDate}`,
  },
  {
    id: "2",
    name: "GST Notice Reply",
    category: "GST",
    description: "Reply to GST department notices and show cause notices",
    template: `Subject: Reply to Show Cause Notice No. {noticeNumber} dated {noticeDate}

To,
The Commissioner/Additional Commissioner,
{department}

Sir/Madam,

With reference to the Show Cause Notice No. {noticeNumber} dated {noticeDate}, I hereby submit my reply as under:

1. I acknowledge receipt of the above Show Cause Notice.

2. The allegations made in the notice are denied and I submit my reply as follows:

{mainContent}

3. In view of the above submissions, it is respectfully prayed that:
   a) The Show Cause Notice may be dropped
   b) No penalty may be imposed
   c) Any other relief as deemed fit may be granted

4. Supporting documents are enclosed herewith.

I request for a personal hearing before passing any final order.

Yours faithfully,
{senderName}
{designation}
Date: {currentDate}`,
  },
  {
    id: "3",
    name: "ITAT Appeal Reply",
    category: "ITAT",
    description: "Reply to ITAT proceedings and cross-objections",
    template: `Before the Income Tax Appellate Tribunal, {bench}

Appeal No. {appealNumber}
Assessment Year: {assessmentYear}

{appellantName} ... Appellant
Vs.
{respondentName} ... Respondent

REPLY TO GROUNDS OF APPEAL

The Respondent most respectfully submits as under:

1. The Respondent craves leave to refer to and rely upon the entire records of the case.

2. The grounds of appeal are denied and the Respondent submits as follows:

{mainContent}

3. The order of the CIT(A) is just, proper and in accordance with law and the same may be upheld.

4. The appeal of the Appellant is liable to be dismissed.

PRAYER

It is therefore prayed that this Hon'ble Tribunal may be pleased to:
a) Dismiss the appeal of the Appellant
b) Uphold the order of the CIT(A)
c) Grant any other relief as deemed fit

{senderName}
{designation}
Date: {currentDate}`,
  },
]

export function ReplyLetterGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReplyTemplate | null>(null)
  const [formData, setFormData] = useState({
    senderName: "",
    designation: "",
    section: "",
    assessmentYear: "",
    noticeDate: "",
    noticeNumber: "",
    department: "",
    bench: "",
    appealNumber: "",
    appellantName: "",
    respondentName: "",
    mainContent: "",
    documents: "",
  })
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleTemplateSelect = (template: ReplyTemplate) => {
    setSelectedTemplate(template)
    setGeneratedLetter("")
  }

  const generateLetter = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      let letter = selectedTemplate.template
      const currentDate = new Date().toLocaleDateString()

      // Replace placeholders with form data
      Object.entries(formData).forEach(([key, value]) => {
        const placeholder = `{${key}}`
        letter = letter.replace(new RegExp(placeholder, "g"), value || `[${key.toUpperCase()}]`)
      })

      letter = letter.replace(/{currentDate}/g, currentDate)

      setGeneratedLetter(letter)
      toast.success("Reply letter generated successfully!")
    } catch (error) {
      toast.error("Failed to generate letter. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const enhanceWithAI = async () => {
    if (!generatedLetter) return

    setIsGenerating(true)
    try {
      // Simulate AI enhancement
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const enhancedLetter =
        generatedLetter +
        "\n\n[AI Enhancement: Added legal precedents and strengthened arguments based on recent case laws]"
      setGeneratedLetter(enhancedLetter)
      toast.success("Letter enhanced with AI suggestions!")
    } catch (error) {
      toast.error("Failed to enhance letter. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter)
    toast.success("Letter copied to clipboard!")
  }

  const downloadLetter = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reply-letter-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Letter downloaded successfully!")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reply Letter Generator</h1>
        <p className="text-gray-600">Generate professional legal reply letters with AI assistance</p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Select Template</TabsTrigger>
          <TabsTrigger value="customize">Customize Content</TabsTrigger>
          <TabsTrigger value="generate">Generate & Review</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Reply Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {replyTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <Badge variant="secondary">{template.category}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        {selectedTemplate?.id === template.id && (
                          <Badge className="w-full justify-center">Selected</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle>Customize Letter Details</CardTitle>
                <p className="text-sm text-gray-600">Fill in the details for your reply letter</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senderName">Sender Name *</Label>
                    <Input
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, senderName: e.target.value }))}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
                      placeholder="Your designation/title"
                    />
                  </div>

                  {selectedTemplate.category === "Income Tax" && (
                    <>
                      <div>
                        <Label htmlFor="section">Section</Label>
                        <Input
                          id="section"
                          value={formData.section}
                          onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
                          placeholder="e.g., 143(2), 148"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assessmentYear">Assessment Year</Label>
                        <Input
                          id="assessmentYear"
                          value={formData.assessmentYear}
                          onChange={(e) => setFormData((prev) => ({ ...prev, assessmentYear: e.target.value }))}
                          placeholder="e.g., 2023-24"
                        />
                      </div>
                    </>
                  )}

                  {selectedTemplate.category === "GST" && (
                    <>
                      <div>
                        <Label htmlFor="noticeNumber">Notice Number</Label>
                        <Input
                          id="noticeNumber"
                          value={formData.noticeNumber}
                          onChange={(e) => setFormData((prev) => ({ ...prev, noticeNumber: e.target.value }))}
                          placeholder="Notice reference number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                          placeholder="GST Department name"
                        />
                      </div>
                    </>
                  )}

                  {selectedTemplate.category === "ITAT" && (
                    <>
                      <div>
                        <Label htmlFor="bench">ITAT Bench</Label>
                        <Input
                          id="bench"
                          value={formData.bench}
                          onChange={(e) => setFormData((prev) => ({ ...prev, bench: e.target.value }))}
                          placeholder="e.g., Delhi, Mumbai"
                        />
                      </div>
                      <div>
                        <Label htmlFor="appealNumber">Appeal Number</Label>
                        <Input
                          id="appealNumber"
                          value={formData.appealNumber}
                          onChange={(e) => setFormData((prev) => ({ ...prev, appealNumber: e.target.value }))}
                          placeholder="ITA No. XXXX/Del/2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor="appellantName">Appellant Name</Label>
                        <Input
                          id="appellantName"
                          value={formData.appellantName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, appellantName: e.target.value }))}
                          placeholder="Name of appellant"
                        />
                      </div>
                      <div>
                        <Label htmlFor="respondentName">Respondent Name</Label>
                        <Input
                          id="respondentName"
                          value={formData.respondentName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, respondentName: e.target.value }))}
                          placeholder="Name of respondent"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="noticeDate">Notice Date</Label>
                    <Input
                      id="noticeDate"
                      type="date"
                      value={formData.noticeDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, noticeDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="mainContent">Main Content/Arguments *</Label>
                  <Textarea
                    id="mainContent"
                    value={formData.mainContent}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mainContent: e.target.value }))}
                    placeholder="Enter your main arguments and points here..."
                    rows={8}
                  />
                </div>

                <div>
                  <Label htmlFor="documents">Supporting Documents</Label>
                  <Textarea
                    id="documents"
                    value={formData.documents}
                    onChange={(e) => setFormData((prev) => ({ ...prev, documents: e.target.value }))}
                    placeholder="List of documents being enclosed..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Template Selected</h3>
                <p className="text-gray-600">Please select a template from the previous tab to continue.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Letter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">{selectedTemplate.name}</h4>
                    <p className="text-sm text-blue-700">{selectedTemplate.description}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button onClick={generateLetter} disabled={!selectedTemplate || isGenerating} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Letter"}
                  </Button>

                  {generatedLetter && (
                    <>
                      <Button onClick={enhanceWithAI} disabled={isGenerating} variant="outline" className="w-full">
                        <Wand2 className="h-4 w-4 mr-2" />
                        {isGenerating ? "Enhancing..." : "Enhance with AI"}
                      </Button>

                      <div className="flex gap-2">
                        <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button onClick={downloadLetter} variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Letter Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedLetter ? (
                  <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{generatedLetter}</pre>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Generated letter will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
