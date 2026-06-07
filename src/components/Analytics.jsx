import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageview } from '../lib/analytics'

// Loads GA4 once and reports a page_view on every client-side route change.
// Renders nothing. Safe no-op when VITE_GA_ID isn't configured.
export default function Analytics() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    trackPageview(location.pathname + location.search)
  }, [location.pathname, location.search])

  return null
}
