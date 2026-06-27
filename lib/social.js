import {
  FaFacebook, FaTwitter, FaInstagram, FaTelegramPlane, FaWhatsapp,
} from 'react-icons/fa'

// Single source of truth for our social profile URLs. Used by Footer (icons
// on every page), FollowCTA (prominent CTA blocks), and layout.jsx (the
// Organization JSON-LD `sameAs` array — helps Google connect our brand
// across platforms in the Knowledge Panel).
export const SOCIAL_LINKS = [
  {
    key: 'telegram',
    href: 'https://t.me/hiresarkar',
    label: 'Telegram',
    cta: 'Join Telegram channel',
    description: 'Instant job alerts the moment they drop.',
    Icon: FaTelegramPlane,
    // Tailwind classes for the prominent CTA button.
    btnClass: 'bg-[#26A5E4] hover:bg-[#1e92ca] text-white',
  },
  {
    key: 'whatsapp',
    href: 'https://www.whatsapp.com/channel/0029Va8PtLXHAdNTIrwVvv0m',
    label: 'WhatsApp',
    cta: 'Follow WhatsApp channel',
    description: 'Get every notification on WhatsApp.',
    Icon: FaWhatsapp,
    btnClass: 'bg-[#25D366] hover:bg-[#1ebe5a] text-white',
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/hiresarkardotcom',
    label: 'Instagram',
    cta: 'Follow on Instagram',
    description: 'Highlights, reels and key updates.',
    Icon: FaInstagram,
    btnClass: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white',
  },
  {
    key: 'twitter',
    href: 'https://x.com/HireSarkar590',
    label: 'X (Twitter)',
    cta: 'Follow on X',
    description: 'Quick announcements and links.',
    Icon: FaTwitter,
    btnClass: 'bg-black hover:bg-gray-800 text-white',
  },
  {
    key: 'facebook',
    href: 'https://www.facebook.com/people/hiresarkarcom/61590899590352/',
    label: 'Facebook',
    cta: 'Follow on Facebook',
    description: 'Updates on our Facebook page.',
    Icon: FaFacebook,
    btnClass: 'bg-[#1877F2] hover:bg-[#0f5fc4] text-white',
  },
]

// Just the URLs — used by Organization JSON-LD `sameAs`.
export const SOCIAL_URLS = SOCIAL_LINKS.map((s) => s.href)
