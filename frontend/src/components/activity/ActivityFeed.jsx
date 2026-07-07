import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ActivityItem from './ActivityItem'
import { getActivities } from './ActivityService'

export default function ActivityFeed({ title = 'Activity Feed', emptyState = 'No recent activity yet.', limit }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadActivities = async () => {
      setLoading(true)
      try {
        const data = await getActivities()
        if (mounted) setActivities(limit ? data.slice(0, limit) : data)
      } catch (error) {
        if (mounted) setActivities([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadActivities()
    return () => {
      mounted = false
    }
  }, [limit])

  if (loading) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-[#0F1425]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="mt-4 space-y-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-[18px] bg-[#111827]/80" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0F1425]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">Your latest CampusConnect activity</p>
        </div>
        <div className="rounded-full border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-3 py-1 text-sm font-medium text-[#D8D4FF]">
          {activities.filter((activity) => activity.unread).length} new
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-dashed border-white/10 bg-[#111827]/70 p-8 text-center text-sm text-[#94A3B8]">
          {emptyState}
        </div>
      ) : (
        <motion.div layout className="mt-5 space-y-3">
          {activities.map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
