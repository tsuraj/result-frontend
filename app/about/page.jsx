import StaticPageView from '../../components/StaticPageView'
import { getPage } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 300

export async function generateMetadata() {
  const p = await getPage('about')
  return pageMetadata({ title: p?.title || 'About Us', description: p?.meta_description || 'About Hire Sarkar.', path: '/about' })
}

export default function AboutPage() {
  return <StaticPageView slug="about" fallbackTitle="About Us" />
}
