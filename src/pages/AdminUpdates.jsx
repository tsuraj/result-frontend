import React, { useEffect, useState } from 'react'
import { authFetch } from '../services/authFetch'

const API = `${import.meta.env.VITE_API_URL}/api/v1`

// linkable_type (model class name) -> { label, admin_page endpoint }
const LINK_TYPES = [
  { key: 'Job', label: 'Job', endpoint: 'jobs' },
  { key: 'Result', label: 'Result', endpoint: 'results' },
  { key: 'AdmitCard', label: 'Admit Card', endpoint: 'admit_cards' },
  { key: 'AnswerKey', label: 'Answer Key', endpoint: 'answer_keys' },
  { key: 'Syllabus', label: 'Syllabus', endpoint: 'syllabus' },
]

const CATEGORIES = ['', 'Exam Date', 'Admit Card', 'Result', 'Answer Key', 'Notification', 'Other']

const emptyForm = { title: '', date: '', category: '', description: '', url: '' }

const toDateInput = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

const AdminUpdates = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [linkType, setLinkType] = useState('')        // '' = no link
  const [linkableId, setLinkableId] = useState('')
  const [linkOptions, setLinkOptions] = useState([])
  const [linkSearch, setLinkSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const loadItems = () => {
    setLoading(true)
    fetch(`${API}/notifications`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadItems() }, [])

  // Load the selectable records whenever the chosen link type changes.
  useEffect(() => {
    if (!linkType) { setLinkOptions([]); return }
    const t = LINK_TYPES.find((x) => x.key === linkType)
    if (!t) return
    authFetch(`${API}/${t.endpoint}/admin_page`)
      .then((res) => res.json())
      .then((data) => setLinkOptions(Array.isArray(data) ? data : []))
      .catch(() => setLinkOptions([]))
  }, [linkType])

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setLinkType('')
    setLinkableId('')
    setLinkSearch('')
    setShowForm(false)
  }

  const startCreate = () => { resetForm(); setShowForm(true) }

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      date: toDateInput(item.date),
      category: item.category || '',
      description: item.description || '',
      url: item.url || '',
    })
    setLinkType(item.linkable_type || '')
    setLinkableId(item.linkable_id ? String(item.linkable_id) : '')
    setLinkSearch('')
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this update? This cannot be undone.')) return
    setError('')
    try {
      const res = await authFetch(`${API}/notifications/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete')
      setItems((prev) => prev.filter((n) => n.id !== id))
      if (editingId === id) resetForm()
    } catch (e) { setError(e.message) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      date: form.date || null,
      linkable_type: linkType && linkableId ? linkType : null,
      linkable_id: linkType && linkableId ? Number(linkableId) : null,
    }
    const url = editingId ? `${API}/notifications/${editingId}` : `${API}/notifications`
    const method = editingId ? 'PUT' : 'POST'
    try {
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Save failed: ${txt}`)
      }
      resetForm()
      loadItems()
    } catch (e) { setError(e.message) }
  }

  const input = (label, value, onChange, type = 'text') => (
    <label className="flex flex-col text-xs">
      <span className="mb-0.5 font-medium text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
      />
    </label>
  )

  const filteredOptions = linkSearch.trim()
    ? linkOptions.filter((o) => (o.title || '').toLowerCase().includes(linkSearch.trim().toLowerCase()))
    : linkOptions

  return (
    <div className="p-3 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold sm:text-xl">Updates Admin</h1>
        <button
          onClick={startCreate}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          + New Update
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs text-red-700">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5 rounded-lg border bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-2 text-base font-semibold">{editingId ? `Edit Update #${editingId}` : 'Create Update'}</h2>

          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {input('Title', form.title, (v) => setForm({ ...form, title: v }))}
            {input('Date (optional)', form.date, (v) => setForm({ ...form, date: v }), 'date')}
            <label className="flex flex-col text-xs">
              <span className="mb-0.5 font-medium text-gray-600">Category (optional)</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c || '— None —'}</option>)}
              </select>
            </label>
            {input('External URL (optional)', form.url, (v) => setForm({ ...form, url: v }))}
            <label className="flex flex-col text-xs sm:col-span-2">
              <span className="mb-0.5 font-medium text-gray-600">Description (optional)</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>

          <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">Link to (optional)</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex flex-col text-xs">
              <span className="mb-0.5 font-medium text-gray-600">Type</span>
              <select
                value={linkType}
                onChange={(e) => { setLinkType(e.target.value); setLinkableId(''); setLinkSearch('') }}
                className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="">— No link —</option>
                {LINK_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </label>
            {linkType && (
              <>
                {input('Search record by title', linkSearch, setLinkSearch)}
                <label className="flex flex-col text-xs sm:col-span-2">
                  <span className="mb-0.5 font-medium text-gray-600">
                    Record {filteredOptions.length > 100 && <span className="text-gray-400">(showing first 100 — refine search)</span>}
                  </span>
                  <select
                    value={linkableId}
                    onChange={(e) => setLinkableId(e.target.value)}
                    className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">— Select a record —</option>
                    {filteredOptions.slice(0, 100).map((o) => (
                      <option key={o.id} value={o.id}>{o.title}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <button type="submit" className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="rounded bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-xs text-gray-500">Loading…</p>}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Linked to</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id} className="border-t">
                <td className="px-3 py-2 font-medium text-gray-900">{n.title}</td>
                <td className="px-3 py-2 text-gray-600">{n.date || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{n.category || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{n.link_label || (n.url ? 'External link' : '—')}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => startEdit(n)} className="mr-2 rounded bg-gray-100 px-2 py-1 font-semibold text-gray-700 hover:bg-gray-200">Edit</button>
                  <button onClick={() => handleDelete(n.id)} className="rounded bg-red-100 px-2 py-1 font-semibold text-red-700 hover:bg-red-200">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">No updates yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUpdates
