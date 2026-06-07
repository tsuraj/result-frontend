// Google Analytics 4 integration.
//
// Driven by the VITE_GA_ID env var (e.g. G-XXXXXXXXXX). When it's not set,
// every function here is a no-op, so analytics is simply disabled in dev /
// before you've created the GA property.
//
// Because this is a single-page app, GA's automatic page_view only fires on
// the first load. We disable it and send a page_view manually on every route
// change (see src/components/Analytics.jsx).

export const GA_ID = import.meta.env.VITE_GA_ID

let initialized = false

export function initAnalytics() {
  if (initialized || !GA_ID || typeof window === 'undefined') return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', GA_ID, { send_page_view: false })
}

export function trackPageview(path) {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

// Optional helper for custom events (e.g. trackEvent('apply_click', { job })).
export function trackEvent(name, params = {}) {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
