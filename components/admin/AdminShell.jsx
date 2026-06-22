'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

const adminLinks = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Jobs', path: '/admin/jobs' },
  { name: 'Results', path: '/admin/results' },
  { name: 'Admit Cards', path: '/admin/admit-cards' },
  { name: 'Answer Keys', path: '/admin/answer-keys' },
  { name: 'Syllabus', path: '/admin/syllabus' },
  { name: 'Updates', path: '/admin/updates' },
  { name: 'Pages', path: '/admin/pages' },
]

export default function AdminShell({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    let user = null
    try { user = JSON.parse(localStorage.getItem('user')) } catch { user = null }

    if (!token || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      setStatus('denied')
      return
    }
    if (user.role !== 'admin') {
      router.replace('/')
      setStatus('denied')
      return
    }
    setStatus('ok')
  }, [router, pathname])

  if (status !== 'ok') {
    return <p className="text-sm text-gray-500 py-10 text-center">Checking access…</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
      <aside className="md:sticky md:top-20 self-start">
        <nav className="rounded-lg border border-gray-200 bg-white p-2">
          <ul className="flex md:flex-col gap-1 overflow-x-auto whitespace-nowrap">
            {adminLinks.map((l) => {
              const active = l.path === '/admin' ? pathname === '/admin' : pathname.startsWith(l.path)
              return (
                <li key={l.path}>
                  <Link
                    href={l.path}
                    className={`block px-3 py-1.5 text-sm rounded ${active ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {l.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  )
}
