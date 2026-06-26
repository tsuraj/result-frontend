// Server-side data fetching for the Rails API.
// API base comes from env; falls back to the production API for builds.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://api.hiresarkar.com') + '/api/v1'

// Revalidate fetched data every 60s (ISR). Admin saves also call
// /api/revalidate to bust the cache immediately — this window is the
// safety net if that call ever fails.
const REVALIDATE = 60

async function getJSON(path, { revalidate = REVALIDATE } = {}) {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } })
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`)
  return res.json()
}

// Returns null instead of throwing for detail lookups (so pages can 404 cleanly).
async function getJSONOrNull(path, opts) {
  try {
    return await getJSON(path, opts)
  } catch {
    return null
  }
}

export async function getJobs({ page = 1, perPage = 20, q } = {}) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (q) params.set('q', q)
  return getJSON(`/jobs?${params.toString()}`)
}

export async function getJob(slug) {
  return getJSONOrNull(`/jobs/${slug}`)
}

export async function getJobStats() {
  // The jobs index meta carries the counts + the latest job (for header/ticker).
  return getJobs({ page: 1, perPage: 1 })
}

// --- Results / Admit Cards / Answer Keys / Syllabus -------------------------
// These index endpoints return a plain array; detail is /<resource>/<slug>.
const listOrEmpty = async (path) => {
  const data = await getJSONOrNull(path)
  return Array.isArray(data) ? data : []
}

export const getResults = () => listOrEmpty('/results')
export const getResult = (slug) => getJSONOrNull(`/results/${slug}`)

export const getAdmitCards = () => listOrEmpty('/admit_cards')
export const getAdmitCard = (slug) => getJSONOrNull(`/admit_cards/${slug}`)

export const getAnswerKeys = () => listOrEmpty('/answer_keys')
export const getAnswerKey = (slug) => getJSONOrNull(`/answer_keys/${slug}`)

export const getSyllabi = () => listOrEmpty('/syllabus')
export const getSyllabus = (slug) => getJSONOrNull(`/syllabus/${slug}`)

export const getNotifications = () => listOrEmpty('/notifications')
export const getPage = (slug) => getJSONOrNull(`/pages/${slug}`)

// Topic landing page data (railway, banking, ssc, upsc, defence). Returns
// null for unknown slugs so the Next page can call notFound().
export const getTopic = (slug) => getJSONOrNull(`/topics/${slug}`)

export { API_BASE, REVALIDATE }
