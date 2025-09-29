// Resolve API base URL from env with a safe local fallback
// Resolve API base URL from env with a safe local fallback. NOTE: NEXT_PUBLIC_* vars are inlined at build time.
let API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5299/api'

// When running in a browser on a non-localhost origin, avoid accidentally calling a localhost dev server
// (this can trigger ad-blockers and cause ERR_BLOCKED_BY_CLIENT). Prefer a site-relative `/api` path.
import logger from './logger'

if (typeof window !== 'undefined') {
  try {
    const hostname = window.location.hostname
    // If the inlined env points to localhost but the site is not served from localhost, switch to site-relative API
    if (API_URL.startsWith('http://localhost') && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      API_URL = `${window.location.protocol}//${window.location.host}/api`
      logger.info('[apiFetch] Resolved API_URL to site-relative', API_URL)
    }
  } catch (e) {
    // ignore
  }
}

// Dev hint when env var is missing (preserve original behavior)
if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  logger.warn(
    "NEXT_PUBLIC_API_URL is not set; falling back to 'http://localhost:5299/api'. Set it in .env.local for correct environments."
  )
}

// Cache inteligente con TTL
interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

class ApiCache {
  private cache = new Map<string, CacheEntry>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  set(key: string, data: any, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  clear(): void {
    this.cache.clear()
  }

  // Limpiar entradas expiradas
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

const apiCache = new ApiCache()

// Limpiar cache cada 10 minutos
setInterval(() => apiCache.cleanup(), 10 * 60 * 1000)

// Simple in-flight dedupe to avoid double fetches
const inFlight = new Map<string, Promise<any>>();

export async function apiFetch(endpoint: string, options?: RequestInit & { cache?: boolean, ttl?: number }) {
  const key = `${options?.method || 'GET'} ${endpoint}`; 
  const shouldCache = options?.cache !== false && (options?.method || 'GET') === 'GET' 

  // Verificar cache primero
  if (shouldCache) {
    const cached = apiCache.get(key)
    if (cached) return cached
  }

  if (inFlight.has(key)) return inFlight.get(key);

  const p = (async () => { 
    try { 
      // Crear AbortController para timeout 
      const maxRetries = 2
      const startAll = Date.now()
      let lastErr: any
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 segundos timeout
        try {
          const fetchOptions = {
            ...options,
            signal: controller.signal
          }

          const res = await fetch(`${API_URL}${endpoint}`, fetchOptions)
          clearTimeout(timeoutId)
          if (!res.ok) {
            lastErr = new Error(`API error ${res.status}`)
          } else {
            const data = await res.json()
            // Log de latencia (dev only)
            if (process.env.NODE_ENV !== 'production') {
              logger.debug(`[apiFetch] ${endpoint} in ${Date.now() - startAll}ms`)
            }
            // Cachear respuesta exitosa 
            if (shouldCache) { 
              apiCache.set(key, data, options?.ttl) 
            } 
            return data
          }
        } catch (err: any) {
          lastErr = err
        } finally {
          clearTimeout(timeoutId)
        }
        // backoff simple
        await new Promise(r => setTimeout(r, 150 * (attempt + 1)))
      }

      // Si llega aquí, todos los intentos fallaron
      throw lastErr ?? new Error('API request failed')
    } catch (error) { 
      // Si es un timeout o error de red, usar fallback inmediatamente 
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))) { 
        logger.warn(`API timeout/network error for ${endpoint}, using fallback`) 
        // Fallbacks por endpoint 
        if (endpoint.startsWith('/carrito')) return []; 
        if (endpoint.startsWith('/productos')) return []; 
      } 

      // Fallbacks por endpoint para otros errores también
      if (endpoint.startsWith('/carrito')) return [];
      if (endpoint.startsWith('/productos')) return [];
      throw error;
    } finally {
      // Clear in-flight entry once settled
      inFlight.delete(key);
    }
  })(); 

  inFlight.set(key, p);
  return p;
}

// Función para limpiar cache manualmente
export function clearApiCache(): void {
  apiCache.clear()
}

// Función para obtener estadísticas del cache
export function getCacheStats(): { size: number, keys: string[] } {
  return {
    size: apiCache['cache'].size,
    keys: Array.from(apiCache['cache'].keys())
  }
}
