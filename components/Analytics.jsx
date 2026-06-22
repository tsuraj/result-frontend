'use client'
import { useEffect, Suspense } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return
    const query = searchParams.toString()
    const path = query ? `${pathname}?${query}` : pathname
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

// Google Analytics 4 integration.
// Driven by NEXT_PUBLIC_GA_ID (e.g. G-XXXXXXXXXX). No-op when unset, so it's
// silent in dev / before a GA property exists.
//
// Next renders most pages server-side, but client-side navigations don't
// trigger a fresh page load — so we disable GA's automatic page_view and emit
// one manually on every pathname/search change.
export default function Analytics() {
  if (!GA_ID) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: false });
      `}</Script>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  )
}
