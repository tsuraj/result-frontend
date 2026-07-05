import { notFound, redirect } from 'next/navigation'
import EntityDetail from '../../../components/EntityDetail'
import FollowCTA from '../../../components/FollowCTA'
import RelatedTopicLink from '../../../components/RelatedTopicLink'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { getSyllabus, getSyllabi } from '../../../lib/api'
import { pageMetadata, breadcrumb, articleJsonLd, cleanDescription } from '../../../lib/seo'
import { detectTopic } from '../../../lib/topics'
import RelatedItems from '../../../components/RelatedItems'

export const revalidate = 60

const cleanDesc = (s) => cleanDescription(s)
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

  const topic = detectTopic(item.title, item.category, item.exam)
  let relatedSyllabi = []
  try {
    const list = topic ? await getSyllabi({ topic: topic.slug }) : await getSyllabi({})
    relatedSyllabi = list.filter((r) => r.id !== item.id && r.slug !== params.slug).slice(0, 6)
  } catch { /* keep empty */ }
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
      <Breadcrumbs items={[
        { name: 'Home', href: '/' },
        { name: 'Syllabus', href: '/syllabus' },
        { name: item.title },
      ]} />
      <EntityDetail item={item} ctaLabel="View Syllabus" fallbackBadge="SY" telegramKind="syllabus" />
      <RelatedItems
        items={relatedSyllabi}
        basePath="/syllabus"
        heading={topic ? `More ${topic.name} syllabi` : 'More syllabi'}
      />
      <RelatedTopicLink kind="syllabi" fields={[item.title, item.category, item.exam]} />
      <FollowCTA />
    </>
  )
}
