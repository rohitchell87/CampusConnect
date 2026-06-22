import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled error in UI:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
          <h2 className="text-2xl font-semibold mb-2">Something went wrong.</h2>
          <p className="text-sm text-red-700 dark:text-red-200">Please refresh the page or try again later.</p>
        </div>
      )
    }

    return this.props.children
  }
}
