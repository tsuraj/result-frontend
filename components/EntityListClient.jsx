'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaArrowRight, FaSearch, FaTimes, FaRegCalendarAlt } from 'react-icons/fa'

const PAGE_SIZE = 20

const badge = (s = '') => (s.trim().split(/[\s\-—:]+/)[0] || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()
const fmtDate = (v) => {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Reusable client list with instant title/category search for Results / Admit
// Cards / Answer Keys / Syllabus. Items are server-fetched and passed in.
export default function EntityListClient({ items = [], basePath, label, fallbackBadge = 'GOV', accent = 'blue' }) {
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const q = query.trim().toLowerCase()
  const filtered = q
    ? items.filter((it) => (it.title || '').toLowerCase().includes(q) || (it.category || '').toLowerCase().includes(q))
    : items

  const accentCls = { blue: 'bg-blue-50 text-blue-700', purple: 'bg-purple-50 text-purple-700', green: 'bg-green-50 text-green-700' }[accent] || 'bg-blue-50 text-blue-700'

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{label}</h1>
        <p className="mt-1 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{filtered.length.toLocaleString()}</span>{q ? ` matching ${label.toLowerCase()}` : ` ${label.toLowerCase()}`}
        </p>
      </div>

      <div className="mb-5 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2.5 shadow-sm focus-within:border-gray-900">
        <FaSearch className="text-gray-400" size={13} />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE) }}
          placeholder={`Search ${label.toLowerCase()} by title or category…`}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        {query && <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-700" aria-label="Clear"><FaTimes size={12} /></button>}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.slice(0, visible).map((item) => (
          <Link
            key={item.id}
            href={`${basePath}/${item.slug || item.id}`}
            className="block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-5"
          >
            <div className="flex gap-4">
              <div className="hidden sm:flex flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-xs font-bold text-gray-700">
                {badge(item.title) || fallbackBadge}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug">{item.title}</h3>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {item.category && <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${accentCls}`}>{item.category}</span>}
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <FaRegCalendarAlt size={11} className="text-gray-400" /> {fmtDate(item.date) || '—'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mt-4">
          <p className="text-gray-600 text-sm">{q ? `No ${label.toLowerCase()} match “${query.trim()}”.` : `No ${label.toLowerCase()} available.`}</p>
        </div>
      )}

      {visible < filtered.length && (
        <div className="mt-6 text-center">
          <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black">
            View more <FaArrowRight size={11} />
          </button>
        </div>
      )}
    </div>
  )
}
