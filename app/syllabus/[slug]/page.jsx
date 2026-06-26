import { notFound, redirect } from 'next/navigation'
import EntityDetail from '../../../components/EntityDetail'
import FollowCTA from '../../../components/FollowCTA'
import RelatedTopicLink from '../../../components/RelatedTopicLink'
import { getSyllabus } from '../../../lib/api'
import { pageMetadata, breadcrumb, articleJsonLd } from '../../../lib/seo'

export const revalidate = 60

const cleanDesc = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 160)
const toIso = (v) => {
  if (!v) return undefined
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export async function generateMetadata({ params }) {
  const item = await getSyllabus(params.slug)
  if (!item) return pageMetadata({ title: 'Syllabus not found', description: 'This syllabus could not be found.', path: `/syllabus/${params.slug}`, noindex: true })
  const canonicalSlug = item.slug || params.slug
  return pageMetadata({
    title: item.title,
    description: cleanDesc(item.description) || `${item.title} — detailed syllabus and exam pattern on Hire Sarkar.`,
    path: `/syllabus/${canonicalSlug}`,
    type: 'article',
  })
}

export default async function SyllabusDetailPage({ params }) {
  const item = await getSyllabus(params.slug)
  if (!item) notFound()
  if (item.slug && item.slug !== params.slug) redirect(`/syllabus/${item.slug}`)
  const path = `/syllabus/${item.slug || params.slug}`
  const description = cleanDesc(item.description) || `${item.title} — syllabus and exam pattern on Hire Sarkar.`
  const article = articleJsonLd({
    title: item.title,
    description,
    path,
    datePublished: toIso(item.date || item.created_at),
    dateModified: toIso(item.updated_at || item.date || item.created_at),
  })
  const crumbs = breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Syllabus', url: '/syllabus' },
    { name: item.title, url: path },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([article, crumbs]) }} />
      <EntityDetail item={item} backTo="/syllabus" backLabel="Syllabus" ctaLabel="View Syllabus" fallbackBadge="SY" />
      <RelatedTopicLink kind="syllabi" fields={[item.title, item.category, item.exam]} />
      <FollowCTA />
    </>
  )
}
