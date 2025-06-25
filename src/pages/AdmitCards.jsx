import React from 'react'
import AdmitCard from '../components/ui/AdmitCard'
import { admitCards } from '../data/mockData'

const AdmitCards = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Admit Cards</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {admitCards.map(card => (
          <AdmitCard key={card.id} card={card} />
        ))}
        
        {/* Additional mock admit cards */}
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">SSC JE 2023 Paper 2 Admit Card</h3>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                  SSC
                </span>
                <span className="text-sm text-gray-500">08 Oct 2023</span>
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
      </div>
      
      <div className="mt-10 text-center">
        <button className="btn-primary px-6 py-2">
          View More Admit Cards
        </button>
      </div>
    </div>
  )
}

export default AdmitCards