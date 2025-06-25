import React from 'react'

const AdmitCard = ({ card }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">{card.title}</h3>
          <div className="flex items-center">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
              {card.category}
            </span>
            <span className="text-sm text-gray-500">{card.date}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">Download your admit card</span>
        <button className="btn-primary text-sm px-4 py-2">
          Download
        </button>
      </div>
    </div>
  )
}

export default AdmitCard