import Link from 'next/link'

const formatDate = (value) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Server component — receives the latest job from the layout.
export default function NotificationBar({ latestJob }) {
  const title = latestJob?.title
  const lastDate = formatDate(latestJob?.last_date)
  const href = latestJob ? `/jobs/${latestJob.slug || latestJob.id}` : null

  return (
    <div className="bg-black text-gray-200 text-xs">
      <div className="container flex items-center justify-between py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          <span className="font-semibold text-white">Latest:</span>
          {title ? (
            <Link href={href} className="truncate text-gray-300 hover:text-white">
              {title}
              {lastDate && <> · Last date <span className="text-white">{lastDate}</span></>}
            </Link>
          ) : (
            <span className="truncate text-gray-400">Latest government job updates</span>
          )}
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-300 flex-shrink-0">
          <Link href="/latest-jobs" className="hover:text-white">All Jobs</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </div>
  )
}
