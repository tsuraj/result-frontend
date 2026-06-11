import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaSearch, FaArrowRight } from 'react-icons/fa'

const SearchBar = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  // Keep the box in sync with the URL (e.g. when landing on /latest-jobs?q=…).
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/latest-jobs?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="bg-gradient-to-b from-red-50/60 to-transparent border-b border-gray-200">
      <div className="container py-5">
        <form onSubmit={handleSearch} className="flex items-stretch gap-2 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center gap-3 bg-white border border-gray-300 rounded-full px-5 py-2.5 shadow-sm focus-within:border-gray-900">
            <FaSearch className="text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search jobs by title or organization…"
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
      </div>
    </div>
  )
}

export default SearchBar
