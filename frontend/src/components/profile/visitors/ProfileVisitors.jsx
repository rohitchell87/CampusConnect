import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Sparkles } from 'lucide-react'
import VisitorCard from './VisitorCard'
import { getProfileVisitors } from './VisitorService'

export default function ProfileVisitors({ limit = 5 }) {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadVisitors = async () => {
      setLoading(true)
      try {
        const data = await getProfileVisitors()
        if (mounted) setVisitors(data.slice(0, limit))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadVisitors()
    return () => {
      mounted = false
    }
  }, [limit])

  if (loading) {
    return (
      <section className="rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
        <div className="flex items-center gap-3 text-2xl font-semibold text-[color:var(--text-primary)]">
          <Eye className="h-5 w-5 text-[color:var(--accent-secondary)]" />
          <span>Profile Visitors</span>
        </div>
        <div className="mt-6 space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-[18px] bg-[color:var(--surface-bg)]" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-2xl font-semibold text-[color:var(--text-primary)]">
          <Eye className="h-5 w-5 text-[color:var(--accent-secondary)]" />
          <span>Profile Visitors</span>
        </div>
        {visitors.length > 5 && (
          <button type="button" className="rounded-full border border-[color:var(--accent-secondary)]/25 bg-[color:var(--accent-secondary)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-secondary)]/20">
            View All Visitors
          </button>
        )}
      </div>

      {visitors.length === 0 ? (
        <div className="mt-8 rounded-[24px] border border-dashed border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] px-6 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--accent-secondary)]/20 bg-[color:var(--accent-secondary)]/10 text-[color:var(--accent-secondary)]">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[color:var(--text-primary)]">No profile visitors yet</h3>
          <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">As you become more active, you&apos;ll see who has viewed your profile here.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visitors.map((visitor) => (
            <VisitorCard key={visitor.id} visitor={visitor} />
          ))}
        </div>
      )}
    </motion.section>
  )
}
