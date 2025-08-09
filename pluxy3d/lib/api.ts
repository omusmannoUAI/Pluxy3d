export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299/api';

export async function apiFetch(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (error) {
    // Fallbacks por endpoint
    if (endpoint.startsWith('/carrito')) return [];
    if (endpoint.startsWith('/productos')) return [];
    return null;
  }
}
