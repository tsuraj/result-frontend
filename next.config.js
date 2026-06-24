/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hiresarkar.com'

// Defensive HTTP headers applied to every response.
// - X-Content-Type-Options: prevents MIME-type sniffing (XSS hardening).
// - Referrer-Policy: don't leak full URLs to third parties on cross-origin nav.
// - X-Frame-Options: blocks iframing the site on other origins (clickjacking).
// - Permissions-Policy: explicitly deny powerful browser APIs we never use.
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

const nextConfig = {
  reactStrictMode: true,
  // SEO: send www -> apex etc. handled at the platform; trailing slash off.
  trailingSlash: false,

  // The backend owns the canonical sitemap (it knows every slug). Proxy
  // /sitemap.xml so crawlers and robots.txt continue to find it at the
  // frontend origin.
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: `${API_URL}/sitemap.xml` },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
    ]
  },
}

module.exports = nextConfig
