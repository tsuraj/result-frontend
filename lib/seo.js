export const SITE_URL = 'https://hiresarkar.com'
export const SITE_NAME = 'Hire Sarkar'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

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
