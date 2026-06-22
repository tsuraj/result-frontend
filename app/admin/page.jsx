'use client'
import Link from 'next/link'

const tiles = [
  { name: 'Jobs', path: '/admin/jobs', desc: 'Create, edit, delete job postings.' },
  { name: 'Results', path: '/admin/results', desc: 'Manage exam result entries.' },
  { name: 'Admit Cards', path: '/admin/admit-cards', desc: 'Manage admit card entries.' },
  { name: 'Answer Keys', path: '/admin/answer-keys', desc: 'Manage answer key entries.' },
  { name: 'Syllabus', path: '/admin/syllabus', desc: 'Manage syllabus entries.' },
  { name: 'Updates', path: '/admin/updates', desc: 'Manage notification / update items.' },
  { name: 'Pages', path: '/admin/pages', desc: 'Edit static pages (about, privacy, terms, etc.).' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <Link
            key={t.path}
            href={t.path}
            className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-red-300 hover:shadow-sm"
          >
            <div className="font-semibold text-gray-900">{t.name}</div>
            <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
