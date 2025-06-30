"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit2, Trash2, X, Check, Tag, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getCaseLawByCategory } from "@/lib/api-service"

// Define the category schema
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  color: z.string().min(1, "Color is required"),
  description: z.string().optional(),
  apiEndpoint: z.string().optional(),
})

export type Category = z.infer<typeof categorySchema> & {
  id: string
  count?: number
}

// Predefined colors for categories
export const categoryColors = [
  { name: "Red", value: "red", class: "bg-red-100 text-red-800 hover:bg-red-200" },
  { name: "Green", value: "green", class: "bg-green-100 text-green-800 hover:bg-green-200" },
  { name: "Blue", value: "blue", class: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  { name: "Purple", value: "purple", class: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { name: "Pink", value: "pink", class: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
  { name: "Indigo", value: "indigo", class: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" },
  { name: "Teal", value: "teal", class: "bg-teal-100 text-teal-800 hover:bg-teal-200" },
  { name: "Orange", value: "orange", class: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
  { name: "Gray", value: "gray", class: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
]

export function getCategoryColorClass(color: string) {
  return categoryColors.find((c) => c.value === color)?.class || "bg-gray-100 text-gray-800 hover:bg-gray-200"
}

export function CategoryManagement() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      color: "blue",
      description: "",
      apiEndpoint: "",
    },
  })

  const editForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      color: "blue",
      description: "",
      apiEndpoint: "",
    },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory && isEditDialogOpen) {
      editForm.reset({
        name: selectedCategory.name,
        color: selectedCategory.color,
        description: selectedCategory.description || "",
        apiEndpoint: selectedCategory.apiEndpoint || "",
      })
    }
  }, [selectedCategory, isEditDialogOpen, editForm])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      // In a real implementation, this would be an API call
      // For now, we'll use mock data stored in localStorage
      const storedCategories = localStorage.getItem("elibrary_categories")
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories)
        // Update counts for each category
        const categoriesWithCounts = await Promise.all(
          parsedCategories.map(async (category: Category) => {
            try {
              const cases = await getCaseLawByCategory(category.name)
              return { ...category, count: cases.length }
            } catch (error) {
              console.error(`Error fetching count for category ${category.name}:`, error)
              return { ...category, count: 0 }
            }
          }),
        )
        setCategories(categoriesWithCounts)
      } else {
        // Initialize with some default categories
        const defaultCategories = [
          {
            id: "1",
            name: "Tax Law",
            color: "blue",
            description: "Tax-related legal documents",
            apiEndpoint: "/api/cases/tax",
            count: 3,
          },
          {
            id: "2",
            name: "Corporate Law",
            color: "green",
            description: "Corporate legal documents",
            apiEndpoint: "/api/cases/corporate",
            count: 1,
          },
          {
            id: "3",
            name: "Criminal Law",
            color: "red",
            description: "Criminal case documents",
            apiEndpoint: "/api/cases/criminal",
            count: 1,
          },
        ]
        localStorage.setItem("elibrary_categories", JSON.stringify(defaultCategories))
        setCategories(defaultCategories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCategoryCounts = async () => {
    try {
      setIsRefreshing(true)
      // Update counts for each category
      const updatedCategories = await Promise.all(
        categories.map(async (category) => {
          try {
            const cases = await getCaseLawByCategory(category.name)
            return { ...category, count: cases.length }
          } catch (error) {
            console.error(`Error fetching count for category ${category.name}:`, error)
            return { ...category, count: 0 }
          }
        }),
      )

      setCategories(updatedCategories)
      localStorage.setItem("elibrary_categories", JSON.stringify(updatedCategories))

      toast({
        title: "Success",
        description: "Category counts refreshed successfully",
      })
    } catch (error) {
      console.error("Error refreshing category counts:", error)
      toast({
        title: "Error",
        description: "Failed to refresh category counts",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    try {
      // In a real implementation, this would be an API call
      const newCategory = {
        id: Date.now().toString(),
        ...data,
        count: 0,
      }

      const updatedCategories = [...categories, newCategory]
      localStorage.setItem("elibrary_categories", JSON.stringify(updatedCategories))
      setCategories(updatedCategories)

      toast({
        title: "Success",
        description: "Category created successfully",
      })

      setIsAddDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const onEdit = async (data: z.infer<typeof categorySchema>) => {
    if (!selectedCategory) return

    try {
      // In a real implementation, this would be an API call
      const updatedCategories = categories.map((category) =>
        category.id === selectedCategory.id ? { ...category, ...data } : category,
      )

      localStorage.setItem("elibrary_categories", JSON.stringify(updatedCategories))
      setCategories(updatedCategories)

      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      setIsEditDialogOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const onDelete = async () => {
    if (!selectedCategory) return

    try {
      // In a real implementation, this would be an API call
      const updatedCategories = categories.filter((category) => category.id !== selectedCategory.id)

      localStorage.setItem("elibrary_categories", JSON.stringify(updatedCategories))
      setCategories(updatedCategories)

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })

      setIsDeleteDialogOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage categories to organize your library entries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshCategoryCounts} disabled={isRefreshing}>
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh Counts
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-gray-100 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className={cn("pb-2", getCategoryColorClass(category.color))}>
                <CardTitle className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    {category.name}
                    {category.count !== undefined && (
                      <Badge variant="outline" className="ml-2 bg-white/50">
                        {category.count} entries
                      </Badge>
                    )}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:text-gray-900"
                      onClick={() => handleEditClick(category)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:text-red-600"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                {category.description && <CardDescription>{category.description}</CardDescription>}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center mb-2">
                  <div className="text-sm text-muted-foreground">Color:</div>
                  <div className={cn("ml-2 w-6 h-6 rounded-full border", getCategoryColorClass(category.color))} />
                </div>
                {category.apiEndpoint && (
                  <div className="text-sm text-muted-foreground">API Endpoint: {category.apiEndpoint}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new category to organize your library entries</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {categoryColors.map((color) => (
                        <div
                          key={color.value}
                          className={cn(
                            "w-8 h-8 rounded-full cursor-pointer border-2",
                            color.class,
                            field.value === color.value ? "ring-2 ring-primary ring-offset-2" : "ring-0",
                          )}
                          onClick={() => form.setValue("color", color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apiEndpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Endpoint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="/api/cases/category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category details</DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {categoryColors.map((color) => (
                        <div
                          key={color.value}
                          className={cn(
                            "w-8 h-8 rounded-full cursor-pointer border-2",
                            color.class,
                            field.value === color.value ? "ring-2 ring-primary ring-offset-2" : "ring-0",
                          )}
                          onClick={() => editForm.setValue("color", color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="apiEndpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Endpoint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="/api/cases/category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="py-4">
              <p className="font-medium">{selectedCategory.name}</p>
              {selectedCategory.description && (
                <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
              )}
              {selectedCategory.count !== undefined && selectedCategory.count > 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Warning: This category contains {selectedCategory.count} entries that will be uncategorized.
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <Badge className={cn("font-normal", getCategoryColorClass(category.color))}>
      <Tag className="mr-1 h-3 w-3" />
      {category.name}
      {category.count !== undefined && <span className="ml-1 text-xs opacity-70">({category.count})</span>}
    </Badge>
  )
}

export function CategorySelect({
  value,
  onChange,
  categories,
}: {
  value: string | null
  onChange: (value: string | null) => void
  categories: Category[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedCategory = categories.find((c) => c.id === value) || null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={isOpen} className="w-full justify-between">
          {selectedCategory ? (
            <span className="flex items-center">
              <div className={cn("mr-2 w-3 h-3 rounded-full", getCategoryColorClass(selectedCategory.color))} />
              {selectedCategory.name}
              {selectedCategory.count !== undefined && (
                <span className="ml-1 text-xs opacity-70">({selectedCategory.count})</span>
              )}
            </span>
          ) : (
            "Select category..."
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex flex-col">
          <Button
            variant="ghost"
            className="justify-start rounded-none"
            onClick={() => {
              onChange(null)
              setIsOpen(false)
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Clear selection
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={cn("justify-start rounded-none", value === category.id && "bg-accent")}
              onClick={() => {
                onChange(category.id)
                setIsOpen(false)
              }}
            >
              <div className={cn("mr-2 w-3 h-3 rounded-full", getCategoryColorClass(category.color))} />
              <span className="flex-1 text-left">{category.name}</span>
              {category.count !== undefined && <span className="text-xs opacity-70">({category.count})</span>}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
