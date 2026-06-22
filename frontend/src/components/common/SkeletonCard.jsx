import React from 'react'

export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      <div className="h-48 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-16 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-10 flex-1 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 flex-1 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  )
}
