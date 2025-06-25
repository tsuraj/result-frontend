import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  
  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search query:', query)
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 py-6">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search jobs, exams, results..."
              className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-r-lg hover:bg-gray-800"
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SearchBar