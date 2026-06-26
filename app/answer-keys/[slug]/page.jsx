import { notFound, redirect } from 'next/navigation'
import EntityDetail from '../../../components/EntityDetail'
import FollowCTA from '../../../components/FollowCTA'
import { getAnswerKey } from '../../../lib/api'
import { pageMetadata, breadcrumb, articleJsonLd } from '../../../lib/seo'

export const revalidate = 60

const cleanDesc = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 160)
const toIso = (v) => {
  if (!v) return undefined
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export async function generateMetadata({ params }) {
  const item = await getAnswerKey(params.slug)
  if (!item) return pageMetadata({ title: 'Answer key not found', description: 'This answer key could not be found.', path: `/answer-keys/${params.slug}`, noindex: true })
  const canonicalSlug = item.slug || params.slug
  return pageMetadata({
    title: item.title,
    description: cleanDesc(item.description) || `${item.title} — download answer key and details on Hire Sarkar.`,
    path: `/answer-keys/${canonicalSlug}`,
    type: 'article',
  })
}

export default async function AnswerKeyDetailPage({ params }) {
  const item = await getAnswerKey(params.slug)
  if (!item) notFound()
  if (item.slug && item.slug !== params.slug) redirect(`/answer-keys/${item.slug}`)
  const path = `/answer-keys/${item.slug || params.slug}`
  const description = cleanDesc(item.description) || `${item.title} — answer key details on Hire Sarkar.`
  const article = articleJsonLd({
    title: item.title,
    description,
    path,
    datePublished: toIso(item.date || item.created_at),
    dateModified: toIso(item.updated_at || item.date || item.created_at),
  })
  const crumbs = breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Answer Keys', url: '/answer-keys' },
    { name: item.title, url: path },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([article, crumbs]) }} />
      <EntityDetail item={item} backTo="/answer-keys" backLabel="Answer Keys" ctaLabel="Download Answer Key" fallbackBadge="AK" />
      <FollowCTA />
    </>
  )
}
