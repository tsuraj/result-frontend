import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// Exact paths the admin is allowed to bust the cache for.
const STATIC_PATHS = new Set([
  '/',
  '/latest-jobs',
  '/results',
  '/admit-cards',
  '/answer-keys',
  '/syllabus',
  '/updates',
  '/about',
  '/privacy',
  '/disclaimer',
  '/terms',
  '/contact',
])

// Dynamic-route patterns (revalidates ALL pages matching the pattern).
const DYNAMIC_PATTERNS = new Set([
  '/jobs/[slug]',
  '/results/[slug]',
  '/admit-cards/[slug]',
  '/answer-keys/[slug]',
  '/syllabus/[slug]',
])

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const paths = Array.isArray(body?.paths) ? body.paths : []
  if (!paths.length) {
    return NextResponse.json({ revalidated: [], ts: Date.now() })
  }

  const revalidated = []
  const rejected = []

  for (const p of paths) {
    if (typeof p !== 'string') {
      rejected.push(p)
      continue
    }
    if (STATIC_PATHS.has(p)) {
      revalidatePath(p)
      revalidated.push(p)
    } else if (DYNAMIC_PATTERNS.has(p)) {
      revalidatePath(p, 'page')
      revalidated.push(p)
    } else {
      rejected.push(p)
    }
  }

  return NextResponse.json({ revalidated, rejected, ts: Date.now() })
}
