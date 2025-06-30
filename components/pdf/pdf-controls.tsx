"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Save, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface PDFControlsProps {
  currentPage: number
  totalPages: number
  isLoading: boolean
  onPrevPage: () => void
  onNextPage: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  scale: number
  isCached: boolean
  isOffline: boolean
  onSaveOffline: () => void
  documentTitle?: string
  pdfUrl: string
}

export function PDFControls({
  currentPage,
  totalPages,
  isLoading,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  scale,
  isCached,
  isOffline,
  onSaveOffline,
  documentTitle,
  pdfUrl,
}: PDFControlsProps) {
  const { toast } = useToast()

  const handleDownload = () => {
    // Create an anchor and trigger download
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `${documentTitle || "document"}.pdf`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      description: "Download started",
    })
  }

  return (
    <div className="flex items-center justify-between p-2 border-b bg-white">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={onPrevPage} disabled={isLoading || currentPage <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>

        <Button variant="outline" size="icon" onClick={onNextPage} disabled={isLoading || currentPage >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {isOffline && (
          <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        )}

        {isCached && (
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            Saved Offline
          </Badge>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onZoomOut} disabled={isLoading}>
          <ZoomOut className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Zoom Out</span>
        </Button>

        <span className="text-xs">{Math.round(scale * 100)}%</span>

        <Button variant="outline" size="sm" onClick={onZoomIn} disabled={isLoading}>
          <ZoomIn className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Zoom In</span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
          <Download className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Download</span>
        </Button>

        {!isOffline && !isCached && (
          <Button variant="outline" size="sm" onClick={onSaveOffline} disabled={isLoading}>
            <Save className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Save Offline</span>
          </Button>
        )}
      </div>
    </div>
  )
}
