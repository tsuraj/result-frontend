import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaEnvelope, FaMobileAlt } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = [
    { 
      title: 'Important Links', 
      links: [
        { name: 'Home', path: '/' },
        { name: 'Latest Jobs', path: '/latest-jobs' },
        { name: 'Results', path: '/results' },
        { name: 'Admit Card', path: '/admit-cards' },
        { name: 'Answer Key', path: '/answer-keys' }
      ]
    },
    { 
      title: 'Popular Exams', 
      links: [
        { name: 'SSC CGL', path: '/exam/ssc-cgl' },
        { name: 'IBPS PO', path: '/exam/ibps-po' },
        { name: 'Railway Group D', path: '/exam/railway-group-d' },
        { name: 'UP Police Constable', path: '/exam/up-police' },
        { name: 'SBI Clerk', path: '/exam/sbi-clerk' }
      ]
    },
    { 
      title: 'Help & Support', 
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'About Us', path: '/about' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms & Conditions', path: '/terms' }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Rojgar Result</h3>
            <p className="text-gray-300 mb-4">
              India's No.1 Portal for Government Job Updates. Get latest exam notifications, 
              results, admit cards and more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
          
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <h4 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-yellow-400" />
                <span>contact@rojgarresult.com</span>
              </li>
              <li className="flex items-center">
                <FaMobileAlt className="mr-2 text-yellow-400" />
                <span>+91 9876543210</span>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="font-medium mb-2">Download App</h5>
              <div className="flex space-x-2">
                <button className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800">
                  Play Store
                </button>
                <button className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800">
                  App Store
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Rojgar Result. All Rights Reserved.</p>
          <p className="mt-2 text-sm">
            Disclaimer: This website is not affiliated with any government organization. 
            We provide information about government job notifications.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer