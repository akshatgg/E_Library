"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { fileUploadService, type UploadResult } from "@/services/file-upload-service"

interface FileUploadProps {
  onUploadComplete?: (results: UploadResult[]) => void
  onUploadError?: (error: string) => void
  multiple?: boolean
  maxFiles?: number
  accept?: Record<string, string[]>
}

interface UploadFile {
  file: File
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  result?: UploadResult
  error?: string
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  multiple = true,
  maxFiles = 10,
  accept = {
    "application/pdf": [".pdf"],
    "image/*": [".png", ".jpg", ".jpeg"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  },
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending",
    }))

    setUploadFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    disabled: isUploading,
  })

  const removeFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadFiles = async () => {
    if (uploadFiles.length === 0) return

    setIsUploading(true)
    const results: UploadResult[] = []

    try {
      for (let i = 0; i < uploadFiles.length; i++) {
        const uploadFile = uploadFiles[i]

        // Validate file
        const validation = fileUploadService.validateFile(uploadFile.file)
        if (!validation.valid) {
          setUploadFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, status: "error", error: validation.error } : f)),
          )
          continue
        }

        // Update status to uploading
        setUploadFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, status: "uploading", progress: 0 } : f)))

        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setUploadFiles((prev) =>
              prev.map((f, idx) => (idx === i && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f)),
            )
          }, 200)

          const result = await fileUploadService.uploadFile(uploadFile.file)

          clearInterval(progressInterval)

          setUploadFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, status: "completed", progress: 100, result } : f)),
          )

          results.push(result)
        } catch (error) {
          setUploadFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, status: "error", error: "Upload failed" } : f)),
          )
        }
      }

      if (results.length > 0) {
        onUploadComplete?.(results)
      }
    } catch (error) {
      onUploadError?.("Upload process failed")
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "uploading":
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag & drop files here, or click to select files</p>
                <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, PNG, JPG (max 10MB each)</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Files to Upload ({uploadFiles.length})</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleUploadFiles}
                    disabled={isUploading || uploadFiles.every((f) => f.status === "completed")}
                  >
                    {isUploading ? "Uploading..." : "Upload All"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setUploadFiles([])} disabled={isUploading}>
                    Clear All
                  </Button>
                </div>
              </div>

              {uploadFiles.map((uploadFile, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStatusIcon(uploadFile.status)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(uploadFile.file.size)}
                      </Badge>
                    </div>

                    {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="mt-2" />}

                    {uploadFile.error && <p className="text-xs text-red-500 mt-1">{uploadFile.error}</p>}

                    {uploadFile.status === "completed" && uploadFile.result && (
                      <p className="text-xs text-green-600 mt-1">Upload completed</p>
                    )}
                  </div>

                  <Button size="sm" variant="ghost" onClick={() => removeFile(index)} disabled={isUploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
