import Link from 'next/link'
import { FaArrowRight, FaRegCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa'
import { getNotifications } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 300

export const metadata = pageMetadata({
  title: 'Latest Updates — Government Job, Result & Admit Card Notifications',
  description: 'Latest government job, result, admit card and exam-date updates and notifications on Hire Sarkar.',
  path: '/updates',
})

const fmtDate = (v) => {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Row({ item }) {
  const date = fmtDate(item.date)
  const body = (
    <>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{item.title}</h3>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {item.category && <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-red-50 text-red-700">{item.category}</span>}
          {date && <span className="inline-flex items-center gap-1 text-xs text-gray-500"><FaRegCalendarAlt size={11} className="text-gray-400" /> {date}</span>}
          {item.link_label && <span className="text-xs text-gray-500">· {item.link_label}</span>}
        </div>
        {item.description && <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{item.description}</p>}
      </div>
      {(item.link_path || item.url) && (
        <span className="self-center text-gray-400">{item.link_path ? <FaArrowRight size={12} /> : <FaExternalLinkAlt size={11} />}</span>
      )}
    </>
  )
  const cls = 'flex gap-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-5'
  if (item.link_path) return <Link href={item.link_path} className={cls}>{body}</Link>
  if (item.url) return <a href={item.url} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
  return <div className={cls}>{body}</div>
}

export default async function UpdatesPage() {
  const items = await getNotifications()
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Updates</h1>
        <p className="mt-1 text-xs text-gray-500"><span className="font-semibold text-gray-700">{items.length.toLocaleString()}</span> updates</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => <Row key={item.id} item={item} />)}
      </div>
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mt-4">
          <p className="text-gray-600 text-sm">No updates available.</p>
        </div>
      )}
    </div>
  )
}
