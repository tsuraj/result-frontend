import { FaArrowRight } from 'react-icons/fa'
import { SOCIAL_LINKS } from '../lib/social'

// Default channels we show in the prominent CTA: Telegram + WhatsApp +
// Instagram are the highest-converting for sarkari job content. X and
// Facebook stay in the footer for completeness.
const PRIMARY_KEYS = ['telegram', 'whatsapp', 'instagram']

// Prominent end-of-page call-to-action. Drop above the footer on detail and
// listing pages. Renders three tap-friendly brand buttons in a row (stack on
// mobile). Server component — zero JS payload.
export default function FollowCTA({ variant = 'default', heading, subheading }) {
  const channels = SOCIAL_LINKS.filter((s) => PRIMARY_KEYS.includes(s.key))

  const title = heading || 'Never miss a government job'
  const sub = subheading || 'Get instant alerts the moment a new notification, result or admit card drops.'

  return (
    <section
      aria-label="Follow Hire Sarkar"
      className={`rounded-2xl border border-gray-200 bg-gradient-to-br from-red-50/60 via-white to-blue-50/40 p-6 md:p-8 ${variant === 'compact' ? '' : 'mt-8'}`}
    >
      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-600">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            Stay updated
          </div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
          <p className="mt-1 text-sm text-gray-600 max-w-xl">{sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto md:flex md:items-center md:gap-3">
          {channels.map(({ key, href, label, cta, Icon, btnClass }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={cta}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition ${btnClass}`}
            >
              <Icon size={16} />
              <span>{label}</span>
              <FaArrowRight size={10} className="ml-0.5 opacity-80" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
