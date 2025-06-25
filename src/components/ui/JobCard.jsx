import React from 'react'
import { Link } from 'react-router-dom'

const JobCard = ({ job }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">{job.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{job.organization}</p>
        </div>
        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
          New
        </span>
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">Last Date: {job.lastDate}</span>
        <Link to={job.link} className="btn-primary text-sm px-4 py-2">
          Apply Now
        </Link>
      </div>
    </div>
  )
}

export default JobCard