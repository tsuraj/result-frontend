import { getJobStats, getNotifications, getTopicsSummary } from '../lib/api'
import { pageMetadata } from '../lib/seo'
import HomeClient from '../components/HomeClient'
import CategoryGrid from '../components/CategoryGrid'

export const revalidate = 60

export const metadata = pageMetadata({
  title: 'Hire Sarkar — Latest Government Jobs, Results & Admit Cards',
  description:
    'Hire Sarkar brings you the latest Sarkari jobs, results, admit cards, answer keys and syllabus in one place — fast, reliable government recruitment updates for SSC, UPSC, Railway, Banking and State Govt exams.',
  path: '/',
})

export default async function HomePage() {
  let initialStats = { total_active: 0, posted_today: 0, closing_this_week: 0 }
  let initialUpdates = []
  let topicsSummary = null
  try {
    const data = await getJobStats()
    if (data && data.meta) {
      initialStats = {
        total_active: data.meta.total_active ?? data.meta.total ?? 0,
        posted_today: data.meta.posted_today ?? 0,
        closing_this_week: data.meta.closing_this_week ?? 0,
      }
    }
  } catch {
    /* keep defaults */
  }
  try {
    const updates = await getNotifications()
    initialUpdates = Array.isArray(updates) ? updates.slice(0, 6) : []
  } catch {
    /* keep defaults */
  }
  try {
    topicsSummary = await getTopicsSummary()
  } catch {
    /* CategoryGrid will render with no counts */
  }

  return (
    <HomeClient
      initialStats={initialStats}
      initialUpdates={initialUpdates}
      categoryGrid={<CategoryGrid summary={topicsSummary} />}
    />
  )
}
