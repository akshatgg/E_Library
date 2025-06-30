"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Icon } from "@iconify/react"
// Add axios import to replace userbackAxios
import axios from "axios"

// Create a custom axios instance to replace userbackAxios
const apiClient = axios.create({
  baseURL: "/api", // Adjust this based on your API endpoint structure
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to handle authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        // Handle unauthorized
        toast.error("Session expired. Please login again.")
      } else if (error.response.status === 500) {
        // Handle server error
        toast.error("Server error. Please try again later.")
      }
    } else if (error.request) {
      // Request was made but no response
      toast.error("Network error. Please check your connection.")
    } else {
      // Something else happened
      toast.error("An error occurred. Please try again.")
    }
    return Promise.reject(error)
  },
)

// Custom Pagination component to replace the missing import
function CustomPagination({ currentPage, setCurrentPage, totalPages }) {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    // Add first page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="px-3 py-1 mx-1 rounded-md bg-bg_2/20 hover:bg-primary/10 text-txt"
        >
          1
        </button>,
      )

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 py-1">
            ...
          </span>,
        )
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 mx-1 rounded-md ${
            i === currentPage ? "bg-primary text-white" : "bg-bg_2/20 hover:bg-primary/10 text-txt"
          }`}
        >
          {i}
        </button>,
      )
    }

    // Add last page
    if (endPage < totalPages) {
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 py-1">
            ...
          </span>,
        )
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 mx-1 rounded-md bg-bg_2/20 hover:bg-primary/10 text-txt"
        >
          {totalPages}
        </button>,
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-1">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md flex items-center ${
          currentPage === 1 ? "bg-bg_2/10 text-txt/40 cursor-not-allowed" : "bg-bg_2/20 hover:bg-primary/10 text-txt"
        }`}
      >
        <Icon icon="material-symbols:chevron-left" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </button>

      <div className="hidden sm:flex">{renderPageNumbers()}</div>

      <div className="sm:hidden px-3 py-1">
        Page {currentPage} of {totalPages}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md flex items-center ${
          currentPage === totalPages
            ? "bg-bg_2/10 text-txt/40 cursor-not-allowed"
            : "bg-bg_2/20 hover:bg-primary/10 text-txt"
        }`}
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <Icon icon="material-symbols:chevron-right" />
      </button>
    </div>
  )
}

// Modal component for editing library entries
function EditModal({ isOpen, onClose, libraryData, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: libraryData || {},
  })

  // Watch for form changes
  const watchAllFields = watch()

  useEffect(() => {
    setHasChanges(isDirty)
  }, [watchAllFields, isDirty])

  useEffect(() => {
    if (libraryData) {
      // Reset form with libraryData
      reset(libraryData)
      setHasChanges(false)
    }
  }, [libraryData, reset])

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValue(name, value)
    setHasChanges(true)
  }

  // Handle closing with unsaved changes
  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      // Using getValues directly instead of data parameter
      console.log("Form values before submission:", getValues())
      const dataToSend = getValues()
      // Replace userbackAxios with apiClient
      const { status, data: responseData } = await apiClient.put(`/library/update/${libraryData.id}`, dataToSend)

      console.log("Update response:", responseData)

      if (status === 200) {
        toast.success("Library entry updated successfully")
        setHasChanges(false)
        onUpdate() // Refresh data after update
        onClose() // Close modal
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update library entry: " + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const formFields = [
    { name: "pan", label: "PAN" },
    { name: "section", label: "Section" },
    { name: "sub_section", label: "Sub-section" },
    { name: "subject", label: "Subject" },
    { name: "ao_order", label: "AO Order" },
    { name: "itat_no", label: "ITAT No." },
    { name: "rsa_no", label: "RSA No." },
    { name: "bench", label: "Bench" },
    { name: "appeal_no", label: "Appeal No." },
    { name: "appellant", label: "Appellant" },
    { name: "respondent", label: "Respondent" },
    { name: "appeal_type", label: "Appeal Type" },
    { name: "appeal_filed_by", label: "Appeal Filed By" },
    { name: "order_result", label: "Order Result" },
    { name: "tribunal_order_date", label: "Tribunal Order Date", type: "date" },
    { name: "assessment_year", label: "Assessment Year" },
    { name: "judgment", label: "Judgment" },
    { name: "conclusion", label: "Conclusion" },
    { name: "download", label: "Download Link" },
    { name: "upload", label: "Upload Link" },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 h-5/6 overflow-hidden shadow-xl">
        <div className="p-4 bg-primary text-white flex justify-between items-center border-b border-primary/20">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Icon icon="material-symbols:edit-document" className="text-xl" />
            Edit Library Entry
          </h3>
          <button
            onClick={handleClose}
            className="text-2xl hover:bg-primary-dark rounded-full h-8 w-8 flex items-center justify-center transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-130px)] scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-gray-100">
          <form id="edit-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {formFields.map((field) => (
              <div key={field.name} className="col-span-1">
                <label className="text-txt font-semibold" htmlFor={field.name}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  type={field.type || "text"}
                  placeholder={field.label}
                  {...register(field.name)}
                  onChange={handleInputChange}
                  className="mt-1 bg-bg_2/10 border border-txt/40 focus:border-primary focus:ring-1 focus:ring-primary/30 text-txt text-sm rounded-md block w-full p-2.5 transition-all duration-200"
                />
                {errors[field.name] && <small className="text-red-500 italic">{errors[field.name]?.message}</small>}
              </div>
            ))}
          </form>
        </div>

        <div className="p-4 bg-gray-50 flex justify-end border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-1"
          >
            <Icon icon="material-symbols:cancel-outline" />
            Cancel
          </button>
          <button
            type="submit"
            form="edit-form"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icon icon="svg-spinners:270-ring" className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="material-symbols:save-outline" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function Item_edit({ libraryData, onEdit, onDelete }) {
  // Format display data
  const title = `${libraryData.appellant} vs ${libraryData.respondent}`
  const overview = libraryData.judgment?.substring(0, 150) + (libraryData.judgment?.length > 150 ? "..." : "")
  const date = new Date(libraryData.updatedAt).toLocaleDateString()

  // Extract key details for card display
  const keyDetails = [
    { label: "Appeal No", value: libraryData.appeal_no },
    { label: "Section", value: libraryData.section },
    { label: "Assessment Year", value: libraryData.assessment_year },
    { label: "Result", value: libraryData.order_result },
  ]

  return (
    <li className="shadow-md shadow-primary/20 rounded-md p-4 bg-bg_1/70 hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-primary/20">
      <div className="flex">
        <div className="flex-1">
          <div className="text-txt text-xl font-semibold self-center mb-2">{title}</div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 mb-3">
            {keyDetails.map((detail, idx) => (
              <div key={idx} className="text-sm bg-bg_2/20 p-2 rounded-md">
                <span className="font-semibold text-primary/80">{detail.label}:</span> {detail.value || "N/A"}
              </div>
            ))}
          </div>

          <p className="text-txt/90 bg-bg_2/10 p-3 rounded-md">{overview}</p>
        </div>
        <div className="grid place-content-between gap-2 ml-3">
          <div
            className="border border-blue-600 rounded-md p-1.5 text-xl text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors"
            title="Edit"
            onClick={() => onEdit(libraryData)}
          >
            <Icon icon="material-symbols:edit-outline" />
          </div>
          <div
            className="border border-red-600 rounded-md p-1.5 text-xl text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
            title="Delete"
            onClick={() => onDelete(libraryData.id)}
          >
            <Icon icon="material-symbols:delete-outline" />
          </div>
        </div>
      </div>
      <div className="relative top-2 italic text-sm text-txt/40 flex items-center gap-1">
        <Icon icon="material-symbols:calendar-month-outline" className="text-primary/60" />
        {date}
      </div>
    </li>
  )
}

export default function Edit_ELibrary() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [allLib, setAllLib] = useState({ allLibrary: [] })
  const [totalPages, setTotalPages] = useState(14)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLibrary, setSelectedLibrary] = useState(null)
  // Add a new state for search query after the other state declarations in Edit_ELibrary component
  const [searchQuery, setSearchQuery] = useState("")
  // Add these new state variables after the existing state declarations in the Edit_ELibrary component
  const [filters, setFilters] = useState({
    section: "",
    assessment_year: "",
    order_result: "",
    bench: "",
  })

  const fetchAllLib = async () => {
    try {
      setIsLoading(true)
      // Replace userbackAxios with apiClient
      const { data } = await apiClient.get("/library/getAll")
      setAllLib(data)
      console.log("Fetched library data:", data)
    } catch (error) {
      console.error("Error fetching library data:", error)
      toast.error("Failed to fetch library data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllLib()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
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
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      // Replace userbackAxios with apiClient
      const { status } = await apiClient.post("/library/create", data)

      if (status === 200 || status === 201) {
        console.log("Library entry created:", data)
        toast.success("Library entry created successfully")
        reset()
        fetchAllLib() // Refresh the list
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("Failed to create library entry")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (libraryData) => {
    console.log("Editing library data:", libraryData)
    setSelectedLibrary(libraryData)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        // Replace userbackAxios with apiClient
        const { status } = await apiClient.delete(`/library/delete/${id}`)

        if (status === 200) {
          toast.success("Library entry deleted successfully")
          fetchAllLib() // Refresh the list
        }
      } catch (error) {
        console.error("Delete error:", error)
        toast.error("Failed to delete library entry")
      }
    }
  }

  // Add a function to filter library entries based on search query after the handleDelete function
  // Add this function after the filteredLibraryEntries function
  const getUniqueValues = (field) => {
    if (!allLib.allLibrary || allLib.allLibrary.length === 0) return []

    const values = allLib.allLibrary.map((item) => item[field]).filter((value) => value && value.trim() !== "")

    return [...new Set(values)].sort()
  }

  // Add this function to handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Add this function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      section: "",
      assessment_year: "",
      order_result: "",
      bench: "",
    })
    setSearchQuery("")
  }

  // Modify the filteredLibraryEntries function to include filter logic
  const filteredLibraryEntries = () => {
    if (!allLib.allLibrary || allLib.allLibrary.length === 0) return []

    let filtered = allLib.allLibrary

    // Apply dropdown filters
    if (filters.section) {
      filtered = filtered.filter((lib) => lib.section === filters.section)
    }

    if (filters.assessment_year) {
      filtered = filtered.filter((lib) => lib.assessment_year === filters.assessment_year)
    }

    if (filters.order_result) {
      filtered = filtered.filter((lib) => lib.order_result === filters.order_result)
    }

    if (filters.bench) {
      filtered = filtered.filter((lib) => lib.bench === filters.bench)
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (lib) =>
          (lib.appellant && lib.appellant.toLowerCase().includes(query)) ||
          (lib.respondent && lib.respondent.toLowerCase().includes(query)) ||
          (lib.appeal_no && lib.appeal_no.toLowerCase().includes(query)) ||
          (lib.section && lib.section.toLowerCase().includes(query)) ||
          (lib.assessment_year && lib.assessment_year.toLowerCase().includes(query)) ||
          (lib.order_result && lib.order_result.toLowerCase().includes(query)) ||
          (lib.judgment && lib.judgment.toLowerCase().includes(query)),
      )
    }

    return filtered
  }

  const formFields = [
    { name: "pan", label: "PAN" },
    { name: "section", label: "Section" },
    { name: "sub_section", label: "Sub-section" },
    { name: "subject", label: "Subject" },
    { name: "ao_order", label: "AO Order" },
    { name: "itat_no", label: "ITAT No." },
    { name: "rsa_no", label: "RSA No." },
    { name: "bench", label: "Bench" },
    { name: "appeal_no", label: "Appeal No." },
    { name: "appellant", label: "Appellant" },
    { name: "respondent", label: "Respondent" },
    { name: "appeal_type", label: "Appeal Type" },
    { name: "appeal_filed_by", label: "Appeal Filed By" },
    { name: "order_result", label: "Order Result" },
    { name: "tribunal_order_date", label: "Tribunal Order Date", type: "date" },
    { name: "assessment_year", label: "Assessment Year" },
    { name: "judgment", label: "Judgment" },
    { name: "conclusion", label: "Conclusion" },
    { name: "download", label: "Download Link" },
    { name: "upload", label: "Upload Link" },
  ]

  return (
    <>
      {/* Replace H5 with standard h2 element with appropriate styling */}
      <h2 className="text-2xl font-bold text-primary mt-12 mb-6 flex items-center gap-2">
        <Icon icon="material-symbols:library-books" />
        Edit E-Library
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6 my-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-5 grid grid-cols-1 gap-4 sm:grid-cols-2 bg-bg_2/10 rounded-lg border border-txt/10 mb-6"
        >
          <div className="col-span-1 sm:col-span-2 mb-2">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Icon icon="material-symbols:add-circle-outline" />
              Add New Library Entry
            </h3>
          </div>

          {formFields.map((field) => (
            <div key={field.name} className="col-span-1">
              <label className="text-txt font-semibold flex items-center gap-1" htmlFor={field.name}>
                <Icon icon="material-symbols:label-outline" className="text-primary/70" size={16} />
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type || "text"}
                placeholder={field.label}
                {...register(field.name, {
                  required: `${field.label} is required`,
                })}
                className="mt-1 bg-bg_2/10 border border-txt/40 focus:border-primary focus:ring-1 focus:ring-primary/30 text-txt text-sm rounded-md block w-full p-2.5 transition-all duration-200"
              />
              {errors[field.name] && (
                <small className="text-red-500 italic flex items-center gap-1 mt-1">
                  <Icon icon="material-symbols:error-outline" size={14} />
                  {errors[field.name]?.message}
                </small>
              )}
            </div>
          ))}

          <div className="col-span-2">
            <button
              type="submit"
              className="px-6 py-2.5 mt-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icon icon="svg-spinners:270-ring" className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Icon icon="material-symbols:save" />
                  Submit
                </>
              )}
            </button>
          </div>
        </form>

        {/* Add a search bar component after the form and before the library entries list */}
        <div className="mt-8 mb-6 bg-bg_2/10 rounded-lg border border-txt/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Icon icon="material-symbols:filter-alt" />
              Search & Filter
            </h3>
            {(searchQuery || filters.section || filters.assessment_year || filters.order_result || filters.bench) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Icon icon="material-symbols:filter-alt-off" />
                Clear all filters
              </button>
            )}
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon icon="material-symbols:search" className="text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full p-3 pl-10 text-sm border border-txt/40 rounded-lg bg-bg_2/10 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
              placeholder="Search by appellant, respondent, appeal no, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                <Icon icon="material-symbols:close" className="text-gray-500 hover:text-primary" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Section Filter */}
            <div>
              <label className="block text-sm font-medium text-txt mb-1 flex items-center gap-1">
                <Icon icon="material-symbols:label-outline" className="text-primary/70" size={16} />
                Section
              </label>
              <select
                className="bg-bg_2/10 border border-txt/40 text-txt text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5"
                value={filters.section}
                onChange={(e) => handleFilterChange("section", e.target.value)}
              >
                <option value="">All Sections</option>
                {getUniqueValues("section").map((section, index) => (
                  <option key={index} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {/* Assessment Year Filter */}
            <div>
              <label className="block text-sm font-medium text-txt mb-1 flex items-center gap-1">
                <Icon icon="material-symbols:calendar-month-outline" className="text-primary/70" size={16} />
                Assessment Year
              </label>
              <select
                className="bg-bg_2/10 border border-txt/40 text-txt text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5"
                value={filters.assessment_year}
                onChange={(e) => handleFilterChange("assessment_year", e.target.value)}
              >
                <option value="">All Years</option>
                {getUniqueValues("assessment_year").map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Result Filter */}
            <div>
              <label className="block text-sm font-medium text-txt mb-1 flex items-center gap-1">
                <Icon icon="material-symbols:gavel" className="text-primary/70" size={16} />
                Order Result
              </label>
              <select
                className="bg-bg_2/10 border border-txt/40 text-txt text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5"
                value={filters.order_result}
                onChange={(e) => handleFilterChange("order_result", e.target.value)}
              >
                <option value="">All Results</option>
                {getUniqueValues("order_result").map((result, index) => (
                  <option key={index} value={result}>
                    {result}
                  </option>
                ))}
              </select>
            </div>

            {/* Bench Filter */}
            <div>
              <label className="block text-sm font-medium text-txt mb-1 flex items-center gap-1">
                <Icon icon="material-symbols:chair-outline" className="text-primary/70" size={16} />
                Bench
              </label>
              <select
                className="bg-bg_2/10 border border-txt/40 text-txt text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2.5"
                value={filters.bench}
                onChange={(e) => handleFilterChange("bench", e.target.value)}
              >
                <option value="">All Benches</option>
                {getUniqueValues("bench").map((bench, index) => (
                  <option key={index} value={bench}>
                    {bench}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter summary */}
          {(filters.section || filters.assessment_year || filters.order_result || filters.bench) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.section && (
                <div className="bg-primary/10 text-primary text-sm py-1 px-2 rounded-md flex items-center gap-1">
                  Section: {filters.section}
                  <button onClick={() => handleFilterChange("section", "")} className="ml-1 hover:text-primary/80">
                    <Icon icon="material-symbols:close" size={16} />
                  </button>
                </div>
              )}
              {filters.assessment_year && (
                <div className="bg-primary/10 text-primary text-sm py-1 px-2 rounded-md flex items-center gap-1">
                  Year: {filters.assessment_year}
                  <button
                    onClick={() => handleFilterChange("assessment_year", "")}
                    className="ml-1 hover:text-primary/80"
                  >
                    <Icon icon="material-symbols:close" size={16} />
                  </button>
                </div>
              )}
              {filters.order_result && (
                <div className="bg-primary/10 text-primary text-sm py-1 px-2 rounded-md flex items-center gap-1">
                  Result: {filters.order_result}
                  <button onClick={() => handleFilterChange("order_result", "")} className="ml-1 hover:text-primary/80">
                    <Icon icon="material-symbols:close" size={16} />
                  </button>
                </div>
              )}
              {filters.bench && (
                <div className="bg-primary/10 text-primary text-sm py-1 px-2 rounded-md flex items-center gap-1">
                  Bench: {filters.bench}
                  <button onClick={() => handleFilterChange("bench", "")} className="ml-1 hover:text-primary/80">
                    <Icon icon="material-symbols:close" size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Replace the existing isLoading check and ul element with this code: */}
        {isLoading ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <Icon icon="svg-spinners:270-ring" className="animate-spin text-4xl text-primary" />
            <span>Loading library data...</span>
          </div>
        ) : (
          <ul className="px-2 py-4 grid gap-4">
            {filteredLibraryEntries().length > 0 ? (
              filteredLibraryEntries().map((lib, index) => (
                <Item_edit key={index} libraryData={lib} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            ) : (
              <div className="text-center p-8 bg-bg_2/10 rounded-lg border border-txt/10">
                {searchQuery || filters.section || filters.assessment_year || filters.order_result || filters.bench ? (
                  <>
                    <Icon icon="material-symbols:search-off" className="text-5xl text-primary/50 mx-auto mb-3" />
                    <p className="text-txt/70">No results found with the current filters</p>
                    <div className="mt-2 text-sm text-txt/60">
                      {searchQuery && <p>Search: "{searchQuery}"</p>}
                      {filters.section && <p>Section: {filters.section}</p>}
                      {filters.assessment_year && <p>Assessment Year: {filters.assessment_year}</p>}
                      {filters.order_result && <p>Order Result: {filters.order_result}</p>}
                      {filters.bench && <p>Bench: {filters.bench}</p>}
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                      onClick={clearAllFilters}
                    >
                      Clear all filters
                    </button>
                  </>
                ) : (
                  <>
                    <Icon
                      icon="material-symbols:library-books-outline"
                      className="text-5xl text-primary/50 mx-auto mb-3"
                    />
                    <p className="text-txt/70">No library entries found. Add your first entry using the form above.</p>
                  </>
                )}
              </div>
            )}
          </ul>
        )}
      </div>

      <div className="flex p-6 justify-center">
        {/* Replace Pagination with our custom implementation */}
        <CustomPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          libraryData={selectedLibrary}
          onUpdate={fetchAllLib}
        />
      )}
    </>
  )
}
