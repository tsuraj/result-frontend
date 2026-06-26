import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import JobCard from '../../../components/JobCard'
import FollowCTA from '../../../components/FollowCTA'
import { getTopic } from '../../../lib/api'
import { pageMetadata, breadcrumb, SITE_URL } from '../../../lib/seo'

export const revalidate = 60

const fmtDate = (v) => {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export async function generateMetadata({ params }) {
  const data = await getTopic(params.slug)
  if (!data?.topic) {
    return pageMetadata({
      title: 'Category not found',
      description: 'This category page does not exist.',
      path: `/category/${params.slug}`,
      noindex: true,
    })
  }
  const { topic, counts = {} } = data
  const total = (counts.jobs || 0) + (counts.results || 0) + (counts.admit_cards || 0) + (counts.answer_keys || 0)
  return pageMetadata({
    title: `${topic.name} Jobs, Results & Admit Cards 2026`,
    description: `${topic.description} ${total ? `Browse ${total} live ${topic.name} updates on Hire Sarkar.` : ''}`.trim(),
    path: `/category/${params.slug}`,
  })
}

const SectionHead = ({ title, count, viewAllHref }) => (
  <div className="flex items-end justify-between mb-3">
    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
      {title}
      {typeof count === 'number' && (
        <span className="ml-2 text-sm font-semibold text-gray-400">({count})</span>
      )}
    </h2>
    {viewAllHref && (
      <Link href={viewAllHref} className="text-sm text-red-600 hover:underline inline-flex items-center gap-1">
        View all <FaArrowRight size={10} />
      </Link>
    )}
  </div>
)

const SimpleRow = ({ item, basePath }) => (
  <Link
    href={`${basePath}/${item.slug || item.id}`}
    className="block rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition p-4"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-snug truncate">{item.title}</h3>
        <div className="mt-1 text-xs text-gray-500">
          {item.category && <span className="mr-2">{item.category}</span>}
          {fmtDate(item.date) && <span>{fmtDate(item.date)}</span>}
        </div>
      </div>
    </div>
  </Link>
)

export default async function CategoryPage({ params }) {
  const data = await getTopic(params.slug)
  if (!data?.topic) notFound()

  const { topic, counts = {}, jobs = [], results = [], admit_cards = [], answer_keys = [], syllabi = [] } = data
  const total = (counts.jobs || 0) + (counts.results || 0) + (counts.admit_cards || 0) + (counts.answer_keys || 0) + (counts.syllabi || 0)

  const crumbs = breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/category' },
    { name: topic.name, url: `/category/${topic.slug}` },
  ])

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${topic.name} Jobs, Results & Admit Cards`,
    description: topic.description,
    url: `${SITE_URL}/category/${topic.slug}`,
    isPartOf: { '@type': 'WebSite', url: `${SITE_URL}/` },
  }

  return (
    <div className="max-w-5xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionJsonLd, crumbs]) }} />

      {/* Hero */}
      <section className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-2">Category</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{topic.name} Jobs, Results &amp; Admit Cards</h1>
        <p className="mt-3 text-gray-600 max-w-2xl">{topic.description}</p>
        {total > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{total.toLocaleString()}</span> live updates across jobs, results, admit cards, answer keys and syllabi.
          </p>
        )}
      </section>

      {/* Jobs */}
      {jobs.length > 0 && (
        <section className="mb-10">
          <SectionHead title={`${topic.name} Jobs`} count={counts.jobs} viewAllHref="/latest-jobs" />
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
      )}

      {/* Results */}
      {results.length > 0 && (
        <section className="mb-10">
          <SectionHead title={`${topic.name} Results`} count={counts.results} viewAllHref="/results" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((r) => <SimpleRow key={r.id} item={r} basePath="/results" />)}
          </div>
        </section>
      )}

      {/* Admit Cards */}
      {admit_cards.length > 0 && (
        <section className="mb-10">
          <SectionHead title={`${topic.name} Admit Cards`} count={counts.admit_cards} viewAllHref="/admit-cards" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {admit_cards.map((a) => <SimpleRow key={a.id} item={a} basePath="/admit-cards" />)}
          </div>
        </section>
      )}

      {/* Answer Keys */}
      {answer_keys.length > 0 && (
        <section className="mb-10">
          <SectionHead title={`${topic.name} Answer Keys`} count={counts.answer_keys} viewAllHref="/answer-keys" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {answer_keys.map((a) => <SimpleRow key={a.id} item={a} basePath="/answer-keys" />)}
          </div>
        </section>
      )}

      {/* Syllabi */}
      {syllabi.length > 0 && (
        <section className="mb-10">
          <SectionHead title={`${topic.name} Syllabus`} count={counts.syllabi} viewAllHref="/syllabus" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {syllabi.map((s) => <SimpleRow key={s.id} item={s} basePath="/syllabus" />)}
          </div>
        </section>
      )}

      {total === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-600 text-sm">No live {topic.name} content right now — check back soon, or follow our channels for instant alerts.</p>
        </div>
      )}

      <FollowCTA heading={`Never miss a ${topic.name} update`} subheading={`Get instant ${topic.name} job, result and admit card alerts the moment they drop.`} />
    </div>
  )
}
