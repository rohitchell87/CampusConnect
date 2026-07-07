import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartHandshake, Sparkles, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import matchesService from '../../services/matchesService'
import MatchCard from '../../components/ui/MatchCard'
import SkeletonCard from '../../components/common/SkeletonCard'
import { subscribeToModerationChanges, isBlockedUser } from '../../components/moderation/ModerationService'
import toast from 'react-hot-toast'

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { loadMatches() }, [])

  useEffect(() => {
    const unsubscribe = subscribeToModerationChanges(() => {
      setMatches((prev) => prev.filter((match) => !isBlockedUser(match.userId || match.id)))
    })
    return unsubscribe
  }, [])

  const loadMatches = async () => {
    setLoading(true)
    setHasLoaded(false)
    try {
      const data = await matchesService.getMatches()
      setMatches(data)
    } catch (err) {
      toast.error('Unable to load matches')
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  const hasRecentMatches = matches.some((match) => match.isNew || match.unread || match.new || (match.matchedAt && Date.now() - new Date(match.matchedAt).getTime() < 1000 * 60 * 60 * 24 * 3))

  if (!hasLoaded) {
    return (
      <div className="animate-fade-in">
        <div className="mx-auto w-[min(92vw,1500px)] max-w-[1500px] space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[#0B0F1F]/80 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-3xl sm:p-8">
            <div className="h-8 w-40 animate-pulse rounded-full bg-[#111827]/80" />
            <div className="mt-4 h-10 w-72 animate-pulse rounded-full bg-[#111827]/80" />
            <div className="mt-3 h-4 w-96 animate-pulse rounded-full bg-[#111827]/80" />
          </div>
          <div className="grid gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-[32px] border border-white/10 bg-[#0B0F1F]/80 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-3xl">
                <div className="h-24 animate-pulse rounded-[24px] bg-[#111827]/80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mx-auto w-[min(92vw,1500px)] max-w-[1500px] space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-[#0B0F1F]/80 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-3xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/20 bg-[#111827]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A78BFA]">
                <Sparkles className="h-3.5 w-3.5" />
                Your Matches
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">People who liked you back.</h1>
              <p className="mt-2 text-sm leading-7 text-[#A9ABC1]">Keep the conversation going with the students who matched with you.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/10 bg-[#111827]/80 px-4 py-2 text-sm font-semibold text-[#D8D4FF]">
                {matches.length} total
              </div>
              {hasRecentMatches && (
                <div className="rounded-full border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-4 py-2 text-sm font-semibold text-[#EDE8FF]">
                  Recent Matches
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-white/10 bg-[#0B0F1F]/80 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-3xl sm:p-10"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFF]/15 to-[#A78BFA]/10 text-[#A78BFA] shadow-lg">
              <HeartHandshake className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-white">No matches yet</h2>
            <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-[#A9ABC1]">Keep discovering students to make your first connection.</p>
            <button type="button" onClick={() => navigate('/discover')} className="btn-primary mt-8 px-6 py-3 text-sm">
              Go to Discover
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {matches.map((match) => <MatchCard key={match.matchId || match.userId} match={match} />)}
          </div>
        )}
      </div>
    </div>
  )
}
