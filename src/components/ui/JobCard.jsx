import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRegBookmark, FaBookmark, FaUsers, FaGraduationCap, FaMapMarkerAlt, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa'

const slugFromTitle = (title = '') => {
  const first = title.trim().split(/[\s\-—:]+/)[0] || ''
  return first.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()
}

const daysFromNow = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

const timeAgo = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

const formatDate = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const JobCard = ({ job }) => {
  const [bookmarked, setBookmarked] = useState(false)
  const slug = slugFromTitle(job.title)
  const daysLeft = daysFromNow(job.last_date || job.lastDate)
  const posted = timeAgo(job.created_at || job.createdAt)

  let status = null
  if (daysLeft !== null) {
    if (daysLeft < 0) status = { label: 'CLOSED', tone: 'bg-gray-100 text-gray-600' }
    else if (daysLeft <= 7) status = { label: `${daysLeft} D LEFT`, tone: 'bg-orange-50 text-orange-700 border border-orange-200', icon: true }
    else if (posted && /min|hour|today|just now/i.test(posted)) status = { label: 'NEW', tone: 'bg-black text-white' }
    else status = { label: 'OPEN', tone: 'bg-green-50 text-green-700' }
  }

  const toggleBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setBookmarked(b => !b)
  }

  return (
    <Link
      to={`/jobs/${job.slug || job.id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-5"
    >
      <div className="flex gap-4">
        <div className="hidden sm:flex flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-xs font-bold text-gray-700">
          {slug || 'JOB'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug">{job.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {job.organization}
                {posted && <span> · Posted {posted}</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {status && (
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${status.tone}`}>
                  {status.icon && <FaRegClock size={10} />} {status.label}
                </span>
              )}
              <button
                onClick={toggleBookmark}
                className="text-gray-400 hover:text-red-600 p-1"
                aria-label="Bookmark"
              >
                {bookmarked ? <FaBookmark size={14} className="text-red-600" /> : <FaRegBookmark size={14} />}
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
            {job.total_posts && (
              <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
                <FaUsers size={10} className="text-gray-400" /> {Number(job.total_posts).toLocaleString()} posts
              </span>
            )}
            {job.qualification && (
              <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
                <FaGraduationCap size={10} className="text-gray-400" />{' '}
                {Array.isArray(job.qualification) ? job.qualification[0] : job.qualification}
              </span>
            )}
            {job.location && (
              <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
                <FaMapMarkerAlt size={10} className="text-gray-400" /> {job.location}
              </span>
            )}
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <FaRegCalendarAlt size={11} className="text-gray-400" />
              Last date {formatDate(job.last_date || job.lastDate) || '—'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default JobCard
