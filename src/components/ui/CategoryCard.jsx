import React from 'react'
import { Link } from 'react-router-dom'

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
      className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
    >
      <div className="text-2xl mb-2">{category.icon}</div>
      <h3 className="font-bold text-gray-800">{category.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{category.count}</p>
    </Link>
  )
}

export default CategoryCard