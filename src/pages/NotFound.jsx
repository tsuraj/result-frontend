import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaSearch } from 'react-icons/fa'
import useDocumentMeta from '../hooks/useDocumentMeta'

const QUICK_LINKS = [
  { to: '/latest-jobs', label: 'Latest Jobs' },
  { to: '/results', label: 'Results' },
  { to: '/admit-cards', label: 'Admit Cards' },
  { to: '/answer-keys', label: 'Answer Keys' },
  { to: '/syllabus', label: 'Syllabus' },
]

const NotFound = () => {
  // Keep this page out of the search index.
  useDocumentMeta(
    'Page Not Found',
    'The page you are looking for could not be found on Hire Sarkar.',
    { noindex: true }
  )

  // Tell Prerender.io (dynamic rendering) to serve crawlers a real 404 status
  // instead of a soft-404 (HTTP 200). Cleaned up when navigating away.
  useEffect(() => {
    const tag = document.createElement('meta')
    tag.name = 'prerender-status-code'
    tag.content = '404'
    document.head.appendChild(tag)
    return () => tag.remove()
  }, [])

  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <p className="text-6xl font-extrabold text-red-600 tracking-tight">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-sm text-gray-600">
        Sorry, the page you’re looking for doesn’t exist or may have been moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-red-700"
        >
          <FaHome size={13} /> Back to Home
        </Link>
        <Link
          to="/latest-jobs"
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-800 text-sm font-medium px-5 py-2.5 rounded-md hover:bg-gray-50"
        >
          <FaSearch size={12} /> Browse Latest Jobs
        </Link>
      </div>

      <div className="mt-10 border-t border-gray-100 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Popular sections</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-red-600 hover:text-red-700 hover:underline px-2 py-1"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotFound
