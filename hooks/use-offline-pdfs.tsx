"use client"

import { useState, useEffect, useCallback } from "react"
import { pdfCache } from "@/lib/offline-cache"

interface CachedPdf {
  id: string
  title: string
  url: string
  blob: Blob
  cachedAt: number
  size: number
}

export function useOfflinePdfs() {
  const [cachedPdfs, setCachedPdfs] = useState<CachedPdf[]>([])
  const [cacheSize, setCacheSize] = useState(0)
  const [loading, setLoading] = useState(false)

  const refreshCache = useCallback(async () => {
    try {
      const pdfs = await pdfCache.getAllCachedPdfs()
      const size = await pdfCache.getCacheSize()
      setCachedPdfs(pdfs)
      setCacheSize(size)
    } catch (error) {
      console.error("Failed to refresh cache:", error)
    }
  }, [])

  const cachePdf = useCallback(
    async (id: string, title: string, url: string) => {
      setLoading(true)
      try {
        const success = await pdfCache.cachePdf(id, title, url)
        if (success) {
          await refreshCache()
        }
        return success
      } catch (error) {
        console.error("Failed to cache PDF:", error)
        return false
      } finally {
        setLoading(false)
      }
    },
    [refreshCache],
  )

  const removePdf = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const success = await pdfCache.removeCachedPdf(id)
        if (success) {
          await refreshCache()
        }
        return success
      } catch (error) {
        console.error("Failed to remove PDF:", error)
        return false
      } finally {
        setLoading(false)
      }
    },
    [refreshCache],
  )

  const getCachedPdfUrl = useCallback(async (id: string) => {
    try {
      return await pdfCache.getCachedPdf(id)
    } catch (error) {
      console.error("Failed to get cached PDF URL:", error)
      return null
    }
  }, [])

  const isPdfCached = useCallback(async (id: string) => {
    try {
      return await pdfCache.isPdfCached(id)
    } catch (error) {
      console.error("Failed to check if PDF is cached:", error)
      return false
    }
  }, [])

  const clearAllCache = useCallback(async () => {
    setLoading(true)
    try {
      const success = await pdfCache.clearCache()
      if (success) {
        await refreshCache()
      }
      return success
    } catch (error) {
      console.error("Failed to clear cache:", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [refreshCache])

  useEffect(() => {
    refreshCache()
  }, [refreshCache])

  return {
    cachedPdfs,
    cacheSize,
    loading,
    cachePdf,
    removePdf,
    getCachedPdfUrl,
    isPdfCached,
    clearAllCache,
    refreshCache,
  }
}
