import { pdfjs } from "react-pdf"

// Only set the worker source once
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  // Use a specific version to avoid mismatches
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
}

export default pdfjs
