"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MoreVertical, Eye, Edit, Trash2, Download, Share, Calendar, FileText, User } from "lucide-react"
import { toast } from "sonner"

interface LibraryGridProps {
  onEdit?: (entry: any) => void
  onView?: (entry: any) => void
  onDelete?: (id: string) => void
}

export function LibraryGrid({ onEdit, onView, onDelete }: LibraryGridProps) {
  const { state, dispatch } = useAppContext()
  const [filteredEntries, setFilteredEntries] = useState(state.entries)

  const getCategoryInfo = (categoryId: string) => {
    return state.categories.find((cat) => cat.id === categoryId) || { name: "Unknown", color: "gray", icon: "📄" }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleToggleFavorite = (id: string) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: id })
    toast.success("Favorite updated")
  }

  if (state.isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-32 bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (state.entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No documents found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start building your legal library by adding your first document. Upload PDFs, organize by categories, and
          access them anywhere.
        </p>
        <Button
          onClick={() => {}}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <FileText className="h-4 w-4 mr-2" />
          Add Your First Document
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {state.entries.map((entry) => {
        const category = getCategoryInfo(entry.category)
        return (
          <Card
            key={entry.id}
            className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
          >
            <CardHeader className="pb-3">
              {/* Thumbnail */}
              <div className="relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                <div className="aspect-[3/4] flex items-center justify-center">
                  <img
                    src={entry.thumbnail || "/placeholder.svg?height=200&width=150&query=document"}
                    alt={entry.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => onView?.(entry)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleToggleFavorite(entry.id)}>
                    <Heart className={`h-3 w-3 ${entry.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>

                {/* Category badge */}
                <Badge
                  className="absolute top-2 left-2 text-xs"
                  style={{ backgroundColor: `var(--${category.color}-500)` }}
                >
                  {category.icon} {category.name}
                </Badge>

                {/* Favorite indicator */}
                {entry.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </div>
                )}
              </div>

              {/* Title and Author */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{entry.title}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  {entry.author}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{entry.description}</p>

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {entry.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      +{entry.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Reading Progress */}
              {entry.readingProgress && entry.readingProgress > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Reading Progress</span>
                    <span>{entry.readingProgress}%</span>
                  </div>
                  <Progress value={entry.readingProgress} className="h-1" />
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(entry.createdAt).toLocaleDateString()}
                </div>
                {entry.fileSize && (
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {formatFileSize(entry.fileSize)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button size="sm" variant="outline" onClick={() => onView?.(entry)} className="flex-1 mr-2">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(entry)}>
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="h-3 w-3 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(entry.id)} className="text-red-600">
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
