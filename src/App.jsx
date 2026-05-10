import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import NotificationBar from './components/layout/NotificationBar'
import SearchBar from './components/ui/SearchBar'
import Home from './pages/Home'
import LatestJobs from './pages/LatestJobs'
import Results from './pages/Results'
import AdmitCards from './pages/AdmitCards'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen">
              <NotificationBar />
              <Header />
              <SearchBar />

              <main className="flex-grow py-6">
                <div className="container">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/latest-jobs" element={<LatestJobs />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/admit-cards" element={<AdmitCards />} />
                    <Route path="*" element={<div className="text-center py-20">Page Not Found</div>} />
                  </Routes>
                </div>
              </main>

              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App