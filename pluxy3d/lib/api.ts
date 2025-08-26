export const API_URL = 'http://localhost:5299/api';

// Simple in-flight dedupe to avoid double fetches for the same request
const inFlight = new Map<string, Promise<any>>();

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const key = `${options?.method || 'GET'} ${endpoint}`;
  if (inFlight.has(key)) return inFlight.get(key);

  const p = (async () => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, options);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json();
    } catch (error) {
      // Fallbacks por endpoint
      if (endpoint.startsWith('/carrito')) return [];
      if (endpoint.startsWith('/productos')) return [];
      return null;
    } finally {
      // Clear in-flight entry once settled
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, p);
  return p;
}
