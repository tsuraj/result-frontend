import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaRegCalendarAlt, FaSearch, FaTimes } from 'react-icons/fa'
import useDocumentMeta from '../hooks/useDocumentMeta'

const PAGE_SIZE = 20

const slug = (s = '') => (s.trim().split(/[\s\-—:]+/)[0] || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const AnswerKeys = () => {
  useDocumentMeta(
    'Answer Keys 2026 — Government Exam Answer Keys',
    'Download official and provisional answer keys for the latest government exams — SSC, UPSC, Railway, Banking and State Govt. Compare responses and raise objections on time.',
    { canonical: '/answer-keys' }
  )
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/answer_keys`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load answer keys')
        return res.json()
      })
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? items.filter(it =>
        (it.title || '').toLowerCase().includes(q) ||
        (it.category || '').toLowerCase().includes(q)
      )
    : items

  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [q])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Answer Keys</h1>
        {!loading && !error && (
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{filtered.length.toLocaleString()}</span>
            {q ? ' matching answer keys' : ' answer keys'}
          </p>
        )}
      </div>

      <div className="mb-5 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2.5 shadow-sm focus-within:border-gray-900">
        <FaSearch className="text-gray-400" size={13} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search answer keys by title or category…"
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-700" aria-label="Clear search">
            <FaTimes size={12} />
          </button>
        )}
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-1 gap-4">
        {filtered.slice(0, visibleCount).map(item => (
          <Link
            key={item.id}
            to={`/answer-keys/${item.slug || item.id}`}
            className="block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-5"
          >
            <div className="flex gap-4">
              <div className="hidden sm:flex flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-xs font-bold text-gray-700">
                {slug(item.title) || 'AK'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug">{item.title}</h3>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {item.category && (
                    <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                      {item.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <FaRegCalendarAlt size={11} className="text-gray-400" /> {formatDate(item.date) || '—'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!loading && !error && filtered.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{Math.min(visibleCount, filtered.length)}</span> of {filtered.length}
          </span>
          {visibleCount < filtered.length && (
            <button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black"
            >
              View more <FaArrowRight size={11} />
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mt-4">
          <p className="text-gray-600 text-sm">
            {q ? <>No answer keys match “{query.trim()}”.</> : 'No answer keys available.'}
          </p>
          {q && (
            <button onClick={() => setQuery('')} className="mt-3 text-sm font-medium text-red-600 hover:underline">
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default AnswerKeys
