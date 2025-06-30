import Tesseract from "tesseract.js"

export class OCRService {
  static async extractTextFromImage(imageFile: File): Promise<string> {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => console.log(m),
      })
      return text
    } catch (error) {
      console.error("OCR Error:", error)
      throw new Error("Failed to extract text from image")
    }
  }

  static async extractTextFromPDF(pdfFile: File): Promise<string> {
    // For PDF OCR, we'll use a combination approach
    try {
      const formData = new FormData()
      formData.append("file", pdfFile)

      const response = await fetch("/api/ocr/pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("PDF OCR failed")

      const result = await response.json()
      return result.text
    } catch (error) {
      console.error("PDF OCR Error:", error)
      throw new Error("Failed to extract text from PDF")
    }
  }
}
