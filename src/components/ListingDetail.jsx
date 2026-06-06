import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FaArrowLeft, FaArrowRight, FaRegBookmark, FaBookmark, FaShareAlt,
  FaRegCalendarAlt, FaFilePdf
} from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import useDocumentMeta from '../hooks/useDocumentMeta'

const API = `${import.meta.env.VITE_API_URL}/api/v1`

const formatDate = (v) => {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const slugFromTitle = (t = '') =>
  (t.trim().split(/[\s\-—:]+/)[0] || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()

const Section = ({ title, children }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5">
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
    {children}
  </section>
)

const ListingDetail = ({ resource, backTo, backLabel, slug3 }) => {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/${resource}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${resource.replace('_', ' ')}`)
        return res.json()
      })
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, resource])

  useDocumentMeta(
    item?.title,
    item?.description?.replace(/\s+/g, ' ').trim().slice(0, 160),
    { type: 'article', canonical: backTo ? `${backTo}/${id}` : undefined }
  )

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>
  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!item) return <p className="text-gray-500 text-sm">Not found.</p>

  const title = item.title
  const category = item.category
  const date = formatDate(item.date)
  const description = item.description
  const importantDates = item.important_dates
  const notificationLink = item.notification_link
  const websiteLink = item.website_link
  const downloadLink = item.download_link
  const files = Array.isArray(item.files) ? item.files : []

  return (
    <div className="space-y-5">
      <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <FaArrowLeft size={11} /> {backLabel}
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex flex-shrink-0 w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-sm font-bold text-gray-700">
            {slugFromTitle(title) || slug3}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
                {category && <p className="mt-1 text-sm text-gray-500">{category}</p>}
              </div>
              <div className="flex items-center gap-2">
                {date && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    <FaRegCalendarAlt size={10} /> {date}
                  </span>
                )}
                <button onClick={() => setBookmarked((b) => !b)} className="p-2 text-gray-400 hover:text-red-600" aria-label="Bookmark">
                  {bookmarked ? <FaBookmark size={14} className="text-red-600" /> : <FaRegBookmark size={14} />}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-900" aria-label="Share">
                  <FaShareAlt size={13} />
                </button>
              </div>
            </div>

            {importantDates && (
              <p className="mt-3 text-xs text-gray-500 whitespace-pre-line">{importantDates}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {downloadLink && (
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-red-700"
                >
                  Open Official Page <FaArrowRight size={11} />
                </a>
              )}
              {notificationLink && (
                <a
                  href={notificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Notification
                </a>
              )}
              {websiteLink && (
                <a
                  href={websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {description && (
        <Section title="Description">
          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:text-gray-700 prose-p:text-gray-700">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </Section>
      )}

      {files.length > 0 && (
        <Section title="Files">
          <ul className="space-y-2">
            {files.map((f, idx) => (
              <li key={idx} className="flex items-center justify-between rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm">
                <div className="min-w-0 flex items-center gap-2">
                  <FaFilePdf className="text-red-600 flex-shrink-0" />
                  <div className="truncate text-gray-900 font-medium">{f.title || f.url}</div>
                </div>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 whitespace-nowrap"
                >
                  Download <FaArrowRight size={10} />
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

export default ListingDetail
