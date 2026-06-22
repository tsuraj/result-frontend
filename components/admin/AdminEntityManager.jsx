'use client'
import React, { useEffect, useState } from 'react'
import { authFetch, API_BASE } from '../../lib/authFetch'
import { triggerRevalidate, revalidationPaths } from '../../lib/triggerRevalidate'

const emptyDetail = {
  id: undefined,
  description: '',
  important_dates: '',
  eligibility: '',
  selection_process: '',
  application_fee: '',
  notification_link: '',
  website_link: '',
  download_link: '',
}

const emptyLink = { link_type: '', title: '', url: '' }

const toDateInput = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

/**
 * Reusable admin CRUD manager driven by config.
 *   { title, entityLabel, resource, payloadKey, detailKey, hasLinks?, extraFields? }
 */
export default function AdminEntityManager({ config }) {
  const {
    title,
    entityLabel,
    resource,
    payloadKey,
    detailKey,
    hasLinks = false,
    extraFields = [],
  } = config

  const emptyEntity = {
    title: '',
    category: '',
    date: '',
    ...Object.fromEntries(extraFields.map((f) => [f.name, ''])),
  }

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [entityForm, setEntityForm] = useState(emptyEntity)
  const [detailForm, setDetailForm] = useState(emptyDetail)
  const [links, setLinks] = useState([])
  const [removedLinkIds, setRemovedLinkIds] = useState([])
  const [showForm, setShowForm] = useState(false)

  const loadItems = () => {
    setLoading(true)
    authFetch(`${API_BASE}/${resource}/admin_page`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource])

  const resetForm = () => {
    setEditingId(null)
    setEntityForm(emptyEntity)
    setDetailForm(emptyDetail)
    setLinks([])
    setRemovedLinkIds([])
    setShowForm(false)
  }

  const startCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const startEdit = async (item) => {
    setError('')
    try {
      const res = await authFetch(`${API_BASE}/${resource}/${item.id}`)
      if (!res.ok) throw new Error(`Failed to load ${entityLabel.toLowerCase()}`)
      const full = await res.json()
      setEditingId(full.id)
      setEntityForm({
        title: full.title || '',
        category: full.category || '',
        date: toDateInput(full.date),
        ...Object.fromEntries(extraFields.map((f) => [f.name, full[f.name] || ''])),
      })
      const d = full[detailKey] || {}
      setDetailForm({
        id: d.id,
        description: d.description || full.description || '',
        important_dates: d.important_dates || full.important_dates || '',
        eligibility: d.eligibility || full.eligibility || '',
        selection_process: d.selection_process || full.selection_process || '',
        application_fee: d.application_fee || full.application_fee || '',
        notification_link: d.notification_link || full.notification_link || '',
        website_link: d.website_link || full.website_link || '',
        download_link: d.download_link || full.download_link || '',
      })
      const sourceLinks = Array.isArray(full.links) ? full.links : []
      setLinks(
        sourceLinks.map((l) => ({
          id: l.id,
          link_type: l.link_type || '',
          title: l.title || '',
          url: l.url || '',
        }))
      )
      setRemovedLinkIds([])
      setShowForm(true)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${entityLabel.toLowerCase()}? This cannot be undone.`)) return
    setError('')
    try {
      const res = await authFetch(`${API_BASE}/${resource}/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete')
      setItems((prev) => prev.filter((r) => r.id !== id))
      if (editingId === id) resetForm()
      triggerRevalidate(revalidationPaths[resource])
    } catch (e) {
      setError(e.message)
    }
  }

  const addLink = () => setLinks((prev) => [...prev, { ...emptyLink }])

  const updateLink = (idx, field, value) =>
    setLinks((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)))

  const removeLink = (idx) => {
    setLinks((prev) => {
      const target = prev[idx]
      if (target && target.id) setRemovedLinkIds((ids) => [...ids, target.id])
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { id: detailId, ...detailRest } = detailForm
    const detailAttrs = detailId ? { id: detailId, ...detailRest } : detailRest

    const body = {
      ...entityForm,
      [`${detailKey}_attributes`]: detailAttrs,
    }

    if (hasLinks) {
      body.links_attributes = [
        ...links.map((l) => ({
          ...(l.id ? { id: l.id } : {}),
          link_type: l.link_type,
          title: l.title,
          url: l.url,
        })),
        ...removedLinkIds.map((id) => ({ id, _destroy: true })),
      ]
    }

    const payload = { [payloadKey]: body }
    const url = editingId ? `${API_BASE}/${resource}/${editingId}` : `${API_BASE}/${resource}`
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
      triggerRevalidate(revalidationPaths[resource])
    } catch (e) {
      setError(e.message)
    }
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

  const textarea = (label, value, onChange, hint) => (
    <label className="flex flex-col text-xs md:col-span-2">
      <span className="mb-0.5 font-medium text-gray-600">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
      />
      {hint && <span className="mt-0.5 text-[10px] text-gray-500">{hint}</span>}
    </label>
  )

  return (
    <div className="p-3 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold sm:text-xl">{title}</h1>
        <button
          onClick={startCreate}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          + New {entityLabel}
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5 rounded-lg border bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-2 text-base font-semibold">
            {editingId ? `Edit ${entityLabel} #${editingId}` : `Create ${entityLabel}`}
          </h2>

          <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">{entityLabel}</h3>
          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {input('Title', entityForm.title, (v) => setEntityForm({ ...entityForm, title: v }))}
            {input('Category', entityForm.category, (v) => setEntityForm({ ...entityForm, category: v }))}
            {extraFields.map((f) => (
              <React.Fragment key={f.name}>
                {input(f.label, entityForm[f.name], (v) => setEntityForm({ ...entityForm, [f.name]: v }))}
              </React.Fragment>
            ))}
            {input('Date', entityForm.date, (v) => setEntityForm({ ...entityForm, date: v }), 'date')}
          </div>

          <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            {entityLabel} Details
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {input('Application Fee', detailForm.application_fee, (v) => setDetailForm({ ...detailForm, application_fee: v }))}
            {input('Notification Link', detailForm.notification_link, (v) => setDetailForm({ ...detailForm, notification_link: v }))}
            {input('Website Link', detailForm.website_link, (v) => setDetailForm({ ...detailForm, website_link: v }))}
            {input('Download Link', detailForm.download_link, (v) => setDetailForm({ ...detailForm, download_link: v }))}
            {textarea('Description', detailForm.description, (v) => setDetailForm({ ...detailForm, description: v }))}
            {textarea('Important Dates', detailForm.important_dates, (v) => setDetailForm({ ...detailForm, important_dates: v }))}
            {textarea('Eligibility', detailForm.eligibility, (v) => setDetailForm({ ...detailForm, eligibility: v }))}
            {textarea('Selection Process', detailForm.selection_process, (v) => setDetailForm({ ...detailForm, selection_process: v }))}
          </div>

          {hasLinks && (
            <>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Links</h3>
                <button
                  type="button"
                  onClick={addLink}
                  className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-200"
                >
                  + Add Link
                </button>
              </div>
              <div className="mt-1.5 space-y-2">
                {links.length === 0 && <p className="text-[11px] text-gray-500">No links added.</p>}
                {links.map((l, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 gap-2 rounded border border-gray-200 p-2 sm:grid-cols-[1fr_1fr_2fr_auto]"
                  >
                    {input('Type', l.link_type, (v) => updateLink(idx, 'link_type', v))}
                    {input('Title', l.title, (v) => updateLink(idx, 'title', v))}
                    {input('URL', l.url, (v) => updateLink(idx, 'url', v))}
                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="self-end rounded bg-red-100 px-2 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Mobile: card list */}
      <div className="space-y-1.5 sm:hidden">
        {loading && <p className="py-3 text-center text-xs text-gray-500">Loading...</p>}
        {!loading && items.length === 0 && (
          <p className="py-3 text-center text-xs text-gray-500">No {entityLabel.toLowerCase()}s found.</p>
        )}
        {items.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-2 rounded border bg-white px-2.5 py-1.5 shadow-sm">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400">#{r.id}</span>
                <p className="truncate text-xs font-semibold text-gray-800">{r.title}</p>
              </div>
              <p className="truncate text-[11px] text-gray-500">
                {r.category || '-'} · {toDateInput(r.date) || '-'}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => startEdit(r)} className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-200">
                Edit
              </button>
              <button onClick={() => handleDelete(r.id)} className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-200">
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: compact table */}
      <div className="hidden overflow-x-auto rounded-lg border bg-white shadow-sm sm:block">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-2 py-1.5">ID</th>
              <th className="px-2 py-1.5">Title</th>
              <th className="px-2 py-1.5">Category</th>
              <th className="px-2 py-1.5">Date</th>
              <th className="px-2 py-1.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="5" className="px-2 py-3 text-center text-gray-500">Loading...</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan="5" className="px-2 py-3 text-center text-gray-500">No {entityLabel.toLowerCase()}s found.</td></tr>
            )}
            {items.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-2 py-1 text-gray-500">{r.id}</td>
                <td className="px-2 py-1 font-medium">{r.title}</td>
                <td className="px-2 py-1">{r.category || '-'}</td>
                <td className="px-2 py-1">{toDateInput(r.date) || '-'}</td>
                <td className="px-2 py-1 text-right whitespace-nowrap">
                  <button onClick={() => startEdit(r)} className="mr-1 rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-200">Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700 hover:bg-red-200">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
