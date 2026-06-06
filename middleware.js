import { next } from '@vercel/edge'

// ---------------------------------------------------------------------------
// Dynamic rendering for SEO (Option A).
//
// Real users get the normal client-rendered SPA. Search-engine and social
// crawlers (which often can't run our JavaScript) are transparently served
// fully-rendered HTML from Prerender.io.
//
// Setup:
//   1. Create a free/paid account at https://prerender.io and copy the token.
//   2. In the Vercel project: Settings -> Environment Variables, add
//        PRERENDER_TOKEN = <your token>
//      (Add it to Production + Preview. No need to commit it anywhere.)
//   3. Redeploy. Until the token is set this middleware is a no-op, so the
//      site keeps working normally.
//
// Test it (replace the host):
//   curl -A "Googlebot" https://hiresarkar.com/jobs/<some-slug> | head -40
//   -> should return real HTML with the job content + meta tags, not an
//      empty <div id="root">.
// ---------------------------------------------------------------------------

const PRERENDER_SERVICE = 'https://service.prerender.io'

// Crawlers that should receive pre-rendered HTML. Lower-cased substring match
// against the User-Agent. (Googlebot can render JS itself, but serving it the
// same pre-rendered HTML is supported and removes any rendering uncertainty.)
const BOT_USER_AGENTS = [
  'googlebot',
  'google-inspectiontool',
  'bingbot',
  'yandex',
  'baiduspider',
  'duckduckbot',
  'slurp', // Yahoo
  'applebot',
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'discordbot',
  'slackbot',
  'redditbot',
  'pinterest',
  'pinterestbot',
  'embedly',
  'quora link preview',
  'outbrain',
  'vkshare',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'flipboard',
  'w3c_validator',
  'rogerbot',
  'screaming frog',
  'chrome-lighthouse',
]

// Only run on real page routes. Skips static assets (anything with a file
// extension, e.g. /assets/x.js, /vite.svg, /robots.txt, /sitemap.xml) and /api.
export const config = {
  matcher: ['/((?!api/|.*\\.).*)'],
}

function isCrawler(userAgent, url) {
  if (url.searchParams.has('_escaped_fragment_')) return true
  const ua = userAgent.toLowerCase()
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot))
}

export default async function middleware(request) {
  const token = process.env.PRERENDER_TOKEN

  // No token configured yet -> behave like the site has no middleware.
  if (!token) return next()

  const url = new URL(request.url)
  const userAgent = request.headers.get('user-agent') || ''

  // Only pre-render GET/HEAD requests from known crawlers.
  if (request.method !== 'GET' && request.method !== 'HEAD') return next()
  if (!isCrawler(userAgent, url)) return next()

  const host = request.headers.get('host') || url.host
  const targetUrl = `${PRERENDER_SERVICE}/https://${host}${url.pathname}${url.search}`

  try {
    const prerendered = await fetch(targetUrl, {
      headers: {
        'X-Prerender-Token': token,
        'User-Agent': userAgent,
      },
    })

    // If Prerender.io errors out, fall back to the normal SPA so the crawler
    // still gets something rather than an error page.
    if (!prerendered.ok) return next()

    const headers = new Headers()
    headers.set('content-type', prerendered.headers.get('content-type') || 'text/html; charset=utf-8')
    // Let crawlers cache pre-rendered HTML briefly.
    headers.set('cache-control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600')
    headers.set('x-prerender', '1')

    return new Response(prerendered.body, {
      status: prerendered.status,
      headers,
    })
  } catch {
    // Network/edge failure -> never block the request.
    return next()
  }
}
