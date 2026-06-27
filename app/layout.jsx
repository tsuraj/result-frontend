import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import './globals.css'

import Header from '../components/Header'
import LayoutShell from '../components/LayoutShell'
import Analytics from '../components/Analytics'
import NotificationBar from '../components/NotificationBar'
import StickyMobileFollow from '../components/StickyMobileFollow'
import { getJobStats } from '../lib/api'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../lib/seo'
import { SOCIAL_URLS } from '../lib/social'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Latest Government Jobs, Results & Admit Cards`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Hire Sarkar is India's trusted government job portal for the latest Sarkari jobs, results, admit cards, answer keys and syllabus.",
  keywords: ['government jobs', 'sarkari naukri', 'sarkari result', 'admit card', 'answer key', 'syllabus', 'SSC', 'UPSC', 'Railway', 'Banking'],
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [DEFAULT_OG_IMAGE] },
}

export const viewport = {
  themeColor: '#dc2626',
}

const orgWebsiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: DEFAULT_OG_IMAGE,
      description: "India's trusted government job portal for the latest Sarkari jobs, results, admit cards, answer keys and syllabus.",
      email: 'hiresarkar590@gmail.com',
      sameAs: SOCIAL_URLS,
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/latest-jobs?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default async function RootLayout({ children }) {
  let activeJobs = 0
  let latestJob = null
  try {
    const stats = await getJobStats()
    activeJobs = stats?.meta?.total_active ?? stats?.meta?.total ?? 0
    latestJob = Array.isArray(stats?.jobs) ? stats.jobs[0] : null
  } catch {
    // API unavailable at build/request time — render with defaults.
  }

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgWebsiteJsonLd) }}
        />
        <div className="flex flex-col min-h-screen">
          <NotificationBar latestJob={latestJob} />
          <Header activeJobs={activeJobs} />
          <LayoutShell>{children}</LayoutShell>
        </div>
        <StickyMobileFollow />
        <Analytics />
      </body>
    </html>
  )
}
