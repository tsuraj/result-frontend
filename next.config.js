/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hiresarkar.com'

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
}

module.exports = nextConfig
