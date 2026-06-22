// Client-side fetch wrapper that attaches the bearer token from localStorage.
// Only safe to call from client components ('use client').
export const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.hiresarkar.com'}/api/v1`

export const authFetch = (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  return fetch(url, { ...options, headers })
}
