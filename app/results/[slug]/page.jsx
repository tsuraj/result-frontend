import { notFound, redirect } from 'next/navigation'
import EntityDetail from '../../../components/EntityDetail'
import FollowCTA from '../../../components/FollowCTA'
import RelatedTopicLink from '../../../components/RelatedTopicLink'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { getResult, getResults } from '../../../lib/api'
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
  const item = await getResult(params.slug)
  if (!item) return pageMetadata({ title: 'Result not found', description: 'This result could not be found.', path: `/results/${params.slug}`, noindex: true })
  const canonicalSlug = item.slug || params.slug
  return pageMetadata({
    title: item.title,
    description: cleanDesc(item.description) || `${item.title} — check result, important dates and download links on Hire Sarkar.`,
    path: `/results/${canonicalSlug}`,
    type: 'article',
  })
}

export default async function ResultDetailPage({ params }) {
  const item = await getResult(params.slug)
  if (!item) notFound()
  if (item.slug && item.slug !== params.slug) redirect(`/results/${item.slug}`)
  const path = `/results/${item.slug || params.slug}`
  const description = cleanDesc(item.description) || `${item.title} — official result update on Hire Sarkar.`

  // Same-topic related results (falls back to latest if no topic match).
  const topic = detectTopic(item.title, item.category)
  let relatedResults = []
  try {
    const list = topic ? await getResults({ topic: topic.slug }) : await getResults({})
    relatedResults = list.filter((r) => r.id !== item.id && r.slug !== params.slug).slice(0, 6)
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
    { name: 'Results', url: '/results' },
    { name: item.title, url: path },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([article, crumbs]) }} />
      <Breadcrumbs items={[
        { name: 'Home', href: '/' },
        { name: 'Results', href: '/results' },
        { name: item.title },
      ]} />
      <EntityDetail item={item} ctaLabel="Check Result" fallbackBadge="RES" telegramKind="result" />
      <RelatedItems
        items={relatedResults}
        basePath="/results"
        heading={topic ? `More ${topic.name} results` : 'More results'}
      />
      <RelatedTopicLink kind="results" fields={[item.title, item.category]} />
      <FollowCTA />
    </>
  )
}
