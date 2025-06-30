import { RealApiService } from "./real-api-service"
import { API_CONFIG, validateApiKeys } from "./api-config"

export interface ApiTestResult {
  service: string
  status: "success" | "error" | "warning"
  message: string
  responseTime?: number
  rateLimit?: {
    remaining: number
    reset: string
  }
}

export class ApiTestingService {
  static async testAllApis(): Promise<ApiTestResult[]> {
    const results: ApiTestResult[] = []
    const keyStatus = validateApiKeys()

    // Test each API service
    for (const [serviceName, hasKey] of Object.entries(keyStatus)) {
      if (!hasKey) {
        results.push({
          service: serviceName,
          status: "warning",
          message: "API key not configured",
        })
        continue
      }

      try {
        const result = await this.testApiService(serviceName)
        results.push(result)
      } catch (error) {
        results.push({
          service: serviceName,
          status: "error",
          message: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
      }
    }

    return results
  }

  private static async testApiService(serviceName: string): Promise<ApiTestResult> {
    const startTime = Date.now()

    try {
      let testResult

      switch (serviceName) {
        case "HIGH_COURTS_API_KEY":
          testResult = await RealApiService.searchHighCourts("test", "ALL", { limit: 1 })
          break
        case "ITAT_API_KEY":
          testResult = await RealApiService.searchITAT("test", { limit: 1 })
          break
        case "INCOME_TAX_API_KEY":
          testResult = await RealApiService.searchIncomeTax("test", { limit: 1 })
          break
        case "INDIAN_KANOON_API_KEY":
          testResult = await RealApiService.searchIndianKanoon("test", { limit: 1 })
          break
        default:
          throw new Error("Unknown service")
      }

      const responseTime = Date.now() - startTime

      return {
        service: serviceName,
        status: "success",
        message: `API connection successful. Retrieved ${testResult.length} test results.`,
        responseTime,
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      return {
        service: serviceName,
        status: "error",
        message: `API test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        responseTime,
      }
    }
  }

  static async checkRateLimits(): Promise<{ [service: string]: any }> {
    const rateLimits: { [service: string]: any } = {}

    // This would typically be stored in a database or cache
    // For now, we'll return mock data
    Object.keys(API_CONFIG).forEach((service) => {
      rateLimits[service] = {
        limit: API_CONFIG[service as keyof typeof API_CONFIG].rateLimit,
        remaining: Math.floor(Math.random() * API_CONFIG[service as keyof typeof API_CONFIG].rateLimit),
        resetTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      }
    })

    return rateLimits
  }
}
