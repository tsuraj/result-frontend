import EntityListClient from '../../components/EntityListClient'
import FollowCTA from '../../components/FollowCTA'
import ActiveTopicChip from '../../components/ActiveTopicChip'
import InlineFollowStrip from '../../components/InlineFollowStrip'
import { getAdmitCards } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'
import { TOPICS } from '../../lib/topics'

export const revalidate = 60

export async function generateMetadata({ searchParams }) {
  const topicSlug = (searchParams?.topic || '').trim().toLowerCase()
  const topic = topicSlug ? TOPICS.find((t) => t.slug === topicSlug) : null
  return pageMetadata({
    title: topic
      ? `${topic.name} Admit Cards — Download Hall Tickets`
      : 'Admit Cards 2026 — Download Government Exam Hall Tickets',
    description: topic
      ? `Download the latest ${topic.name} admit cards and hall tickets on Hire Sarkar.`
      : 'Download the latest admit cards and hall tickets for government exams — SSC, UPSC, Railway, Banking and State Govt recruitment. Direct download links and exam dates.',
    path: topic ? `/category/${topic.slug}` : '/admit-cards',
    noindex: Boolean(topic),
  })
}

export default async function AdmitCardsPage({ searchParams }) {
  const topic = (searchParams?.topic || '').trim().toLowerCase()
  const items = await getAdmitCards({ topic })
  return (
    <>
      <ActiveTopicChip topicSlug={topic} clearHref="/admit-cards" />
      <InlineFollowStrip />
      <EntityListClient items={items} basePath="/admit-cards" label="Admit Cards" fallbackBadge="AC" accent="blue" />
      <FollowCTA />
    </>
  )
}
