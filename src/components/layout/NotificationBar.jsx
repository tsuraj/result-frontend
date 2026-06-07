import { Link } from 'react-router-dom'
import { useJobs } from '../../context/JobsContext'

const formatDate = (value) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const NotificationBar = () => {
  const { latestJob } = useJobs()

  const title = latestJob?.title
  const posts = latestJob?.total_posts ? Number(latestJob.total_posts).toLocaleString('en-IN') : null
  const lastDate = formatDate(latestJob?.last_date || latestJob?.lastDate)
  const href = latestJob ? `/jobs/${latestJob.slug || latestJob.id}` : null

  return (
    <div className="bg-black text-gray-200 text-xs">
      <div className="container flex items-center justify-between py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          <span className="font-semibold text-white">Latest:</span>
          {title ? (
            <Link to={href} className="truncate text-gray-300 hover:text-white">
              {title}
              {posts && <> — {posts} posts</>}
              {lastDate && <> · Last date <span className="text-white">{lastDate}</span></>}
            </Link>
          ) : (
            <span className="truncate text-gray-400">Latest government job updates</span>
          )}
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-300 flex-shrink-0">
          <Link to="/latest-jobs" className="hover:text-white">All Jobs</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </div>
  )
}

export default NotificationBar
