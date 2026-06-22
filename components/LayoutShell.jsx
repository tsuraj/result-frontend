'use client'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

// On the home page we want a full-bleed hero and an inline slim footer (Home
// renders its own), so we skip both the `.container` wrap and the global
// Footer. Every other page gets the standard chrome.
export default function LayoutShell({ children }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  return (
    <>
      <main className="flex-grow py-6">
        {isHome ? children : <div className="container">{children}</div>}
      </main>
      {!isHome && <Footer />}
    </>
  )
}
