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

interface HUFMember {
  id: string
  name: string
  relation: string
  age: string
  panNumber: string
  share: string
}

export function HUFDeedForm() {
  const [hufName, setHufName] = useState("")
  const [kartaName, setKartaName] = useState("")
  const [kartaPan, setKartaPan] = useState("")
  const [hufAddress, setHufAddress] = useState("")
  const [totalAssets, setTotalAssets] = useState("")
  const [constitutionDate, setConstitutionDate] = useState("")
  const [members, setMembers] = useState<HUFMember[]>([
    {
      id: "1",
      name: "",
      relation: "",
      age: "",
      panNumber: "",
      share: "",
    },
  ])

  const addMember = () => {
    const newMember: HUFMember = {
      id: Date.now().toString(),
      name: "",
      relation: "",
      age: "",
      panNumber: "",
      share: "",
    }
    setMembers([...members, newMember])
  }

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id))
    }
  }

  const updateMember = (id: string, field: keyof HUFMember, value: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!hufName || !kartaName || !hufAddress) {
      toast.error("Please fill in all required HUF details")
      return
    }

    const invalidMember = members.find((m) => !m.name || !m.relation || !m.age)
    if (invalidMember) {
      toast.error("Please fill in all member details")
      return
    }

    toast.success("HUF deed generated successfully!")
    console.log("HUF Deed Data:", {
      hufName,
      kartaName,
      kartaPan,
      hufAddress,
      totalAssets,
      constitutionDate,
      members,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HUF Deed Generator</h1>
        <p className="text-gray-600">Create Hindu Undivided Family deed documents</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* HUF Details */}
        <Card>
          <CardHeader>
            <CardTitle>HUF Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hufName">HUF Name *</Label>
                <Input
                  id="hufName"
                  value={hufName}
                  onChange={(e) => setHufName(e.target.value)}
                  placeholder="Enter HUF name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="constitutionDate">Constitution Date</Label>
                <Input
                  id="constitutionDate"
                  type="date"
                  value={constitutionDate}
                  onChange={(e) => setConstitutionDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hufAddress">HUF Address *</Label>
              <Textarea
                id="hufAddress"
                value={hufAddress}
                onChange={(e) => setHufAddress(e.target.value)}
                placeholder="Enter complete HUF address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kartaName">Karta Name *</Label>
                <Input
                  id="kartaName"
                  value={kartaName}
                  onChange={(e) => setKartaName(e.target.value)}
                  placeholder="Enter Karta's full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="kartaPan">Karta PAN Number</Label>
                <Input
                  id="kartaPan"
                  value={kartaPan}
                  onChange={(e) => setKartaPan(e.target.value)}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="totalAssets">Total Assets Value (₹)</Label>
              <Input
                id="totalAssets"
                type="number"
                value={totalAssets}
                onChange={(e) => setTotalAssets(e.target.value)}
                placeholder="Enter total asset value"
              />
            </div>
          </CardContent>
        </Card>

        {/* Members Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>HUF Members</CardTitle>
              <Button type="button" onClick={addMember} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {members.map((member, index) => (
              <div key={member.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Member {index + 1}</h3>
                  {members.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`member-name-${member.id}`}>Full Name *</Label>
                    <Input
                      id={`member-name-${member.id}`}
                      value={member.name}
                      onChange={(e) => updateMember(member.id, "name", e.target.value)}
                      placeholder="Enter member's name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`member-relation-${member.id}`}>Relation to Karta *</Label>
                    <Select
                      value={member.relation}
                      onValueChange={(value) => updateMember(member.id, "relation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="son">Son</SelectItem>
                        <SelectItem value="daughter">Daughter</SelectItem>
                        <SelectItem value="wife">Wife</SelectItem>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="brother">Brother</SelectItem>
                        <SelectItem value="sister">Sister</SelectItem>
                        <SelectItem value="grandson">Grandson</SelectItem>
                        <SelectItem value="granddaughter">Granddaughter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`member-age-${member.id}`}>Age *</Label>
                    <Input
                      id={`member-age-${member.id}`}
                      type="number"
                      value={member.age}
                      onChange={(e) => updateMember(member.id, "age", e.target.value)}
                      placeholder="Age"
                      min="0"
                      max="120"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`member-pan-${member.id}`}>PAN Number</Label>
                    <Input
                      id={`member-pan-${member.id}`}
                      value={member.panNumber}
                      onChange={(e) => updateMember(member.id, "panNumber", e.target.value)}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`member-share-${member.id}`}>Share (%)</Label>
                    <Input
                      id={`member-share-${member.id}`}
                      type="number"
                      value={member.share}
                      onChange={(e) => updateMember(member.id, "share", e.target.value)}
                      placeholder="Share percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {index < members.length - 1 && <Separator />}
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
            Generate HUF Deed
          </Button>
        </div>
      </form>
    </div>
  )
}
