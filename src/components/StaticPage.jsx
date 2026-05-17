import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FaRegClock } from 'react-icons/fa'
import useDocumentMeta from '../hooks/useDocumentMeta'

const API = `${import.meta.env.VITE_API_URL}/api/v1`

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

const StaticPage = ({ slug, fallbackTitle, fallbackDescription, children }) => {
  const [page, setPage] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch(`${API}/pages/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Page not found')
        return res.json()
      })
      .then((data) => active && setPage(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [slug])

  useDocumentMeta(
    page?.title || fallbackTitle,
    page?.meta_description || fallbackDescription
  )

  return (
    <article className="max-w-3xl mx-auto py-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <header className="border-b border-gray-100 pb-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {page?.title || fallbackTitle}
          </h1>
          {page?.updated_at && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-500">
              <FaRegClock size={11} className="text-gray-400" />
              Last Updated: <span className="font-medium text-gray-700">{formatDate(page.updated_at)}</span>
            </p>
          )}
        </header>

        {loading && <p className="text-gray-500 text-sm">Loading…</p>}
        {error && !loading && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && !error && page && (
          <div className="prose prose-sm sm:prose-base max-w-none prose-headings:scroll-mt-20 prose-h2:text-lg prose-h2:sm:text-xl prose-h2:font-semibold prose-h2:text-gray-900 prose-h2:mt-6 prose-h2:mb-3 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-red-600 hover:prose-a:text-red-700 prose-strong:text-gray-900">
            <ReactMarkdown>{page.body || ''}</ReactMarkdown>
          </div>
        )}

        {children}
      </div>
    </article>
  )
}

export default StaticPage
