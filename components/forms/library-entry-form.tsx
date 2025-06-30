"use client"

import type React from "react"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"
import { libraryApi } from "@/lib/api"
import { useFormValidation, type ValidationRules } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface LibraryEntryFormProps {
  entry?: any
  onSuccess?: () => void
  onCancel?: () => void
}

const validationRules: ValidationRules = {
  title: { required: true, minLength: 3, maxLength: 100 },
  author: { required: true, minLength: 2, maxLength: 50 },
  category: { required: true },
  description: { maxLength: 500 },
  fileUrl: {
    pattern: /^https?:\/\/.+/,
    custom: (value) => {
      if (value && !value.startsWith("http")) {
        return "Please enter a valid URL"
      }
      return null
    },
  },
}

export function LibraryEntryForm({ entry, onSuccess, onCancel }: LibraryEntryFormProps) {
  const { state, dispatch } = useAppContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>(entry?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [uploadingFile, setUploadingFile] = useState(false)

  const initialData = {
    title: entry?.title || "",
    author: entry?.author || "",
    category: entry?.category || "",
    description: entry?.description || "",
    fileUrl: entry?.fileUrl || "",
  }

  const { data, errors, touched, handleChange, handleBlur, validate, reset } = useFormValidation(
    initialData,
    validationRules,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error("Please fix the form errors")
      return
    }

    setIsSubmitting(true)

    try {
      const entryData = {
        ...data,
        tags,
        id: entry?.id || Date.now().toString(),
        createdAt: entry?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (entry) {
        await libraryApi.updateEntry(entry.id, entryData)
        dispatch({ type: "UPDATE_ENTRY", payload: entryData })
        toast.success("Entry updated successfully")
      } else {
        await libraryApi.createEntry(entryData)
        dispatch({ type: "ADD_ENTRY", payload: entryData })
        toast.success("Entry created successfully")
      }

      reset()
      setTags([])
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file")
      return
    }

    setUploadingFile(true)
    try {
      const result = await libraryApi.uploadFile(file)
      handleChange("fileUrl", result.url)
      toast.success("File uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload file")
    } finally {
      setUploadingFile(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{entry ? "Edit Entry" : "Add New Entry"}</CardTitle>
        <CardDescription>Fill in the details for the library entry</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              placeholder="Enter document title"
              className={errors.title && touched.title ? "border-red-500" : ""}
            />
            {errors.title && touched.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={data.author}
              onChange={(e) => handleChange("author", e.target.value)}
              onBlur={() => handleBlur("author")}
              placeholder="Enter author name"
              className={errors.author && touched.author ? "border-red-500" : ""}
            />
            {errors.author && touched.author && <p className="text-sm text-red-500">{errors.author}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={data.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className={errors.category && touched.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {state.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && touched.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">PDF File</Label>
            <div className="flex gap-2">
              <Input
                id="fileUrl"
                value={data.fileUrl}
                onChange={(e) => handleChange("fileUrl", e.target.value)}
                onBlur={() => handleBlur("fileUrl")}
                placeholder="Enter file URL or upload below"
                className={errors.fileUrl && touched.fileUrl ? "border-red-500" : ""}
              />
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingFile}
                />
                <Button type="button" variant="outline" disabled={uploadingFile}>
                  {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {errors.fileUrl && touched.fileUrl && <p className="text-sm text-red-500">{errors.fileUrl}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="Enter description (optional)"
              rows={4}
              className={errors.description && touched.description ? "border-red-500" : ""}
            />
            {errors.description && touched.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {entry ? "Update Entry" : "Create Entry"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
