import { Link } from 'react-router-dom'

const NotificationBar = () => {
  return (
    <div className="bg-black text-gray-200 text-xs">
      <div className="container flex items-center justify-between py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          <span className="font-semibold text-white">Active:</span>
          <span className="truncate text-gray-300">
            UP Police Constable 2023 — 60,244 vacancies · Last date <span className="text-white">10 Nov 2023</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-300 flex-shrink-0">
          <button className="hover:text-white">EN</button>
          <button className="hover:text-white">हि</button>
          <span className="text-gray-600">|</span>
          <Link to="/" className="hover:text-white">Sarkari Result</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </div>
  )
}

export default NotificationBar
