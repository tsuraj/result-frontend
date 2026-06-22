import StaticPageView from '../../components/StaticPageView'
import { getPage } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 300

export async function generateMetadata() {
  const p = await getPage('privacy')
  return pageMetadata({ title: p?.title || 'Privacy Policy', description: p?.meta_description || 'Privacy Policy of Hire Sarkar.', path: '/privacy' })
}

export default function PrivacyPage() {
  return <StaticPageView slug="privacy" fallbackTitle="Privacy Policy" />
}
