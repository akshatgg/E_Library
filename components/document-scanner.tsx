"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Upload, FileText, Download } from "lucide-react"
import { OCRService } from "@/lib/ocr-service"
import { toast } from "sonner"

interface DocumentScannerProps {
  onTextExtracted?: (text: string) => void
}

export function DocumentScanner({ onTextExtracted }: DocumentScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedText, setExtractedText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      toast.error("Failed to access camera")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        canvas.toBlob(
          async (blob) => {
            if (blob) {
              const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" })
              await processFile(file)
            }
          },
          "image/jpeg",
          0.8,
        )
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      let text = ""
      if (file.type.includes("pdf")) {
        text = await OCRService.extractTextFromPDF(file)
      } else {
        text = await OCRService.extractTextFromImage(file)
      }

      clearInterval(progressInterval)
      setProgress(100)

      setExtractedText(text)
      onTextExtracted?.(text)
      toast.success("Text extracted successfully!")
    } catch (error) {
      toast.error("Failed to extract text from document")
    } finally {
      setIsProcessing(false)
      setProgress(0)
      stopCamera()
    }
  }

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "extracted-text.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Camera className="h-4 w-4" />
        Scan Document
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Scanner with OCR</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Scanner Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Camera Capture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!stream ? (
                    <Button onClick={startCamera} className="w-full">
                      Start Camera
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                      <div className="flex gap-2">
                        <Button onClick={captureImage} className="flex-1">
                          Capture
                        </Button>
                        <Button onClick={stopCamera} variant="outline">
                          Stop
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    File Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">Supports: JPG, PNG, PDF</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Processing Progress */}
            {isProcessing && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 animate-pulse" />
                      <span className="text-sm font-medium">Processing document...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Extracted Text */}
            {extractedText && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Extracted Text</CardTitle>
                    <Button onClick={downloadText} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Extracted text will appear here..."
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  )
}
