// API Configuration for Government Legal Databases
export const API_CONFIG = {
  // Indian Government APIs
  SUPREME_COURT: {
    baseUrl: "https://main.sci.gov.in/api",
    keyRequired: false, // Public API
    rateLimit: 100, // requests per hour
    documentation: "https://main.sci.gov.in/api-docs",
  },

  HIGH_COURTS: {
    baseUrl: "https://hcservices.ecourts.gov.in/api",
    keyRequired: true,
    apiKeyHeader: "X-API-Key",
    rateLimit: 500,
    documentation: "https://ecourts.gov.in/api-documentation",
  },

  ITAT: {
    baseUrl: "https://itat.gov.in/api",
    keyRequired: true,
    apiKeyHeader: "Authorization",
    authType: "Bearer",
    rateLimit: 200,
    documentation: "https://itat.gov.in/api-guide",
  },

  INCOME_TAX_DEPT: {
    baseUrl: "https://www.incometaxindia.gov.in/api",
    keyRequired: true,
    apiKeyHeader: "X-CBDT-API-Key",
    rateLimit: 300,
    documentation: "https://incometaxindia.gov.in/developer",
  },

  // Commercial Legal APIs
  INDIAN_KANOON: {
    baseUrl: "https://api.indiankanoon.org",
    keyRequired: true,
    apiKeyHeader: "X-API-Key",
    rateLimit: 1000,
    pricing: "Free tier: 100 requests/day, Paid: ₹5000/month",
    documentation: "https://indiankanoon.org/api",
  },

  MANUPATRA: {
    baseUrl: "https://api.manupatra.com",
    keyRequired: true,
    apiKeyHeader: "Authorization",
    authType: "Bearer",
    rateLimit: 2000,
    pricing: "₹15000/month for full access",
    documentation: "https://manupatra.com/api-docs",
  },

  SCC_ONLINE: {
    baseUrl: "https://api.scconline.com",
    keyRequired: true,
    apiKeyHeader: "X-SCC-API-Key",
    rateLimit: 1500,
    pricing: "₹12000/month",
    documentation: "https://scconline.com/api-documentation",
  },

  WESTLAW_INDIA: {
    baseUrl: "https://api.westlawindia.com",
    keyRequired: true,
    apiKeyHeader: "Authorization",
    authType: "Bearer",
    rateLimit: 3000,
    pricing: "₹25000/month",
    documentation: "https://westlawindia.com/api",
  },

  // Additional Government APIs
  LAW_MINISTRY: {
    baseUrl: "https://legislative.gov.in/api",
    keyRequired: true,
    apiKeyHeader: "X-Legislative-Key",
    rateLimit: 200,
    documentation: "https://legislative.gov.in/api-docs",
  },

  NATIONAL_JUDICIAL_DATA_GRID: {
    baseUrl: "https://njdg.ecourts.gov.in/api",
    keyRequired: true,
    apiKeyHeader: "X-NJDG-Key",
    rateLimit: 500,
    documentation: "https://njdg.ecourts.gov.in/api-guide",
  },
}

// Environment variable mapping
export const ENV_KEYS = {
  HIGH_COURTS_API_KEY: "HIGH_COURTS_API_KEY",
  ITAT_API_KEY: "ITAT_API_KEY",
  INCOME_TAX_API_KEY: "INCOME_TAX_API_KEY",
  INDIAN_KANOON_API_KEY: "INDIAN_KANOON_API_KEY",
  MANUPATRA_API_KEY: "MANUPATRA_API_KEY",
  SCC_ONLINE_API_KEY: "SCC_ONLINE_API_KEY",
  WESTLAW_INDIA_API_KEY: "WESTLAW_INDIA_API_KEY",
  LAW_MINISTRY_API_KEY: "LAW_MINISTRY_API_KEY",
  NJDG_API_KEY: "NJDG_API_KEY",
}

// API Key validation
export function validateApiKeys(): { [key: string]: boolean } {
  const status: { [key: string]: boolean } = {}

  Object.entries(ENV_KEYS).forEach(([name, envKey]) => {
    status[name] = !!process.env[envKey]
  })

  return status
}

// Get API configuration with keys
export function getApiConfig(service: keyof typeof API_CONFIG) {
  const config = API_CONFIG[service]
  const envKey = ENV_KEYS[`${service}_API_KEY` as keyof typeof ENV_KEYS]

  return {
    ...config,
    apiKey: process.env[envKey],
    isConfigured: !!process.env[envKey],
  }
}
