import React from 'react'

const ResultCard = ({ result }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">{result.title}</h3>
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
              {result.category}
            </span>
            <span className="text-sm text-gray-500">{result.date}</span>
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
  )
}

export default ResultCard