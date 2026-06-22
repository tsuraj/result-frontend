import StaticPageView from '../../components/StaticPageView'
import { getPage } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  const p = await getPage('contact')
  return pageMetadata({ title: p?.title || 'Contact Us', description: p?.meta_description || 'Get in touch with Hire Sarkar.', path: '/contact' })
}

export default function ContactPage() {
  return <StaticPageView slug="contact" fallbackTitle="Contact Us" />
}
