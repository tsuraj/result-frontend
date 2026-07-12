import Link from 'next/link'
import { FaArrowRight, FaRegCalendarAlt, FaRupeeSign, FaExternalLinkAlt } from 'react-icons/fa'
import InlineTelegramNudge from './InlineTelegramNudge'

const fmtDate = (v) => {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
const badge = (s = '') => (s.trim().split(/[\s\-—:]+/)[0] || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()

const Section = ({ title, children }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5">
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
    {children}
  </section>
)

// Server-rendered detail for Result / Admit Card / Answer Key / Syllabus.
// `item` is the API record; `backTo`/`backLabel` for the back link;
// `ctaLabel` is the primary action button text (e.g. "Check Result").
export default function EntityDetail({ item, ctaLabel = 'Open', fallbackBadge = 'GOV', telegramKind = 'update' }) {
  // backTo / backLabel props are deprecated — the parent page now renders
  // a <Breadcrumbs /> above this component which provides clearer navigation.
  const downloadLink = item.download_link || item.link
  const links = Array.isArray(item.links) ? item.links : []
  const faqs = Array.isArray(item.faqs) ? item.faqs.filter((f) => f.question && f.answer) : []

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  return (
    <div className="space-y-5">
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex flex-shrink-0 w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 items-center justify-center text-sm font-bold text-gray-700">
            {badge(item.title) || fallbackBadge}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{item.title}</h1>
            {item.category && <p className="mt-1 text-sm text-gray-500">{item.category}</p>}
            {item.important_dates && <p className="mt-3 text-xs text-gray-500 whitespace-pre-line">{item.important_dates}</p>}

            <div className="mt-4 flex flex-wrap gap-3">
              {downloadLink && (
                <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-red-700">
                  {ctaLabel} <FaArrowRight size={11} />
                </a>
              )}
              {item.notification_link && (
                <a href={item.notification_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">Notification</a>
              )}
              {item.website_link && (
                <a href={item.website_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">Official Website</a>
              )}
            </div>
            <InlineTelegramNudge kind={telegramKind} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fmtDate(item.date) && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500"><FaRegCalendarAlt size={10} className="text-gray-400" /> Date</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">{fmtDate(item.date)}</div>
          </div>
        )}
        {item.application_fee && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500"><FaRupeeSign size={10} className="text-gray-400" /> Application Fee</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">{item.application_fee}</div>
          </div>
        )}
        {item.exam_duration && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Exam Duration</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">{item.exam_duration}</div>
          </div>
        )}
        {item.negative_marking && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Negative Marking</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">{item.negative_marking}</div>
          </div>
        )}
      </div>

      {item.description && <Section title="Description"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{item.description}</p></Section>}
      {item.exam_pattern && <Section title="Exam Pattern"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{item.exam_pattern}</p></Section>}
      {item.subject_wise_syllabus && <Section title="Subject-wise Syllabus"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{item.subject_wise_syllabus}</p></Section>}
      {item.eligibility && <Section title="Eligibility"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{item.eligibility}</p></Section>}
      {item.selection_process && <Section title="Selection Process"><p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{item.selection_process}</p></Section>}

      {faqs.length > 0 && (
        <Section title="Frequently Asked Questions">
          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-semibold text-gray-900">{f.question}</h3>
                <p className="mt-1 whitespace-pre-line text-sm text-gray-700 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {item.job?.slug && (
        <Section title="Related Job">
          <Link
            href={`/jobs/${item.job.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            {item.job.title} <FaArrowRight size={11} />
          </Link>
        </Section>
      )}

      {links.length > 0 && (
        <Section title="Important Links">
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{l.title || l.url}</div>
                  {l.link_type && <div className="text-[10px] uppercase tracking-wide text-gray-500">{l.link_type}</div>}
                </div>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700">
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
