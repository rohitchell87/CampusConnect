import React from 'react'

export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-2xl border p-4 shadow-sm ${className}`} style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--card-bg)' }}>
      <div className="h-48 rounded-xl" style={{ backgroundColor: 'var(--surface-bg)' }}></div>
      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--surface-bg)' }}></div>
        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: 'var(--surface-bg)' }}></div>
        <div className="h-16 rounded" style={{ backgroundColor: 'var(--surface-bg)' }}></div>
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-10 flex-1 rounded" style={{ backgroundColor: 'var(--surface-bg)' }} />
        <div className="h-10 flex-1 rounded" style={{ backgroundColor: 'var(--surface-bg)' }} />
      </div>
    </div>
  )
}
