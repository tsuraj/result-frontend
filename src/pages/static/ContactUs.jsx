// Meta title: Contact Us | RojgarResult
import { useState } from 'react'
import { FaEnvelope, FaBriefcase, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPaperPlane } from 'react-icons/fa'
import StaticPage from '../../components/StaticPage'

const API = `${import.meta.env.VITE_API_URL}/api/v1`

const inquiryOptions = ['General', 'Content Correction', 'Business / Partnership', 'Other']

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', inquiry_type: 'General', message: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending', message: '' })
    try {
      const res = await fetch(`${API}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: form })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data.errors || []).join(', ') || 'Failed to send message')
      }
      setStatus({ state: 'success', message: 'Thanks! We\'ll get back to you soon.' })
      setForm({ name: '', email: '', subject: '', inquiry_type: 'General', message: '' })
    } catch (err) {
      setStatus({ state: 'error', message: err.message })
    }
  }

  return (
    <StaticPage
      slug="contact"
      fallbackTitle="Contact Us"
      fallbackDescription="Reach RojgarResult — questions, corrections, and business inquiries."
    >
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <FaEnvelope className="text-red-600" />
            <h3 className="font-semibold text-gray-900">Email</h3>
          </div>
          <p className="text-sm text-gray-600">For questions and content corrections:</p>
          <a href="mailto:contact@rojgarresult.example" className="text-sm font-medium text-red-600 hover:text-red-700">contact@rojgarresult.example</a>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <FaBriefcase className="text-red-600" />
            <h3 className="font-semibold text-gray-900">Business Inquiries</h3>
          </div>
          <p className="text-sm text-gray-600">Partnerships, advertising, collaborations:</p>
          <a href="mailto:business@rojgarresult.example" className="text-sm font-medium text-red-600 hover:text-red-700">business@rojgarresult.example</a>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Follow us</h3>
        <div className="flex items-center gap-3">
          <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700" aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <h3 className="font-semibold text-gray-900 mb-1">Send us a message</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-medium text-gray-700 mb-1">Name</span>
            <input type="text" required value={form.name} onChange={handleChange('name')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-gray-700 mb-1">Email</span>
            <input type="email" required value={form.email} onChange={handleChange('email')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-500 focus:outline-none" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-medium text-gray-700 mb-1">Subject</span>
            <input type="text" value={form.subject} onChange={handleChange('subject')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-gray-700 mb-1">Inquiry type</span>
            <select value={form.inquiry_type} onChange={handleChange('inquiry_type')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-500 focus:outline-none bg-white">
              {inquiryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="block text-xs font-medium text-gray-700 mb-1">Message</span>
          <textarea rows={5} required value={form.message} onChange={handleChange('message')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-red-500 focus:outline-none" />
        </label>

        {status.state === 'success' && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{status.message}</p>}
        {status.state === 'error' && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{status.message}</p>}

        <button
          type="submit"
          disabled={status.state === 'sending'}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-md"
        >
          {status.state === 'sending' ? 'Sending…' : (<>Send Message <FaPaperPlane size={11} /></>)}
        </button>
      </form>
    </StaticPage>
  )
}

export default ContactUs
