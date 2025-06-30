"use client"

import { Suspense, lazy } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Lazy load PDF Viewer which is heavy
const PDFViewer = lazy(() => import("./pdf-viewer"))

interface PDFViewerContainerProps {
  pdfUrl: string
  title?: string
}

export function PDFViewerContainer({ pdfUrl, title }: PDFViewerContainerProps) {
  if (!pdfUrl) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No PDF URL provided</AlertDescription>
      </Alert>
    )
  }

  return (
    <Suspense fallback={<PDFLoadingSkeleton />}>
      <PDFViewer url={pdfUrl} title={title} />
    </Suspense>
  )
}

function PDFLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-48" />
      </div>
      <Skeleton className="flex-grow h-[600px]" />
    </div>
  )
}
