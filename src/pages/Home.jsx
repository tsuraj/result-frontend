import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import JobCard from '../components/ui/JobCard'
import ResultCard from '../components/ui/ResultCard'
import AdmitCard from '../components/ui/AdmitCard'
import CategoryCard from '../components/ui/CategoryCard'
import QuickLinks from '../components/ui/QuickLinks'
import UpdatesPanel from '../components/ui/UpdatesPanel'
import { 
  notifications, 
  latestJobs, 
  results, 
  admitCards, 
  categories 
} from '../data/mockData'

const Home = () => {
  const [activeTab, setActiveTab] = useState('latest-jobs')

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <QuickLinks />
          <UpdatesPanel notifications={notifications} />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="card mb-6">
            <div className="flex border-b">
              <button 
                className={`tab-btn ${activeTab === 'latest-jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('latest-jobs')}
              >
                Latest Jobs
              </button>
              <button 
                className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                Results
              </button>
              <button 
                className={`tab-btn ${activeTab === 'admit-cards' ? 'active' : ''}`}
                onClick={() => setActiveTab('admit-cards')}
              >
                Admit Cards
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'latest-jobs' && (
                <div className="space-y-4">
                  {latestJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                  <div className="text-center mt-4">
                    <Link to="/latest-jobs" className="text-red-600 font-medium hover:underline">
                      View All Jobs
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div className="space-y-4">
                  {results.map(result => (
                    <ResultCard key={result.id} result={result} />
                  ))}
                  <div className="text-center mt-4">
                    <Link to="/results" className="text-red-600 font-medium hover:underline">
                      View All Results
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'admit-cards' && (
                <div className="space-y-4">
                  {admitCards.map(card => (
                    <AdmitCard key={card.id} card={card} />
                  ))}
                  <div className="text-center mt-4">
                    <Link to="/admit-cards" className="text-red-600 font-medium hover:underline">
                      View All Admit Cards
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exam Categories */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <CategoryCard key={index} category={category} />
              ))}
            </div>
          </div>

          {/* Mobile App Banner */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold mb-2">Get Rojgar Result App</h3>
                <p className="mb-4">
                  Download our app for instant notifications on government jobs, exam results, 
                  admit cards and more. Never miss an important update!
                </p>
                <div className="flex space-x-4">
                  <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100">
                    Google Play
                  </button>
                  <button className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800">
                    App Store
                  </button>
                </div>
              </div>
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-64 h-48 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home