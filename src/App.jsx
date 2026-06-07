import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import NotificationBar from './components/layout/NotificationBar'
import SearchBar from './components/ui/SearchBar'
import { JobsProvider } from './context/JobsContext'
import AdminRoute from './components/AdminRoute'
import Analytics from './components/Analytics'
import NotFound from './pages/NotFound'

// Route pages are code-split so each is only downloaded when visited. In
// particular the admin panel no longer ships in the public bundle.
const Home = lazy(() => import('./pages/Home'))
const LatestJobs = lazy(() => import('./pages/LatestJobs'))
const Results = lazy(() => import('./pages/Results'))
const ResultDetails = lazy(() => import('./pages/ResultDetails'))
const AdmitCards = lazy(() => import('./pages/AdmitCards'))
const AdmitCardDetails = lazy(() => import('./pages/AdmitCardDetails'))
const AnswerKeys = lazy(() => import('./pages/AnswerKeys'))
const AnswerKeyDetails = lazy(() => import('./pages/AnswerKeyDetails'))
const Syllabus = lazy(() => import('./pages/Syllabus'))
const SyllabusDetails = lazy(() => import('./pages/SyllabusDetails'))
const JobDetails = lazy(() => import('./pages/JobDetails'))
const AboutUs = lazy(() => import('./pages/static/AboutUs'))
const PrivacyPolicy = lazy(() => import('./pages/static/PrivacyPolicy'))
const Disclaimer = lazy(() => import('./pages/static/Disclaimer'))
const Terms = lazy(() => import('./pages/static/Terms'))
const ContactUs = lazy(() => import('./pages/static/ContactUs'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const AdminJobs = lazy(() => import('./pages/AdminJobs'))
const AdminResult = lazy(() => import('./pages/AdminResult'))
const AdminPages = lazy(() => import('./pages/AdminPages'))
const AdminAdmitCards = lazy(() => import('./pages/AdminAdmitCards'))
const AdminAnswerKeys = lazy(() => import('./pages/AdminAnswerKeys'))
const AdminSyllabus = lazy(() => import('./pages/AdminSyllabus'))

const PageLoader = () => (
  <p className="text-gray-500 text-sm py-10 text-center">Loading…</p>
)

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
          <Suspense fallback={<PageLoader />}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {!isHome && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Analytics />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </Router>
  )
}

export default App
