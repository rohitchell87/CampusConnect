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
      <section className="rounded-[28px] border border-white/10 bg-[#0B0F1F]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
        <div className="flex items-center gap-3 text-2xl font-semibold text-white">
          <Eye className="h-5 w-5 text-[#A78BFA]" />
          <span>Profile Visitors</span>
        </div>
        <div className="mt-6 space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-[18px] bg-[#111827]/80" />
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
      className="rounded-[28px] border border-white/10 bg-[#0B0F1F]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-2xl font-semibold text-white">
          <Eye className="h-5 w-5 text-[#A78BFA]" />
          <span>Profile Visitors</span>
        </div>
        {visitors.length > 5 && (
          <button type="button" className="rounded-full border border-[#7C5CFF]/25 bg-[#7C5CFF]/10 px-4 py-2 text-sm font-semibold text-[#EDE8FF] transition hover:bg-[#7C5CFF]/20">
            View All Visitors
          </button>
        )}
      </div>

      {visitors.length === 0 ? (
        <div className="mt-8 rounded-[24px] border border-dashed border-white/10 bg-[#101529] px-6 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 text-[#A78BFA]">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">No profile visitors yet</h3>
          <p className="mt-2 text-sm leading-7 text-[#A9ABC1]">As you become more active, you&apos;ll see who has viewed your profile here.</p>
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
