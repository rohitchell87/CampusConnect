import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm uppercase tracking-[0.3em] text-primary-600">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/discover" className="mt-6 inline-flex rounded-lg bg-primary-500 px-5 py-3 text-white transition hover:bg-primary-600">
        Back to Discover
      </Link>
    </div>
  )
}
