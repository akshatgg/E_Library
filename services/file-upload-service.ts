export interface UploadResult {
  url: string
  filename: string
  size: number
  type: string
}

class FileUploadService {
  async uploadFile(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      return {
        url: result.url,
        filename: file.name,
        size: file.size,
        type: file.type,
      }
    } catch (error) {
      console.error("File upload error:", error)
      throw new Error("Failed to upload file")
    }
  }

  async uploadMultipleFiles(files: File[]): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file))
    return Promise.all(uploadPromises)
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (file.size > maxSize) {
      return { valid: false, error: "File size exceeds 10MB limit" }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "File type not supported" }
    }

    return { valid: true }
  }
}

export const fileUploadService = new FileUploadService()
