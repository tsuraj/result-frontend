import EntityListClient from '../../components/EntityListClient'
import FollowCTA from '../../components/FollowCTA'
import { getResults } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 60

export const metadata = pageMetadata({
  title: 'Sarkari Results 2026 — Latest Government Exam Results',
  description: 'Check the latest Sarkari results and government exam results for SSC, UPSC, Railway, Banking and State Govt exams. Fast, reliable result updates with direct links.',
  path: '/results',
})

export default async function ResultsPage() {
  const items = await getResults()
  return (
    <>
      <EntityListClient items={items} basePath="/results" label="Results" fallbackBadge="RES" accent="blue" />
      <FollowCTA />
    </>
  )
}
