import { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import AdmitCard from '../components/ui/AdmitCard'
import useDocumentMeta from '../hooks/useDocumentMeta'

const PAGE_SIZE = 20

const AdmitCards = () => {
  useDocumentMeta(
    'Admit Cards 2026 — Download Government Exam Hall Tickets',
    'Download the latest admit cards and hall tickets for government exams — SSC, UPSC, Railway, Banking and State Govt recruitment. Direct download links and exam dates.',
    { canonical: '/admit-cards' }
  )
  const [admitCards, setAdmitCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/admit_cards`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load admit cards')
        return res.json()
   
   
   
      })
      .then(data => setAdmitCards(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admit Cards</h1>
        {!loading && !error && (
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{admitCards.length.toLocaleString()}</span> admit cards
          </p>
        )}
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-1 gap-4">
        {admitCards.slice(0, visibleCount).map(card => (
          <AdmitCard key={card.id} card={card} />
        ))}
      </div>

      {!loading && !error && admitCards.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{Math.min(visibleCount, admitCards.length)}</span> of {admitCards.length}
          </span>
          {visibleCount < admitCards.length && (
            <button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black"
            >
              View more <FaArrowRight size={11} />
            </button>
          )}
        </div>
      )}

      {!loading && !error && admitCards.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mt-4">
          <p className="text-gray-600 text-sm">No admit cards available.</p>
        </div>
      )}
    </div>
  )
}

export default AdmitCards
