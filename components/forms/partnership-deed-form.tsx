"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Download } from "lucide-react"
import { toast } from "sonner"

interface Partner {
  id: string
  name: string
  address: string
  contribution: string
  profitShare: string
  panNumber: string
}

export function PartnershipDeedForm() {
  const [firmName, setFirmName] = useState("")
  const [firmAddress, setFirmAddress] = useState("")
  const [businessNature, setBusinessNature] = useState("")
  const [commencementDate, setCommencementDate] = useState("")
  const [duration, setDuration] = useState("")
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: "1",
      name: "",
      address: "",
      contribution: "",
      profitShare: "",
      panNumber: "",
    },
  ])

  const addPartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      name: "",
      address: "",
      contribution: "",
      profitShare: "",
      panNumber: "",
    }
    setPartners([...partners, newPartner])
  }

  const removePartner = (id: string) => {
    if (partners.length > 1) {
      setPartners(partners.filter((p) => p.id !== id))
    }
  }

  const updatePartner = (id: string, field: keyof Partner, value: string) => {
    setPartners(partners.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!firmName || !firmAddress || !businessNature) {
      toast.error("Please fill in all required firm details")
      return
    }

    const invalidPartner = partners.find((p) => !p.name || !p.address || !p.contribution || !p.profitShare)
    if (invalidPartner) {
      toast.error("Please fill in all partner details")
      return
    }

    // Generate partnership deed
    toast.success("Partnership deed generated successfully!")
    console.log("Partnership Deed Data:", {
      firmName,
      firmAddress,
      businessNature,
      commencementDate,
      duration,
      partners,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Partnership Deed Generator</h1>
        <p className="text-gray-600">Create a comprehensive partnership deed with AI assistance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Firm Details */}
        <Card>
          <CardHeader>
            <CardTitle>Firm Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firmName">Firm Name *</Label>
                <Input
                  id="firmName"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="Enter firm name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessNature">Nature of Business *</Label>
                <Input
                  id="businessNature"
                  value={businessNature}
                  onChange={(e) => setBusinessNature(e.target.value)}
                  placeholder="e.g., Trading, Manufacturing, Services"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="firmAddress">Firm Address *</Label>
              <Textarea
                id="firmAddress"
                value={firmAddress}
                onChange={(e) => setFirmAddress(e.target.value)}
                placeholder="Enter complete firm address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commencementDate">Commencement Date</Label>
                <Input
                  id="commencementDate"
                  type="date"
                  value={commencementDate}
                  onChange={(e) => setCommencementDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indefinite">Indefinite</SelectItem>
                    <SelectItem value="1_year">1 Year</SelectItem>
                    <SelectItem value="2_years">2 Years</SelectItem>
                    <SelectItem value="5_years">5 Years</SelectItem>
                    <SelectItem value="10_years">10 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partners Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partners Details</CardTitle>
              <Button type="button" onClick={addPartner} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {partners.map((partner, index) => (
              <div key={partner.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Partner {index + 1}</h3>
                  {partners.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removePartner(partner.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`partner-name-${partner.id}`}>Full Name *</Label>
                    <Input
                      id={`partner-name-${partner.id}`}
                      value={partner.name}
                      onChange={(e) => updatePartner(partner.id, "name", e.target.value)}
                      placeholder="Enter partner's full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`partner-pan-${partner.id}`}>PAN Number</Label>
                    <Input
                      id={`partner-pan-${partner.id}`}
                      value={partner.panNumber}
                      onChange={(e) => updatePartner(partner.id, "panNumber", e.target.value)}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`partner-address-${partner.id}`}>Address *</Label>
                  <Textarea
                    id={`partner-address-${partner.id}`}
                    value={partner.address}
                    onChange={(e) => updatePartner(partner.id, "address", e.target.value)}
                    placeholder="Enter partner's complete address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`partner-contribution-${partner.id}`}>Capital Contribution (₹) *</Label>
                    <Input
                      id={`partner-contribution-${partner.id}`}
                      type="number"
                      value={partner.contribution}
                      onChange={(e) => updatePartner(partner.id, "contribution", e.target.value)}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`partner-profit-${partner.id}`}>Profit Share (%) *</Label>
                    <Input
                      id={`partner-profit-${partner.id}`}
                      type="number"
                      value={partner.profitShare}
                      onChange={(e) => updatePartner(partner.id, "profitShare", e.target.value)}
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>

                {index < partners.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Generate Partnership Deed
          </Button>
        </div>
      </form>
    </div>
  )
}
