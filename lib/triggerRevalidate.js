// Fire-and-forget helper used by admin pages after a successful mutation.
// Tells Next to drop its ISR cache for the affected paths so the next public
// request rebuilds against fresh backend data. Failures are swallowed —
// public pages will still self-heal when their revalidate window elapses.

// Each entity → which public paths to bust when admin creates/updates/deletes.
export const revalidationPaths = {
  jobs: ['/', '/latest-jobs', '/jobs/[slug]'],
  results: ['/results', '/results/[slug]'],
  admit_cards: ['/admit-cards', '/admit-cards/[slug]'],
  answer_keys: ['/answer-keys', '/answer-keys/[slug]'],
  syllabus: ['/syllabus', '/syllabus/[slug]'],
  notifications: ['/updates', '/'],
  pages: ['/about', '/privacy', '/disclaimer', '/terms', '/contact'],
}

export function triggerRevalidate(paths) {
  if (!Array.isArray(paths) || paths.length === 0) return Promise.resolve()
  return fetch('/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths }),
    keepalive: true,
  }).catch(() => {
    /* ignore — list pages fall back to ISR window */
  })
}
