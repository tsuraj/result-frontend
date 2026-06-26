import EntityListClient from '../../components/EntityListClient'
import FollowCTA from '../../components/FollowCTA'
import ActiveTopicChip from '../../components/ActiveTopicChip'
import { getResults } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'
import { TOPICS } from '../../lib/topics'

export const revalidate = 60

export async function generateMetadata({ searchParams }) {
  const topicSlug = (searchParams?.topic || '').trim().toLowerCase()
  const topic = topicSlug ? TOPICS.find((t) => t.slug === topicSlug) : null
  return pageMetadata({
    title: topic
      ? `${topic.name} Results — Latest Government Exam Results`
      : 'Sarkari Results 2026 — Latest Government Exam Results',
    description: topic
      ? `All current ${topic.name} exam result updates on Hire Sarkar.`
      : 'Check the latest Sarkari results and government exam results for SSC, UPSC, Railway, Banking and State Govt exams. Fast, reliable result updates with direct links.',
    path: topic ? `/category/${topic.slug}` : '/results',
    noindex: Boolean(topic),
  })
}

export default async function ResultsPage({ searchParams }) {
  const topic = (searchParams?.topic || '').trim().toLowerCase()
  const items = await getResults({ topic })
  return (
    <>
      <ActiveTopicChip topicSlug={topic} clearHref="/results" />
      <EntityListClient items={items} basePath="/results" label="Results" fallbackBadge="RES" accent="blue" />
      <FollowCTA />
    </>
  )
}
