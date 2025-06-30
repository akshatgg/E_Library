"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building, Cog, Calculator, FileText, Download, Share2, TrendingUp, Calendar, IndianRupee } from "lucide-react"
import { toast } from "sonner"
import { generateSimplePDF, downloadPDF } from "@/lib/pdf-generator"
import { shareContent, getShareableLink } from "@/lib/share-utils"

interface ValuationReport {
  id: string
  type: "plant_machinery" | "house"
  title: string
  value: number
  date: string
  status: "draft" | "completed" | "approved"
  client: string
}

const mockReports: ValuationReport[] = [
  {
    id: "1",
    type: "plant_machinery",
    title: "Manufacturing Equipment - ABC Industries",
    value: 2500000,
    date: "2024-01-15",
    status: "completed",
    client: "ABC Industries Ltd",
  },
  {
    id: "2",
    type: "house",
    title: "Residential Property - Sector 15, Gurgaon",
    value: 8500000,
    date: "2024-01-14",
    status: "approved",
    client: "Mr. Rajesh Kumar",
  },
]

export function ValuationDashboard() {
  const [reports, setReports] = useState<ValuationReport[]>(mockReports)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedType, setSelectedType] = useState<"plant_machinery" | "house">("plant_machinery")

  // Plant & Machinery Form State
  const [machineryForm, setMachineryForm] = useState({
    equipmentName: "",
    manufacturer: "",
    model: "",
    yearOfManufacture: "",
    originalCost: "",
    currentCondition: "",
    location: "",
    purpose: "",
    specifications: "",
  })

  // House Valuation Form State
  const [houseForm, setHouseForm] = useState({
    propertyType: "",
    address: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    age: "",
    condition: "",
    amenities: "",
    locality: "",
    nearbyLandmarks: "",
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateMachineryValue = () => {
    const originalCost = Number.parseFloat(machineryForm.originalCost) || 0
    const age = new Date().getFullYear() - Number.parseInt(machineryForm.yearOfManufacture) || 0
    const depreciationRate = 0.1 // 10% per year
    const conditionFactor =
      machineryForm.currentCondition === "excellent" ? 1 : machineryForm.currentCondition === "good" ? 0.8 : 0.6

    const depreciatedValue = originalCost * Math.pow(1 - depreciationRate, age)
    const finalValue = depreciatedValue * conditionFactor

    return Math.max(finalValue, originalCost * 0.1) // Minimum 10% of original cost
  }

  const calculateHouseValue = () => {
    const area = Number.parseFloat(houseForm.area) || 0
    const baseRate = houseForm.locality === "prime" ? 8000 : houseForm.locality === "good" ? 6000 : 4000 // Per sq ft
    const age = Number.parseInt(houseForm.age) || 0
    const ageFactor = Math.max(0.7, 1 - age * 0.02) // 2% depreciation per year, min 70%
    const conditionFactor = houseForm.condition === "excellent" ? 1.1 : houseForm.condition === "good" ? 1 : 0.9

    return area * baseRate * ageFactor * conditionFactor
  }

  const generateReport = () => {
    const isPlantMachinery = selectedType === "plant_machinery"
    const value = isPlantMachinery ? calculateMachineryValue() : calculateHouseValue()
    const title = isPlantMachinery
      ? `${machineryForm.equipmentName} - ${machineryForm.manufacturer}`
      : `${houseForm.propertyType} - ${houseForm.address}`

    const newReport: ValuationReport = {
      id: Date.now().toString(),
      type: selectedType,
      title,
      value,
      date: new Date().toISOString().split("T")[0],
      status: "draft",
      client: "New Client",
    }

    setReports((prev) => [newReport, ...prev])
    toast.success("Valuation report generated successfully!")

    // Reset forms
    if (isPlantMachinery) {
      setMachineryForm({
        equipmentName: "",
        manufacturer: "",
        model: "",
        yearOfManufacture: "",
        originalCost: "",
        currentCondition: "",
        location: "",
        purpose: "",
        specifications: "",
      })
    } else {
      setHouseForm({
        propertyType: "",
        address: "",
        area: "",
        bedrooms: "",
        bathrooms: "",
        age: "",
        condition: "",
        amenities: "",
        locality: "",
        nearbyLandmarks: "",
      })
    }
  }

  const totalValue = reports.reduce((sum, report) => sum + report.value, 0)
  const completedReports = reports.filter((r) => r.status === "completed" || r.status === "approved").length

  const handleDownloadPDF = (report: ValuationReport) => {
    const pdfContent = {
      title: report.title,
      client: report.client,
      date: report.date,
      value: report.value,
      type: report.type,
      details: {},
    }

    const pdfBlob = generateSimplePDF(pdfContent)
    downloadPDF(pdfBlob, `${report.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`)
    toast.success("PDF downloaded successfully!")
  }

  const handleShare = async (report: ValuationReport) => {
    const shareData = {
      title: report.title,
      text: `Valuation Report: ${report.title}\nClient: ${report.client}\nValue: ${formatCurrency(report.value)}`,
      url: getShareableLink("valuation", report.id),
    }

    const success = await shareContent(shareData)
    if (success) {
      toast.success("Report shared successfully!")
    } else {
      toast.error("Failed to share report")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Valuation Reports</h1>
              <p className="text-gray-600 mt-1">Professional valuation for Plant & Machinery and Real Estate</p>
            </div>
            <Button onClick={() => setActiveTab("create")}>
              <Calculator className="h-4 w-4 mr-2" />
              New Valuation
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reports</p>
                      <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-3xl font-bold text-green-600">{completedReports}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue)}</p>
                    </div>
                    <IndianRupee className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {reports.filter((r) => new Date(r.date).getMonth() === new Date().getMonth()).length}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Valuation Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {report.type === "plant_machinery" ? (
                          <Cog className="h-8 w-8 text-blue-500" />
                        ) : (
                          <Building className="h-8 w-8 text-green-500" />
                        )}
                        <div>
                          <h3 className="font-semibold">{report.title}</h3>
                          <p className="text-sm text-gray-600">{report.client}</p>
                          <p className="text-xs text-gray-500">{report.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{formatCurrency(report.value)}</p>
                        <Badge variant={report.status === "approved" ? "default" : "secondary"}>{report.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {report.type === "plant_machinery" ? (
                          <Cog className="h-12 w-12 text-blue-500" />
                        ) : (
                          <Building className="h-12 w-12 text-green-500" />
                        )}
                        <div>
                          <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                          <p className="text-gray-600 mb-1">Client: {report.client}</p>
                          <p className="text-sm text-gray-500 mb-3">Date: {report.date}</p>
                          <Badge variant={report.status === "approved" ? "default" : "secondary"}>
                            {report.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600 mb-4">{formatCurrency(report.value)}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(report)}>
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleShare(report)}>
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Valuation Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Type Selection */}
                  <div>
                    <Label className="text-base font-semibold">Valuation Type</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Card
                        className={`cursor-pointer transition-all ${selectedType === "plant_machinery" ? "ring-2 ring-blue-500" : ""}`}
                        onClick={() => setSelectedType("plant_machinery")}
                      >
                        <CardContent className="p-6 text-center">
                          <Cog className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                          <h3 className="font-semibold">Plant & Machinery</h3>
                          <p className="text-sm text-gray-600">Industrial equipment valuation</p>
                        </CardContent>
                      </Card>
                      <Card
                        className={`cursor-pointer transition-all ${selectedType === "house" ? "ring-2 ring-green-500" : ""}`}
                        onClick={() => setSelectedType("house")}
                      >
                        <CardContent className="p-6 text-center">
                          <Building className="h-12 w-12 mx-auto mb-3 text-green-500" />
                          <h3 className="font-semibold">House/Property</h3>
                          <p className="text-sm text-gray-600">Real estate valuation</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Plant & Machinery Form */}
                  {selectedType === "plant_machinery" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Plant & Machinery Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="equipmentName">Equipment Name *</Label>
                          <Input
                            id="equipmentName"
                            value={machineryForm.equipmentName}
                            onChange={(e) => setMachineryForm((prev) => ({ ...prev, equipmentName: e.target.value }))}
                            placeholder="e.g., CNC Milling Machine"
                          />
                        </div>
                        <div>
                          <Label htmlFor="manufacturer">Manufacturer *</Label>
                          <Input
                            id="manufacturer"
                            value={machineryForm.manufacturer}
                            onChange={(e) => setMachineryForm((prev) => ({ ...prev, manufacturer: e.target.value }))}
                            placeholder="e.g., Haas Automation"
                          />
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <Input
                            id="model"
                            value={machineryForm.model}
                            onChange={(e) => setMachineryForm((prev) => ({ ...prev, model: e.target.value }))}
                            placeholder="e.g., VF-2SS"
                          />
                        </div>
                        <div>
                          <Label htmlFor="yearOfManufacture">Year of Manufacture *</Label>
                          <Input
                            id="yearOfManufacture"
                            type="number"
                            value={machineryForm.yearOfManufacture}
                            onChange={(e) =>
                              setMachineryForm((prev) => ({ ...prev, yearOfManufacture: e.target.value }))
                            }
                            placeholder="e.g., 2020"
                          />
                        </div>
                        <div>
                          <Label htmlFor="originalCost">Original Cost (₹) *</Label>
                          <Input
                            id="originalCost"
                            type="number"
                            value={machineryForm.originalCost}
                            onChange={(e) => setMachineryForm((prev) => ({ ...prev, originalCost: e.target.value }))}
                            placeholder="e.g., 2500000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="currentCondition">Current Condition *</Label>
                          <Select
                            value={machineryForm.currentCondition}
                            onValueChange={(value) =>
                              setMachineryForm((prev) => ({ ...prev, currentCondition: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={machineryForm.location}
                            onChange={(e) => setMachineryForm((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., Mumbai, Maharashtra"
                          />
                        </div>
                        <div>
                          <Label htmlFor="purpose">Purpose/Usage</Label>
                          <Input
                            id="purpose"
                            value={machineryForm.purpose}
                            onChange={(e) => setMachineryForm((prev) => ({ ...prev, purpose: e.target.value }))}
                            placeholder="e.g., Metal cutting and shaping"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specifications">Technical Specifications</Label>
                        <Textarea
                          id="specifications"
                          value={machineryForm.specifications}
                          onChange={(e) => setMachineryForm((prev) => ({ ...prev, specifications: e.target.value }))}
                          placeholder="Detailed technical specifications..."
                          rows={4}
                        />
                      </div>

                      {machineryForm.originalCost &&
                        machineryForm.yearOfManufacture &&
                        machineryForm.currentCondition && (
                          <Card className="bg-blue-50">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">Estimated Value</h4>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(calculateMachineryValue())}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">Based on depreciation and condition factors</p>
                            </CardContent>
                          </Card>
                        )}
                    </div>
                  )}

                  {/* House Valuation Form */}
                  {selectedType === "house" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Property Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="propertyType">Property Type *</Label>
                          <Select
                            value={houseForm.propertyType}
                            onValueChange={(value) => setHouseForm((prev) => ({ ...prev, propertyType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="independent_house">Independent House</SelectItem>
                              <SelectItem value="plot">Plot</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="area">Area (sq ft) *</Label>
                          <Input
                            id="area"
                            type="number"
                            value={houseForm.area}
                            onChange={(e) => setHouseForm((prev) => ({ ...prev, area: e.target.value }))}
                            placeholder="e.g., 1200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            value={houseForm.bedrooms}
                            onChange={(e) => setHouseForm((prev) => ({ ...prev, bedrooms: e.target.value }))}
                            placeholder="e.g., 3"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            value={houseForm.bathrooms}
                            onChange={(e) => setHouseForm((prev) => ({ ...prev, bathrooms: e.target.value }))}
                            placeholder="e.g., 2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="age">Age (years) *</Label>
                          <Input
                            id="age"
                            type="number"
                            value={houseForm.age}
                            onChange={(e) => setHouseForm((prev) => ({ ...prev, age: e.target.value }))}
                            placeholder="e.g., 5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="condition">Condition *</Label>
                          <Select
                            value={houseForm.condition}
                            onValueChange={(value) => setHouseForm((prev) => ({ ...prev, condition: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="locality">Locality Type *</Label>
                          <Select
                            value={houseForm.locality}
                            onValueChange={(value) => setHouseForm((prev) => ({ ...prev, locality: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select locality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prime">Prime Location</SelectItem>
                              <SelectItem value="good">Good Location</SelectItem>
                              <SelectItem value="average">Average Location</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Complete Address *</Label>
                        <Textarea
                          id="address"
                          value={houseForm.address}
                          onChange={(e) => setHouseForm((prev) => ({ ...prev, address: e.target.value }))}
                          placeholder="Complete property address..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="amenities">Amenities</Label>
                        <Textarea
                          id="amenities"
                          value={houseForm.amenities}
                          onChange={(e) => setHouseForm((prev) => ({ ...prev, amenities: e.target.value }))}
                          placeholder="Swimming pool, gym, parking, etc..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nearbyLandmarks">Nearby Landmarks</Label>
                        <Textarea
                          id="nearbyLandmarks"
                          value={houseForm.nearbyLandmarks}
                          onChange={(e) => setHouseForm((prev) => ({ ...prev, nearbyLandmarks: e.target.value }))}
                          placeholder="Schools, hospitals, metro stations, etc..."
                          rows={2}
                        />
                      </div>

                      {houseForm.area && houseForm.age && houseForm.condition && houseForm.locality && (
                        <Card className="bg-green-50">
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">Estimated Value</h4>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateHouseValue())}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Based on area, location, age and condition factors
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <Button onClick={generateReport} className="flex-1">
                      <Calculator className="h-4 w-4 mr-2" />
                      Generate Valuation Report
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMachineryForm({
                          equipmentName: "",
                          manufacturer: "",
                          model: "",
                          yearOfManufacture: "",
                          originalCost: "",
                          currentCondition: "",
                          location: "",
                          purpose: "",
                          specifications: "",
                        })
                        setHouseForm({
                          propertyType: "",
                          address: "",
                          area: "",
                          bedrooms: "",
                          bathrooms: "",
                          age: "",
                          condition: "",
                          amenities: "",
                          locality: "",
                          nearbyLandmarks: "",
                        })
                      }}
                    >
                      Reset Form
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
