import { FaTelegramPlane, FaArrowRight } from 'react-icons/fa'
import { SOCIAL_LINKS } from '../lib/social'

// Small, low-key Telegram link rendered immediately below the primary
// action buttons (Apply Now / Download / Check Result) on detail pages.
//
// Placement rationale: this is the moment users have the highest intent —
// they've just decided to engage. A subtle "and get future alerts" prompt
// converts better here than at the bottom of the page (where many never
// scroll). Designed to whisper, not shout — small text, brand blue,
// underline-style affordance.
//
// Server component, zero JS payload.
export default function InlineTelegramNudge({ kind = 'updates' }) {
  const telegram = SOCIAL_LINKS.find((s) => s.key === 'telegram')
  if (!telegram) return null

  return (
    <a
      href={telegram.href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#26A5E4] hover:text-[#1e92ca] hover:underline"
    >
      <FaTelegramPlane size={11} />
      Get every {kind} update on Telegram
      <FaArrowRight size={9} />
    </a>
  )
}
