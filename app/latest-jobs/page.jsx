import Link from 'next/link'
import { FaSearch, FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import JobCard from '../../components/JobCard'
import FollowCTA from '../../components/FollowCTA'
import { getJobs } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 60

export async function generateMetadata({ searchParams }) {
  const q = (searchParams?.q || '').trim()
  return pageMetadata({
    title: q ? `Search results for “${q}”` : 'Latest Government Jobs 2026 — Apply Online',
    description: q
      ? `Government job openings matching “${q}” on Hire Sarkar.`
      : 'Browse the latest Sarkari (government) job openings across India — SSC, UPSC, Railway, Banking, Defence and State Govt vacancies with eligibility, last dates and apply links.',
    path: '/latest-jobs',
    noindex: Boolean(q), // search-result pages shouldn't be indexed
  })
}

export default async function LatestJobsPage({ searchParams }) {
  const q = (searchParams?.q || '').trim()
  const page = Math.max(1, parseInt(searchParams?.page, 10) || 1)

  let data = { jobs: [], meta: {} }
  try {
    data = await getJobs({ page, perPage: 20, q })
  } catch {
    /* keep empty */
  }
  const jobs = Array.isArray(data.jobs) ? data.jobs : []
  const total = data.meta?.total || 0
  const totalPages = data.meta?.total_pages || 1

  const pageHref = (p) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/latest-jobs${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form action="/latest-jobs" className="mb-5 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2.5 shadow-sm focus-within:border-gray-900">
        <FaSearch className="text-gray-400" size={13} />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search jobs by title or organization…"
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        <button type="submit" className="bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-black">
          Search
        </button>
      </form>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {q ? <>Search results for “{q}”</> : 'Latest Government Jobs'}
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{total.toLocaleString()}</span>
          {q ? ' matching jobs' : ' openings'}
        </p>
        {q && (
          <Link href="/latest-jobs" className="mt-2 inline-block text-xs font-medium text-red-600 hover:underline">
            Clear search
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mt-4">
          <p className="text-gray-600 text-sm">{q ? <>No jobs match “{q}”.</> : 'No jobs available.'}</p>
        </div>
      )}

      {jobs.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
              <FaArrowLeft size={11} /> Previous
            </Link>
          ) : <span />}
          <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={pageHref(page + 1)} className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black">
              Next <FaArrowRight size={11} />
            </Link>
          ) : <span />}
        </div>
      )}

      <FollowCTA />
    </div>
  )
}
