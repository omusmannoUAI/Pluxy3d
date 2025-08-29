// Service Worker optimizado para Pluxy3D
const CACHE_NAME = 'pluxy3d-v2'
const STATIC_CACHE = 'pluxy3d-static-v2'
const DYNAMIC_CACHE = 'pluxy3d-dynamic-v2'

// Recursos críticos a cachear inmediatamente
const STATIC_ASSETS = [
  '/',
  '/productos',
  '/manifest.json',
  '/favicon.ico'
]

// Patrones para cache dinámico optimizado
const DYNAMIC_PATTERNS = [
  /^\/_next\/static\//,
  /^\/_next\/image\?/,
  /\.(png|jpg|jpeg|gif|svg|webp|ico|avif)$/,
  /^\/api\//
]

// Recursos a no cachear
const EXCLUDE_PATTERNS = [
  /\/admin\//,
  /\/api\/analytics/,
  /\/_next\/webpack/,
  /hot-update/
]

self.addEventListener('install', (event) => {
  console.log('SW: Installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('SW: Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('SW: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Solo procesar GET requests
  if (request.method !== 'GET') return

  // Excluir patrones específicos
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(url.pathname))) return

  // Estrategia de cache agresiva para recursos optimizados
  if (STATIC_ASSETS.includes(url.pathname) ||
      DYNAMIC_PATTERNS.some(pattern => pattern.test(url.pathname + url.search))) {

    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Retornar cache inmediatamente y actualizar en background
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, response.clone())
              })
            }
          }).catch(() => {
            // Mantener cache existente si falla la actualización
          })
          return cachedResponse
        }

        // Si no está en cache, fetch y cachear
        return fetch(request).then((response) => {
          if (!response.ok) return response

          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        }).catch(() => {
          // Fallback para offline
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        })
      })
    )
  }
})

// Limpieza de cache optimizada
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    console.log('SW: Cleaning cache...')
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  }
})
