import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaSearch, FaSlidersH, FaThLarge, FaList, FaArrowRight,
  FaBell, FaAngleLeft, FaAngleRight, FaAngleDown, FaTimes
} from 'react-icons/fa'
import JobCard from '../components/ui/JobCard'
import { useJobs } from '../context/JobsContext'
import useDocumentMeta from '../hooks/useDocumentMeta'

const PAGE_SIZE = 5

const popularChips = ['All', 'Posted today', 'Closing this week', '12th Pass', 'Graduate', 'Railway', 'Banking']
const browseCategories = ['All Jobs', 'Railway', 'Banking', 'Defence / Police', 'SSC / UPSC', 'Teaching', 'State Govt']
const qualifications = ['10th Pass', '12th Pass', 'ITI / Diploma', 'Graduate', 'Post Graduate']
const states = ['All India', 'Uttar Pradesh', 'Bihar', 'Maharashtra', 'Delhi']

const categoryToOrgLike = {
  Railway: 'Railway',
  Banking: 'Bank',
  'Defence / Police': 'Army',
  'SSC / UPSC': 'SSC',
  Teaching: 'CBSE',
  'State Govt': 'State'
}

const qualToTitleLike = {
  '10th Pass': '10th',
  '12th Pass': '12th',
  'ITI / Diploma': 'ITI',
  Graduate: 'Graduate',
  'Post Graduate': 'Post Graduate'
}

const closingThisWeekStatic = [
  { name: 'RRB NTPC', sub: 'Last date to apply', days: '3d' },
  { name: 'UP Police', sub: 'Application closes', days: '7d' },
  { name: 'SSC CGL', sub: 'Window closes', days: '11d' }
]

const ActiveChip = ({ label, onClear }) => (
  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
    {label}
    <button onClick={onClear} className="text-gray-400 hover:text-gray-700" aria-label={`Remove ${label}`}>
      <FaTimes size={9} />
    </button>
  </span>
)

const Home = () => {
  useDocumentMeta(
    'Hire Sarkar — Latest Government Jobs, Results & Admit Cards',
    'Hire Sarkar brings you the latest Sarkari jobs, results, admit cards, answer keys and syllabus in one place. Fast, reliable government recruitment updates for SSC, UPSC, Railway, Banking and State Govt exams.',
    { canonical: '/' }
  )
  const { stats, refresh } = useJobs()
  const [jobs, setJobs] = useState([])
  const [meta, setMeta] = useState({ page: 1, per_page: PAGE_SIZE, total: 0, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [view, setView] = useState('list')
  const [sort, setSort] = useState('latest')
  const [updates, setUpdates] = useState([])
  const [activeChip, setActiveChip] = useState('All')
  const [activeCategory, setActiveCategory] = useState('All Jobs')
  const [activeQualification, setActiveQualification] = useState(null)
  const [activeState, setActiveState] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [now, setNow] = useState(() => Date.now())
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [qualificationOpen, setQualificationOpen] = useState(false)
  const [stateOpen, setStateOpen] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(id)
  }, [query])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedQuery, activeChip, activeCategory, activeQualification, activeState, sort])

  useEffect(() => {
    const p = new URLSearchParams()
    p.set('page', page)
    p.set('per_page', PAGE_SIZE)
    if (debouncedQuery) p.set('q', debouncedQuery)

    if (activeChip === 'Posted today') p.set('posted_within', 24)
    else if (activeChip === 'Closing this week') p.set('closing_within', 7)
    else if (['12th Pass', 'Graduate'].includes(activeChip)) p.set('title_like', activeChip === '12th Pass' ? '12th' : 'Graduate')
    else if (activeChip === 'Railway') p.set('organization_like', 'Railway')
    else if (activeChip === 'Banking') p.set('organization_like', 'Bank')

    if (!p.has('organization_like') && activeCategory !== 'All Jobs' && categoryToOrgLike[activeCategory]) {
      p.set('organization_like', categoryToOrgLike[activeCategory])
    }
    if (!p.has('title_like') && activeQualification && qualToTitleLike[activeQualification]) {
      p.set('title_like', qualToTitleLike[activeQualification])
    }
    if (activeState && activeState !== 'All India') {
      p.set('location_like', activeState)
    }

    if (sort && sort !== 'latest') p.set('sort', sort)

    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jobs?${p.toString()}`)
      .then(res => res.json())
      .then(data => {
        setJobs(Array.isArray(data.jobs) ? data.jobs : [])
        setMeta(data.meta || {})
        setUpdatedAt(Date.now())
      })
      .catch(() => {
        setJobs([])
      })
      .finally(() => setLoading(false))
  }, [page, debouncedQuery, activeChip, activeCategory, activeQualification, activeState, sort])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications`)
      .then(res => res.json())
      .then(data => setUpdates(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setUpdates([]))
  }, [])

  const relativeUpdated = () => {
    if (!updatedAt) return '—'
    const secs = Math.max(0, Math.floor((now - updatedAt) / 1000))
    if (secs < 60) return 'just now'
    const mins = Math.floor(secs / 60)
    if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
    const hrs = Math.floor(mins / 60)
    return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  }

  const totalPages = Math.max(1, meta.total_pages || 1)
  const totalResults = meta.total || 0

  const clearFilters = () => {
    setQuery('')
    setActiveChip('All')
    setActiveCategory('All Jobs')
    setActiveQualification(null)
    setActiveState(null)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50/60 to-transparent">
        <div className="container py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600 mb-5">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              Updated <span className="font-semibold text-gray-900">{relativeUpdated()}</span>
            </span>
            <span><span className="font-semibold text-gray-900">{(stats.total_active || 0).toLocaleString()}</span> active openings</span>
            <span><span className="font-semibold text-gray-900">{stats.posted_today || 0}</span> posted today</span>
            <span><span className="font-semibold text-gray-900">{stats.closing_this_week || 0}</span> closing this week</span>
            <button onClick={refresh} className="text-gray-400 hover:text-gray-700 underline-offset-2 hover:underline">refresh</button>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Every sarkari job,{' '}
            <span className="italic font-serif text-red-600">in one place.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-gray-600">
            Notifications, results, admit cards and syllabi from 240+ government departments —
            without the clutter.
          </p>

          <div className="mt-7 flex items-stretch gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-3 bg-white border border-gray-300 rounded-full px-5 py-3 shadow-sm focus-within:border-gray-900">
              <FaSearch className="text-gray-400" size={14} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by exam, department or post — e.g. SSC CGL, RRB NTPC, SBI PO..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              />
              <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">⌘ K</span>
            </div>
            <button
              onClick={() => setDebouncedQuery(query)}
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full hover:bg-black"
            >
              Search <FaArrowRight size={11} />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 mr-2">Popular:</span>
            {popularChips.map(label => {
              const active = activeChip === label
              return (
                <button
                  key={label}
                  onClick={() => setActiveChip(label)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    active
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main 3-col */}
      <section className="container py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: filters */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <button
              type="button"
              onClick={() => setCategoryOpen(o => !o)}
              className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-900 lg:cursor-default lg:py-0 lg:mb-3"
            >
              <span>Browse by category</span>
              <span className={`lg:hidden text-gray-400 transition-transform ${categoryOpen ? 'rotate-180' : ''}`}>
                <FaAngleDown size={14} />
              </span>
            </button>
            <ul className={`space-y-1 ${categoryOpen ? 'block' : 'hidden'} lg:block`}>
              {browseCategories.map(label => {
                const active = activeCategory === label
                return (
                  <li key={label}>
                    <button
                      onClick={() => setActiveCategory(label)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={() => setQualificationOpen(o => !o)}
              className="w-full flex items-center justify-between py-2 border-t border-gray-100 text-sm font-semibold text-gray-900 lg:cursor-default lg:py-0 lg:mt-5 lg:border-0 lg:text-[11px] lg:font-semibold lg:tracking-wider lg:text-gray-400 lg:uppercase"
            >
              <span>Qualification</span>
              <span className={`lg:hidden text-gray-400 transition-transform ${qualificationOpen ? 'rotate-180' : ''}`}>
                <FaAngleDown size={14} />
              </span>
            </button>
            <ul className={`space-y-1 ${qualificationOpen ? 'block' : 'hidden'} lg:mt-2 lg:block`}>
              {qualifications.map(label => {
                const active = activeQualification === label
                return (
                  <li key={label}>
                    <button
                      onClick={() => setActiveQualification(active ? null : label)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={() => setStateOpen(o => !o)}
              className="w-full flex items-center justify-between py-2 border-t border-gray-100 text-sm font-semibold text-gray-900 lg:cursor-default lg:py-0 lg:mt-5 lg:border-0 lg:text-[11px] lg:font-semibold lg:tracking-wider lg:text-gray-400 lg:uppercase"
            >
              <span>State</span>
              <span className={`lg:hidden text-gray-400 transition-transform ${stateOpen ? 'rotate-180' : ''}`}>
                <FaAngleDown size={14} />
              </span>
            </button>
            <ul className={`space-y-1 ${stateOpen ? 'block' : 'hidden'} lg:mt-2 lg:block`}>
              {states.map(s => {
                const active = activeState === s
                return (
                  <li key={s}>
                    <button
                      onClick={() => setActiveState(active ? null : s)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  </li>
                )
              })}
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  More…
                </button>
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5">
            <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Free</div>
            <div className="mt-1 text-lg font-bold">Never miss a deadline.</div>
            <p className="mt-2 text-sm text-gray-300">
              Get WhatsApp alerts the moment a notification drops in your category.
            </p>
            <button className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium px-4 py-2.5 rounded-md hover:bg-gray-100">
              <FaBell size={12} /> Enable alerts <FaArrowRight size={11} />
            </button>
          </div>
        </aside>

        {/* Center: jobs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Latest Government Jobs</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                <span className="font-semibold text-gray-700">{totalResults.toLocaleString()}</span> results
                {loading && <span className="ml-2 text-gray-400">loading…</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50">
                <FaSlidersH size={12} /> Filters
              </button>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Sort jobs"
                className="text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-gray-900 cursor-pointer"
              >
                <option value="latest">Sort: Latest</option>
                <option value="closing">Sort: Closing soon</option>
              </select>
              <div className="inline-flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setView('list')}
                  className={`px-2.5 py-2 ${view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  aria-label="List view"
                >
                  <FaList size={11} />
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={`px-2.5 py-2 ${view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  aria-label="Grid view"
                >
                  <FaThLarge size={11} />
                </button>
              </div>
            </div>
          </div>

          {(query || activeChip !== 'All' || activeCategory !== 'All Jobs' || activeQualification || activeState) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {query && <ActiveChip label={`“${query}”`} onClear={() => setQuery('')} />}
              {activeChip !== 'All' && <ActiveChip label={activeChip} onClear={() => setActiveChip('All')} />}
              {activeCategory !== 'All Jobs' && <ActiveChip label={activeCategory} onClear={() => setActiveCategory('All Jobs')} />}
              {activeQualification && <ActiveChip label={activeQualification} onClear={() => setActiveQualification(null)} />}
              {activeState && <ActiveChip label={activeState} onClear={() => setActiveState(null)} />}
              <button onClick={clearFilters} className="ml-1 text-xs font-semibold text-red-600 hover:underline">
                Clear all
              </button>
            </div>
          )}

          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
            {!loading && jobs.length === 0 && (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-gray-600 text-sm">No jobs match the current filters.</p>
                <button onClick={clearFilters} className="mt-3 text-sm font-medium text-red-600 hover:underline">
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {totalResults > 0 && (
            <div className="flex items-center justify-center gap-1 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-600 disabled:opacity-40"
              >
                <FaAngleLeft size={11} />
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    page === n
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              {totalPages > 4 && <span className="px-2 text-gray-400">…</span>}
              {totalPages > 3 && (
                <button
                  onClick={() => setPage(totalPages)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    page === totalPages
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-600 disabled:opacity-40"
              >
                <FaAngleRight size={11} />
              </button>
            </div>
          )}
        </div>

        {/* Right: rails */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-900 inline-flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                Closing this week
              </div>
              <Link to="/latest-jobs" className="text-xs text-gray-500 hover:text-gray-800">All</Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {closingThisWeekStatic.map(item => (
                <li key={item.name} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.sub}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-red-600 leading-none">{item.days}</div>
                    <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Left</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-900 inline-flex items-center gap-2">
                <FaBell className="text-red-600" size={11} />
                Latest Updates
              </div>
              <Link to="/updates" className="text-xs text-gray-500 hover:text-gray-800">View all</Link>
            </div>
            {updates.length === 0 ? (
              <p className="text-xs text-gray-500">No updates yet.</p>
            ) : (
              <ul className="space-y-3">
                {updates.map((u, i) => {
                  const inner = (
                    <>
                      <span className="text-xs text-gray-400 font-mono pt-0.5 w-5">{String(i + 1).padStart(2, '0')}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 leading-snug">{u.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          {u.category && <span className="font-medium text-red-600">{u.category}</span>}
                          {u.date && <span>{new Date(u.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>}
                        </div>
                      </div>
                    </>
                  )
                  if (u.link_path) {
                    return <li key={u.id}><Link to={u.link_path} className="flex items-start gap-3 hover:opacity-80">{inner}</Link></li>
                  }
                  if (u.url) {
                    return <li key={u.id}><a href={u.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:opacity-80">{inner}</a></li>
                  }
                  return <li key={u.id} className="flex items-start gap-3">{inner}</li>
                })}
              </ul>
            )}
          </div>
        </aside>
      </section>

      {/* Simple footer note */}
      <div className="container border-t border-gray-200 py-6 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <span>
          © {new Date().getFullYear()} HireSarkar · Independent job-listing service · Not affiliated with any government body
        </span>
        <span className="flex items-center gap-4">
          <Link to="/about" className="hover:text-gray-800">About</Link>
          <Link to="/disclaimer" className="hover:text-gray-800">Disclaimer</Link>
          <Link to="/privacy" className="hover:text-gray-800">Privacy</Link>
          <Link to="/contact" className="hover:text-gray-800">Contact</Link>
          <Link to="/rss" className="hover:text-gray-800">RSS</Link>
        </span>
      </div>
    </div>
  )
}

export default Home
