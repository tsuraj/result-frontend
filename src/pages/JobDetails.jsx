import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

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

  return (
    <div>
      <div className="mb-4">
        <Link to="/latest-jobs" className="text-red-600 hover:underline text-sm">&larr; Back to Latest Jobs</Link>
      </div>

      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
            {job.organization && (
              <p className="text-gray-600">{job.organization}</p>
            )}
            {job.department && (
              <p className="text-gray-600">{job.department}</p>
            )}
          </div>
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">New</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {job.lastDate && (
            <div>
              <span className="block text-xs text-gray-500 uppercase">Last Date</span>
              <span className="text-gray-800 font-medium">{job.lastDate}</span>
            </div>
          )}
          {job.posted_date && (
            <div>
              <span className="block text-xs text-gray-500 uppercase">Posted</span>
              <span className="text-gray-800 font-medium">{job.posted_date}</span>
            </div>
          )}
          {job.location && (
            <div>
              <span className="block text-xs text-gray-500 uppercase">Location</span>
              <span className="text-gray-800 font-medium">{job.location}</span>
            </div>
          )}
          {job.vacancies && (
            <div>
              <span className="block text-xs text-gray-500 uppercase">Vacancies</span>
              <span className="text-gray-800 font-medium">{job.vacancies}</span>
            </div>
          )}
          {job.qualification && (
            <div>
              <span className="block text-xs text-gray-500 uppercase">Qualification</span>
              <span className="text-gray-800 font-medium">{job.qualification}</span>
            </div>
          )}
          {job.salary && (
            <div>
              <span className="block text-xs text-gray-500 uppercase">Salary</span>
              <span className="text-gray-800 font-medium">{job.salary}</span>
            </div>
          )}
        </div>

        {job.description && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {job.eligibility && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Eligibility</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.eligibility}</p>
          </div>
        )}

        {job.how_to_apply && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">How to Apply</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.how_to_apply}</p>
          </div>
        )}

        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block px-6 py-2"
          >
            Apply Now
          </a>
        )}
      </div>
    </div>
  )
}

export default JobDetails
