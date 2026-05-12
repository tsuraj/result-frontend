import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const formatDate = (value) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const InfoRow = ({ label, value }) => {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex flex-col rounded-lg bg-gray-50 px-3 py-2">
      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  )
}

const Section = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="mb-2 text-lg font-bold text-gray-800">{title}</h2>
    {children}
  </section>
)

const JobDetails = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8000/api/v1/jobs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load job')
        return res.json()
      })
      .then(data => setJob(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-gray-600">Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!job) return <p className="text-gray-600">Job not found.</p>

  const detail = job.job_detail || {}
  const title = detail.title || job.title
  const organization = detail.organization || job.organization
  const lastDate = formatDate(detail.last_date || job.last_date)
  const startDate = formatDate(detail.start_date)
  const applyLink = detail.apply_link || job.link
  const qualification = Array.isArray(detail.qualification) ? detail.qualification : null
  const paymentMode = Array.isArray(detail.payment_mode) ? detail.payment_mode : null
  const fees = detail.application_fees && typeof detail.application_fees === 'object' ? detail.application_fees : null

  return (
    <div>
      <div className="mb-4">
        <Link to="/latest-jobs" className="text-sm text-red-600 hover:underline">&larr; Back to Latest Jobs</Link>
      </div>

      <div className="card">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">{title}</h1>
            {organization && <p className="text-gray-600">{organization}</p>}
            {detail.important_dates && (
              <p className="mt-1 text-xs text-gray-500">{detail.important_dates}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">New</span>
            {detail.type && (
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{detail.type}</span>
            )}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoRow label="Location" value={detail.location} />
          <InfoRow label="Salary" value={detail.salary} />
          <InfoRow label="Experience" value={detail.experience} />
          <InfoRow label="Total Posts" value={detail.total_posts} />
          <InfoRow label="Start Date" value={startDate} />
          <InfoRow label="Last Date" value={lastDate} />
        </div>

        {detail.description && (
          <Section title="Description">
            <p className="whitespace-pre-line text-sm text-gray-700">{detail.description}</p>
          </Section>
        )}

        {qualification && qualification.length > 0 && (
          <Section title="Qualification">
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {qualification.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </Section>
        )}

        {fees && (
          <Section title="Application Fees">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(fees).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-semibold text-gray-800">{amount}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {paymentMode && paymentMode.length > 0 && (
          <Section title="Payment Mode">
            <div className="flex flex-wrap gap-2">
              {paymentMode.map((m, i) => (
                <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{m}</span>
              ))}
            </div>
          </Section>
        )}

        {detail.how_to_apply && (
          <Section title="How to Apply">
            <p className="whitespace-pre-line text-sm text-gray-700">{detail.how_to_apply}</p>
          </Section>
        )}

        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
          {applyLink && (
            <a
              href={applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block px-6 py-2"
            >
              Apply Now
            </a>
          )}
          {detail.notification_link && (
            <a
              href={detail.notification_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Notification
            </a>
          )}
          {detail.website_link && (
            <a
              href={detail.website_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Official Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetails
