'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { API_BASE } from '../lib/authFetch'

function Inner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || data.message || 'Invalid credentials')
      }
      const data = await res.json().catch(() => ({}))
      if (data.access_token) localStorage.setItem('token', data.access_token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      router.push(next)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? 'Logging in…' : 'Log in'}
      </button>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-red-600 hover:underline">Sign up</Link>
      </div>
    </form>
  )
}

export default function LoginForm() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
        <Inner />
      </Suspense>
    </div>
  )
}
