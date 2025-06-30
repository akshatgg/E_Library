"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Add imports for offline functionality
import { useOffline } from "@/hooks/use-offline"
import { OfflineManager } from "@/components/offline/offline-manager"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PdfViewerProps {
  url: string
  title?: string
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const [scale, setScale] = useState(1.0)
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const { toast } = useToast()

  // Add isOffline to the component
  const isOffline = useOffline()

  useEffect(() => {
    if (pageParam) {
      const page = Number.parseInt(pageParam, 10)
      if (!isNaN(page) && page > 0 && page <= (numPages || 1)) {
        setPageNumber(page)
      }
    }
  }, [pageParam, numPages])

  useEffect(() => {
    const getWidth = () => {
      if (pdfContainerRef.current) {
        setContainerWidth(pdfContainerRef.current.offsetWidth)
      }
    }

    // Set initial width
    getWidth()

    // Update width on window resize
    window.addEventListener("resize", getWidth)

    // Clean up the event listener
    return () => window.removeEventListener("resize", getWidth)
  }, [])

  useEffect(() => {
    if (url) {
      fetchPdf()
    }
  }, [url, isOffline])

  const fetchPdf = async () => {
    setLoading(true)
    setError(null)

    try {
      // First try to get from cache if offline
      if (isOffline) {
        const cache = await caches.open("elibrary-pdf-cache-v1")
        const cachedResponse = await cache.match(url)

        if (cachedResponse) {
          const data = await cachedResponse.arrayBuffer()
          setPdfData(data)
          setLoading(false)
          return
        }
      }

      // If not in cache or not offline, fetch from network
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
      }

      const data = await response.arrayBuffer()
      setPdfData(data)
    } catch (err) {
      console.error("Error fetching PDF:", err)
      setError("Failed to load PDF. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages || 1))
  }

  const handleDownload = () => {
    if (pdfData) {
      const blob = new Blob([pdfData], { type: "application/pdf" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${title || "document"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } else {
      toast({
        title: "Error",
        description: "Failed to download PDF. PDF data is not available.",
        variant: "destructive",
      })
    }
  }

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3.0))
  }

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1 || loading}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-sm font-medium">
            Page {pageNumber} of {numPages || 1}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1) || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={loading}>
            Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={loading}>
            Zoom Out
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        {loading && !pdfData ? (
          <div className="flex justify-center items-center h-full">
            <Skeleton className="w-[80%] h-[600px]" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-500">{error}</div>
        ) : pdfData ? (
          <div className="flex justify-center items-center">
            <div ref={pdfContainerRef} style={{ width: "100%", maxWidth: "100%" }}>
              <Document file={{ data: pdfData }} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center">
                <Page pageNumber={pageNumber} width={containerWidth} scale={scale} />
              </Document>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">No PDF available</div>
        )}
      </div>

      {/* Add this after other sidebar components */}
      <div className="mt-4">
        <OfflineManager currentPdfUrl={url} currentPdfTitle={title || "Document"} />
      </div>
    </div>
  )
}

export default PdfViewer
