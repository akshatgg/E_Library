# Multi-Category Kanoon Sync Cron Jobs

## 🎯 **Enhanced Features**

The Kanoon sync system now supports **category-specific syncing** with dedicated cron jobs for each legal category.

### **Categories & Search Queries:**

| Category | Search Query | Schedule |
|----------|-------------|----------|
| `ITAT` | `(ITAT)` | Every 48h at 02:00 |
| `GST` | `(GST)` | Every 48h at 06:00 |
| `INCOME_TAX` | `(income tax)` | Every 48h at 10:00 |
| `HIGH_COURT` | `(high court order)` | Every 48h at 14:00 |
| `SUPREME_COURT` | `(supreme court order)` | Every 48h at 18:00 |
| `TRIBUNAL_COURT` | `(tribunal)` | Every 48h at 22:00 |

## 🕐 **Cron Schedule (48-hour intervals)**

Each category is staggered by 4 hours to avoid API overload:

```bash
# ITAT: Every 2 days at 2:00 AM
0 2 */2 * *

# GST: Every 2 days at 6:00 AM  
0 6 */2 * *

# INCOME_TAX: Every 2 days at 10:00 AM
0 10 */2 * *

# HIGH_COURT: Every 2 days at 2:00 PM
0 14 */2 * *

# SUPREME_COURT: Every 2 days at 6:00 PM
0 18 */2 * *

# TRIBUNAL_COURT: Every 2 days at 10:00 PM
0 22 */2 * *
```

## 🚀 **Usage Examples**

### **Manual Category Sync:**
```bash
# Sync specific category
curl -X POST "http://localhost:4500/api/cron/kanoon-sync?category=ITAT" \
  -H "Authorization: Bearer kanoon-sync-secret-2025"

# Sync GST cases
curl -X POST "http://localhost:4500/api/cron/kanoon-sync?category=GST" \
  -H "Authorization: Bearer kanoon-sync-secret-2025"
```

### **Status Checking:**
```bash
# Get status for all categories
curl "http://localhost:4500/api/cron/kanoon-sync?all=true"

# Get status for specific category
curl "http://localhost:4500/api/cron/kanoon-sync?category=ITAT"

# Get overall status
curl "http://localhost:4500/api/cron/kanoon-sync"
```

## 📊 **Response Format**

### **Category Sync Response:**
```json
{
  "success": true,
  "message": "Sync completed successfully",
  "summary": {
    "category": "ITAT",
    "searchQuery": "(ITAT)",
    "newCaseLaws": 0,
    "updatedCaseLaws": 0,
    "newCaseDetails": 0,
    "updatedCaseDetails": 0,
    "errors": 0,
    "totalProcessed": 10,
    "syncTime": "2025-07-31T21:55:01.513Z"
  }
}
```

### **All Categories Status:**
```json
{
  "success": true,
  "status": {
    "overall": {
      "category": "ALL",
      "totalCases": 10,
      "totalDetails": 10,
      "lastSyncTime": "2025-07-31T20:16:22.385Z",
      "detailsCoverage": "100.00%"
    },
    "categories": [
      {
        "category": "ITAT",
        "totalCases": 5,
        "totalDetails": 10,
        "lastSyncTime": "2025-07-31T20:16:16.094Z",
        "detailsCoverage": "200.00%"
      },
      // ... other categories
    ]
  }
}
```

## ⚙️ **Configuration**

### **Environment Variables:**
```env
# Enable cron jobs
ENABLE_CRON_JOBS=true

# API security
CRON_SECRET=kanoon-sync-secret-2025

# Indian Kanoon API
NEXT_PUBLIC_KANOON_TOKEN=your_token
NEXT_PUBLIC_KANOON_URL=https://api.indiankanoon.org
```

### **Automatic Startup:**
The cron jobs automatically start when your Next.js application boots up:

```bash
🚀 Starting Kanoon sync cron jobs...
⏰ Each category scheduled to run every 48 hours
📅 Scheduling ITAT sync every 48 hours at 2:00
📅 Scheduling GST sync every 48 hours at 6:00
📅 Scheduling INCOME_TAX sync every 48 hours at 10:00
📅 Scheduling HIGH_COURT sync every 48 hours at 14:00
📅 Scheduling SUPREME_COURT sync every 48 hours at 18:00
📅 Scheduling TRIBUNAL_COURT sync every 48 hours at 22:00
✅ All category cron jobs scheduled successfully
```

## 🔍 **Smart Filtering**

The system now includes intelligent category filtering:
- Fetches cases using category-specific search queries
- Filters results to only process cases matching the target category
- Skips irrelevant cases to improve efficiency
- Provides detailed logging of skipped cases

## 📈 **Benefits**

1. **Focused Data Collection**: Each category gets targeted search queries
2. **Reduced API Load**: Staggered execution prevents API overload
3. **Better Organization**: Cases are properly categorized in the database
4. **Efficient Processing**: Only relevant cases are processed and stored
5. **Comprehensive Coverage**: All major legal categories are covered
6. **Monitoring**: Detailed status tracking per category

## 🛠 **Programmatic Usage**

```typescript
import { runManualSync, getSyncStatus, getAllCategoriesStatus } from '@/lib/cron-jobs/kanoon-sync';

// Sync specific category
const result = await runManualSync('ITAT');

// Get category status
const status = await getSyncStatus('GST');

// Get all categories status
const allStatus = await getAllCategoriesStatus();
```

This enhanced system ensures comprehensive and organized data collection from the Indian Kanoon API with proper categorization and efficient scheduling! 🎯
