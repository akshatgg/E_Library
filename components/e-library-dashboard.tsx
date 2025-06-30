"use client"

import { useEffect, useState } from "react"
import { AppProvider, useAppContext } from "@/lib/app-context"
import { libraryApi } from "@/lib/api"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { LibraryGrid } from "@/components/library/library-grid"
import { LibraryEntryForm } from "@/components/forms/library-entry-form"
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, BookOpen, Star, Clock } from "lucide-react"
import { toast } from "sonner"

function DashboardSidebar() {
  const { state, dispatch } = useAppContext()

  const quickFilters = [
    { id: "all", label: "All Documents", icon: BookOpen, count: state.stats.totalEntries },
    { id: "favorites", label: "Favorites", icon: Star, count: state.stats.favorites },
    { id: "recent", label: "Recently Added", icon: Clock, count: state.stats.recentlyAdded },
  ]

  return (
    <Sidebar className="border-r">
      <SidebarContent className="p-4">
        <div className="space-y-6">
          {/* Quick Filters */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Filters</h3>
            <div className="space-y-1">
              {quickFilters.map((filter) => {
                const Icon = filter.icon
                return (
                  <Button
                    key={filter.id}
                    variant="ghost"
                    className="w-full justify-start h-9"
                    onClick={() => {
                      // Handle filter logic here
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {filter.label}
                    <Badge variant="secondary" className="ml-auto">
                      {filter.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Categories</h3>
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {state.categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={state.selectedCategory === category.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-9"
                    onClick={() => dispatch({ type: "SET_SELECTED_CATEGORY", payload: category.id })}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                    <Badge variant="outline" className="ml-auto">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Recent Activity */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Activity</h3>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Document added 2 hours ago</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Category updated yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

function DashboardContent() {
  const { state, dispatch } = useAppContext()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const entries = await libraryApi.getEntries()
      dispatch({ type: "SET_ENTRIES", payload: entries })
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      toast.error("Failed to load library data")
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const handleEdit = (entry: any) => {
    setEditingEntry(entry)
    setShowAddForm(true)
  }

  const handleView = (entry: any) => {
    dispatch({ type: "SET_SELECTED_ENTRY", payload: entry })
    // Navigate to document viewer
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      await libraryApi.deleteEntry(id)
      dispatch({ type: "DELETE_ENTRY", payload: id })
      toast.success("Document deleted successfully")
    } catch (error) {
      toast.error("Failed to delete document")
    }
  }

  const handleFormSuccess = () => {
    setShowAddForm(false)
    setEditingEntry(null)
    loadData()
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DashboardHeader />

      <div className="flex-1 flex">
        <DashboardSidebar />

        <main className="flex-1 p-6 space-y-6">
          {/* Stats Cards */}
          <StatsCards />

          {/* Main Content Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Document Library</h2>
              <p className="text-muted-foreground">
                {state.entries.length} documents • {state.categories.length} categories
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>

          {/* Library Grid */}
          <LibraryGrid onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
        </main>
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Document" : "Add New Document"}</DialogTitle>
          </DialogHeader>
          <LibraryEntryForm
            entry={editingEntry}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowAddForm(false)
              setEditingEntry(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ELibraryDashboard() {
  return (
    <AppProvider>
      <SidebarProvider>
        <DashboardContent />
      </SidebarProvider>
    </AppProvider>
  )
}
