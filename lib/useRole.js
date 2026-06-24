'use client'
import { useEffect, useState } from 'react'

// Reads the current user's role from localStorage after mount (SSR-safe).
// Returns null while loading or for anonymous users.
export function useRole() {
  const [role, setRole] = useState(null)
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      setRole(user?.role || null)
    } catch {
      setRole(null)
    }
  }, [])
  return role
}

export const isAdminRole = (role) => role === 'admin'
export const isWriterRole = (role) => role === 'admin' || role === 'moderator'
