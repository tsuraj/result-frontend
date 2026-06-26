import EntityListClient from '../../components/EntityListClient'
import FollowCTA from '../../components/FollowCTA'
import { getAnswerKeys } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 60

export const metadata = pageMetadata({
  title: 'Answer Keys 2026 — Government Exam Answer Keys',
  description: 'Download official and provisional answer keys for the latest government exams — SSC, UPSC, Railway, Banking and State Govt. Compare responses and raise objections on time.',
  path: '/answer-keys',
})

export default async function AnswerKeysPage() {
  const items = await getAnswerKeys()
  return (
    <>
      <EntityListClient items={items} basePath="/answer-keys" label="Answer Keys" fallbackBadge="AK" accent="blue" />
      <FollowCTA />
    </>
  )
}
