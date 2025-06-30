"use client"

import { useState } from "react"
import { useOfflinePdfs } from "@/hooks/use-offline-pdfs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, HardDrive, FileText, Download } from "lucide-react"
import { formatBytes } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface OfflineManagerProps {
  currentPdfUrl?: string
  currentPdfTitle?: string
}

export function OfflineManager({ currentPdfUrl, currentPdfTitle }: OfflineManagerProps) {
  const { cachedPdfs, cacheSize, loading, cachePdf, removePdf, clearAllCache, isPdfCached } = useOfflinePdfs()
  const [removing, setRemoving] = useState<string | null>(null)
  const [caching, setCaching] = useState(false)
  const { toast } = useToast()

  const handleCachePdf = async () => {
    if (!currentPdfUrl || !currentPdfTitle) return

    setCaching(true)
    try {
      const success = await cachePdf(currentPdfUrl, currentPdfTitle)
      if (success) {
        toast({
          title: "PDF Cached",
          description: "Document is now available offline",
        })
      } else {
        toast({
          title: "Cache Failed",
          description: "Could not cache the document",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cache document",
        variant: "destructive",
      })
    } finally {
      setCaching(false)
    }
  }

  const handleRemovePdf = async (id: string) => {
    setRemoving(id)
    try {
      const success = await removePdf(id)
      if (success) {
        toast({
          title: "PDF Removed",
          description: "Document removed from offline storage",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove document",
        variant: "destructive",
      })
    } finally {
      setRemoving(null)
    }
  }

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all offline PDFs?")) {
      try {
        const success = await clearAllCache()
        if (success) {
          toast({
            title: "Cache Cleared",
            description: "All offline documents removed",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to clear cache",
          variant: "destructive",
        })
      }
    }
  }

  const isCurrentPdfCached = currentPdfUrl ? isPdfCached(currentPdfUrl) : false

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Offline Storage
        </CardTitle>
        <CardDescription>Manage your offline PDF documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{cachedPdfs.length} PDFs cached</Badge>
            <Badge variant="outline">{formatBytes(cacheSize)} used</Badge>
          </div>
          {cachedPdfs.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearAll} disabled={loading}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {currentPdfUrl && (
          <>
            <Separator />
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{currentPdfTitle || "Current Document"}</span>
              </div>
              {!isCurrentPdfCached ? (
                <Button size="sm" onClick={handleCachePdf} disabled={caching}>
                  <Download className="h-4 w-4 mr-1" />
                  {caching ? "Caching..." : "Cache Offline"}
                </Button>
              ) : (
                <Badge variant="secondary">Cached</Badge>
              )}
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {cachedPdfs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No PDFs cached for offline viewing</p>
          ) : (
            cachedPdfs.map((pdf) => (
              <div key={pdf.id} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{pdf.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(pdf.size)} • {new Date(pdf.cachedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePdf(pdf.id)}
                  disabled={removing === pdf.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
