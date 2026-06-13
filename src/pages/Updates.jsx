import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaRegCalendarAlt, FaExternalLinkAlt, FaSearch, FaTimes } from 'react-icons/fa'
import useDocumentMeta from '../hooks/useDocumentMeta'

const PAGE_SIZE = 20

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Renders an update row, linking internally (link_path), externally (url), or as plain text.
const UpdateRow = ({ item }) => {
  const date = formatDate(item.date)
  const body = (
    <>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{item.title}</h3>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {item.category && (
            <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-red-50 text-red-700">
              {item.category}
            </span>
          )}
          {date && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <FaRegCalendarAlt size={11} className="text-gray-400" /> {date}
            </span>
          )}
          {item.link_label && (
            <span className="text-xs text-gray-500">· {item.link_label}</span>
          )}
        </div>
        {item.description && (
          <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{item.description}</p>
        )}
      </div>
      {(item.link_path || item.url) && (
        <span className="self-center text-gray-400">
          {item.link_path ? <FaArrowRight size={12} /> : <FaExternalLinkAlt size={11} />}
        </span>
      )}
    </>
  )

  const cls = 'flex gap-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-5'

  if (item.link_path) {
    return <Link to={item.link_path} className={cls}>{body}</Link>
  }
  if (item.url) {
    return <a href={item.url} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
  }
  return <div className={cls}>{body}</div>
}

const Updates = () => {
  useDocumentMeta(
    'Latest Updates — Government Job, Result & Admit Card Notifications',
    'Latest government job, result, admit card and exam-date updates and notifications on Hire Sarkar.',
    { canonical: '/updates' }
  )

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load updates')
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Updates</h1>
        {!loading && !error && (
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{filtered.length.toLocaleString()}</span>
            {q ? ' matching updates' : ' updates'}
          </p>
        )}
      </div>

      <div className="mb-5 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2.5 shadow-sm focus-within:border-gray-900">
        <FaSearch className="text-gray-400" size={13} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search updates by title or category…"
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
          <UpdateRow key={item.id} item={item} />
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
            {q ? <>No updates match “{query.trim()}”.</> : 'No updates available.'}
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

export default Updates
