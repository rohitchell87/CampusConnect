import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Heart,
  Sparkles,
  MessageCircleMore,
  Eye,
  GraduationCap,
  CircleAlert
} from 'lucide-react'
import { formatRelativeTime } from './ActivityService'

const iconMap = {
  LIKE: Heart,
  MATCH: Sparkles,
  MESSAGE: MessageCircleMore,
  VIEW: Eye,
  COLLEGE: GraduationCap,
  REMINDER: CircleAlert
}

export default function ActivityItem({ activity, index }) {
  const navigate = useNavigate()
  const Icon = iconMap[activity.type] || Sparkles

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.05 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={() => activity.route && navigate(activity.route)}
      className={`flex w-full items-start gap-3 rounded-[20px] border px-4 py-4 text-left transition ${
        activity.unread
          ? 'border-[#7C5CFF]/35 bg-[#111827]/95 shadow-[0_0_0_1px_rgba(124,92,255,0.12),0_16px_38px_rgba(124,92,255,0.08)]'
          : 'border-white/10 bg-[#0F1425]/80 text-[#94A3B8]'
      }`}
    >
      <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${activity.unread ? 'bg-[#7C5CFF]/15 text-[#A78BFA]' : 'bg-white/5 text-[#CBD5E1]'}`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-semibold ${activity.unread ? 'text-white' : 'text-[#E2E8F0]'}`}>
                {activity.title}
              </h3>
              {activity.unread && <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.7)]" />}
            </div>
            <p className={`mt-1 text-sm leading-6 ${activity.unread ? 'text-[#D8D4FF]' : 'text-[#94A3B8]'}`}>
              {activity.description}
            </p>
          </div>
          <span className={`whitespace-nowrap text-xs ${activity.unread ? 'text-[#B9BBCC]' : 'text-[#64748B]'}`}>
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>
      </div>
    </motion.button>
  )
}
