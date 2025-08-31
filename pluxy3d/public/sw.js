// Service Worker optimizado para Pluxy3D
// Incrementa la versión si cambias la estrategia para invalidar caches antiguos
const CACHE_NAME = 'pluxy3d-v3'
const STATIC_CACHE = 'pluxy3d-static-v3'
const DYNAMIC_CACHE = 'pluxy3d-dynamic-v3'

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
  // Nota: evitamos API por completo; aquí solo patrones estáticos
]

// Recursos a no cachear
const EXCLUDE_PATTERNS = [
  /\/admin\//,
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

  // Ignorar cross-origin (APIs externas, backend en otro puerto, etc.)
  if (url.origin !== self.location.origin) return

  // Nunca interceptar endpoints de API locales
  if (url.pathname.startsWith('/api/')) return

  // Excluir patrones específicos
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(url.pathname))) return

  // Estrategia de cache agresiva para recursos optimizados
  if (STATIC_ASSETS.includes(url.pathname) ||
      DYNAMIC_PATTERNS.some(pattern => pattern.test(url.pathname + url.search))) {

    // Preferir red para mantener frescura; si falla, usar cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(async () => {
          const cached = await caches.match(request)
          if (cached) return cached
          // Fallback para offline
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
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
