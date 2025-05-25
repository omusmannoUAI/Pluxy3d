export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (error) {
    // Devuelve un array vacío o un objeto vacío según el endpoint
    if (endpoint.startsWith('/carrito')) return [];
    if (endpoint.startsWith('/productos')) return [];
    // Puedes agregar más casos según tus endpoints
    return null;
  }
}
