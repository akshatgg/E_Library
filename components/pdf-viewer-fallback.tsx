"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, FileText, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PDFViewerFallbackProps {
  pdfUrl: string
  errorMessage?: string
}

export function PDFViewerFallback({ pdfUrl, errorMessage }: PDFViewerFallbackProps) {
  const [showError, setShowError] = useState(true)

  return (
    <div className="flex flex-col h-full">
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">PDF Document</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} download>
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading PDF viewer</AlertTitle>
          <AlertDescription>
            {errorMessage || "There was an issue loading the PDF viewer component."}
            <Button variant="link" className="p-0 h-auto" onClick={() => setShowError(false)}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-auto bg-slate-100 rounded-lg p-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center max-w-md">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">PDF Viewer Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            The PDF viewer couldn't be loaded. You can still access the document using the options below.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                Open in Browser
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={pdfUrl} download>
                Download PDF
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
