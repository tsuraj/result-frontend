'use client'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

// The home page renders its own slim inline footer. Hide the global Footer
// there to avoid stacking two footers.
export default function FooterGate() {
  const pathname = usePathname()
  if (pathname === '/') return null
  return <Footer />
}
