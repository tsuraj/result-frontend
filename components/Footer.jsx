import Link from 'next/link'
import { FaEnvelope, FaMobileAlt } from 'react-icons/fa'
import { SOCIAL_LINKS } from '../lib/social'

const footerLinks = [
  {
    title: 'Important Links',
    links: [
      { name: 'Home', path: '/' },
      { name: 'Latest Jobs', path: '/latest-jobs' },
      { name: 'Results', path: '/results' },
      { name: 'Admit Card', path: '/admit-cards' },
      { name: 'Answer Key', path: '/answer-keys' },
    ],
  },
  {
    title: 'Browse by Category',
    links: [
      { name: 'Railway Jobs', path: '/category/railway' },
      { name: 'Banking Jobs', path: '/category/banking' },
      { name: 'SSC Exams', path: '/category/ssc' },
      { name: 'UPSC Exams', path: '/category/upsc' },
      { name: 'Defence Jobs', path: '/category/defence' },
    ],
  },
  {
    title: 'Help & Support',
    links: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'About Us', path: '/about' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Disclaimer', path: '/disclaimer' },
      { name: 'Terms & Conditions', path: '/terms' },
    ],
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Hire Sarkar</h3>
            <p className="text-gray-300 mb-4">
              Get the latest government job notifications, exam results, admit cards, answer keys and syllabus from across India.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-300 hover:text-white"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link href={link.path} className="text-gray-300 hover:text-yellow-400 transition-colors">
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
                <span>hiresarkar590@gmail.com</span>
              </li>
              <li className="flex items-center">
                <FaMobileAlt className="mr-2 text-yellow-400" />
                <span>+91 ********</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Hire Sarkar. All Rights Reserved.</p>
          <p className="mt-2 text-sm">
            Disclaimer: This website is not affiliated with any government organization.
            We provide information about government job notifications.
          </p>
        </div>
      </div>
    </footer>
  )
}
