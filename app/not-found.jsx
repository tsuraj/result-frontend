import Link from 'next/link'
import FollowCTA from '../components/FollowCTA'
import { pageMetadata } from '../lib/seo'

export const metadata = pageMetadata({
  title: 'Page not found',
  description: 'The page you’re looking for doesn’t exist.',
  path: '/404',
  noindex: true,
})

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-3">404 · Not Found</p>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-600 max-w-md mx-auto">
        The page you’re looking for might have been moved or no longer exists.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          Go home
        </Link>
        <Link href="/latest-jobs" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
          Browse jobs
        </Link>
      </div>

      <div className="max-w-3xl mx-auto mt-12 text-left">
        <FollowCTA />
      </div>
    </div>
  )
}
