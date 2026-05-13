import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRegBookmark, FaBookmark, FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'

const slug = (s = '') => (s.trim().split(/[\s\-—:]+/)[0] || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ResultCard = ({ result }) => {
  const [bookmarked, setBookmarked] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-5">
      <div className="flex gap-4">
        <div className="hidden sm:flex flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-xs font-bold text-gray-700">
          {slug(result.title) || 'RES'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to={`/results/${result.id}`} className="hover:text-red-600">
                <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug">{result.title}</h3>
              </Link>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                {result.category && (
                  <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    {result.category}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <FaRegCalendarAlt size={11} className="text-gray-400" /> {formatDate(result.date) || '—'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setBookmarked(b => !b)}
              className="text-gray-400 hover:text-red-600 p-1"
              aria-label="Bookmark"
            >
              {bookmarked ? <FaBookmark size={14} className="text-red-600" /> : <FaRegBookmark size={14} />}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Check your result</span>
            <Link
              to={`/results/${result.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-red-600"
            >
              View result <FaArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
