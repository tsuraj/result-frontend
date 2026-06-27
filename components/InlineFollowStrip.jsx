import { FaArrowRight, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { SOCIAL_LINKS } from '../lib/social'

// Compact desktop-only strip rendered near the top of listing / category
// pages, just under the header. Catches visitors at the moment of arrival
// (before they scroll into the items). Hidden on mobile — StickyMobileFollow
// covers that audience instead, no need to double up.
//
// Server component — zero JS payload.
export default function InlineFollowStrip() {
  const telegram = SOCIAL_LINKS.find((s) => s.key === 'telegram')
  const whatsapp = SOCIAL_LINKS.find((s) => s.key === 'whatsapp')
  if (!telegram) return null

  return (
    <div className="hidden md:flex items-center justify-between gap-3 mb-5 rounded-lg border border-gray-200 bg-gradient-to-r from-red-50/70 via-white to-blue-50/50 px-4 py-2.5">
      <div className="flex items-center gap-3 text-sm text-gray-700 min-w-0">
        <span className="inline-flex flex-shrink-0 items-center justify-center w-7 h-7 rounded-full bg-[#26A5E4] text-white">
          <FaTelegramPlane size={13} />
        </span>
        <span className="truncate">
          <span className="font-semibold text-gray-900">Get instant job alerts.</span>{' '}
          <span className="text-gray-600">Be the first to know when a new notification drops.</span>
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href={telegram.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#26A5E4] hover:bg-[#1e92ca] text-white text-xs font-semibold"
        >
          Join Telegram <FaArrowRight size={9} />
        </a>
        {whatsapp && (
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-gray-800 text-xs font-semibold hover:bg-gray-50"
          >
            <FaWhatsapp size={11} className="text-[#25D366]" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
