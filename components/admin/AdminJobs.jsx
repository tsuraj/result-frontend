'use client'
import { useEffect, useState } from 'react'
import { authFetch, API_BASE } from '../../lib/authFetch'
import { triggerRevalidate, revalidationPaths } from '../../lib/triggerRevalidate'
import { useRole, isAdminRole } from '../../lib/useRole'

const emptyJob = { title: '', organization: '', last_date: '', published: false }

const emptyDetail = {
  type: 'Full Time',
  location: '',
  salary: '',
  apply_link: '',
  start_date: '',
  last_date: '',
  experience: '',
  total_posts: '',
  description: '',
  eligibility: '',
  selection_process: '',
  notification_link: '',
  website_link: '',
  important_dates: '',
  how_to_apply: '',
  application_fees: '',
  payment_mode: '',
  qualification: '',
}

const emptyLink = { link_type: '', title: '', url: '' }

const toDateInput = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

const parseList = (str) => str.split(',').map((s) => s.trim()).filter(Boolean)

const parseKeyValue = (str) => {
  const obj = {}
  str.split('\n').forEach((line) => {
    const [k, ...rest] = line.split(':')
    if (k && rest.length) obj[k.trim()] = rest.join(':').trim()
  })
  return obj
}

const stringifyKeyValue = (obj) => {
  if (!obj || typeof obj !== 'object') return ''
  return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n')
}

const stringifyList = (val) => (Array.isArray(val) ? val.join(', ') : val || '')

export default function AdminJobs() {
  const role = useRole()
  const canDelete = isAdminRole(role)

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [jobForm, setJobForm] = useState(emptyJob)
  const [detailForm, setDetailForm] = useState(emptyDetail)
  const [links, setLinks] = useState([])
  const [removedLinkIds, setRemovedLinkIds] = useState([])
  const [showForm, setShowForm] = useState(false)

  const loadJobs = () => {
    setLoading(true)
    authFetch(`${API_BASE}/jobs/admin_page`)
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadJobs() }, [])

  const resetForm = () => {
    setEditingId(null)
    setJobForm(emptyJob)
    setDetailForm(emptyDetail)
    setLinks([])
    setRemovedLinkIds([])
    setShowForm(false)
  }

  const addLink = () => setLinks((prev) => [...prev, { ...emptyLink }])
  const updateLink = (idx, field, value) =>
    setLinks((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)))
  const removeLink = (idx) =>
    setLinks((prev) => {
      const target = prev[idx]
      if (target && target.id) setRemovedLinkIds((ids) => [...ids, target.id])
      return prev.filter((_, i) => i !== idx)
    })

  const startCreate = () => { resetForm(); setShowForm(true) }

  const startEdit = async (job) => {
    setError('')
    try {
      const res = await authFetch(`${API_BASE}/jobs/${job.id}`)
      if (!res.ok) throw new Error('Failed to load job')
      const full = await res.json()
      setEditingId(full.id)
      setJobForm({
        title: full.title || '',
        organization: full.organization || '',
        last_date: toDateInput(full.last_date),
        published: Boolean(full.published),
      })
      const d = full.job_detail || {}
      setDetailForm({
        type: d.type || 'Full Time',
        location: d.location || '',
        salary: d.salary || '',
        apply_link: d.apply_link || '',
        start_date: toDateInput(d.start_date),
        last_date: toDateInput(d.last_date),
        experience: d.experience || '',
        total_posts: d.total_posts ?? '',
        description: d.description || '',
        eligibility: d.eligibility || '',
        selection_process: d.selection_process || '',
        notification_link: d.notification_link || '',
        website_link: d.website_link || '',
        important_dates: d.important_dates || '',
        how_to_apply: d.how_to_apply || '',
        application_fees: stringifyKeyValue(d.application_fees),
        payment_mode: stringifyList(d.payment_mode),
        qualification: stringifyList(d.qualification),
      })
      const sourceLinks = Array.isArray(full.links) ? full.links : []
      setLinks(sourceLinks.map((l) => ({ id: l.id, link_type: l.link_type || '', title: l.title || '', url: l.url || '' })))
      setRemovedLinkIds([])
      setShowForm(true)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return
    setError('')
    try {
      const res = await authFetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete')
      setJobs((prev) => prev.filter((j) => j.id !== id))
      if (editingId === id) resetForm()
      triggerRevalidate(revalidationPaths.jobs)
    } catch (e) {
      setError(e.message)
    }
  }

  const togglePublished = async (job) => {
    setError('')
    try {
      const res = await authFetch(`${API_BASE}/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: { published: !job.published } }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Toggle failed: ${txt}`)
      }
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, published: !job.published } : j)))
      triggerRevalidate(revalidationPaths.jobs)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      job: {
        ...jobForm,
        job_detail_attributes: {
          ...detailForm,
          total_posts: detailForm.total_posts === '' ? null : Number(detailForm.total_posts),
          application_fees: parseKeyValue(detailForm.application_fees),
          payment_mode: parseList(detailForm.payment_mode),
          qualification: parseList(detailForm.qualification),
        },
        links_attributes: [
          ...links.map((l) => ({
            ...(l.id ? { id: l.id } : {}),
            link_type: l.link_type,
            title: l.title,
            url: l.url,
          })),
          ...removedLinkIds.map((id) => ({ id, _destroy: true })),
        ],
      },
    }
    const url = editingId ? `${API_BASE}/jobs/${editingId}` : `${API_BASE}/jobs`
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
      loadJobs()
      triggerRevalidate(revalidationPaths.jobs)
    } catch (e) {
      setError(e.message)
    }
  }

  const input = (label, value, onChange, type = 'text') => (
    <label className="flex flex-col text-sm">
      <span className="mb-1 text-xs font-medium text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
      />
    </label>
  )

  // `rows` defaults to 5 (was 2) so admins can actually see what they're
  // writing. Long-form fields (description / eligibility / how_to_apply)
  // override with rows={10}. `resize-y` lets admins drag bigger when needed.
  const textarea = (label, value, onChange, hint, rows = 5) => (
    <label className="flex flex-col text-sm md:col-span-2">
      <span className="mb-1 text-xs font-medium text-gray-600">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="resize-y rounded-md border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
      />
      {hint && <span className="mt-1 text-[11px] text-gray-500">{hint}</span>}
    </label>
  )

  return (
    <div className="p-3 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold sm:text-xl">Jobs Admin</h1>
        <button onClick={startCreate} className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
          + New Job
        </button>
      </div>

      {error && <div className="mb-3 rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs text-red-700">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5 rounded-lg border bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-2 text-base font-semibold">{editingId ? `Edit Job #${editingId}` : 'Create Job'}</h2>

          <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">Job</h3>
          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {input('Title', jobForm.title, (v) => setJobForm({ ...jobForm, title: v }))}
            {input('Organization', jobForm.organization, (v) => setJobForm({ ...jobForm, organization: v }))}
            {input('Last Date', jobForm.last_date, (v) => setJobForm({ ...jobForm, last_date: v }), 'date')}
            <label className="flex items-center gap-2 text-xs sm:col-span-2">
              <input
                type="checkbox"
                checked={Boolean(jobForm.published)}
                onChange={(e) => setJobForm({ ...jobForm, published: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="font-medium text-gray-700">Publish (visible on public site)</span>
              <span className="text-[10px] text-gray-500">Uncheck to save as a draft.</span>
            </label>
          </div>

          <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">Job Details</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {input('Type', detailForm.type, (v) => setDetailForm({ ...detailForm, type: v }))}
            {input('Location', detailForm.location, (v) => setDetailForm({ ...detailForm, location: v }))}
            {input('Salary', detailForm.salary, (v) => setDetailForm({ ...detailForm, salary: v }))}
            {input('Apply Link', detailForm.apply_link, (v) => setDetailForm({ ...detailForm, apply_link: v }))}
            {input('Start Date', detailForm.start_date, (v) => setDetailForm({ ...detailForm, start_date: v }), 'date')}
            {input('Last Date', detailForm.last_date, (v) => setDetailForm({ ...detailForm, last_date: v }), 'date')}
            {input('Experience', detailForm.experience, (v) => setDetailForm({ ...detailForm, experience: v }))}
            {input('Total Posts', detailForm.total_posts, (v) => setDetailForm({ ...detailForm, total_posts: v }), 'number')}
            {input('Notification Link', detailForm.notification_link, (v) => setDetailForm({ ...detailForm, notification_link: v }))}
            {input('Website Link', detailForm.website_link, (v) => setDetailForm({ ...detailForm, website_link: v }))}
            {textarea('Description', detailForm.description, (v) => setDetailForm({ ...detailForm, description: v }), null, 10)}
            {textarea('Eligibility', detailForm.eligibility, (v) => setDetailForm({ ...detailForm, eligibility: v }), null, 8)}
            {textarea('Selection Process', detailForm.selection_process, (v) => setDetailForm({ ...detailForm, selection_process: v }), null, 8)}
            {textarea('Important Dates', detailForm.important_dates, (v) => setDetailForm({ ...detailForm, important_dates: v }), null, 6)}
            {textarea('How To Apply', detailForm.how_to_apply, (v) => setDetailForm({ ...detailForm, how_to_apply: v }), null, 10)}
            {textarea('Application Fees', detailForm.application_fees, (v) => setDetailForm({ ...detailForm, application_fees: v }), 'One per line as "Category: Amount"')}
            {textarea('Payment Mode', detailForm.payment_mode, (v) => setDetailForm({ ...detailForm, payment_mode: v }), 'Comma-separated')}
            {textarea('Qualification', detailForm.qualification, (v) => setDetailForm({ ...detailForm, qualification: v }), 'Comma-separated')}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Links</h3>
            <button type="button" onClick={addLink} className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-200">
              + Add Link
            </button>
          </div>
          <div className="mt-1.5 space-y-2">
            {links.length === 0 && <p className="text-[11px] text-gray-500">No links added.</p>}
            {links.map((l, idx) => (
              <div key={idx} className="grid grid-cols-1 gap-2 rounded border border-gray-200 p-2 sm:grid-cols-[1fr_1fr_2fr_auto]">
                {input('Type', l.link_type, (v) => updateLink(idx, 'link_type', v))}
                {input('Title', l.title, (v) => updateLink(idx, 'title', v))}
                {input('URL', l.url, (v) => updateLink(idx, 'url', v))}
                <button type="button" onClick={() => removeLink(idx)} className="self-end rounded bg-red-100 px-2 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-200">Remove</button>
              </div>
            ))}
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

      <div className="space-y-1.5 sm:hidden">
        {loading && <p className="py-3 text-center text-xs text-gray-500">Loading...</p>}
        {!loading && jobs.length === 0 && <p className="py-3 text-center text-xs text-gray-500">No jobs found.</p>}
        {jobs.map((j) => (
          <div key={j.id} className="flex items-start justify-between gap-2 rounded border bg-white px-2.5 py-1.5 shadow-sm">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400">#{j.id}</span>
                <p className="truncate text-xs font-semibold text-gray-800">{j.title}</p>
                {!j.published && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-amber-800">Draft</span>
                )}
              </div>
              <p className="truncate text-[11px] text-gray-500">{j.organization || '-'} · {toDateInput(j.last_date) || '-'}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => togglePublished(j)}
                className={`rounded px-2 py-0.5 text-[10px] font-semibold ${j.published ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
              >
                {j.published ? 'Unpub' : 'Pub'}
              </button>
              <button onClick={() => startEdit(j)} className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-200">Edit</button>
              {canDelete && (
                <button onClick={() => handleDelete(j.id)} className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-200">Del</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border bg-white shadow-sm sm:block">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-2 py-1.5">ID</th>
              <th className="px-2 py-1.5">Title</th>
              <th className="px-2 py-1.5">Organization</th>
              <th className="px-2 py-1.5">Last Date</th>
              <th className="px-2 py-1.5">Status</th>
              <th className="px-2 py-1.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="6" className="px-2 py-3 text-center text-gray-500">Loading...</td></tr>}
            {!loading && jobs.length === 0 && <tr><td colSpan="6" className="px-2 py-3 text-center text-gray-500">No jobs found.</td></tr>}
            {jobs.map((j) => (
              <tr key={j.id} className="border-t hover:bg-gray-50">
                <td className="px-2 py-1 text-gray-500">{j.id}</td>
                <td className="px-2 py-1 font-medium">{j.title}</td>
                <td className="px-2 py-1">{j.organization || '-'}</td>
                <td className="px-2 py-1">{toDateInput(j.last_date) || '-'}</td>
                <td className="px-2 py-1">
                  {j.published ? (
                    <span className="rounded-full bg-green-100 px-2 py-px text-[10px] font-bold uppercase tracking-wide text-green-800">Live</span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-px text-[10px] font-bold uppercase tracking-wide text-amber-800">Draft</span>
                  )}
                </td>
                <td className="px-2 py-1 text-right whitespace-nowrap">
                  <button
                    onClick={() => togglePublished(j)}
                    className={`mr-1 rounded px-2 py-0.5 text-[11px] font-semibold ${j.published ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                  >
                    {j.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => startEdit(j)} className="mr-1 rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-200">Edit</button>
                  {canDelete && (
                    <button onClick={() => handleDelete(j.id)} className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700 hover:bg-red-200">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
