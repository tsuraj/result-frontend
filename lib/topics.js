import { FaTrain, FaUniversity, FaClipboardCheck, FaBalanceScale, FaShieldAlt } from 'react-icons/fa'

// UI-side topic registry. Backend's TOPICS constant in topics_controller.rb
// is the source of truth for SEARCH MATCH patterns; this file is the source
// of truth for FRONTEND PRESENTATION (icon, accent color, detection patterns
// for inline "more X" links on detail pages).
//
// Keep slugs in sync with backend.
export const TOPICS = [
  {
    slug: 'railway',
    name: 'Railway',
    Icon: FaTrain,
    // Tailwind classes for icon + tile accent.
    accent: 'bg-orange-50 text-orange-700 border-orange-200',
    // Used by detectTopic() for the inline "more X" link on detail pages.
    detect: ['railway', 'rrb', 'irctc', 'metro', 'rail'],
  },
  {
    slug: 'banking',
    name: 'Banking',
    Icon: FaUniversity,
    accent: 'bg-green-50 text-green-700 border-green-200',
    detect: ['bank', 'ibps', 'sbi', 'rbi', 'nabard', 'sidbi'],
  },
  {
    slug: 'ssc',
    name: 'SSC',
    Icon: FaClipboardCheck,
    accent: 'bg-blue-50 text-blue-700 border-blue-200',
    detect: ['ssc'],
  },
  {
    slug: 'upsc',
    name: 'UPSC',
    Icon: FaBalanceScale,
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    detect: ['upsc'],
  },
  {
    slug: 'defence',
    name: 'Defence',
    Icon: FaShieldAlt,
    accent: 'bg-red-50 text-red-700 border-red-200',
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
