"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Eye, Download, Share2, Star, FileText, Clock, ExternalLink } from "lucide-react"

interface CaseLawCardProps {
  caseData: {
    id: string
    title: string
    court: string
    date: string
    category: string
    status: "ALLOWED" | "DISMISSED" | "PARTLY ALLOWED" | "REMANDED"
    sections: string[]
    summary: string
    caseNumber: string
    impact: "High" | "Medium" | "Low"
    tags: string[]
    isBookmarked?: boolean
    viewCount?: number
    downloadCount?: number
  }
  onView?: (id: string) => void
  onDownload?: (id: string) => void
  onBookmark?: (id: string) => void
  onShare?: (id: string) => void
}

export function CaseLawCard({ caseData, onView, onDownload, onBookmark, onShare }: CaseLawCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(caseData.isBookmarked || false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ALLOWED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "DISMISSED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "PARTLY ALLOWED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "REMANDED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(caseData.id)
  }

  return (
    <Card
      className={`
        group relative overflow-hidden transition-all duration-500 ease-out cursor-pointer
        ${
          isHovered
            ? "shadow-2xl shadow-blue-500/25 scale-[1.02] -translate-y-2 border-blue-200 dark:border-blue-800"
            : "shadow-md hover:shadow-xl border-gray-200 dark:border-gray-700"
        }
        bg-gradient-to-br from-white via-gray-50 to-blue-50/30 
        dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20
        backdrop-blur-sm border-2
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "perspective(1000px) rotateX(2deg) rotateY(-2deg)" : "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Animated Background Gradient */}
      <div
        className={`
          absolute inset-0 opacity-0 transition-opacity duration-500
          bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5
          ${isHovered ? "opacity-100" : ""}
        `}
      />

      {/* Glow Effect */}
      <div
        className={`
          absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
          rounded-lg blur opacity-0 transition-opacity duration-500
          ${isHovered ? "opacity-20" : ""}
        `}
      />

      <CardContent className="relative p-6 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Impact Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getImpactColor(caseData.impact)} animate-pulse`} />
              <Badge variant="outline" className="text-xs font-medium">
                {caseData.impact} Impact
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                {caseData.category}
              </Badge>
            </div>

            {/* Title */}
            <h3
              className={`
                text-lg font-bold leading-tight transition-colors duration-300
                ${isHovered ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}
                line-clamp-2
              `}
            >
              {caseData.title}
            </h3>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{caseData.court}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{caseData.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{caseData.caseNumber}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <Badge className={`${getStatusColor(caseData.status)} font-medium`}>{caseData.status}</Badge>
        </div>

        {/* Summary */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">{caseData.summary}</p>

        {/* Sections */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Relevant Sections:</p>
          <div className="flex flex-wrap gap-1">
            {caseData.sections.slice(0, 3).map((section, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {section}
              </Badge>
            ))}
            {caseData.sections.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{caseData.sections.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Tags */}
        {caseData.tags && caseData.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Tags:</p>
            <div className="flex flex-wrap gap-1">
              {caseData.tags.slice(0, 4).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{caseData.viewCount || 0} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{caseData.downloadCount || 0} downloads</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated {caseData.date}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`
            flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700
            transition-all duration-300
            ${isHovered ? "border-blue-200 dark:border-blue-800" : ""}
          `}
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(caseData.id)}
              className={`
                transition-all duration-300 hover:scale-105
                ${isHovered ? "border-blue-300 text-blue-600 hover:bg-blue-50" : ""}
              `}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload?.(caseData.id)}
              className="transition-all duration-300 hover:scale-105 hover:border-green-300 hover:text-green-600 hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleBookmark}
              className={`
                transition-all duration-300 hover:scale-110
                ${isBookmarked ? "text-yellow-600 hover:text-yellow-700" : "text-gray-400 hover:text-yellow-600"}
              `}
            >
              <Star className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onShare?.(caseData.id)}
              className="transition-all duration-300 hover:scale-110 text-gray-400 hover:text-blue-600"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="transition-all duration-300 hover:scale-110 text-gray-400 hover:text-purple-600"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hover Overlay */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent
            opacity-0 transition-opacity duration-500 pointer-events-none
            ${isHovered ? "opacity-100" : ""}
          `}
        />
      </CardContent>

      {/* Corner Accent */}
      <div
        className={`
          absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/20 to-transparent
          transition-all duration-500
          ${isHovered ? "w-24 h-24 from-blue-500/30" : ""}
        `}
      />
    </Card>
  )
}
