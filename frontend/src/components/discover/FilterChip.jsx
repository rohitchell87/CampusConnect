import React from 'react'

export default function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition"
      style={{ borderColor: 'var(--accent)', backgroundColor: 'rgba(124,92,255,0.16)', color: 'var(--text-primary)' }}
    >
      <span>{label}</span>
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>×</span>
    </button>
  )
}
