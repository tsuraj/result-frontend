'use client'
import ReactMarkdown from 'react-markdown'

export default function Markdown({ children }) {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none prose-headings:scroll-mt-20 prose-h2:text-lg prose-h2:sm:text-xl prose-h2:font-semibold prose-h2:text-gray-900 prose-h2:mt-6 prose-h2:mb-3 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-red-600 hover:prose-a:text-red-700 prose-strong:text-gray-900">
      <ReactMarkdown>{children || ''}</ReactMarkdown>
    </div>
  )
}
