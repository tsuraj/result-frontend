import { useEffect } from 'react'

export const SITE_URL = 'https://hiresarkar.com'
export const SITE_NAME = 'Hire Sarkar'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

function upsertMeta(attr, key, content) {
  if (content == null || content === '') return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/**
 * Manage per-page SEO tags: title, description, canonical, Open Graph,
 * Twitter cards, robots and optional JSON-LD structured data.
 *
 * @param {string} title       Page title (site name is appended automatically)
 * @param {string} description Meta description (~160 chars)
 * @param {object} [options]
 * @param {string} [options.canonical] Path or absolute URL; defaults to current path
 * @param {string} [options.image]     Absolute OG/Twitter image URL
 * @param {string} [options.type]      OG type ('website' | 'article')
 * @param {boolean}[options.noindex]   When true, emit noindex,nofollow
 * @param {object} [options.jsonLd]    Schema.org object injected as JSON-LD
 */
export default function useDocumentMeta(title, description, options = {}) {
  const { canonical, image, type = 'website', noindex = false, jsonLd } = options

  useEffect(() => {
    const fullTitle = title
      ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
      : `${SITE_NAME} - India's No.1 Government Job Portal`
    document.title = fullTitle

    const canonicalUrl = canonical
      ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`)
      : `${SITE_URL}${window.location.pathname}`
    const ogImage = image || DEFAULT_OG_IMAGE

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertLink('canonical', canonicalUrl)

    // Open Graph
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:site_name', SITE_NAME)

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)

    // Page-level JSON-LD (replaces any previous page-managed block)
    document
      .querySelectorAll('script[data-managed="page-jsonld"]')
      .forEach((s) => s.remove())
    let script
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-managed', 'page-jsonld')
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      if (script) script.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonical, image, type, noindex, JSON.stringify(jsonLd)])
}
