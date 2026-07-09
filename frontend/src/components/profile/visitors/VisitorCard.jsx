import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { formatRelativeTime } from './VisitorService'

export default function VisitorCard({ visitor }) {
  const navigate = useNavigate()

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/profile/${visitor.profileId || ''}`)}
      className="flex w-full items-center gap-3 rounded-[18px] border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] px-3 py-3 text-left transition hover:border-[color:var(--accent-secondary)]/35 hover:bg-[color:var(--surface-elevated)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)] text-sm font-semibold text-[color:var(--text-secondary)]">
        {visitor.profilePhoto ? (
          <img src={visitor.profilePhoto} alt={visitor.fullName} className="h-full w-full object-cover" />
        ) : (
          visitor.fullName?.slice(0, 1)?.toUpperCase() || 'U'
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-[color:var(--text-primary)]">{visitor.fullName}</p>
          <Eye className="h-3.5 w-3.5 flex-shrink-0 text-[color:var(--accent-secondary)]" />
        </div>
        <p className="mt-1 truncate text-sm text-[color:var(--text-secondary)]">{visitor.college || 'College unknown'}</p>
        <p className="mt-1 text-xs text-[color:var(--text-muted)]">Viewed your profile • {formatRelativeTime(visitor.viewedAt)}</p>
      </div>
    </motion.button>
  )
}
