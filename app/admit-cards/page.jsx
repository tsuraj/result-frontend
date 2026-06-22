import EntityListClient from '../../components/EntityListClient'
import { getAdmitCards } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 60

export const metadata = pageMetadata({
  title: 'Admit Cards 2026 — Download Government Exam Hall Tickets',
  description: 'Download the latest admit cards and hall tickets for government exams — SSC, UPSC, Railway, Banking and State Govt recruitment. Direct download links and exam dates.',
  path: '/admit-cards',
})

export default async function AdmitCardsPage() {
  const items = await getAdmitCards()
  return <EntityListClient items={items} basePath="/admit-cards" label="Admit Cards" fallbackBadge="AC" accent="blue" />
}
