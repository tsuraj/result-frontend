# SEO: Dynamic rendering for crawlers

This app is a client-rendered Vite SPA. Search engines (especially Bing) and
social-media link-preview crawlers (WhatsApp, Facebook, Twitter, LinkedIn…)
often can't run our JavaScript, so they'd see an empty `<div id="root">`.

To fix that without rewriting the app, [`middleware.js`](../middleware.js) does
**dynamic rendering**: crawlers are transparently served fully-rendered HTML
from [Prerender.io](https://prerender.io); real users get the normal SPA.

## One-time setup

1. Create an account at https://prerender.io and copy your **token**.
2. In Vercel → Project → **Settings → Environment Variables**, add:
   - `PRERENDER_TOKEN` = `<your token>` (enable for **Production** and **Preview**).
3. Redeploy.

> Until `PRERENDER_TOKEN` is set, the middleware is a no-op — the site keeps
> working exactly as before, so it's safe to ship before configuring the token.

## How to verify

```bash
# As a crawler -> should return real HTML with content + meta tags:
curl -A "Googlebot" https://hiresarkar.com/jobs/<slug> | head -n 40

# As a normal browser -> should return the SPA shell (empty #root):
curl -A "Mozilla/5.0" https://hiresarkar.com/jobs/<slug> | head -n 40
```

A pre-rendered response also carries an `x-prerender: 1` header.

Also validate rich results once live:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Submit `sitemap.xml` in Google Search Console + Bing Webmaster Tools.

## Notes / tuning

- **Which bots**: the crawler list is in `middleware.js` (`BOT_USER_AGENTS`).
  Googlebot is included; if you'd rather let Google render JS itself, remove it.
- **Static files & APIs** are skipped via the middleware `matcher`, so
  `robots.txt`, `sitemap.xml`, `/assets/*` and `/api/*` are never pre-rendered.
- **Async data reliability**: Prerender.io waits for network idle before
  snapshotting, which normally captures our `fetch()` calls. If some pages
  occasionally snapshot before data loads, harden it by setting
  `window.prerenderReady = false` in `index.html` and flipping it to `true`
  once each page's data has loaded.
- **Cost**: Prerender.io caches rendered pages; only crawler traffic hits it.
