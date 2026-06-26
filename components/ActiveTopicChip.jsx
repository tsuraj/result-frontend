import Link from 'next/link'
import { FaTimes } from 'react-icons/fa'
import { TOPICS } from '../lib/topics'

// Visual indicator + clear button shown on listing pages when a ?topic=
// filter is active. Renders nothing if the topic slug isn't recognized.
export default function ActiveTopicChip({ topicSlug, clearHref }) {
  if (!topicSlug) return null
  const topic = TOPICS.find((t) => t.slug === topicSlug)
  if (!topic) return null

  const { name, Icon, accent, iconClass } = topic
  return (
    <div className="mb-4 flex items-center gap-2 text-sm">
      <span className="text-gray-500">Filtered:</span>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${accent} font-semibold`}>
        <Icon size={11} className={iconClass} />
        {name}
      </span>
      <Link href={clearHref} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
        <FaTimes size={10} /> Clear
      </Link>
    </div>
  )
}
