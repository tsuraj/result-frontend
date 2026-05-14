import { useEffect, useState } from 'react'
import { FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'

const PAGE_SIZE = 20

const slug = (s = '') => (s.trim().split(/[\s\-—:]+/)[0] || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()

const Syllabus = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/syllabus`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load syllabus')
        return res.json()
      })
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Syllabus</h1>
        {!loading && !error && (
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{items.length.toLocaleString()}</span> syllabi
          </p>
        )}
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-1 gap-4">
        {items.slice(0, visibleCount).map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-5">
            <div className="flex gap-4">
              <div className="hidden sm:flex flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-xs font-bold text-gray-700">
                {slug(item.title) || 'SY'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug">{item.title}</h3>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {item.category && (
                    <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-purple-50 text-purple-700">
                      {item.category}
                    </span>
                  )}
                  {item.exam && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <FaRegCalendarAlt size={11} className="text-gray-400" /> {item.exam}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">View detailed syllabus</span>
                  <a
                    href={item.link || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-red-600"
                  >
                    View <FaArrowRight size={11} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && items.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{Math.min(visibleCount, items.length)}</span> of {items.length}
          </span>
          {visibleCount < items.length && (
            <button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black"
            >
              View more <FaArrowRight size={11} />
            </button>
          )}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mt-4">
          <p className="text-gray-600 text-sm">No syllabus available.</p>
        </div>
      )}
    </div>
  )
}

export default Syllabus
