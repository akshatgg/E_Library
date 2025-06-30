export interface Suggestion {
  id: string
  type: "document" | "form" | "case_law" | "deadline" | "action" | "template"
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  relevanceScore: number
  actionUrl?: string
  dueDate?: string
  estimatedTime?: string
  tags: string[]
  reason: string
  benefits: string[]
}

export interface UserContext {
  recentDocuments: string[]
  activeProjects: string[]
  userRole: string
  preferences: Record<string, any>
  searchHistory: string[]
  documentTypes: string[]
  deadlines: Array<{ date: string; type: string }>
}

class SuggestionEngine {
  private suggestions: Suggestion[] = []

  async generateSuggestions(userContext: UserContext): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = []

    // Document-based suggestions
    suggestions.push(...this.getDocumentSuggestions(userContext))

    // Deadline-based suggestions
    suggestions.push(...this.getDeadlineSuggestions(userContext))

    // Form suggestions
    suggestions.push(...this.getFormSuggestions(userContext))

    // Case law suggestions
    suggestions.push(...this.getCaseLawSuggestions(userContext))

    // Action suggestions
    suggestions.push(...this.getActionSuggestions(userContext))

    // Sort by priority and relevance
    return suggestions.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.relevanceScore - a.relevanceScore
    })
  }

  private getDocumentSuggestions(context: UserContext): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Suggest completing incomplete documents
    if (context.recentDocuments.length > 0) {
      suggestions.push({
        id: "complete-draft",
        type: "document",
        title: "Complete Your Draft Documents",
        description: "You have 3 draft documents that need completion",
        priority: "medium",
        category: "Document Management",
        relevanceScore: 0.8,
        actionUrl: "/documents?filter=draft",
        estimatedTime: "15 minutes",
        tags: ["draft", "completion"],
        reason: "Based on your recent activity",
        benefits: ["Avoid deadline issues", "Maintain document workflow"],
      })
    }

    // Suggest document templates based on user role
    if (context.userRole === "tax_consultant") {
      suggestions.push({
        id: "tax-templates",
        type: "template",
        title: "New Tax Season Templates Available",
        description: "Updated templates for AY 2024-25 are now available",
        priority: "high",
        category: "Templates",
        relevanceScore: 0.9,
        actionUrl: "/templates/tax-season",
        tags: ["templates", "tax", "new"],
        reason: "Tax season is approaching",
        benefits: ["Save time", "Ensure compliance", "Use latest formats"],
      })
    }

    return suggestions
  }

  private getDeadlineSuggestions(context: UserContext): Suggestion[] {
    const suggestions: Suggestion[] = []
    const now = new Date()

    context.deadlines.forEach((deadline) => {
      const deadlineDate = new Date(deadline.date)
      const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntil <= 7 && daysUntil > 0) {
        suggestions.push({
          id: `deadline-${deadline.type}`,
          type: "deadline",
          title: `Upcoming ${deadline.type} Deadline`,
          description: `${deadline.type} is due in ${daysUntil} days`,
          priority: daysUntil <= 3 ? "urgent" : "high",
          category: "Deadlines",
          relevanceScore: 1.0 - daysUntil / 7,
          dueDate: deadline.date,
          tags: ["deadline", deadline.type.toLowerCase()],
          reason: "Approaching deadline",
          benefits: ["Avoid penalties", "Maintain compliance"],
        })
      }
    })

    return suggestions
  }

  private getFormSuggestions(context: UserContext): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Suggest forms based on document types
    if (context.documentTypes.includes("partnership")) {
      suggestions.push({
        id: "partnership-amendment",
        type: "form",
        title: "Partnership Deed Amendment",
        description: "Consider updating your partnership deed for the new financial year",
        priority: "medium",
        category: "Legal Forms",
        relevanceScore: 0.7,
        actionUrl: "/forms/partnership-amendment",
        estimatedTime: "30 minutes",
        tags: ["partnership", "amendment"],
        reason: "Based on your partnership documents",
        benefits: ["Legal compliance", "Updated terms"],
      })
    }

    // Suggest wealth certificate if high-value transactions
    suggestions.push({
      id: "wealth-certificate",
      type: "form",
      title: "Generate Wealth Certificate",
      description: "Create a comprehensive wealth certificate for loan applications",
      priority: "low",
      category: "Certificates",
      relevanceScore: 0.6,
      actionUrl: "/forms/wealth-certificate",
      estimatedTime: "20 minutes",
      tags: ["wealth", "certificate"],
      reason: "Commonly needed document",
      benefits: ["Loan applications", "Financial planning"],
    })

    return suggestions
  }

  private getCaseLawSuggestions(context: UserContext): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Suggest relevant case laws based on search history
    if (context.searchHistory.some((term) => term.includes("section 14A"))) {
      suggestions.push({
        id: "section-14a-cases",
        type: "case_law",
        title: "Latest Section 14A Judgments",
        description: "New ITAT decisions on Section 14A disallowance available",
        priority: "medium",
        category: "Case Law",
        relevanceScore: 0.8,
        actionUrl: "/case-laws/search?q=section+14A",
        tags: ["section-14a", "itat", "recent"],
        reason: "Based on your recent searches",
        benefits: ["Stay updated", "Strengthen arguments"],
      })
    }

    return suggestions
  }

  private getActionSuggestions(context: UserContext): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Suggest backup actions
    suggestions.push({
      id: "backup-documents",
      type: "action",
      title: "Backup Your Documents",
      description: "Last backup was 7 days ago. Secure your important documents.",
      priority: "medium",
      category: "Data Management",
      relevanceScore: 0.6,
      actionUrl: "/settings/backup",
      estimatedTime: "5 minutes",
      tags: ["backup", "security"],
      reason: "Regular backup recommended",
      benefits: ["Data security", "Peace of mind"],
    })

    // Suggest profile completion
    suggestions.push({
      id: "complete-profile",
      type: "action",
      title: "Complete Your Profile",
      description: "Add missing information to get personalized suggestions",
      priority: "low",
      category: "Profile",
      relevanceScore: 0.5,
      actionUrl: "/profile/edit",
      estimatedTime: "10 minutes",
      tags: ["profile", "setup"],
      reason: "Incomplete profile detected",
      benefits: ["Better suggestions", "Personalized experience"],
    })

    return suggestions
  }
}

export const suggestionEngine = new SuggestionEngine()
