"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
}

export function AdvancedFilters({ isOpen, onClose, onApplyFilters }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    courts: [] as string[],
    sections: [] as string[],
    keywords: "",
    caseStatus: [] as string[],
    impactLevel: [] as string[],
    precedentValue: [1, 5] as number[],
  })

  const availableCourts = [
    "Supreme Court",
    "Delhi High Court",
    "Mumbai High Court",
    "Calcutta High Court",
    "ITAT Delhi",
    "ITAT Mumbai",
    "CESTAT",
  ]

  const availableSections = [
    "Section 14A",
    "Section 68",
    "Section 54",
    "Section 194",
    "Section 143",
    "Section 271",
    "Rule 8D",
    "Rule 36",
  ]

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleClearFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      courts: [],
      sections: [],
      keywords: "",
      caseStatus: [],
      impactLevel: [],
      precedentValue: [1, 5],
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, from: date },
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, to: date },
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Additional Keywords</Label>
              <Input
                placeholder="Enter keywords separated by commas"
                value={filters.keywords}
                onChange={(e) => setFilters((prev) => ({ ...prev, keywords: e.target.value }))}
              />
            </div>

            {/* Courts */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Courts</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableCourts.map((court) => (
                  <div key={court} className="flex items-center space-x-2">
                    <Checkbox
                      id={court}
                      checked={filters.courts.includes(court)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters((prev) => ({ ...prev, courts: [...prev.courts, court] }))
                        } else {
                          setFilters((prev) => ({ ...prev, courts: prev.courts.filter((c) => c !== court) }))
                        }
                      }}
                    />
                    <Label htmlFor={court} className="text-sm">
                      {court}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Relevant Sections</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableSections.map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={section}
                      checked={filters.sections.includes(section)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters((prev) => ({ ...prev, sections: [...prev.sections, section] }))
                        } else {
                          setFilters((prev) => ({ ...prev, sections: prev.sections.filter((s) => s !== section) }))
                        }
                      }}
                    />
                    <Label htmlFor={section} className="text-sm">
                      {section}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Status */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Case Status</Label>
              <div className="flex flex-wrap gap-2">
                {["ALLOWED", "DISMISSED", "PARTLY ALLOWED", "REMANDED"].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={status}
                      checked={filters.caseStatus.includes(status)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters((prev) => ({ ...prev, caseStatus: [...prev.caseStatus, status] }))
                        } else {
                          setFilters((prev) => ({ ...prev, caseStatus: prev.caseStatus.filter((s) => s !== status) }))
                        }
                      }}
                    />
                    <Label htmlFor={status} className="text-sm">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Level */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Impact Level</Label>
              <div className="flex gap-4">
                {["High", "Medium", "Low"].map((impact) => (
                  <div key={impact} className="flex items-center space-x-2">
                    <Checkbox
                      id={impact}
                      checked={filters.impactLevel.includes(impact)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters((prev) => ({ ...prev, impactLevel: [...prev.impactLevel, impact] }))
                        } else {
                          setFilters((prev) => ({ ...prev, impactLevel: prev.impactLevel.filter((i) => i !== impact) }))
                        }
                      }}
                    />
                    <Label htmlFor={impact} className="text-sm">
                      {impact}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Precedent Value Slider */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Precedent Value: {filters.precedentValue[0]} - {filters.precedentValue[1]}
            </Label>
            <Slider
              value={filters.precedentValue}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, precedentValue: value }))}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          {/* Active Filters Preview */}
          {(filters.courts.length > 0 || filters.sections.length > 0 || filters.caseStatus.length > 0) && (
            <div className="space-y-2">
              <Label className="text-base font-medium">Active Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {filters.courts.map((court) => (
                  <Badge key={court} variant="secondary">
                    {court}
                  </Badge>
                ))}
                {filters.sections.map((section) => (
                  <Badge key={section} variant="secondary">
                    {section}
                  </Badge>
                ))}
                {filters.caseStatus.map((status) => (
                  <Badge key={status} variant="secondary">
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
