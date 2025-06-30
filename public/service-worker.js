// Service Worker for E-Library Application
const CACHE_NAME = "elibrary-cache-v1"
const PDF_CACHE_NAME = "elibrary-pdf-cache-v1"
const STATIC_ASSETS = ["/", "/index.html", "/styles/globals.css", "/styles/pdf-viewer.css"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME, PDF_CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Helper function to determine if a request is for a PDF
function isPdfRequest(request) {
  // Check if URL ends with .pdf or contains /api/pdf/
  return (
    request.url.endsWith(".pdf") ||
    request.url.includes("/api/pdf/") ||
    (request.headers && request.headers.get("Accept") === "application/pdf")
  )
}

// Helper function to determine if a request is for an API
function isApiRequest(request) {
  return new URL(request.url).pathname.startsWith("/api/")
}

// Helper function to determine if a request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url)
  return STATIC_ASSETS.includes(url.pathname)
}

// Fetch event - handle requests
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Different strategies based on request type
  if (isPdfRequest(event.request)) {
    // PDF files - Cache then network with offline fallback
    event.respondWith(handlePdfRequest(event.request))
  } else if (isApiRequest(event.request)) {
    // API requests - Network first with timeout fallback
    event.respondWith(handleApiRequest(event.request))
  } else if (isStaticAsset(event.request)) {
    // Static assets - Cache first
    event.respondWith(handleStaticRequest(event.request))
  } else {
    // Everything else - Network first with cache fallback
    event.respondWith(handleDefaultRequest(event.request))
  }
})

// Handle PDF requests - Cache then network with offline fallback
async function handlePdfRequest(request) {
  // Try to get from cache first
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    // Return cached response and update cache in background
    updatePdfCache(request)
    return cachedResponse
  }

  // If not in cache, try network
  try {
    const networkResponse = await fetch(request)
    // Cache the response for future use
    const responseToCache = networkResponse.clone()
    caches.open(PDF_CACHE_NAME).then((cache) => {
      cache.put(request, responseToCache)
      // Notify clients that a new PDF has been cached
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "PDF_CACHED",
            url: request.url,
          })
        })
      })
    })
    return networkResponse
  } catch (error) {
    console.error("Failed to fetch PDF:", error)
    // If network fails, return offline PDF placeholder
    return caches.match("/offline-pdf.pdf")
  }
}

// Update PDF cache in background
async function updatePdfCache(request) {
  try {
    const cache = await caches.open(PDF_CACHE_NAME)
    const networkResponse = await fetch(request)
    await cache.put(request, networkResponse)
    console.log("Updated cached PDF:", request.url)
  } catch (error) {
    console.error("Failed to update PDF cache:", error)
  }
}

// Handle API requests - Network first with timeout fallback
async function handleApiRequest(request) {
  try {
    // Try network first with a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Network request timed out")), 3000)
    })
    const networkResponse = await Promise.race([fetch(request), timeoutPromise])
    return networkResponse
  } catch (error) {
    console.error("API request failed:", error)
    // For API requests, check if we have a cached response
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // If no cached response, return a JSON error
    return new Response(
      JSON.stringify({
        error: "Network request failed",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Handle static asset requests - Cache first
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  try {
    const networkResponse = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    console.error("Failed to fetch static asset:", error)
    // Return a fallback for HTML requests
    if (request.headers.get("Accept").includes("text/html")) {
      return caches.match("/offline.html")
    }
    // Otherwise just fail
    throw error
  }
}

// Handle default requests - Network first with cache fallback
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    console.error("Network request failed:", error)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // Return offline page for HTML requests
    if (request.headers.get("Accept").includes("text/html")) {
      return caches.match("/offline.html")
    }
    throw error
  }
}

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_PDF") {
    // Manually cache a PDF
    const pdfUrl = event.data.url
    console.log("Manually caching PDF:", pdfUrl)
    event.waitUntil(
      caches.open(PDF_CACHE_NAME).then((cache) => {
        return fetch(pdfUrl)
          .then((response) => {
            return cache.put(pdfUrl, response)
          })
          .then(() => {
            // Notify the client that caching is complete
            event.source.postMessage({
              type: "PDF_CACHED",
              url: pdfUrl,
              success: true,
            })
          })
          .catch((error) => {
            console.error("Failed to cache PDF:", error)
            event.source.postMessage({
              type: "PDF_CACHED",
              url: pdfUrl,
              success: false,
              error: error.message,
            })
          })
      }),
    )
  } else if (event.data && event.data.type === "REMOVE_CACHED_PDF") {
    // Remove a PDF from cache
    const pdfUrl = event.data.url
    console.log("Removing PDF from cache:", pdfUrl)
    event.waitUntil(
      caches.open(PDF_CACHE_NAME).then((cache) => {
        return cache.delete(pdfUrl).then((success) => {
          event.source.postMessage({
            type: "PDF_REMOVED",
            url: pdfUrl,
            success,
          })
        })
      }),
    )
  } else if (event.data && event.data.type === "CLEAR_PDF_CACHE") {
    // Clear all cached PDFs
    console.log("Clearing PDF cache")
    event.waitUntil(
      caches.delete(PDF_CACHE_NAME).then((success) => {
        event.source.postMessage({
          type: "PDF_CACHE_CLEARED",
          success,
        })
      }),
    )
  }
})
