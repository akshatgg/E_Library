// Lightweight service worker registration

// Check if service workers are supported
export function isServiceWorkerSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator
}

// Register a minimal service worker for PDF caching
export async function registerMinimalServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    console.warn("Service workers are not supported in this browser")
    return null
  }

  try {
    // Create a minimal service worker that only caches PDFs
    const swCode = `
      // Minimal PDF Caching Service Worker
      const PDF_CACHE = 'pdf-cache-v1';
      
      // Cache PDFs on fetch
      self.addEventListener('fetch', event => {
        const url = new URL(event.request.url);
        const isPDF = url.pathname.endsWith('.pdf') || 
                      url.pathname.includes('/api/pdf/') ||
                      (event.request.headers.get('Accept') === 'application/pdf');
        
        if (isPDF) {
          event.respondWith(
            caches.open(PDF_CACHE).then(cache => {
              return cache.match(event.request).then(response => {
                if (response) {
                  // Return cached response
                  return response;
                }
                
                // Fetch and cache
                return fetch(event.request).then(networkResponse => {
                  if (networkResponse.ok) {
                    cache.put(event.request, networkResponse.clone());
                  }
                  return networkResponse;
                }).catch(error => {
                  console.error('Fetch failed:', error);
                  throw error;
                });
              });
            })
          );
        }
      });
      
      // Listen for cache PDF message
      self.addEventListener('message', event => {
        if (event.data && event.data.type === 'CACHE_PDF' && event.data.url) {
          caches.open(PDF_CACHE).then(cache => {
            fetch(event.data.url).then(response => {
              if (response.ok) {
                cache.put(event.data.url, response);
                event.ports[0].postMessage({ success: true });
              } else {
                event.ports[0].postMessage({ 
                  success: false, 
                  error: 'Failed to fetch PDF' 
                });
              }
            }).catch(error => {
              event.ports[0].postMessage({ 
                success: false, 
                error: error.message 
              });
            });
          });
        }
      });
    `

    // Create blob with correct MIME type
    const blob = new Blob([swCode], { type: "application/javascript" })
    const swUrl = URL.createObjectURL(blob)

    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: "/",
    })

    console.log("Minimal service worker registered")
    return registration
  } catch (error) {
    console.error("Service worker registration failed:", error)
    return null
  }
}

// Check if a PDF is cached
export async function isPdfCached(url: string): Promise<boolean> {
  if (!isServiceWorkerSupported()) return false

  try {
    const cache = await caches.open("pdf-cache-v1")
    const response = await cache.match(url)
    return !!response
  } catch (error) {
    console.error("Error checking cached PDF:", error)
    return false
  }
}

// Cache a PDF for offline use
export async function cachePdf(url: string): Promise<boolean> {
  if (!isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
    return false
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel()
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.success)
    }

    navigator.serviceWorker.controller.postMessage({ type: "CACHE_PDF", url }, [messageChannel.port2])
  })
}

// Get all cached PDFs
export async function getCachedPdfs(): Promise<string[]> {
  if (!isServiceWorkerSupported()) return []

  try {
    const cache = await caches.open("pdf-cache-v1")
    const keys = await cache.keys()
    return keys.map((request) => request.url)
  } catch (error) {
    console.error("Error getting cached PDFs:", error)
    return []
  }
}
