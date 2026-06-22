import { notFound } from 'next/navigation'
import EntityDetail from '../../../components/EntityDetail'
import { getAdmitCard } from '../../../lib/api'
import { pageMetadata, breadcrumb, articleJsonLd } from '../../../lib/seo'

export const revalidate = 300

const cleanDesc = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 160)
const toIso = (v) => {
  if (!v) return undefined
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export async function generateMetadata({ params }) {
  const item = await getAdmitCard(params.slug)
  if (!item) return pageMetadata({ title: 'Admit card not found', description: 'This admit card could not be found.', path: `/admit-cards/${params.slug}`, noindex: true })
  return pageMetadata({
    title: item.title,
    description: cleanDesc(item.description) || `${item.title} — download admit card, exam date and details on Hire Sarkar.`,
    path: `/admit-cards/${params.slug}`,
    type: 'article',
  })
}

export default async function AdmitCardDetailPage({ params }) {
  const item = await getAdmitCard(params.slug)
  if (!item) notFound()
  const path = `/admit-cards/${params.slug}`
  const description = cleanDesc(item.description) || `${item.title} — admit card details on Hire Sarkar.`
  const article = articleJsonLd({
    title: item.title,
    description,
    path,
    datePublished: toIso(item.date || item.created_at),
    dateModified: toIso(item.updated_at || item.date || item.created_at),
  })
  const crumbs = breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Admit Cards', url: '/admit-cards' },
    { name: item.title, url: path },
  ])
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([article, crumbs]) }} />
      <EntityDetail item={item} backTo="/admit-cards" backLabel="Admit Cards" ctaLabel="Download Admit Card" fallbackBadge="AC" />
    </>
  )
}
