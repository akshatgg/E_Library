import { prisma } from './prisma'
import { fetchIndianKanoonData, fetchCaseByTid, IKanoonResult } from './kanoon-api'

// Map docsource to category
export function mapDocSourceToCategory(docsource: string): string {
  const source = docsource.toLowerCase()
  
  if (source.includes('itat') || source.includes('income tax appellate tribunal')) {
    return 'ITAT'
  }
  if (source.includes('gst') || source.includes('goods and services tax') || source.includes('cestat')) {
    return 'GST'
  }
  if (source.includes('income tax') || source.includes('income-tax')) {
    return 'INCOME_TAX'
  }
  if (source.includes('high court')) {
    return 'HIGH_COURT'
  }
  if (source.includes('supreme court')) {
    return 'SUPREME_COURT'
  }
  
  return 'OTHER'
}

// Store basic case laws from search results (Table 1)
export async function storeCaseLaws(
  searchQuery: string,
  pagenum: number = 0,
  year?: number
) {
  try {
    console.log(`Fetching and storing case laws for query: "${searchQuery}", page: ${pagenum}`)
    
    // Fetch data from Indian Kanoon API
    const results = await fetchIndianKanoonData({
      formInput: searchQuery,
      pagenum,
      year
    })
    
    console.log(`Fetched ${results.length} cases from API`)
    
    // Process and store each case
    const storedCases = []
    
    for (const item of results) {
      try {
        const cleanTitle = item.title?.replace(/<[^>]+>/g, '') || ''
        const cleanHeadline = item.headline?.replace(/<[^>]+>/g, '') || ''
        
        // Check if case already exists
        const existingCase = await prisma.caseLaw.findUnique({
          where: { tid: item.tid }
        })
        
        const caseData = {
          tid: item.tid,
          title: cleanTitle,
          court: item.docsource || 'Unknown',
          date: item.publishdate || '',
          bench: '', // item.bench is not in search results
          category: mapDocSourceToCategory(item.docsource || '') as any,
          outcome: 'allowed' as any,
          appellant: '',
          respondent: '',
          caseNumber: item.tid.toString(),
          summary: cleanHeadline,
          url: `https://indiankanoon.org/doc/${item.tid}`,
          relevantSections: [],
          keywords: [],
          legalPoints: [],
        }
        
        if (existingCase) {
          console.log(`Case TID ${item.tid} already exists, updating...`)
          
          const updatedCase = await prisma.caseLaw.update({
            where: { tid: item.tid },
            data: caseData
          })
          
          storedCases.push(updatedCase)
        } else {
          console.log(`Creating new case TID ${item.tid}`)
          
          const newCase = await prisma.caseLaw.create({
            data: caseData
          })
          
          storedCases.push(newCase)
        }
      } catch (error) {
        console.error(`Error storing case TID ${item.tid}:`, error)
      }
    }
    
    console.log(`Successfully stored ${storedCases.length} case laws`)
    return storedCases
    
  } catch (error) {
    console.error('Error in storeCaseLaws:', error)
    throw error
  }
}

// Store detailed case data (Table 2)
export async function storeCaseDetail(tid: number) {
  try {
    console.log(`Fetching and storing case detail for TID: ${tid}`)
    
    // Fetch full case data from Indian Kanoon API
    const caseData = await fetchCaseByTid(tid)
    
    if (!caseData?.success) {
      throw new Error(`Failed to fetch case data for TID ${tid}`)
    }
    
    // Check if case detail already exists
    const existingDetail = await prisma.caseDetail.findUnique({
      where: { tid }
    })
    
    const detailData = {
      tid,
      publishdate: caseData.data.publishdate || '',
      title: caseData.data.title || '',
      doc: caseData.data.doc || '',
      numcites: caseData.data.numcites || 0,
      numcitedby: caseData.data.numcitedby || 0,
      docsource: caseData.data.docsource || '',
      citetid: caseData.data.citetid || null,
      divtype: caseData.data.divtype || null,
      courtcopy: caseData.data.courtcopy || false,
      agreement: caseData.data.agreement || false,
      queryAlert: caseData.data.query_alert || null,
    }
    
    let caseDetail
    
    if (existingDetail) {
      console.log(`Case detail TID ${tid} already exists, updating...`)
      caseDetail = await prisma.caseDetail.update({
        where: { tid },
        data: detailData
      })
    } else {
      console.log(`Creating new case detail TID ${tid}`)
      caseDetail = await prisma.caseDetail.create({
        data: detailData
      })
    }
    
    console.log(`Successfully stored case detail for TID ${tid}`)
    return caseDetail
    
  } catch (error) {
    console.error(`Error storing case detail for TID ${tid}:`, error)
    throw error
  }
}

// Get case laws with filtering and pagination (Table 1)
export async function getCaseLaws(options: {
  page?: number
  limit?: number
  category?: string
  year?: string
  searchQuery?: string
  sortBy?: 'date' | 'tid' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
} = {}) {
  const {
    page = 1,
    limit = 20,
    category,
    year,
    searchQuery,
    sortBy = 'date',
    sortOrder = 'desc'
  } = options
  
  const skip = (page - 1) * limit
  
  // Build where clause
  const where: any = {}
  
  if (category && category !== 'all' && category !== 'OTHER') {
    where.category = category
  }
  
  if (year && year !== 'all') {
    where.date = {
      contains: year
    }
  }
  
  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { summary: { contains: searchQuery, mode: 'insensitive' } },
      { court: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }
  
  // Get cases with pagination
  const [cases, total] = await Promise.all([
    prisma.caseLaw.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        caseDetail: {
          select: {
            numcitedby: true,
            divtype: true,
            courtcopy: true
          }
        }
      }
    }),
    prisma.caseLaw.count({ where })
  ])
  
  return {
    cases,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: skip + cases.length < total
  }
}

// Get case law with its detail by TID
export async function getCaseLawByTid(tid: number) {
  const caseLaw = await prisma.caseLaw.findUnique({
    where: { tid },
    include: {
      caseDetail: true
    }
  })
  
  return caseLaw
}

// Get case detail by TID (Table 2)
export async function getCaseDetailByTid(tid: number) {
  // First ensure we have the basic case law entry
  let caseLaw = await prisma.caseLaw.findUnique({
    where: { tid }
  })
  
  // If no basic case law exists, we can't fetch detail
  if (!caseLaw) {
    throw new Error(`Case law with TID ${tid} not found. Please fetch basic case data first.`)
  }
  
  // Check if detail already exists
  let caseDetail = await prisma.caseDetail.findUnique({
    where: { tid },
    include: {
      caseLaw: true
    }
  })
  
  // If detail doesn't exist, fetch and store it
  if (!caseDetail) {
    await storeCaseDetail(tid)
    caseDetail = await prisma.caseDetail.findUnique({
      where: { tid },
      include: {
        caseLaw: true
      }
    })
  }
  
  return caseDetail
}

// Bulk sync cases from API to database
export async function syncCasesFromAPI(
  searchQuery: string,
  pages: number = 5,
  year?: number
) {
  try {
    console.log(`Starting sync for query: "${searchQuery}", pages: ${pages}`)
    
    let totalSynced = 0
    
    // Sync multiple pages
    for (let page = 0; page < pages; page++) {
      console.log(`Syncing page ${page + 1}/${pages}`)
      
      const storedCases = await storeCaseLaws(searchQuery, page, year)
      totalSynced += storedCases.length
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(`Sync completed. Total cases synced: ${totalSynced}`)
    return { success: true, synced: totalSynced }
    
  } catch (error) {
    console.error('Error in syncCasesFromAPI:', error)
    throw error
  }
}

// Get statistics
export async function getCaseStatistics() {
  const stats = await prisma.caseLaw.groupBy({
    by: ['category'],
    _count: {
      category: true
    }
  })
  
  const total = await prisma.caseLaw.count()
  
  const categoryCounts = stats.reduce((acc, stat) => {
    acc[stat.category] = stat._count.category
    return acc
  }, {} as Record<string, number>)
  
  return {
    total,
    categoryCounts
  }
}
