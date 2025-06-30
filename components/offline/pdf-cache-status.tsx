"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Check } from "lucide-react"
import { useOfflinePdfs } from "@/hooks/use-offline-pdfs"
import { useState } from "react"

interface PdfCacheStatusProps {
  pdfUrl: string
  pdfTitle: string
}

export function PdfCacheStatus({ pdfUrl, pdfTitle }: PdfCacheStatusProps) {
  const { isPdfCached, cachePdf } = useOfflinePdfs()
  const [caching, setCaching] = useState(false)

  const isCached = isPdfCached(pdfUrl)

  const handleCache = async () => {
    setCaching(true)
    try {
      await cachePdf(pdfUrl, pdfTitle)
    } finally {
      setCaching(false)
    }
  }

  if (isCached) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Check className="h-3 w-3" />
        Offline Available
      </Badge>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCache} disabled={caching}>
      <Download className="h-4 w-4 mr-1" />
      {caching ? "Caching..." : "Save Offline"}
    </Button>
  )
}
