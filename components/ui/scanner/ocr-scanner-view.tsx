"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, FileText, Download, Copy, Wand2, Sparkles } from "lucide-react"

export function OCRScannerView() {
  const [extractedText, setExtractedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setIsProcessing(true)

    // Simulate OCR processing
    setTimeout(() => {
      setExtractedText(
        "Sample extracted text from the document. This would be the actual OCR result from the uploaded image or PDF file. The text extraction includes formatting and structure preservation where possible.",
      )
      setIsProcessing(false)
    }, 2000)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const captureImage = () => {
    // Implement camera capture logic
    setIsProcessing(true)
    setTimeout(() => {
      setExtractedText("Text extracted from camera capture...")
      setIsProcessing(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
  }

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "extracted-text.txt"
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Camera className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              OCR Document Scanner
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Extract text from images and documents using AI</p>
          </div>
        </div>

        <div className="flex justify-center space-x-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">99.5%</div>
            <div className="text-gray-500">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-gray-500">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">AI</div>
            <div className="text-gray-500">Powered</div>
          </div>
        </div>
      </div>

      {/* Scanner Interface */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="camera">Camera Capture</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Document for OCR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drop your document here</p>
                <p className="text-gray-500 mb-4">Supports PDF, JPG, PNG, TIFF formats</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Badge variant="outline">Ready to Process</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="camera">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera Capture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} className="w-full h-64 object-cover" autoPlay playsInline />
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={startCamera}>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
                <Button onClick={captureImage} variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Capture & Extract
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Processing document...</p>
            <p className="text-gray-500">AI is extracting text from your document</p>
          </CardContent>
        </Card>
      )}

      {/* Extracted Text */}
      {extractedText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Extracted Text
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={downloadText}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Extracted text will appear here..."
            />
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{extractedText.length} characters extracted</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
