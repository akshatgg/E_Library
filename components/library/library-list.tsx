"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/lib/app-context"
import { libraryApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, Edit, Trash2, FileText, Calendar, User } from "lucide-react"
import { toast } from "sonner"

interface LibraryListProps {
  onEdit?: (entry: any) => void
  onView?: (entry: any) => void
}

export function LibraryList({ onEdit, onView }: LibraryListProps) {
  const { state, dispatch } = useAppContext()
  const [filteredEntries, setFilteredEntries] = useState(state.entries)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [])

  useEffect(() => {
    filterEntries()
  }, [state.entries, state.searchQuery, state.selectedCategory])

  const loadEntries = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const entries = await libraryApi.getEntries()
      dispatch({ type: "SET_ENTRIES", payload: entries })
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      toast.error("Failed to load entries")
    }
  }

  const filterEntries = () => {
    let filtered = state.entries

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.author.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (state.selectedCategory) {
      filtered = filtered.filter((entry) => entry.category === state.selectedCategory)
    }

    setFilteredEntries(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      await libraryApi.deleteEntry(id)
      dispatch({ type: "DELETE_ENTRY", payload: id })
      toast.success("Entry deleted successfully")
    } catch (error) {
      toast.error("Failed to delete entry")
    }
  }

  const getCategoryName = (categoryId: string) => {
    return state.categories.find((cat) => cat.id === categoryId)?.name || "Unknown"
  }

  const getCategoryColor = (categoryId: string) => {
    return state.categories.find((cat) => cat.id === categoryId)?.color || "gray"
  }

  if (state.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={state.selectedCategory}
                  onValueChange={(value) => dispatch({ type: "SET_SELECTED_CATEGORY", payload: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {state.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"} found
        </p>
        {(state.searchQuery || state.selectedCategory) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              dispatch({ type: "SET_SEARCH_QUERY", payload: "" })
              dispatch({ type: "SET_SELECTED_CATEGORY", payload: "" })
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Entry Grid */}
      {filteredEntries.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No entries found</h3>
          <p className="text-gray-600">
            {state.searchQuery || state.selectedCategory
              ? "Try adjusting your search or filters"
              : "Start by adding your first library entry"}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base line-clamp-2">{entry.title}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={`ml-2 bg-${getCategoryColor(entry.category)}-100 text-${getCategoryColor(entry.category)}-800`}
                  >
                    {getCategoryName(entry.category)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {entry.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{entry.description}</p>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{entry.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(entry.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => onView?.(entry)} className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(entry)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
