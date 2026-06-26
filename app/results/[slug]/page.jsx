import { notFound, redirect } from 'next/navigation'
import EntityDetail from '../../../components/EntityDetail'
import FollowCTA from '../../../components/FollowCTA'
import { getResult } from '../../../lib/api'
import { pageMetadata, breadcrumb, articleJsonLd } from '../../../lib/seo'

export const revalidate = 60

const cleanDesc = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 160)
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
      <EntityDetail item={item} backTo="/results" backLabel="Results" ctaLabel="Check Result" fallbackBadge="RES" />
      <FollowCTA />
    </>
  )
}
