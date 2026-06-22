import StaticPageView from '../../components/StaticPageView'
import { getPage } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  const p = await getPage('terms')
  return pageMetadata({ title: p?.title || 'Terms & Conditions', description: p?.meta_description || 'Terms & Conditions of Hire Sarkar.', path: '/terms' })
}

export default function TermsPage() {
  return <StaticPageView slug="terms" fallbackTitle="Terms & Conditions" />
}
