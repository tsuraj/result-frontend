// Meta title: Admin — Pages | RojgarResult
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { authFetch } from '../services/authFetch'

const API = `${import.meta.env.VITE_API_URL}/api/v1`

const SLUGS = ['about', 'privacy', 'disclaimer', 'terms', 'contact']

const AdminPages = () => {
  const [pages, setPages] = useState([])
  const [active, setActive] = useState('about')
  const [form, setForm] = useState({ title: '', meta_description: '', body: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(false)

  const loadAll = async () => {
    setLoading(true)
    try {
      const res = await authFetch(`${API}/pages`)
      const data = await res.json()
      setPages(Array.isArray(data) ? data : [])
    } catch (e) {
      setStatus({ state: 'error', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  useEffect(() => {
    const p = pages.find((x) => x.slug === active)
    if (p) setForm({ title: p.title || '', meta_description: p.meta_description || '', body: p.body || '' })
  }, [active, pages])

  const handleSave = async (e) => {
    e.preventDefault()
    setStatus({ state: 'saving', message: '' })
    try {
      const res = await authFetch(`${API}/pages/${active}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: form })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data.errors || []).join(', ') || 'Failed to save')
      }
      setStatus({ state: 'success', message: 'Saved.' })
      loadAll()
    } catch (err) {
      setStatus({ state: 'error', message: err.message })
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Static Pages</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {SLUGS.map((slug) => (
          <button
            key={slug}
            onClick={() => { setActive(slug); setStatus({ state: 'idle', message: '' }) }}
            className={`px-3 py-1.5 text-sm rounded-md border ${active === slug ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            {slug}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-3">
          <label className="block">
            <span className="block text-xs font-medium text-gray-700 mb-1">Title</span>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required />
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-gray-700 mb-1">Meta description (SEO)</span>
            <input type="text" maxLength={200} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            <span className="block mt-1 text-[10px] text-gray-500">{form.meta_description.length}/200</span>
          </label>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Body (Markdown)</span>
            <button type="button" onClick={() => setPreview((p) => !p)} className="text-xs text-red-600 hover:text-red-700">
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {preview ? (
            <div className="prose prose-sm max-w-none border border-gray-200 rounded-md p-4 bg-gray-50 min-h-[280px]">
              <ReactMarkdown>{form.body || ''}</ReactMarkdown>
            </div>
          ) : (
            <textarea rows={18} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono" />
          )}

          {status.state === 'success' && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{status.message}</p>}
          {status.state === 'error' && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{status.message}</p>}

          <div className="flex gap-2">
            <button type="submit" disabled={status.state === 'saving'} className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md">
              {status.state === 'saving' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AdminPages
