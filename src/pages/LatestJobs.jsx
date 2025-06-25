import React from 'react'
import JobCard from '../components/ui/JobCard'
import { latestJobs } from '../data/mockData'

const LatestJobs = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Latest Government Jobs</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {latestJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
        
        {/* Additional mock jobs */}
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Indian Army Technical Graduate Course 2024</h3>
              <p className="text-gray-600 text-sm mb-2">Indian Army</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">Last Date: 20 Nov 2023</span>
            <button className="btn-primary text-sm px-4 py-2">
              Apply Now
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Delhi High Court Clerk Recruitment 2023</h3>
              <p className="text-gray-600 text-sm mb-2">Delhi High Court</p>
            </div>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              New
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">Last Date: 05 Nov 2023</span>
            <button className="btn-primary text-sm px-4 py-2">
              Apply Now
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <button className="btn-primary px-6 py-2">
          Load More Jobs
        </button>
      </div>
    </div>
  )
}

export default LatestJobs