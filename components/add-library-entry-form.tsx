"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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

export function AddLibraryEntryForm() {
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
      pan: "",
      section: "",
      sub_section: "",
      subject: "",
      ao_order: "",
      itat_no: "",
      rsa_no: "",
      bench: "",
      appeal_no: "",
      appellant: "",
      respondent: "",
      appeal_type: "",
      appeal_filed_by: "",
      order_result: "",
      tribunal_order_date: "",
      assessment_year: "",
      judgment: "",
      conclusion: "",
      download: "",
      upload: "",
      category_id: null,
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)

      // Add the entry to localStorage for demo purposes
      const entries = JSON.parse(localStorage.getItem("elibrary_entries") || "[]")
      const newEntry = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      entries.push(newEntry)
      localStorage.setItem("elibrary_entries", JSON.stringify(entries))

      // In a real implementation, we would use the API
      // const response = await userbackAxios.post("/library/create", data)

      toast({
        title: "Success",
        description: "Library entry created successfully",
      })

      form.reset()
    } catch (error) {
      console.error("Error creating library entry:", error)
      toast({
        title: "Error",
        description: "Failed to create library entry",
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
    <Card>
      <CardHeader>
        <CardTitle>Add New Library Entry</CardTitle>
        <CardDescription>Fill in the details to add a new document to the e-library</CardDescription>
      </CardHeader>
      <CardContent>
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

            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Entry
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
