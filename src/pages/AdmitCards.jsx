import React, { useEffect, useState } from 'react'
import AdmitCard from '../components/ui/AdmitCard'

const AdmitCards = () => {
  const [admitCards, setAdmitCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/admit_cards')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load admit cards')
        return res.json()
      })
      .then(data => setAdmitCards(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Admit Cards</h1>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6">
        {admitCards.map(card => (
          <AdmitCard key={card.id} card={card} />
        ))}
      </div>

      {!loading && !error && admitCards.length === 0 && (
        <p className="text-gray-600 mt-6">No admit cards available.</p>
      )}
    </div>
  )
}

export default AdmitCards
