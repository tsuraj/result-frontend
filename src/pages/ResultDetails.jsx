import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FaArrowLeft, FaArrowRight, FaRegBookmark, FaBookmark, FaShareAlt,
  FaRegCalendarAlt, FaRupeeSign, FaExternalLinkAlt
} from 'react-icons/fa'
import useDocumentMeta from '../hooks/useDocumentMeta'
import { breadcrumb } from '../lib/jsonld'

const formatDate = (value) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const slugFromTitle = (title = '') => {
  const first = title.trim().split(/[\s\-—:]+/)[0] || ''
  return first.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()
}

const InfoTile = ({ icon: Icon, label, value }) => {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {Icon && <Icon size={10} className="text-gray-400" />} {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  )
}

const Section = ({ title, children }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5">
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
    {children}
  </section>
)

const ResultDetails = () => {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/results/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load result')
        return res.json()
      })
      .then(data => setResult(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useDocumentMeta(
    result?.title,
    (result?.description || '').replace(/\s+/g, ' ').trim().slice(0, 160) ||
      (result?.title ? `${result.title} — check result, important dates and download links on Hire Sarkar.` : undefined),
    {
      type: 'article',
      canonical: `/results/${id}`,
      jsonLd: result
        ? breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Results', url: '/results' },
            { name: result.title, url: `/results/${id}` },
          ])
        : null,
    }
  )

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>
  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!result) return <p className="text-gray-500 text-sm">Result not found.</p>

  const title = result.title
  const category = result.category
  const date = formatDate(result.date)
  const description = result.description
  const importantDates = result.important_dates
  const eligibility = result.eligibility
  const selectionProcess = result.selection_process
  const applicationFee = result.application_fee
  const notificationLink = result.notification_link
  const websiteLink = result.website_link
  const downloadLink = result.download_link || result.link
  const links = Array.isArray(result.links) ? result.links : []
  const slug = slugFromTitle(title)

  return (
    <div className="space-y-5">
      <Link to="/results" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <FaArrowLeft size={11} /> Back to Results
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex flex-shrink-0 w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-sm font-bold text-gray-700">
            {slug || 'RES'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
                {category && (
                  <p className="mt-1 text-sm text-gray-500">{category}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {date && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    <FaRegCalendarAlt size={10} /> {date}
                  </span>
                )}
                <button
                  onClick={() => setBookmarked(b => !b)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  aria-label="Bookmark"
                >
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
                  Check Result <FaArrowRight size={11} />
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <InfoTile icon={FaRegCalendarAlt} label="Date" value={date} />
        <InfoTile icon={FaRupeeSign} label="Application Fee" value={applicationFee} />
      </div>

      {description && (
        <Section title="Description">
          <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{description}</p>
        </Section>
      )}

      {eligibility && (
        <Section title="Eligibility">
          <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{eligibility}</p>
        </Section>
      )}

      {selectionProcess && (
        <Section title="Selection Process">
          <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{selectionProcess}</p>
        </Section>
      )}

      {links.length > 0 && (
        <Section title="Important Links">
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{l.title || l.url}</div>
                  {l.link_type && (
                    <div className="text-[10px] uppercase tracking-wide text-gray-500">{l.link_type}</div>
                  )}
                </div>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Open <FaExternalLinkAlt size={10} />
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

export default ResultDetails
