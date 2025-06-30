// Client-side PDF caching without service workers

interface CachedPdf {
  id: string
  title: string
  url: string
  blob: Blob
  cachedAt: number
  size: number
}

class OfflinePdfCache {
  private dbName = "pdf-offline-cache"
  private dbVersion = 1
  private storeName = "pdfs"
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (typeof window === "undefined") return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" })
          store.createIndex("title", "title", { unique: false })
          store.createIndex("cachedAt", "cachedAt", { unique: false })
        }
      }
    })
  }

  async cachePdf(id: string, title: string, url: string): Promise<boolean> {
    try {
      if (!this.db) await this.init()

      // Fetch the PDF
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch PDF")

      const blob = await response.blob()
      const cachedPdf: CachedPdf = {
        id,
        title,
        url,
        blob,
        cachedAt: Date.now(),
        size: blob.size,
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.put(cachedPdf)

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to cache PDF:", error)
      return false
    }
  }

  async getCachedPdf(id: string): Promise<string | null> {
    try {
      if (!this.db) await this.init()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], "readonly")
        const store = transaction.objectStore(this.storeName)
        const request = store.get(id)

        request.onsuccess = () => {
          const result = request.result as CachedPdf
          if (result) {
            const url = URL.createObjectURL(result.blob)
            resolve(url)
          } else {
            resolve(null)
          }
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to get cached PDF:", error)
      return null
    }
  }

  async getAllCachedPdfs(): Promise<CachedPdf[]> {
    try {
      if (!this.db) await this.init()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], "readonly")
        const store = transaction.objectStore(this.storeName)
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to get all cached PDFs:", error)
      return []
    }
  }

  async removeCachedPdf(id: string): Promise<boolean> {
    try {
      if (!this.db) await this.init()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.delete(id)

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to remove cached PDF:", error)
      return false
    }
  }

  async isPdfCached(id: string): Promise<boolean> {
    try {
      if (!this.db) await this.init()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], "readonly")
        const store = transaction.objectStore(this.storeName)
        const request = store.get(id)

        request.onsuccess = () => resolve(!!request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to check if PDF is cached:", error)
      return false
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const cachedPdfs = await this.getAllCachedPdfs()
      return cachedPdfs.reduce((total, pdf) => total + pdf.size, 0)
    } catch (error) {
      console.error("Failed to get cache size:", error)
      return 0
    }
  }

  async clearCache(): Promise<boolean> {
    try {
      if (!this.db) await this.init()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.clear()

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to clear cache:", error)
      return false
    }
  }
}

// Export singleton instance
export const pdfCache = new OfflinePdfCache()
