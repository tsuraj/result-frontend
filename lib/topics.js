import { FaTrain, FaUniversity, FaClipboardCheck, FaBalanceScale, FaShieldAlt } from 'react-icons/fa'

// UI-side topic registry. Backend's TOPICS constant in topics_controller.rb
// is the source of truth for SEARCH MATCH patterns; this file is the source
// of truth for FRONTEND PRESENTATION (icon, accent color, detection patterns
// for inline "more X" links on detail pages).
//
// Keep slugs in sync with backend.
// One shared chip style for all topics — matches the site's neutral palette
// (gray with a single red brand accent). Icons keep their red tint so the
// row reads as branded without going rainbow.
const CHIP_CLASS = 'bg-white text-gray-800 border-gray-200 hover:border-red-300 hover:text-red-700 hover:bg-red-50/50'
const ICON_CLASS = 'text-red-600'

export const TOPICS = [
  {
    slug: 'railway',
    name: 'Railway',
    Icon: FaTrain,
    accent: CHIP_CLASS,
    iconClass: ICON_CLASS,
    // Used by detectTopic() for the inline "more X" link on detail pages.
    detect: ['railway', 'rrb', 'irctc', 'metro', 'rail'],
  },
  {
    slug: 'banking',
    name: 'Banking',
    Icon: FaUniversity,
    accent: CHIP_CLASS,
    iconClass: ICON_CLASS,
    detect: ['bank', 'ibps', 'sbi', 'rbi', 'nabard', 'sidbi'],
  },
  {
    slug: 'ssc',
    name: 'SSC',
    Icon: FaClipboardCheck,
    accent: CHIP_CLASS,
    iconClass: ICON_CLASS,
    detect: ['ssc'],
  },
  {
    slug: 'upsc',
    name: 'UPSC',
    Icon: FaBalanceScale,
    accent: CHIP_CLASS,
    iconClass: ICON_CLASS,
    detect: ['upsc'],
  },
  {
    slug: 'defence',
    name: 'Defence',
    Icon: FaShieldAlt,
    accent: CHIP_CLASS,
    iconClass: ICON_CLASS,
    detect: ['army', 'navy', 'air force', 'defence', 'coast guard', 'bsf', 'crpf', 'cisf', 'itbp', 'ssb', 'police'],
  },
]

// Find which topic a piece of content belongs to. Pass any string fields
// (title, organization, location...). Returns the first matching topic or null.
export function detectTopic(...fields) {
  const text = fields.filter(Boolean).join(' ').toLowerCase()
  if (!text) return null
  for (const t of TOPICS) {
    if (t.detect.some((p) => text.includes(p))) return t
  }
  return null
}
