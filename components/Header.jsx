'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaBell, FaRegBookmark, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Latest Jobs', path: '/latest-jobs' },
  { name: 'Results', path: '/results' },
  { name: 'Admit Card', path: '/admit-cards' },
  { name: 'Answer Key', path: '/answer-keys' },
  { name: 'Syllabus', path: '/syllabus' },
  { name: 'Updates', path: '/updates' },
]

export default function Header({ activeJobs = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [auth, setAuth] = useState({ loggedIn: false, admin: false })
  const pathname = usePathname()
  const router = useRouter()

  // Read auth from localStorage after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    const token = localStorage.getItem('token')
    let user = null
    try { user = JSON.parse(localStorage.getItem('user')) } catch { user = null }
    const role = user?.role
    setAuth({
      loggedIn: Boolean(token && user),
      admin: Boolean(token && user && (role === 'admin' || role === 'moderator')),
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path))

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-red-600 text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded">HS</div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-gray-900">
              Hire<span className="text-red-600">Sarkar</span>
            </div>
            <div className="text-[10px] font-semibold tracking-wide text-gray-500 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
              {Number(activeJobs).toLocaleString()} ACTIVE JOBS
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative font-medium text-sm pb-1 ${active ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.name}
                {active && <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-red-600 rounded-full" />}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden md:inline-flex relative p-2 text-gray-600 hover:text-gray-900" aria-label="Notifications">
            <FaBell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button className="hidden md:inline-flex p-2 text-gray-600 hover:text-gray-900" aria-label="Bookmarks">
            <FaRegBookmark size={16} />
          </button>
          {auth.admin && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100"
            >
              Admin
            </Link>
          )}
          {auth.loggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Log out
            </button>
          ) : (
            <>
              <Link href="/login" className="hidden md:inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
                Log in
              </Link>
              <Link href="/signup" className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Create account <FaArrowRight size={11} />
              </Link>
            </>
          )}
          <button className="md:hidden text-gray-700 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      <nav className="md:hidden border-t border-gray-200">
        <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto whitespace-nowrap">
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`shrink-0 px-3 py-1.5 text-sm font-medium rounded-full border ${active ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-3 px-4">
          <div className="flex gap-3">
            {auth.loggedIn ? (
              <button onClick={() => { setIsMenuOpen(false); handleLogout() }} className="flex-1 text-center px-4 py-2 text-sm border border-gray-300 rounded-md">
                Log out
              </button>
            ) : (
              <>
                <Link href="/login" className="flex-1 text-center px-4 py-2 text-sm border border-gray-300 rounded-md" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                <Link href="/signup" className="flex-1 text-center px-4 py-2 text-sm text-white bg-red-600 rounded-md" onClick={() => setIsMenuOpen(false)}>Create account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
