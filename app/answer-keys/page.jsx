import EntityListClient from '../../components/EntityListClient'
import FollowCTA from '../../components/FollowCTA'
import ActiveTopicChip from '../../components/ActiveTopicChip'
import InlineFollowStrip from '../../components/InlineFollowStrip'
import { getAnswerKeys } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'
import { TOPICS } from '../../lib/topics'

export const revalidate = 60

export async function generateMetadata({ searchParams }) {
  const topicSlug = (searchParams?.topic || '').trim().toLowerCase()
  const topic = topicSlug ? TOPICS.find((t) => t.slug === topicSlug) : null
  return pageMetadata({
    title: topic
      ? `${topic.name} Answer Keys — Government Exams`
      : 'Answer Keys 2026 — Government Exam Answer Keys',
    description: topic
      ? `Official and provisional ${topic.name} exam answer keys on Hire Sarkar.`
      : 'Download official and provisional answer keys for the latest government exams — SSC, UPSC, Railway, Banking and State Govt. Compare responses and raise objections on time.',
    path: topic ? `/category/${topic.slug}` : '/answer-keys',
    noindex: Boolean(topic),
  })
}

export default async function AnswerKeysPage({ searchParams }) {
  const topic = (searchParams?.topic || '').trim().toLowerCase()
  const items = await getAnswerKeys({ topic })
  return (
    <>
      <ActiveTopicChip topicSlug={topic} clearHref="/answer-keys" />
      <InlineFollowStrip />
      <EntityListClient items={items} basePath="/answer-keys" label="Answer Keys" fallbackBadge="AK" accent="blue" />
      <FollowCTA />
    </>
  )
}
