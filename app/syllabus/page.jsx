import EntityListClient from '../../components/EntityListClient'
import { getSyllabi } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'

export const revalidate = 300

export const metadata = pageMetadata({
  title: 'Exam Syllabus 2026 — Government Exam Syllabus & Pattern',
  description: 'Get the latest syllabus and exam pattern for government exams — SSC, UPSC, Railway, Banking and State Govt. Topic-wise syllabus to plan your preparation.',
  path: '/syllabus',
})

export default async function SyllabusPage() {
  const items = await getSyllabi()
  return <EntityListClient items={items} basePath="/syllabus" label="Syllabus" fallbackBadge="SY" accent="purple" />
}
