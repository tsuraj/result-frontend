import React from 'react'
import ResultCard from '../components/ui/ResultCard'
import { results } from '../data/mockData'

const Results = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Latest Results</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {results.map(result => (
          <ResultCard key={result.id} result={result} />
        ))}
        
        {/* Additional mock results */}
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Railway Group D 2022 Final Result</h3>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                  Railway
                </span>
                <span className="text-sm text-gray-500">05 Oct 2023</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">Check your result now</span>
            <button className="btn-primary text-sm px-4 py-2">
              View Result
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <button className="btn-primary px-6 py-2">
          Load More Results
        </button>
      </div>
    </div>
  )
}

export default Results