"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Printer,
  Share2,
  Highlighter,
  Save,
  SunMoon,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PdfSearch } from "@/components/pdf/pdf-search"

interface PdfToolbarProps {
  pageNumber: number
  numPages: number | null
  scale: number
  rotation: number
  onPageChange: (pageNumber: number) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onScaleChange: (scale: number) => void
  onRotate: () => void
  onDownload: () => void
  onPrint: () => void
  onShare: () => void
  onHighlight: () => void
  onSave: () => void
  hasHighlights: boolean
  pdfUrl: string
}

export function PdfToolbar({
  pageNumber,
  numPages,
  scale,
  rotation,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onScaleChange,
  onRotate,
  onDownload,
  onPrint,
  onShare,
  onHighlight,
  onSave,
  hasHighlights,
  pdfUrl,
}: PdfToolbarProps) {
  const [selectedView, setSelectedView] = useState("fit-page")
  const [nightMode, setNightMode] = useState(false)

  const handleViewChange = (value: string) => {
    setSelectedView(value)

    // Adjust scale based on view selection
    switch (value) {
      case "fit-page":
        onScaleChange(1.0)
        break
      case "fit-width":
        onScaleChange(1.2)
        break
      case "two-pages":
        onScaleChange(0.8)
        break
    }
  }

  const changePage = (offset: number) => {
    const newPageNumber = pageNumber + offset
    if (newPageNumber >= 1 && numPages && newPageNumber <= numPages) {
      onPageChange(newPageNumber)
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm">
            Page {pageNumber} of {numPages || "..."}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(1)}
            disabled={!numPages || pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <div className="w-32">
            <Slider
              value={[scale * 100]}
              min={50}
              max={300}
              step={10}
              onValueChange={(value) => onScaleChange(value[0] / 100)}
            />
          </div>

          <Button variant="outline" size="icon" onClick={onZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Tabs value={selectedView} onValueChange={handleViewChange} className="h-9">
            <TabsList className="h-8">
              <TabsTrigger value="fit-page" className="text-xs h-7">
                Fit Page
              </TabsTrigger>
              <TabsTrigger value="fit-width" className="text-xs h-7">
                Fit Width
              </TabsTrigger>
              <TabsTrigger value="two-pages" className="text-xs h-7">
                Two Pages
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon" onClick={onRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDownload} className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPrint} className="cursor-pointer">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare} className="cursor-pointer">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onHighlight} className="cursor-pointer">
                <Highlighter className="mr-2 h-4 w-4" />
                {hasHighlights ? "Edit Highlights" : "Highlight Text"}
              </DropdownMenuItem>
              {hasHighlights && (
                <DropdownMenuItem onClick={onSave} className="cursor-pointer">
                  <Save className="mr-2 h-4 w-4" />
                  Save Annotations
                </DropdownMenuItem>
              )}
              <div className="px-2 py-1.5 flex items-center justify-between">
                <div className="flex items-center">
                  <SunMoon className="mr-2 h-4 w-4" />
                  <Label htmlFor="night-mode">Night Mode</Label>
                </div>
                <Switch id="night-mode" checked={nightMode} onCheckedChange={setNightMode} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <PdfSearch pdfUrl={pdfUrl} onNavigateToPage={onPageChange} />
    </div>
  )
}
