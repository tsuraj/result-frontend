import { SITE_URL } from '../hooks/useDocumentMeta'

// Build a schema.org BreadcrumbList from [{ name, url }] items.
// Relative urls are resolved against SITE_URL.
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
