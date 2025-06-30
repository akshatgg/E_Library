"use client"

import { useState, useEffect } from "react"
import { getCachedPdfs } from "@/lib/service-worker-lite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, RefreshCw } from "lucide-react"
import Link from "next/link"

export function OfflineLibrary() {
  const [pdfs, setPdfs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCachedPdfs = async () => {
    setIsLoading(true)
    const cachedPdfs = await getCachedPdfs()
    setPdfs(cachedPdfs)
    setIsLoading(false)
  }

  useEffect(() => {
    loadCachedPdfs()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Offline Library</CardTitle>
        <Button variant="ghost" size="sm" onClick={loadCachedPdfs} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {pdfs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No documents saved for offline use</p>
        ) : (
          <ul className="space-y-2">
            {pdfs.map((url) => (
              <li key={url} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{url.split("/").pop() || url}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={url} target="_blank">
                    Open
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
