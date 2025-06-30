"use client"

import { useState, useEffect } from "react"
import { useOfflinePdfs } from "@/hooks/use-offline-pdfs"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface PdfViewerProps {
  pdfId: string
  pdfTitle: string
  pdfUrl: string
}

export function PdfViewer({ pdfId, pdfTitle, pdfUrl }: PdfViewerProps) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [isCached, setIsCached] = useState(false)
  const [loading, setLoading] = useState(true)
  const [caching, setCaching] = useState(false)

  const { cachePdf, getCachedPdfUrl, isPdfCached } = useOfflinePdfs()
  const isOnline = useOnlineStatus()

  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true)

      // Check if PDF is cached
      const cached = await isPdfCached(pdfId)
      setIsCached(cached)

      if (cached) {
        // Use cached version
        const cachedUrl = await getCachedPdfUrl(pdfId)
        setCurrentUrl(cachedUrl)
      } else if (isOnline) {
        // Use online version
        setCurrentUrl(pdfUrl)
      } else {
        // Offline and not cached
        setCurrentUrl(null)
      }

      setLoading(false)
    }

    loadPdf()
  }, [pdfId, pdfUrl, isOnline, isPdfCached, getCachedPdfUrl])

  const handleCachePdf = async () => {
    setCaching(true)
    try {
      const success = await cachePdf(pdfId, pdfTitle, pdfUrl)
      if (success) {
        setIsCached(true)
        toast.success("PDF saved for offline viewing")
      } else {
        toast.error("Failed to save PDF offline")
      }
    } catch (error) {
      toast.error("Failed to save PDF offline")
    } finally {
      setCaching(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    )
  }

  if (!currentUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-medium">PDF Not Available Offline</h3>
            <p className="text-sm text-muted-foreground">This PDF is not cached and you're currently offline.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{pdfTitle}</h3>
          {isCached && <Badge variant="secondary">Offline Available</Badge>}
          {!isOnline && <Badge variant="destructive">Offline Mode</Badge>}
        </div>

        {isOnline && !isCached && (
          <Button variant="outline" size="sm" onClick={handleCachePdf} disabled={caching}>
            <Download className="h-4 w-4 mr-1" />
            {caching ? "Saving..." : "Save Offline"}
          </Button>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <iframe src={currentUrl} className="w-full h-96" title={pdfTitle} />
      </div>
    </div>
  )
}
