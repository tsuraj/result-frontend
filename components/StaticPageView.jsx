import Markdown from './Markdown'
import { getPage } from '../lib/api'

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

// Server component: renders an admin-managed CMS page from /pages/:slug.
export default async function StaticPageView({ slug, fallbackTitle }) {
  const page = await getPage(slug)
  const title = page?.title || fallbackTitle

  return (
    <article className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <header className="border-b border-gray-100 pb-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          {page?.updated_at && (
            <p className="mt-2 text-xs text-gray-500">Last Updated: <span className="font-medium text-gray-700">{formatDate(page.updated_at)}</span></p>
          )}
        </header>
        {page ? <Markdown>{page.body}</Markdown> : <p className="text-gray-500 text-sm">Content coming soon.</p>}
      </div>
    </article>
  )
}
