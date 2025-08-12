# E-Library Prisma Database Setup

This document explains how to set up and use the Prisma database for storing case law data from the Indian Kanoon API.

## Overview

The Prisma schema is designed to store case law data fetched from the Indian Kanoon API. It includes:

1. **Cases**: Main table storing case information
2. **Citations**: Relationships between cases
3. **Analytics**: View/download statistics
4. **Notes**: User annotations
5. **Documents**: Additional case documents
6. **Sync Tracking**: API synchronization logs

## Setup Instructions

### 1. Install Dependencies

The required packages are already added to package.json:

```bash
npm install
# or
pnpm install
```

### 2. Database Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the DATABASE_URL in `.env`:

```env
# For PostgreSQL (recommended)
DATABASE_URL="postgresql://username:password@localhost:5432/elibrary_db"

# For MySQL
DATABASE_URL="mysql://username:password@localhost:3306/elibrary_db"

# For SQLite (development)
DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Apply Database Schema

For development (SQLite/direct DB access):
```bash
npm run db:push
```

For production (with migrations):
```bash
npm run db:migrate
```

### 5. Seed Sample Data (Optional)

```bash
npm run db:seed
```

### 6. Open Prisma Studio (Optional)

To view and edit data:
```bash
npm run db:studio
```

## API Usage

### Sync Cases from Indian Kanoon API

To fetch and store cases from the Indian Kanoon API:

```javascript
// Sync single page
POST /api/cases/sync
{
  "searchQuery": "(income tax appellate tribunal OR ITAT)",
  "pagenum": 0,
  "year": 2024
}

// Bulk sync multiple pages
POST /api/cases/sync
{
  "searchQuery": "(income tax appellate tribunal OR ITAT)",
  "sync": true,
  "pages": 5,
  "year": 2024
}
```

### Get Cases from Database

```javascript
// Get cases with filtering
GET /api/cases?page=1&limit=20&category=ITAT&year=2024&q=search

// Get specific case by TID
GET /api/cases/tid?tid=12345
```

## Data Structure

### Case Model Fields

```typescript
interface Case {
  // Core API fields
  tid: number              // Indian Kanoon TID
  title: string           // Case title
  headline: string        // Case summary
  publishdate: string     // Publication date
  docsource: string       // Source court/tribunal
  numcitedby: number      // Citation count
  docsize: number         // Document size
  
  // Processed fields
  category: CaseCategory  // ITAT, GST, etc.
  outcome: CaseOutcome    // allowed, dismissed, etc.
  court: string           // Court name
  bench: string           // Bench information
  caseNumber: string      // Case reference number
  appellant: string       // Appellant name
  respondent: string      // Respondent name
  
  // Content
  doc: string             // Full HTML content
  relevantSections: string[]
  keywords: string[]
  legalPoints: string[]
  
  // Metadata
  isProcessed: boolean    // Whether full content is fetched
  url: string            // Indian Kanoon URL
  pdfUrl: string         // PDF download URL
}
```

## Service Functions

The `case-service.ts` file provides these main functions:

### 1. Store Search Results
```typescript
import { storeCaseSearchResults } from '@/lib/case-service'

const cases = await storeCaseSearchResults(
  "(income tax appellate tribunal OR ITAT)",
  0, // page number
  2024 // year
)
```

### 2. Store Full Case Details
```typescript
import { storeFullCaseDetails } from '@/lib/case-service'

const fullCase = await storeFullCaseDetails(12345) // TID
```

### 3. Get Cases with Filtering
```typescript
import { getCases } from '@/lib/case-service'

const result = await getCases({
  page: 1,
  limit: 20,
  category: 'ITAT',
  year: '2024',
  searchQuery: 'section 14A'
})
```

### 4. Bulk Sync
```typescript
import { syncCasesFromAPI } from '@/lib/case-service'

const result = await syncCasesFromAPI(
  "(income tax appellate tribunal OR ITAT)",
  5, // pages
  2024 // year
)
```

## Data Flow

1. **Search Cases**: Use Indian Kanoon API to search cases
2. **Store Basic Info**: Store TID, title, headline, etc.
3. **Fetch Full Content**: Get complete case document by TID
4. **Extract Metadata**: Parse case number, parties, dates
5. **Update Database**: Store processed information
6. **Serve from DB**: Subsequent requests use database

## Benefits

1. **Performance**: Faster responses from local database
2. **Reliability**: Reduced API calls to Indian Kanoon
3. **Features**: Advanced search, filtering, analytics
4. **Offline**: Works without internet for stored cases
5. **Extensibility**: Add notes, tags, custom fields

## Monitoring

- Check sync status in `api_syncs` table
- Monitor case processing in `isProcessed` field
- View analytics in `case_analytics` table
- Track API usage and errors in logs

## Best Practices

1. **Rate Limiting**: Add delays between API calls
2. **Error Handling**: Log failed syncs for retry
3. **Caching**: Use database as primary source
4. **Incremental Sync**: Only fetch new/updated cases
5. **Backup**: Regular database backups
6. **Indexing**: Optimize queries with proper indexes
