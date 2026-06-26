import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { detectTopic } from '../lib/topics'

// One-line link to a category hub, shown above the FollowCTA on detail
// pages. Renders nothing if the item doesn't clearly belong to any of our
// configured topics. Pure server component — zero JS payload.
//
// Pass any string fields that identify the item (title, organization,
// location, etc.). `kind` controls the link copy ("Railway jobs" vs.
// "Railway results").
export default function RelatedTopicLink({ kind = 'updates', fields = [] }) {
  const topic = detectTopic(...fields)
  if (!topic) return null

  const { Icon, iconClass } = topic
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-4 flex items-center gap-3">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
        <Icon size={15} className={iconClass} />
      </div>
      <div className="flex-1 min-w-0 text-sm text-gray-700">
        Looking for more <span className="font-semibold text-gray-900">{topic.name}</span> {kind}?
      </div>
      <Link
        href={`/category/${topic.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
      >
        Browse all {topic.name} updates <FaArrowRight size={10} />
      </Link>
    </div>
  )
}
