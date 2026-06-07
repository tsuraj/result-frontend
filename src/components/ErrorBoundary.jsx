import { Component } from 'react'
import { trackEvent } from '../lib/analytics'

// Catches render-time errors anywhere below it so a single failure shows a
// friendly fallback instead of a blank white screen. Must be a class component
// (React error boundaries have no hooks equivalent).
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Surface it in the console for debugging...
    console.error('App crashed:', error, info)
    // ...and report to GA4 (no-op if analytics isn't configured).
    trackEvent('exception', {
      description: String(error?.message || error),
      fatal: true,
    })
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-5xl font-extrabold text-red-600">Oops!</p>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-600">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-red-700"
            >
              Reload page
            </button>
            <a
              href="/"
              className="border border-gray-300 text-gray-800 text-sm font-medium px-5 py-2.5 rounded-md hover:bg-gray-50"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    )
  }
}
