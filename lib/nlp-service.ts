"use client"

import { removeStopwords } from "stopword"
import type { CitationNode } from "./citation-network"

// Types for topic modeling
export interface Topic {
  id: string
  label: string
  keywords: string[]
  color: string
  cases: string[] // Case IDs belonging to this topic
}

// Predefined colors for topics
const TOPIC_COLORS = [
  "rgb(255, 99, 132)", // Red
  "rgb(54, 162, 235)", // Blue
  "rgb(255, 206, 86)", // Yellow
  "rgb(75, 192, 192)", // Teal
  "rgb(153, 102, 255)", // Purple
  "rgb(255, 159, 64)", // Orange
  "rgb(199, 199, 199)", // Gray
  "rgb(83, 102, 255)", // Indigo
  "rgb(78, 166, 134)", // Green
  "rgb(255, 99, 255)", // Pink
]

// Preprocess text for NLP
function preprocessText(text: string): string[] {
  // Convert to lowercase
  const lowercase = text.toLowerCase()

  // Remove special characters and numbers
  const cleanText = lowercase.replace(/[^\w\s]|[\d]/g, " ")

  // Tokenize
  const tokens = cleanText.split(/\s+/).filter((token) => token.length > 2)

  // Remove stopwords
  const filteredTokens = removeStopwords(tokens)

  return filteredTokens
}

// Calculate term frequency
function calculateTermFrequency(tokens: string[]): Record<string, number> {
  const termFreq: Record<string, number> = {}

  tokens.forEach((token) => {
    termFreq[token] = (termFreq[token] || 0) + 1
  })

  return termFreq
}

// Calculate TF-IDF
function calculateTfIdf(
  documents: Record<string, string[]>,
  documentTermFreqs: Record<string, Record<string, number>>,
): Record<string, Record<string, number>> {
  const tfIdf: Record<string, Record<string, number>> = {}
  const documentCount = Object.keys(documents).length

  // Calculate document frequency for each term
  const documentFrequency: Record<string, number> = {}

  Object.values(documentTermFreqs).forEach((termFreq) => {
    Object.keys(termFreq).forEach((term) => {
      documentFrequency[term] = (documentFrequency[term] || 0) + 1
    })
  })

  // Calculate TF-IDF for each document
  Object.entries(documentTermFreqs).forEach(([docId, termFreq]) => {
    tfIdf[docId] = {}

    Object.entries(termFreq).forEach(([term, freq]) => {
      // TF * IDF
      const tf = freq / documents[docId].length
      const idf = Math.log(documentCount / (documentFrequency[term] || 1))
      tfIdf[docId][term] = tf * idf
    })
  })

  return tfIdf
}

// Extract keywords from a document using TF-IDF
function extractKeywords(tfIdf: Record<string, number>, count = 10): string[] {
  return Object.entries(tfIdf)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([term]) => term)
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA: Record<string, number>, vecB: Record<string, number>): number {
  const commonTerms = Object.keys(vecA).filter((term) => term in vecB)

  if (commonTerms.length === 0) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  Object.entries(vecA).forEach(([term, value]) => {
    normA += value * value
    if (term in vecB) {
      dotProduct += value * vecB[term]
    }
  })

  Object.values(vecB).forEach((value) => {
    normB += value * value
  })

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// K-means clustering algorithm
function kMeansClustering(
  vectors: Record<string, Record<string, number>>,
  k: number,
  maxIterations = 10,
): Record<string, number> {
  const docIds = Object.keys(vectors)
  if (docIds.length <= k) {
    // If we have fewer documents than clusters, assign each to its own cluster
    return docIds.reduce(
      (acc, docId, index) => {
        acc[docId] = index
        return acc
      },
      {} as Record<string, number>,
    )
  }

  // Initialize centroids randomly
  const centroids: Record<string, number>[] = []
  const usedIndices = new Set<number>()

  for (let i = 0; i < k; i++) {
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * docIds.length)
    } while (usedIndices.has(randomIndex))

    usedIndices.add(randomIndex)
    centroids.push(vectors[docIds[randomIndex]])
  }

  // Assign documents to clusters
  const assignments: Record<string, number> = {}
  let iterations = 0
  let changed = true

  while (changed && iterations < maxIterations) {
    changed = false
    iterations++

    // Assign each document to the nearest centroid
    docIds.forEach((docId) => {
      const vector = vectors[docId]
      let maxSimilarity = -1
      let bestCluster = 0

      centroids.forEach((centroid, clusterIndex) => {
        const similarity = cosineSimilarity(vector, centroid)
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity
          bestCluster = clusterIndex
        }
      })

      if (assignments[docId] !== bestCluster) {
        changed = true
        assignments[docId] = bestCluster
      }
    })

    if (!changed) break

    // Recalculate centroids
    const newCentroids: Record<string, number>[] = Array(k)
      .fill(0)
      .map(() => ({}))
    const clusterSizes: number[] = Array(k).fill(0)

    docIds.forEach((docId) => {
      const cluster = assignments[docId]
      const vector = vectors[docId]
      clusterSizes[cluster]++

      Object.entries(vector).forEach(([term, value]) => {
        newCentroids[cluster][term] = (newCentroids[cluster][term] || 0) + value
      })
    })

    // Normalize centroids
    centroids.forEach((_, clusterIndex) => {
      if (clusterSizes[clusterIndex] > 0) {
        Object.keys(newCentroids[clusterIndex]).forEach((term) => {
          newCentroids[clusterIndex][term] /= clusterSizes[clusterIndex]
        })
      }
    })

    centroids.splice(0, centroids.length, ...newCentroids)
  }

  return assignments
}

// Generate topic labels based on the most significant terms
function generateTopicLabels(
  clusters: Record<string, number>,
  documents: Record<string, string[]>,
  documentTfIdf: Record<string, Record<string, number>>,
  k: number,
): string[] {
  const clusterDocuments: Record<number, string[]> = {}

  // Group documents by cluster
  Object.entries(clusters).forEach(([docId, cluster]) => {
    if (!clusterDocuments[cluster]) {
      clusterDocuments[cluster] = []
    }
    clusterDocuments[cluster].push(docId)
  })

  // Generate labels for each cluster
  const labels: string[] = []

  for (let i = 0; i < k; i++) {
    const docs = clusterDocuments[i] || []
    if (docs.length === 0) {
      labels.push(`Topic ${i + 1}`)
      continue
    }

    // Combine TF-IDF vectors for all documents in the cluster
    const combinedTfIdf: Record<string, number> = {}

    docs.forEach((docId) => {
      Object.entries(documentTfIdf[docId]).forEach(([term, value]) => {
        combinedTfIdf[term] = (combinedTfIdf[term] || 0) + value
      })
    })

    // Extract top keywords
    const keywords = extractKeywords(combinedTfIdf, 3)

    // Generate label
    labels.push(keywords.length > 0 ? keywords.join(", ") : `Topic ${i + 1}`)
  }

  return labels
}

// Main function to identify topics in a set of cases
export function identifyTopics(cases: CitationNode[], numTopics = 5): Topic[] {
  // Extract text from cases
  const caseTexts: Record<string, string> = {}
  cases.forEach((c) => {
    // Combine title and summary for better topic modeling
    caseTexts[c.id] = `${c.title} ${c.summary || ""}`
  })

  // Preprocess text
  const processedTexts: Record<string, string[]> = {}
  Object.entries(caseTexts).forEach(([id, text]) => {
    processedTexts[id] = preprocessText(text)
  })

  // Calculate term frequencies
  const termFrequencies: Record<string, Record<string, number>> = {}
  Object.entries(processedTexts).forEach(([id, tokens]) => {
    termFrequencies[id] = calculateTermFrequency(tokens)
  })

  // Calculate TF-IDF
  const tfIdf = calculateTfIdf(processedTexts, termFrequencies)

  // Cluster documents
  const clusters = kMeansClustering(tfIdf, numTopics)

  // Generate topic labels
  const topicLabels = generateTopicLabels(clusters, processedTexts, tfIdf, numTopics)

  // Create topic objects
  const topics: Topic[] = []

  for (let i = 0; i < numTopics; i++) {
    const topicCases = Object.entries(clusters)
      .filter(([_, cluster]) => cluster === i)
      .map(([docId]) => docId)

    if (topicCases.length === 0) continue

    // Extract keywords for this topic
    const combinedTfIdf: Record<string, number> = {}

    topicCases.forEach((docId) => {
      Object.entries(tfIdf[docId]).forEach(([term, value]) => {
        combinedTfIdf[term] = (combinedTfIdf[term] || 0) + value
      })
    })

    const keywords = extractKeywords(combinedTfIdf, 5)

    topics.push({
      id: `topic-${i}`,
      label: topicLabels[i],
      keywords,
      color: TOPIC_COLORS[i % TOPIC_COLORS.length],
      cases: topicCases,
    })
  }

  return topics
}

// Assign topics to cases
export function assignTopicsToCases(cases: CitationNode[], topics: Topic[]): CitationNode[] {
  const caseTopicMap: Record<string, Topic> = {}

  topics.forEach((topic) => {
    topic.cases.forEach((caseId) => {
      caseTopicMap[caseId] = topic
    })
  })

  return cases.map((c) => ({
    ...c,
    topicId: caseTopicMap[c.id]?.id,
    topicLabel: caseTopicMap[c.id]?.label,
    topicColor: caseTopicMap[c.id]?.color,
  }))
}
