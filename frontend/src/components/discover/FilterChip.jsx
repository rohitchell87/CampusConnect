import React from 'react'

export default function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-3 py-1.5 text-sm font-medium text-[#EDE8FF] transition hover:bg-[#7C5CFF]/20"
    >
      <span>{label}</span>
      <span className="text-xs text-[#D8D4FF]">×</span>
    </button>
  )
}
