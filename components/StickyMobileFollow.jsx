'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FaTelegramPlane, FaTimes } from 'react-icons/fa'
import { SOCIAL_LINKS } from '../lib/social'

const DISMISS_KEY = 'hire_sarkar_sticky_follow_dismissed_at'
const DISMISS_DAYS = 7

// Paths we DON'T want a floating CTA on (auth, admin, narrow conversion
// forms where any distraction hurts).
const HIDDEN_PREFIXES = ['/login', '/signup', '/admin']

// Floating Telegram button shown only on mobile (`md:hidden`). Persists on
// every page so users scrolling long lists or articles always have a one-tap
// path to subscribe. Dismissible — sets a localStorage timestamp; we hide
// for DISMISS_DAYS after each dismiss, then re-emerge.
export default function StickyMobileFollow() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
      setVisible(false)
      return
    }
    try {
      const ts = parseInt(localStorage.getItem(DISMISS_KEY), 10)
      if (ts && Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
        setVisible(false)
        return
      }
    } catch {
      /* localStorage unavailable — show by default */
    }
    setVisible(true)
  }, [pathname])

  if (!visible) return null

  const telegram = SOCIAL_LINKS.find((s) => s.key === 'telegram')
  if (!telegram) return null

  const handleDismiss = (e) => {
    e.preventDefault()
    e.stopPropagation()
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())) } catch { /* no-op */ }
    setVisible(false)
  }

  return (
    <div
      className="md:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2"
      role="complementary"
      aria-label="Subscribe for job alerts"
    >
      <a
        href={telegram.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get job alerts on Telegram"
        className="inline-flex items-center gap-2 bg-[#26A5E4] hover:bg-[#1e92ca] text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold"
      >
        <FaTelegramPlane size={14} />
        Telegram alerts
      </a>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md text-gray-500 hover:text-gray-900 border border-gray-200"
      >
        <FaTimes size={11} />
      </button>
    </div>
  )
}
