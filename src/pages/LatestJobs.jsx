import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaTimes, FaSearch } from 'react-icons/fa'
import JobCard from '../components/ui/JobCard'
import useDocumentMeta from '../hooks/useDocumentMeta'

const PAGE_SIZE = 20

const LatestJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = (searchParams.get('q') || '').trim()
  const [term, setTerm] = useState(searchParams.get('q') || '')

  // Keep the input in sync if the URL query changes (e.g. via "Clear search").
  useEffect(() => { setTerm(searchParams.get('q') || '') }, [searchParams])

  const submitSearch = (e) => {
    e.preventDefault()
    const next = term.trim()
    setSearchParams(next ? { q: next } : {})
  }

  useDocumentMeta(
    q ? `Search results for “${q}”` : 'Latest Government Jobs 2026 — Apply Online',
    q
      ? `Government job openings matching “${q}” on Hire Sarkar.`
      : 'Browse the latest Sarkari (government) job openings across India — SSC, UPSC, Railway, Banking, Defence and State Govt vacancies with eligibility, last dates and apply links.',
    // Search-result pages shouldn't be indexed; the canonical list page should.
    q ? { canonical: '/latest-jobs', noindex: true } : { canonical: '/latest-jobs' }
  )

  const [jobs, setJobs] = useState([])
  const [meta, setMeta] = useState({ page: 1, total: 0, total_pages: 1 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Reset to the first page whenever the search query changes.
  useEffect(() => {
    setPage(1)
  }, [q])

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page, per_page: PAGE_SIZE })
    if (q) params.set('q', q)
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jobs?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load jobs')
        return res.json()
      })
      .then(data => {
        setJobs(prev => (page === 1 ? data.jobs || [] : [...prev, ...(data.jobs || [])]))
        setMeta(data.meta || {})
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [page, q])

  const total = meta.total || 0
  const hasMore = page < (meta.total_pages || 1)

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={submitSearch} className="mb-5 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2.5 shadow-sm focus-within:border-gray-900">
        <FaSearch className="text-gray-400" size={13} />
        <input
          type="text"
          value={term}
          onChange={e => setTerm(e.target.value)}
          placeholder="Search jobs by title or organization…"
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        {term && (
          <button type="button" onClick={() => { setTerm(''); setSearchParams({}) }} className="text-gray-400 hover:text-gray-700" aria-label="Clear search">
            <FaTimes size={12} />
          </button>
        )}
        <button type="submit" className="bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-black">
          Search
        </button>
      </form>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {q ? <>Search results for “{q}”</> : 'Latest Government Jobs'}
        </h1>
        {!error && (
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{total.toLocaleString()}</span>
            {q ? ' matching jobs' : ' openings'}
            {loading && <span className="ml-2 text-gray-400">loading…</span>}
          </p>
        )}
        {q && (
          <Link
            to="/latest-jobs"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline"
          >
            <FaTimes size={10} /> Clear search
          </Link>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-1 gap-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {!error && jobs.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{jobs.length}</span> of {total}
          </span>
          {hasMore && (
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'View more'} <FaArrowRight size={11} />
            </button>
          )}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mt-4">
          <p className="text-gray-600 text-sm">
            {q ? <>No jobs match “{q}”.</> : 'No jobs available.'}
          </p>
          {q && (
            <Link to="/latest-jobs" className="mt-3 inline-block text-sm font-medium text-red-600 hover:underline">
              Clear search
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default LatestJobs
