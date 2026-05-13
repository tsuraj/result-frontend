import { useState } from 'react'
import { FaSearch, FaArrowRight } from 'react-icons/fa'
import { searchJobs } from '../../services/searchApi'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    try {
      const response = await searchJobs(query)
      setResults(response.data)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  return (
    <div className="bg-gradient-to-b from-red-50/60 to-transparent border-b border-gray-200">
      <div className="container py-5">
        <form onSubmit={handleSearch} className="flex items-stretch gap-2 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center gap-3 bg-white border border-gray-300 rounded-full px-5 py-2.5 shadow-sm focus-within:border-gray-900">
            <FaSearch className="text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search jobs, exams, results…"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-black"
          >
            Search <FaArrowRight size={11} />
          </button>
        </form>

        {results.length > 0 && (
          <div className="max-w-3xl mx-auto mt-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {results.map(job => (
              <div key={job.id} className="px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{job.organization}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
