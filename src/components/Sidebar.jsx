import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegCalendarAlt, FaRegClock, FaRegNewspaper, FaBullhorn } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar space-y-6">
      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-blue-800 border-b pb-2">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/admit-cards" className="flex items-center text-blue-600 hover:text-blue-800">
              <FaRegCalendarAlt className="mr-2 text-red-600" /> Admit Cards
            </Link>
          </li>
          <li>
            <Link to="/results" className="flex items-center text-blue-600 hover:text-blue-800">
              <FaRegNewspaper className="mr-2 text-green-600" /> Results
            </Link>
          </li>
          <li>
            <Link to="/latest-jobs" className="flex items-center text-blue-600 hover:text-blue-800">
              <FaBullhorn className="mr-2 text-yellow-600" /> Latest Jobs
            </Link>
          </li>
          <li>
            <Link to="/syllabus" className="flex items-center text-blue-600 hover:text-blue-800">
              <FaRegClock className="mr-2 text-purple-600" /> Syllabus
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Important Dates */}
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-blue-800 border-b pb-2">Important Dates</h3>
        <ul className="space-y-3">
          <li className="border-b border-gray-100 pb-2">
            <p className="font-medium">UPSC Civil Services</p>
            <p className="text-sm text-gray-600">Last Date: 05 Mar 2024</p>
          </li>
          <li className="border-b border-gray-100 pb-2">
            <p className="font-medium">SSC CGL 2023</p>
            <p className="text-sm text-gray-600">Tier 2 Exam: 15 Feb 2024</p>
          </li>
          <li className="border-b border-gray-100 pb-2">
            <p className="font-medium">IBPS PO 2023</p>
            <p className="text-sm text-gray-600">Interview: 20-28 Feb 2024</p>
          </li>
          <li>
            <p className="font-medium">Railway Group D</p>
            <p className="text-sm text-gray-600">Phase 3 Exam: 10 Mar 2024</p>
          </li>
        </ul>
      </div>
      
      {/* Advertisement */}
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-blue-800 border-b pb-2">Download App</h3>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="font-medium mb-2">Get Instant Notifications</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md w-full hover:bg-green-700">
            Download Sarkari Result App
          </button>
          <p className="text-sm text-gray-600 mt-2">1M+ Downloads</p>
        </div>
      </div>
      
      {/* Popular Exams */}
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-blue-800 border-b pb-2">Popular Exams</h3>
        <ul className="space-y-2">
          {[
            'SSC CGL', 'IBPS PO', 'UPSC Civil Services', 'Railway Group D', 
            'SBI Clerk', 'CTET', 'NEET', 'GATE', 'UGC NET', 'State PSC'
          ].map((exam, index) => (
            <li key={index} className="border-b border-gray-100 pb-2 last:border-0">
              <Link to={`/exam/${exam.toLowerCase().replace(/\s+/g, '-')}`} className="text-blue-600 hover:underline">
                {exam}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;