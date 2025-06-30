"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2, X, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Category, CategorySelect } from "@/components/category-management"

const formSchema = z.object({
  pan: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  sub_section: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  ao_order: z.string().optional(),
  itat_no: z.string().optional(),
  rsa_no: z.string().optional(),
  bench: z.string().min(1, "Bench is required"),
  appeal_no: z.string().min(1, "Appeal No. is required"),
  appellant: z.string().min(1, "Appellant is required"),
  respondent: z.string().min(1, "Respondent is required"),
  appeal_type: z.string().optional(),
  appeal_filed_by: z.string().optional(),
  order_result: z.string().min(1, "Order Result is required"),
  tribunal_order_date: z.string().optional(),
  assessment_year: z.string().min(1, "Assessment Year is required"),
  judgment: z.string().min(1, "Judgment is required"),
  conclusion: z.string().optional(),
  download: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  upload: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  category_id: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

interface LibraryEntry extends FormValues {
  id: string
  createdAt: string
  updatedAt: string
}

interface EditEntryModalProps {
  isOpen: boolean
  onClose: () => void
  entry: LibraryEntry
  onUpdate: () => void
}

export function EditEntryModal({ isOpen, onClose, entry, onUpdate }: EditEntryModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Fetch categories from localStorage
    const storedCategories = localStorage.getItem("elibrary_categories")
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    }
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pan: entry.pan || "",
      section: entry.section || "",
      sub_section: entry.sub_section || "",
      subject: entry.subject || "",
      ao_order: entry.ao_order || "",
      itat_no: entry.itat_no || "",
      rsa_no: entry.rsa_no || "",
      bench: entry.bench || "",
      appeal_no: entry.appeal_no || "",
      appellant: entry.appellant || "",
      respondent: entry.respondent || "",
      appeal_type: entry.appeal_type || "",
      appeal_filed_by: entry.appeal_filed_by || "",
      order_result: entry.order_result || "",
      tribunal_order_date: entry.tribunal_order_date || "",
      assessment_year: entry.assessment_year || "",
      judgment: entry.judgment || "",
      conclusion: entry.conclusion || "",
      download: entry.download || "",
      upload: entry.upload || "",
      category_id: entry.category_id || null,
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)

      // Update the entry in localStorage for demo purposes
      const entries = JSON.parse(localStorage.getItem("elibrary_entries") || "[]")
      const updatedEntries = entries.map((e: any) =>
        e.id === entry.id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e,
      )

      localStorage.setItem("elibrary_entries", JSON.stringify(updatedEntries))

      // In a real implementation, we would use the API
      // const response = await userbackAxios.put(`/library/update/${entry.id}`, data)

      toast({
        title: "Success",
        description: "Library entry updated successfully",
      })

      onUpdate()
      onClose()
    } catch (error) {
      console.error("Error updating library entry:", error)
      toast({
        title: "Error",
        description: "Failed to update library entry",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formFields = [
    { name: "pan" as const, label: "PAN" },
    { name: "section" as const, label: "Section" },
    { name: "sub_section" as const, label: "Sub-section" },
    { name: "subject" as const, label: "Subject" },
    { name: "ao_order" as const, label: "AO Order" },
    { name: "itat_no" as const, label: "ITAT No." },
    { name: "rsa_no" as const, label: "RSA No." },
    { name: "bench" as const, label: "Bench" },
    { name: "appeal_no" as const, label: "Appeal No." },
    { name: "appellant" as const, label: "Appellant" },
    { name: "respondent" as const, label: "Respondent" },
    { name: "appeal_type" as const, label: "Appeal Type" },
    { name: "appeal_filed_by" as const, label: "Appeal Filed By" },
    { name: "order_result" as const, label: "Order Result" },
    { name: "tribunal_order_date" as const, label: "Tribunal Order Date", type: "date" },
    { name: "assessment_year" as const, label: "Assessment Year" },
  ]

  const textareaFields = [
    { name: "judgment" as const, label: "Judgment" },
    { name: "conclusion" as const, label: "Conclusion" },
  ]

  const linkFields = [
    { name: "download" as const, label: "Download Link" },
    { name: "upload" as const, label: "Upload Link" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Library Entry</DialogTitle>
          <DialogDescription>Update the details of this library entry</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category selection */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    Category
                  </FormLabel>
                  <FormControl>
                    <CategorySelect value={field.value || null} onChange={field.onChange} categories={categories} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input {...formField} type={field.type || "text"} placeholder={field.label} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="space-y-4">
              {textareaFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Textarea {...formField} placeholder={field.label} className="min-h-[120px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {linkFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...formField}
                          type="url"
                          placeholder={`https://example.com/${field.name.toLowerCase()}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
