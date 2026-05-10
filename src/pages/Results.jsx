import React, { useEffect, useState } from 'react'
import ResultCard from '../components/ui/ResultCard'

const Results = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/results')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load results')
        return res.json()
      })
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Latest Results</h1>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6">
        {results.map(result => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>

      {!loading && !error && results.length === 0 && (
        <p className="text-gray-600 mt-6">No results available.</p>
      )}
    </div>
  )
}

export default Results
