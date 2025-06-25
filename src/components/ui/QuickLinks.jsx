import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaBook, FaFileAlt, FaGraduationCap, FaEnvelope } from 'react-icons/fa'

const QuickLinks = () => {
  const links = [
    { name: 'Home', icon: <FaHome />, path: '/' },
    { name: 'Latest Jobs', icon: <FaBook />, path: '/latest-jobs' },
    { name: 'Results', icon: <FaFileAlt />, path: '/results' },
    { name: 'Admit Card', icon: <FaGraduationCap />, path: '/admit-cards' },
    { name: 'Contact Us', icon: <FaEnvelope />, path: '/contact' },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Quick Links</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link 
              to={link.path}
              className="flex items-center text-gray-700 hover:text-red-600"
            >
              <span className="text-red-600 mr-2">{link.icon}</span> {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuickLinks