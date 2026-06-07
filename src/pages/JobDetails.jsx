import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FaArrowLeft, FaArrowRight, FaRegBookmark, FaBookmark, FaShareAlt,
  FaMapMarkerAlt, FaRupeeSign, FaUsers, FaBriefcase, FaRegCalendarAlt, FaRegClock
} from 'react-icons/fa'
import useDocumentMeta, { SITE_URL, SITE_NAME } from '../hooks/useDocumentMeta'
import { breadcrumb } from '../lib/jsonld'

const toIso = (value) => {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

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

const daysFromNow = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
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

const JobDetails = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jobs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load job')
        return res.json()
      })
      .then(data => setJob(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  // SEO meta + Google "JobPosting" structured data (must run before early returns)
  const md = job?.job_detail || {}
  const metaTitle = md.title || job?.title
  const metaOrg = md.organization || job?.organization
  const metaDesc =
    (md.description || '').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    (metaTitle
      ? `${metaTitle}${metaOrg ? ` by ${metaOrg}` : ''} — eligibility, important dates, fees and how to apply online on Hire Sarkar.`
      : undefined)

  const jobJsonLd = job
    ? {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: metaTitle,
        description: md.description || metaDesc || metaTitle,
        datePosted: toIso(job.created_at || md.start_date),
        validThrough: toIso(md.last_date || job.last_date),
        employmentType: md.type ? String(md.type).toUpperCase() : undefined,
        hiringOrganization: metaOrg
          ? { '@type': 'Organization', name: metaOrg }
          : { '@type': 'Organization', name: SITE_NAME, sameAs: SITE_URL },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: md.location || undefined,
            addressCountry: 'IN',
          },
        },
        url: `${SITE_URL}/jobs/${id}`,
        directApply: Boolean(md.apply_link || job.link),
      }
    : null

  const jsonLd = job
    ? [
        jobJsonLd,
        breadcrumb([
          { name: 'Home', url: '/' },
          { name: 'Latest Jobs', url: '/latest-jobs' },
          { name: metaTitle, url: `/jobs/${id}` },
        ]),
      ]
    : null

  useDocumentMeta(metaTitle, metaDesc, {
    type: 'article',
    canonical: `/jobs/${id}`,
    jsonLd,
  })

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>
  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!job) return <p className="text-gray-500 text-sm">Job not found.</p>

  const detail = job.job_detail || {}
  const title = detail.title || job.title
  const organization = detail.organization || job.organization
  const lastDateRaw = detail.last_date || job.last_date
  const lastDate = formatDate(lastDateRaw)
  const startDate = formatDate(detail.start_date)
  const applyLink = detail.apply_link || job.link
  const qualification = Array.isArray(detail.qualification) ? detail.qualification : null
  const paymentMode = Array.isArray(detail.payment_mode) ? detail.payment_mode : null
  const fees = detail.application_fees && typeof detail.application_fees === 'object' ? detail.application_fees : null
  const slug = slugFromTitle(title)
  const daysLeft = daysFromNow(lastDateRaw)

  let status = null
  if (daysLeft !== null) {
    if (daysLeft < 0) status = { label: 'CLOSED', tone: 'bg-gray-100 text-gray-600' }
    else if (daysLeft <= 7) status = { label: `${daysLeft} D LEFT`, tone: 'bg-orange-50 text-orange-700 border border-orange-200', icon: FaRegClock }
    else status = { label: 'OPEN', tone: 'bg-green-50 text-green-700' }
  }

  return (
    <div className="space-y-5">
      <Link to="/latest-jobs" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <FaArrowLeft size={11} /> Back to Latest Jobs
      </Link>

      {/* Header card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex flex-shrink-0 w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-sm font-bold text-gray-700">
            {slug || 'JOB'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
                {organization && (
                  <p className="mt-1 text-sm text-gray-500">{organization}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {status && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${status.tone}`}>
                    {status.icon && <status.icon size={10} />} {status.label}
                  </span>
                )}
                {detail.type && (
                  <span className="inline-flex items-center text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    {detail.type.toUpperCase()}
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

            {detail.important_dates && (
              <p className="mt-3 text-xs text-gray-500 whitespace-pre-line">{detail.important_dates}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {applyLink && (
                <a
                  href={applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-red-700"
                >
                  Apply Now <FaArrowRight size={11} />
                </a>
              )}
              {detail.notification_link && (
                <a
                  href={detail.notification_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Notification
                </a>
              )}
              {detail.website_link && (
                <a
                  href={detail.website_link}
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

      {/* Key info tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <InfoTile icon={FaMapMarkerAlt} label="Location" value={detail.location} />
        <InfoTile icon={FaRupeeSign} label="Salary" value={detail.salary} />
        <InfoTile icon={FaBriefcase} label="Experience" value={detail.experience} />
        <InfoTile icon={FaUsers} label="Total posts" value={detail.total_posts && Number(detail.total_posts).toLocaleString()} />
        <InfoTile icon={FaRegCalendarAlt} label="Start date" value={startDate} />
        <InfoTile icon={FaRegCalendarAlt} label="Last date" value={lastDate} />
      </div>

      {/* Sections */}
      {detail.description && (
        <Section title="Description">
          <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{detail.description}</p>
        </Section>
      )}

      {qualification && qualification.length > 0 && (
        <Section title="Qualification">
          <ul className="space-y-2 text-sm text-gray-700">
            {qualification.map((q, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {fees && (
        <Section title="Application Fees">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(fees).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between rounded-md bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm">
                <span className="text-gray-600">{category}</span>
                <span className="font-semibold text-gray-900">{amount}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {paymentMode && paymentMode.length > 0 && (
        <Section title="Payment Mode">
          <div className="flex flex-wrap gap-2">
            {paymentMode.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-md bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700">{m}</span>
            ))}
          </div>
        </Section>
      )}

      {detail.how_to_apply && (
        <Section title="How to apply">
          <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{detail.how_to_apply}</p>
        </Section>
      )}
    </div>
  )
}

export default JobDetails
