import { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import JobCard from '../components/ui/JobCard'

const PAGE_SIZE = 20

const LatestJobs = () => {
  const [jobs, setJobs] = useState([])
  const [meta, setMeta] = useState({ page: 1, total: 0, total_pages: 1 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`${import.meta.env.VITE_API_URL}/jobs?page=${page}&per_page=${PAGE_SIZE}`)
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
  }, [page])

  const total = meta.total || 0
  const hasMore = page < (meta.total_pages || 1)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Government Jobs</h1>
        {!error && (
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{total.toLocaleString()}</span> openings
            {loading && <span className="ml-2 text-gray-400">loading…</span>}
          </p>
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
          <p className="text-gray-600 text-sm">No jobs available.</p>
        </div>
      )}
    </div>
  )
}

export default LatestJobs
