export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, options);
  if (!res.ok) throw new Error('API error');
  return res.json();
}
