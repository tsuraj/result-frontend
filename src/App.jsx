import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import NotificationBar from './components/layout/NotificationBar'
import SearchBar from './components/ui/SearchBar'
import Home from './pages/Home'
import LatestJobs from './pages/LatestJobs'
import Results from './pages/Results'
import ResultDetails from './pages/ResultDetails'
import AdmitCards from './pages/AdmitCards'
import AdmitCardDetails from './pages/AdmitCardDetails'
import AnswerKeyDetails from './pages/AnswerKeyDetails'
import JobDetails from './pages/JobDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminJobs from './pages/AdminJobs'
import AdminResult from './pages/AdminResult'
import AdminPages from './pages/AdminPages'
import AdminAdmitCards from './pages/AdminAdmitCards'
import AdminAnswerKeys from './pages/AdminAnswerKeys'
import AdminSyllabus from './pages/AdminSyllabus'
import AboutUs from './pages/static/AboutUs'
import PrivacyPolicy from './pages/static/PrivacyPolicy'
import Disclaimer from './pages/static/Disclaimer'
import Terms from './pages/static/Terms'
import ContactUs from './pages/static/ContactUs'
import AnswerKeys from './pages/AnswerKeys'
import Syllabus from './pages/Syllabus'
import SyllabusDetails from './pages/SyllabusDetails'
import { JobsProvider } from './context/JobsContext'
import AdminRoute from './components/AdminRoute'

function MainLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const containerWide = isHome
  return (
    <div className="flex flex-col min-h-screen">
      <NotificationBar />
      <Header />
      {!isHome && <SearchBar />}

      <main className="flex-grow py-6">
        <div className={containerWide ? '' : 'container'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/latest-jobs" element={<LatestJobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/results" element={<Results />} />
            <Route path="/results/:id" element={<ResultDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/admit-cards" element={<AdmitCards />} />
            <Route path="/admit-cards/:id" element={<AdmitCardDetails />} />
            <Route path="/answer-keys" element={<AnswerKeys />} />
            <Route path="/answer-keys/:id" element={<AnswerKeyDetails />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/syllabus/:id" element={<SyllabusDetails />} />
            <Route path="*" element={<div className="text-center py-20">Page Not Found</div>} />
          </Routes>
        </div>
      </main>

      {!isHome && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/jobs" element={<AdminRoute><AdminJobs /></AdminRoute>} />
        <Route path="/admin/results" element={<AdminRoute><AdminResult /></AdminRoute>} />
        <Route path="/admin/admit-cards" element={<AdminRoute><AdminAdmitCards /></AdminRoute>} />
        <Route path="/admin/answer-keys" element={<AdminRoute><AdminAnswerKeys /></AdminRoute>} />
        <Route path="/admin/syllabus" element={<AdminRoute><AdminSyllabus /></AdminRoute>} />
        <Route path="/admin/pages" element={<AdminRoute><AdminPages /></AdminRoute>} />
        <Route path="*" element={<JobsProvider><MainLayout /></JobsProvider>} />
      </Routes>
    </Router>
  )
}

export default App