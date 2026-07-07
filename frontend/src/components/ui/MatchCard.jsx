import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Clock3, Sparkles } from 'lucide-react'
import CompatibilityBreakdown from '../compatibility/CompatibilityBreakdown'
import { AuthContext } from '../../context/AuthContext'

const formatRelativeTime = (value) => {
  if (!value) return 'recently'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'recently'
  const diffDays = Math.max(1, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)))
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export default function MatchCard({ match }) {
  const navigate = useNavigate()
  const { user: currentUser } = useContext(AuthContext)
  const [showCompatibility, setShowCompatibility] = useState(false)

  const openChat = () => navigate(`/chat?matchId=${match.matchId || ''}&userId=${match.userId}`)
  const viewProfile = (e) => {
    e.stopPropagation()
    navigate(`/profile/${match.userId}`)
  }

  const previewText = match.lastMessage || match.latestMessage || match.messagePreview || match.bio || 'Say hello and start the conversation.'
  const interests = (match.mutualInterests || match.commonInterests || []).slice(0, 3)
  const matchedLabel = match.matchedAt ? `Matched ${formatRelativeTime(match.matchedAt)}` : 'Recently matched'
  const onlineLabel = match.online ? 'Online now' : match.lastSeen ? `Last seen ${formatRelativeTime(match.lastSeen)}` : 'Recently active'

  return (
    <motion.div
      role="button"
      tabIndex={0}
      whileHover={{ y: -4, scale: 1.01, boxShadow: '0 25px 70px rgba(124, 92, 255, 0.12)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={openChat}
      onKeyDown={(e) => (e.key === 'Enter' ? openChat() : null)}
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(17,24,39,0.95),rgba(11,15,28,0.95))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-3xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/8 via-transparent to-[#A78BFA]/5" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-[#7C5CFF]/30 bg-[#111827] transition-transform duration-200 group-hover:scale-105 sm:h-24 sm:w-24">
              {match.profilePhoto ? (
                <img src={match.profilePhoto} alt={match.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-[#A78BFA]">{match.fullName?.[0] || 'U'}</div>
              )}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-[#0B0F1F] ${match.online ? 'bg-emerald-400' : 'bg-[#64748B]'}`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-semibold text-white">{match.fullName}{match.age ? `, ${match.age}` : ''}</h3>
              {match.compatibilityScore != null && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowCompatibility((prev) => !prev)
                  }}
                  className="rounded-full border border-[#7C5CFF]/20 bg-[#111827]/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D8D4FF] transition hover:bg-[#1c2140]"
                >
                  {match.compatibilityScore}%
                </button>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#A9ABC1]">
              <span>{match.college || 'College'}</span>
              {match.branch ? <><span>•</span><span>{match.branch}</span></> : null}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#D8D4FF]">
              <span className={`h-2.5 w-2.5 rounded-full ${match.online ? 'bg-emerald-400' : 'bg-[#64748B]'}`} />
              <span>{onlineLabel}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {interests.length > 0 ? interests.map((interest) => (
                <span key={interest} className="rounded-full border border-white/10 bg-[#111827]/80 px-3 py-1 text-xs font-medium text-[#D8D4FF]">
                  {interest}
                </span>
              )) : (
                <span className="rounded-full border border-dashed border-white/10 bg-[#111827]/60 px-3 py-1 text-xs text-[#A9ABC1]">
                  Shared interests coming soon
                </span>
              )}
            </div>

            <div className="mt-4 rounded-[18px] border border-white/10 bg-[#111827]/70 p-3">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#A78BFA]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Latest message</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#D8D4FF]">{previewText}</p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#94A3B8]">
              <Clock3 className="h-4 w-4 text-[#A78BFA]" />
              <span>{matchedLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:min-w-[200px]">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openChat() }}
            className="btn-primary flex items-center justify-center gap-2 px-4 py-3 text-sm"
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </button>
          <button
            type="button"
            onClick={viewProfile}
            className="btn-secondary px-4 py-3 text-sm"
          >
            View Profile
          </button>
        </div>
      </div>

      {showCompatibility && match.compatibilityScore != null && (
        <div className="mt-4 rounded-[20px] border border-white/10 bg-[#0B0F1F]/70 p-4">
          <CompatibilityBreakdown currentUser={currentUser} otherUser={match} score={match.compatibilityScore} defaultOpen />
        </div>
      )}
    </motion.div>
  )
}
