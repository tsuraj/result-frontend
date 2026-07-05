export const SITE_URL = 'https://hiresarkar.com'
export const SITE_NAME = 'Hire Sarkar'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

// Prepare a description string (as typed in admin) for use in <meta description>,
// OpenGraph, and Twitter cards. Admin descriptions often contain markdown headers,
// pipe-separated keyword rows, and bold syntax — all of which look terrible when
// Google shows them literally in search snippets.
//
// Cleanup pipeline:
//   1. strip markdown syntax (# * _ ` >) so headers and bold don't leak through
//   2. drop lines with 3+ pipes — they're keyword headers, not prose
//   3. drop bare header lines (e.g. "Notification 2026") when a longer prose
//      line follows, so the first-real-sentence rule kicks in
//   4. collapse whitespace to a single space
//   5. truncate at ~155 chars on a word boundary, appending "…" if truncated
//
// The visible page body is untouched — this only affects meta tags.
export function cleanDescription(raw, maxLen = 155) {
  if (!raw) return ''
  const stripped = String(raw).replace(/[#*_`>]/g, '')
  const lines = stripped
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => (l.match(/\|/g) || []).length < 3)
  const prose = lines.find((l) => /[.!?]/.test(l) && l.length > 40) || lines.join(' ')
  const cleaned = prose.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= maxLen) return cleaned
  const cut = cleaned.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?]+$/, '') + '…'
}

// schema.org Article for entity detail pages (Result / Admit Card / Answer Key /
// Syllabus). Use for content where there's no more-specific schema like JobPosting.
export function articleJsonLd({ title, description, path, datePublished, dateModified }) {
  const url = `${SITE_URL}${path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: [DEFAULT_OG_IMAGE],
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    },
    url,
  }
}

// schema.org BreadcrumbList from [{ name, url }] (relative urls resolved to SITE_URL).
export function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .filter((it) => it && it.name)
      .map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        item: it.url
          ? it.url.startsWith('http')
            ? it.url
            : `${SITE_URL}${it.url}`
          : undefined,
      })),
  }
}

// Build Next.js Metadata with sensible Open Graph / Twitter / canonical defaults.
export function pageMetadata({ title, description, path = '/', noindex = false, type = 'website' }) {
  const url = `${SITE_URL}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: 'en_IN',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}
