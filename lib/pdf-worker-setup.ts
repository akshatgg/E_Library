import { pdfjs } from "react-pdf"

// Function to set up the PDF.js worker
export default function setupPdfWorker() {
  // Try multiple CDNs for better reliability
  const cdnSources = [
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
  ]

  // Use the first CDN source by default
  pdfjs.GlobalWorkerOptions.workerSrc = cdnSources[0]

  // Optionally, we could implement a fallback mechanism if the first CDN fails
  // This would require more complex logic with fetch attempts and error handling

  return pdfjs.GlobalWorkerOptions.workerSrc
}
