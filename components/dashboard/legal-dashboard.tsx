"use client"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import type { UserContext } from "@/lib/suggestion-engine"

// Mock data for demonstration
const mockDocuments = [
  {
    id: "1",
    title: "Partnership Deed - ABC & Co",
    type: "partnership_deed",
    status: "approved",
    priority: "high",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "GST Return Filing",
    type: "gst_return",
    status: "pending_review",
    priority: "medium",
    createdAt: new Date().toISOString(),
  },
]

const mockCases = [
  {
    id: "1",
    title: "ITAT Delhi Case - Income Tax Appeal",
    court: "ITAT Delhi",
    year: "2024",
    category: "income_tax",
  },
]

const defaultUserContext: UserContext = {
  recentDocuments: ["doc1", "doc2"],
  activeProjects: ["project1"],
  userRole: "tax_consultant",
  preferences: {},
  searchHistory: ["tax", "gst"],
  documentTypes: ["partnership", "reply"],
  deadlines: [{ date: "2024-01-25", type: "ITR Filing" }],
}

export function LegalDashboard() {
  return <EnhancedDashboard />
}
