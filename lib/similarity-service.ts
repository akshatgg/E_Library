"use client"

import type { CitationNode, CitationNetworkData, CitationTopic } from "./citation-network"

export interface SimilarCase {
  node: CitationNode
  similarityScore: number
  similarityReasons: string[]
}

// Calculate similarity between two cases based on multiple factors
export function calculateCaseSimilarity(
  caseA: CitationNode,
  caseB: CitationNode,
  network: CitationNetworkData,
): SimilarCase {
  const reasons: string[] = []
  let score = 0

  // 1. Topic similarity (highest weight)
  if (caseA.topicId && caseB.topicId && caseA.topicId === caseB.topicId) {
    score += 0.5
    reasons.push("Same topic")
  }

  // 2. Court similarity
  if (caseA.court === caseB.court) {
    score += 0.1
    reasons.push("Same court")
  }

  // 3. Time period similarity (cases within 5 years)
  const yearDiff = Math.abs(caseA.year - caseB.year)
  if (yearDiff <= 5) {
    const yearScore = 0.1 * (1 - yearDiff / 5)
    score += yearScore
    reasons.push(`Similar time period (${yearDiff} years apart)`)
  }

  // 4. Citation relationship
  const directCitation = network.links.some(
    (link) =>
      (link.source === caseA.id && link.target === caseB.id) || (link.source === caseB.id && link.target === caseA.id),
  )

  if (directCitation) {
    score += 0.2
    reasons.push("Direct citation relationship")
  }

  // 5. Co-citation analysis (cases that cite the same sources)
  const casesACites = network.links.filter((link) => link.source === caseA.id).map((link) => link.target)
  const casesBCites = network.links.filter((link) => link.source === caseB.id).map((link) => link.target)

  const commonCitations = casesACites.filter((id) => casesBCites.includes(id))
  if (commonCitations.length > 0) {
    const cocitationScore = Math.min(0.15, 0.05 * commonCitations.length)
    score += cocitationScore
    reasons.push(`Cites ${commonCitations.length} same case(s)`)
  }

  // 6. Text similarity (would be more sophisticated in a real implementation)
  // Here we're just checking if titles contain similar keywords
  const titleWordsA = caseA.title.toLowerCase().split(/\W+/)
  const titleWordsB = caseB.title.toLowerCase().split(/\W+/)
  const commonWords = titleWordsA.filter(
    (word) => word.length > 3 && titleWordsB.includes(word) && !["case", "versus", "the", "and", "with"].includes(word),
  )

  if (commonWords.length > 0) {
    const textScore = Math.min(0.15, 0.05 * commonWords.length)
    score += textScore
    reasons.push(`Similar keywords: ${commonWords.join(", ")}`)
  }

  return {
    node: caseB,
    similarityScore: Math.min(1, score), // Cap at 1.0
    similarityReasons: reasons,
  }
}

// Find similar cases for a given case
export function findSimilarCases(caseNode: CitationNode, network: CitationNetworkData, limit = 5): SimilarCase[] {
  // Calculate similarity with all other cases
  const similarities: SimilarCase[] = network.nodes
    .filter((node) => node.id !== caseNode.id) // Exclude the case itself
    .map((node) => calculateCaseSimilarity(caseNode, node, network))
    .filter((similar) => similar.similarityScore > 0) // Only include cases with some similarity
    .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity score
    .slice(0, limit) // Limit to the requested number of results

  return similarities
}

// Find cases with similar topics
export function findCasesWithSimilarTopics(topicId: string, network: CitationNetworkData, limit = 10): CitationNode[] {
  // Get the topic
  const topic = network.topics?.find((t) => t.id === topicId)
  if (!topic) return []

  // Get cases in this topic
  const casesInTopic = network.nodes.filter((node) => node.topicId === topicId)

  // If we don't have enough cases in this topic, find related topics
  if (casesInTopic.length < limit && network.topics) {
    // Calculate topic similarity based on keyword overlap
    const relatedTopics = network.topics
      .filter((t) => t.id !== topicId)
      .map((t) => {
        const commonKeywords = t.keywords.filter((kw) => topic.keywords.includes(kw))
        return {
          topic: t,
          similarity: commonKeywords.length / Math.max(1, Math.min(t.keywords.length, topic.keywords.length)),
        }
      })
      .filter((rt) => rt.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)

    // Get cases from related topics
    const relatedCases: CitationNode[] = []
    for (const relatedTopic of relatedTopics) {
      const casesInRelatedTopic = network.nodes.filter((node) => node.topicId === relatedTopic.topic.id)
      relatedCases.push(...casesInRelatedTopic)

      if (casesInTopic.length + relatedCases.length >= limit) break
    }

    // Combine cases from the original topic and related topics
    return [...casesInTopic, ...relatedCases].slice(0, limit)
  }

  return casesInTopic.slice(0, limit)
}

// Find topics similar to a given topic
export function findSimilarTopics(
  topicId: string,
  network: CitationNetworkData,
  limit = 3,
): { topic: CitationTopic; similarity: number }[] {
  // Get the topic
  const topic = network.topics?.find((t) => t.id === topicId)
  if (!topic || !network.topics) return []

  // Calculate topic similarity based on keyword overlap
  return network.topics
    .filter((t) => t.id !== topicId)
    .map((t) => {
      const commonKeywords = t.keywords.filter((kw) => topic.keywords.includes(kw))
      return {
        topic: t,
        similarity: commonKeywords.length / Math.max(1, Math.min(t.keywords.length, topic.keywords.length)),
      }
    })
    .filter((rt) => rt.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}
