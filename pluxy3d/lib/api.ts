// Resolve API base URL from env with a safe local fallback
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5299/api';

// Dev hint when env var is missing
if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  // eslint-disable-next-line no-console
  console.warn(
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
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 segundos timeout

      const fetchOptions = {
        ...options,
        signal: controller.signal
      }

      const res = await fetch(`${API_URL}${endpoint}`, fetchOptions);
      clearTimeout(timeoutId)

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();

      // Cachear respuesta exitosa
      if (shouldCache) {
        apiCache.set(key, data, options?.ttl)
      }

      return data;
    } catch (error) {
      // Si es un timeout o error de red, usar fallback inmediatamente
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))) {
        console.warn(`API timeout/network error for ${endpoint}, using fallback`)
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
