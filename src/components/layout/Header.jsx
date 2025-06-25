import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBell, FaUser, FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Latest Jobs', path: '/latest-jobs' },
    { name: 'Results', path: '/results' },
    { name: 'Admit Card', path: '/admit-cards' },
    { name: 'Answer Key', path: '/answer-keys' },
    { name: 'Syllabus', path: '/syllabus' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="bg-red-600 text-white font-bold text-xl px-3 py-2 rounded mr-3">RR</div>
            <div>
              <Link to="/" className="text-2xl font-bold text-gray-800">Rojgar<span className="text-red-600">Result</span></Link>
              <p className="text-xs text-gray-600">India's No.1 Job Portal</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className={`font-medium ${location.pathname === item.path ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center text-gray-700 hover:text-red-600">
              <FaBell className="mr-1" /> <span className="hidden lg:inline">Notifications</span>
            </button>
            <button className="hidden md:flex items-center btn-primary">
              <FaUser className="mr-1" /> <span className="hidden lg:inline">Login</span>
            </button>
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 border-t">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className={`font-medium ${location.pathname === item.path ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex space-x-4">
              <button className="flex items-center text-gray-700 hover:text-red-600">
                <FaBell className="mr-1" /> Notifications
              </button>
              <button className="flex items-center btn-primary">
                <FaUser className="mr-1" /> Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header