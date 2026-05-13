import React, { useEffect, useState } from 'react'
import { authFetch } from '../services/authFetch'

const API = `${import.meta.env.VITE_API_URL}`

const emptyJob = {
  title: '',
  organization: '',
  last_date: '',
  link: '',
}

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
  notification_link: '',
  website_link: '',
  important_dates: '',
  how_to_apply: '',
  application_fees: '',
  payment_mode: '',
  qualification: '',
}

const toDateInput = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

const parseList = (str) =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

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
  return Object.entries(obj)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

const stringifyList = (val) => (Array.isArray(val) ? val.join(', ') : val || '')

const AdminJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [jobForm, setJobForm] = useState(emptyJob)
  const [detailForm, setDetailForm] = useState(emptyDetail)
  const [showForm, setShowForm] = useState(false)

  const loadJobs = () => {
    setLoading(true)
    authFetch(`${API}/jobs/admin_page`)
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setJobForm(emptyJob)
    setDetailForm(emptyDetail)
    setShowForm(false)
  }

  const startCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const startEdit = async (job) => {
    setError('')
    try {
      const res = await authFetch(`${API}/jobs/${job.id}`)
      if (!res.ok) throw new Error('Failed to load job')
      const full = await res.json()
      setEditingId(full.id)
      setJobForm({
        title: full.title || '',
        organization: full.organization || '',
        last_date: toDateInput(full.last_date),
        link: full.link || '',
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
        notification_link: d.notification_link || '',
        website_link: d.website_link || '',
        important_dates: d.important_dates || '',
        how_to_apply: d.how_to_apply || '',
        application_fees: stringifyKeyValue(d.application_fees),
        payment_mode: stringifyList(d.payment_mode),
        qualification: stringifyList(d.qualification),
      })
      setShowForm(true)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return
    setError('')
    try {
      const res = await authFetch(`${API}/jobs/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete')
      setJobs((prev) => prev.filter((j) => j.id !== id))
      if (editingId === id) resetForm()
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
      },
    }
    const url = editingId ? `${API}/jobs/${editingId}` : `${API}/jobs`
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
        <h1 className="text-lg font-bold sm:text-xl">Jobs Admin</h1>
        <button
          onClick={startCreate}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          + New Job
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 rounded-lg border bg-white p-3 shadow-sm sm:p-4"
        >
          <h2 className="mb-2 text-base font-semibold">
            {editingId ? `Edit Job #${editingId}` : 'Create Job'}
          </h2>

          <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">Job</h3>
          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {input('Title', jobForm.title, (v) => setJobForm({ ...jobForm, title: v }))}
            {input('Organization', jobForm.organization, (v) =>
              setJobForm({ ...jobForm, organization: v })
            )}
            {input('Last Date', jobForm.last_date, (v) =>
              setJobForm({ ...jobForm, last_date: v }), 'date'
            )}
            {input('Link', jobForm.link, (v) => setJobForm({ ...jobForm, link: v }))}
          </div>

          <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Job Details
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {input('Type', detailForm.type, (v) => setDetailForm({ ...detailForm, type: v }))}
            {input('Location', detailForm.location, (v) =>
              setDetailForm({ ...detailForm, location: v })
            )}
            {input('Salary', detailForm.salary, (v) => setDetailForm({ ...detailForm, salary: v }))}
            {input('Apply Link', detailForm.apply_link, (v) =>
              setDetailForm({ ...detailForm, apply_link: v })
            )}
            {input('Start Date', detailForm.start_date, (v) =>
              setDetailForm({ ...detailForm, start_date: v }), 'date'
            )}
            {input('Last Date', detailForm.last_date, (v) =>
              setDetailForm({ ...detailForm, last_date: v }), 'date'
            )}
            {input('Experience', detailForm.experience, (v) =>
              setDetailForm({ ...detailForm, experience: v })
            )}
            {input('Total Posts', detailForm.total_posts, (v) =>
              setDetailForm({ ...detailForm, total_posts: v }), 'number'
            )}
            {input('Notification Link', detailForm.notification_link, (v) =>
              setDetailForm({ ...detailForm, notification_link: v })
            )}
            {input('Website Link', detailForm.website_link, (v) =>
              setDetailForm({ ...detailForm, website_link: v })
            )}
            {textarea('Description', detailForm.description, (v) =>
              setDetailForm({ ...detailForm, description: v })
            )}
            {textarea('Important Dates', detailForm.important_dates, (v) =>
              setDetailForm({ ...detailForm, important_dates: v })
            )}
            {textarea('How To Apply', detailForm.how_to_apply, (v) =>
              setDetailForm({ ...detailForm, how_to_apply: v })
            )}
            {textarea(
              'Application Fees',
              detailForm.application_fees,
              (v) => setDetailForm({ ...detailForm, application_fees: v }),
              'One per line as "Category: Amount" (e.g. General/OBC: ₹500)'
            )}
            {textarea(
              'Payment Mode',
              detailForm.payment_mode,
              (v) => setDetailForm({ ...detailForm, payment_mode: v }),
              'Comma-separated (e.g. Online, UPI, Net Banking)'
            )}
            {textarea(
              'Qualification',
              detailForm.qualification,
              (v) => setDetailForm({ ...detailForm, qualification: v }),
              'Comma-separated list'
            )}
          </div>

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
        {!loading && jobs.length === 0 && (
          <p className="py-3 text-center text-xs text-gray-500">No jobs found.</p>
        )}
        {jobs.map((j) => (
          <div
            key={j.id}
            className="flex items-start justify-between gap-2 rounded border bg-white px-2.5 py-1.5 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400">#{j.id}</span>
                <p className="truncate text-xs font-semibold text-gray-800">{j.title}</p>
              </div>
              <p className="truncate text-[11px] text-gray-500">
                {j.organization || '-'} · {toDateInput(j.last_date) || '-'}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => startEdit(j)}
                className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(j.id)}
                className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-200"
              >
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
              <th className="px-2 py-1.5">Organization</th>
              <th className="px-2 py-1.5">Last Date</th>
              <th className="px-2 py-1.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="px-2 py-3 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && jobs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-2 py-3 text-center text-gray-500">
                  No jobs found.
                </td>
              </tr>
            )}
            {jobs.map((j) => (
              <tr key={j.id} className="border-t hover:bg-gray-50">
                <td className="px-2 py-1 text-gray-500">{j.id}</td>
                <td className="px-2 py-1 font-medium">{j.title}</td>
                <td className="px-2 py-1">{j.organization || '-'}</td>
                <td className="px-2 py-1">{toDateInput(j.last_date) || '-'}</td>
                <td className="px-2 py-1 text-right whitespace-nowrap">
                  <button
                    onClick={() => startEdit(j)}
                    className="mr-1 rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(j.id)}
                    className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminJobs
