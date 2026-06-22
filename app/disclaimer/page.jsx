import StaticPageView from '../../components/StaticPageView'
import { getPage } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  const p = await getPage('disclaimer')
  return pageMetadata({ title: p?.title || 'Disclaimer', description: p?.meta_description || 'Disclaimer for Hire Sarkar.', path: '/disclaimer' })
}

export default function DisclaimerPage() {
  return <StaticPageView slug="disclaimer" fallbackTitle="Disclaimer" />
}
