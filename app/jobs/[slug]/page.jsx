import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaRupeeSign, FaUsers,
  FaBriefcase, FaRegCalendarAlt,
} from 'react-icons/fa'
import { getJob } from '../../../lib/api'
import FollowCTA from '../../../components/FollowCTA'
import RelatedTopicLink from '../../../components/RelatedTopicLink'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, pageMetadata, breadcrumb } from '../../../lib/seo'

export const revalidate = 60

const fmtDate = (v) => {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
const toIso = (v) => {
  if (!v) return undefined
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

const EMPLOYMENT_TYPE_MAP = {
  'full time': 'FULL_TIME', 'full-time': 'FULL_TIME', fulltime: 'FULL_TIME', permanent: 'FULL_TIME', regular: 'FULL_TIME',
  'part time': 'PART_TIME', 'part-time': 'PART_TIME',
  contract: 'CONTRACTOR', contractual: 'CONTRACTOR', contractor: 'CONTRACTOR',
  temporary: 'TEMPORARY', temp: 'TEMPORARY',
  internship: 'INTERN', intern: 'INTERN', apprentice: 'INTERN', apprenticeship: 'INTERN',
}
const employmentTypeEnum = (t) =>
  t ? (EMPLOYMENT_TYPE_MAP[String(t).trim().toLowerCase()] || 'FULL_TIME') : 'FULL_TIME'

const parseBaseSalary = (text) => {
  if (!text) return undefined
  const nums = String(text).replace(/[,\s]/g, '').match(/\d{3,}/g)
  if (!nums) return undefined
  const values = nums.map(Number).filter((n) => n >= 1000)
  if (!values.length) return undefined
  const min = Math.min(...values)
  const max = Math.max(...values)
  const value = min === max
    ? { '@type': 'QuantitativeValue', value: min, unitText: 'MONTH' }
    : { '@type': 'QuantitativeValue', minValue: min, maxValue: max, unitText: 'MONTH' }
  return { '@type': 'MonetaryAmount', currency: 'INR', value }
}

const cleanDesc = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 160)

export async function generateMetadata({ params }) {
  const job = await getJob(params.slug)
  if (!job) return pageMetadata({ title: 'Job not found', description: 'This job posting could not be found.', path: `/jobs/${params.slug}`, noindex: true })
  const d = job.job_detail || {}
  const title = d.title || job.title
  const org = d.organization || job.organization
  const desc = cleanDesc(d.description) || `${title}${org ? ` by ${org}` : ''} — eligibility, important dates, fees and how to apply on Hire Sarkar.`
  const canonicalSlug = job.slug || params.slug
  return pageMetadata({ title, description: desc, path: `/jobs/${canonicalSlug}`, type: 'article' })
}

const Section = ({ title, children }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5">
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
    {children}
  </section>
)

const Tile = ({ icon: Icon, label, value }) => {
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

export default async function JobDetailPage({ params }) {
  const job = await getJob(params.slug)
  if (!job) notFound()
  if (job.slug && job.slug !== params.slug) redirect(`/jobs/${job.slug}`)
  const slug = job.slug || params.slug

  const d = job.job_detail || {}
  const title = d.title || job.title
  const organization = d.organization || job.organization
  const qualification = Array.isArray(d.qualification) ? d.qualification : null
  const applyLink = d.apply_link || job.link

  const jobPosting = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description: d.description || `${title} — apply online on Hire Sarkar.`,
    datePosted: toIso(job.created_at || d.start_date),
    validThrough: toIso(d.last_date || job.last_date),
    employmentType: employmentTypeEnum(d.type),
    hiringOrganization: organization
      ? { '@type': 'Organization', name: organization }
      : { '@type': 'Organization', name: SITE_NAME, sameAs: SITE_URL },
    baseSalary: parseBaseSalary(d.salary),
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: d.location || undefined, addressCountry: 'IN' } },
    url: `${SITE_URL}/jobs/${slug}`,
    image: [DEFAULT_OG_IMAGE],
    directApply: Boolean(applyLink),
  }
  const crumbs = breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Latest Jobs', url: '/latest-jobs' },
    { name: title, url: `/jobs/${slug}` },
  ])

  return (
    <div className="space-y-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jobPosting, crumbs]) }} />

      <Link href="/latest-jobs" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <FaArrowLeft size={11} /> Back to Latest Jobs
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
        {organization && <p className="mt-1 text-sm text-gray-500">{organization}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          {applyLink && (
            <a href={applyLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-red-700">
              Apply Now <FaArrowRight size={11} />
            </a>
          )}
          {d.notification_link && (
            <a href={d.notification_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">Notification</a>
          )}
          {d.website_link && (
            <a href={d.website_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">Official Website</a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Tile icon={FaMapMarkerAlt} label="Location" value={d.location} />
        <Tile icon={FaRupeeSign} label="Salary" value={d.salary} />
        <Tile icon={FaBriefcase} label="Experience" value={d.experience} />
        <Tile icon={FaUsers} label="Total posts" value={d.total_posts && Number(d.total_posts).toLocaleString()} />
        <Tile icon={FaRegCalendarAlt} label="Start date" value={fmtDate(d.start_date)} />
        <Tile icon={FaRegCalendarAlt} label="Last date" value={fmtDate(d.last_date || job.last_date)} />
      </div>

      {d.description && <Section title="Description"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{d.description}</p></Section>}
      {d.eligibility && <Section title="Eligibility"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{d.eligibility}</p></Section>}
      {d.selection_process && <Section title="Selection Process"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{d.selection_process}</p></Section>}

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

      {d.how_to_apply && <Section title="How to apply"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{d.how_to_apply}</p></Section>}
      {d.important_dates && <Section title="Important Dates"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{d.important_dates}</p></Section>}

      <RelatedTopicLink kind="jobs" fields={[title, organization, d.location]} />
      <FollowCTA />
    </div>
  )
}
