import EntityListClient from '../../components/EntityListClient'
import FollowCTA from '../../components/FollowCTA'
import ActiveTopicChip from '../../components/ActiveTopicChip'
import { getSyllabi } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'
import { TOPICS } from '../../lib/topics'

export const revalidate = 60

export async function generateMetadata({ searchParams }) {
  const topicSlug = (searchParams?.topic || '').trim().toLowerCase()
  const topic = topicSlug ? TOPICS.find((t) => t.slug === topicSlug) : null
  return pageMetadata({
    title: topic
      ? `${topic.name} Syllabus & Exam Pattern`
      : 'Exam Syllabus 2026 — Government Exam Syllabus & Pattern',
    description: topic
      ? `Detailed ${topic.name} exam syllabus and pattern on Hire Sarkar.`
      : 'Get the latest syllabus and exam pattern for government exams — SSC, UPSC, Railway, Banking and State Govt. Topic-wise syllabus to plan your preparation.',
    path: topic ? `/category/${topic.slug}` : '/syllabus',
    noindex: Boolean(topic),
  })
}

export default async function SyllabusPage({ searchParams }) {
  const topic = (searchParams?.topic || '').trim().toLowerCase()
  const items = await getSyllabi({ topic })
  return (
    <>
      <ActiveTopicChip topicSlug={topic} clearHref="/syllabus" />
      <EntityListClient items={items} basePath="/syllabus" label="Syllabus" fallbackBadge="SY" accent="purple" />
      <FollowCTA />
    </>
  )
}
