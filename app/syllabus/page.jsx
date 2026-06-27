import Link from 'next/link'
import { FaArrowRight, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import EntityListClient from '../../components/EntityListClient'
import FollowCTA from '../../components/FollowCTA'
import ActiveTopicChip from '../../components/ActiveTopicChip'
import InlineFollowStrip from '../../components/InlineFollowStrip'
import { getSyllabi } from '../../lib/api'
import { pageMetadata } from '../../lib/seo'
import { TOPICS } from '../../lib/topics'
import { SOCIAL_LINKS } from '../../lib/social'

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
    // Keep /syllabus out of the index until we publish content. Once
    // entries exist, remove this `noindex || empty` guard.
    noindex: Boolean(topic),
  })
}

// Friendly "coming soon" panel shown when there are zero syllabus entries.
// Users who reach this page via a bookmark or social share see something
// intentional instead of an empty list.
function ComingSoonPanel() {
  const telegram = SOCIAL_LINKS.find((s) => s.key === 'telegram')
  const whatsapp = SOCIAL_LINKS.find((s) => s.key === 'whatsapp')
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-3">Coming soon</p>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Exam syllabus library</h1>
      <p className="mt-4 text-gray-600">
        We&apos;re curating detailed syllabi and exam patterns for SSC, UPSC, Railway, Banking and Defence.
        Follow our channels and we&apos;ll ping you the moment they&apos;re live.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        {telegram && (
          <a
            href={telegram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#26A5E4] hover:bg-[#1e92ca] text-white text-sm font-semibold px-5 py-2.5 rounded-md"
          >
            <FaTelegramPlane size={14} /> Join Telegram <FaArrowRight size={10} />
          </a>
        )}
        {whatsapp && (
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-semibold px-5 py-2.5 rounded-md"
          >
            <FaWhatsapp size={14} /> Follow on WhatsApp <FaArrowRight size={10} />
          </a>
        )}
      </div>
      <div className="mt-8 text-xs text-gray-500">
        Meanwhile, browse{' '}
        <Link href="/latest-jobs" className="text-red-600 hover:underline">latest jobs</Link>,{' '}
        <Link href="/results" className="text-red-600 hover:underline">results</Link>{' '}
        or <Link href="/admit-cards" className="text-red-600 hover:underline">admit cards</Link>.
      </div>
    </div>
  )
}

export default async function SyllabusPage({ searchParams }) {
  const topic = (searchParams?.topic || '').trim().toLowerCase()
  const items = await getSyllabi({ topic })

  if (!items.length) {
    return (
      <>
        <ComingSoonPanel />
        <FollowCTA />
      </>
    )
  }

  return (
    <>
      <ActiveTopicChip topicSlug={topic} clearHref="/syllabus" />
      <InlineFollowStrip />
      <EntityListClient items={items} basePath="/syllabus" label="Syllabus" fallbackBadge="SY" accent="purple" />
      <FollowCTA />
    </>
  )
}
