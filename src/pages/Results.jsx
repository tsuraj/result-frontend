import { useEffect, useState } from 'react'
import { FaArrowRight, FaSearch, FaTimes } from 'react-icons/fa'
import ResultCard from '../components/ui/ResultCard'
import useDocumentMeta from '../hooks/useDocumentMeta'

const PAGE_SIZE = 20

const Results = () => {
  useDocumentMeta(
    'Sarkari Results 2026 — Latest Government Exam Results',
    'Check the latest Sarkari results and government exam results for SSC, UPSC, Railway, Banking and State Govt exams. Fast, reliable result updates with direct links.',
    { canonical: '/results' }
  )
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/results`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load results')
        return res.json()
      })
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? results.filter(r =>
        (r.title || '').toLowerCase().includes(q) ||
        (r.category || '').toLowerCase().includes(q)
      )
    : results

  // Reset pagination whenever the search changes.
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [q])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Results</h1>
        {!loading && !error && (
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{filtered.length.toLocaleString()}</span>
            {q ? ' matching results' : ' results'}
          </p>
        )}
      </div>

      <div className="mb-5 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2.5 shadow-sm focus-within:border-gray-900">
        <FaSearch className="text-gray-400" size={13} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search results by title or category…"
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
        {filtered.slice(0, visibleCount).map(result => (
          <ResultCard key={result.id} result={result} />
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
            {q ? <>No results match “{query.trim()}”.</> : 'No results available.'}
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

export default Results
