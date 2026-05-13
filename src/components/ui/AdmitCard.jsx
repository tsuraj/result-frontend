import { useState } from 'react'
import { FaRegBookmark, FaBookmark, FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'

const slug = (s = '') => (s.trim().split(/[\s\-—:]+/)[0] || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const AdmitCard = ({ card }) => {
  const [bookmarked, setBookmarked] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-5">
      <div className="flex gap-4">
        <div className="hidden sm:flex flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-xs font-bold text-gray-700">
          {slug(card.title) || 'AC'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug">{card.title}</h3>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                {card.category && (
                  <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-green-50 text-green-700">
                    {card.category}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <FaRegCalendarAlt size={11} className="text-gray-400" /> {formatDate(card.date) || '—'}
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
            <span className="text-sm text-gray-500">Download your admit card</span>
            <a
              href={card.link || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-red-600"
            >
              Download <FaArrowRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdmitCard
