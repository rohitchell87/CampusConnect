import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import likeService from '../../services/likeService'
import toast from 'react-hot-toast'
import { MessageSquare } from 'lucide-react'
import CompatibilityBreakdown from '../compatibility/CompatibilityBreakdown'
import { AuthContext } from '../../context/AuthContext'

export default function LikeCard({ user }){
  const navigate = useNavigate()
  const { user: currentUser } = useContext(AuthContext)
  const [showCompatibility, setShowCompatibility] = useState(false)

  const openProfile = (e) => {
    e.stopPropagation()
    navigate(`/profile/${user.userId}`)
  }

  const likeBack = async (e) => {
    e.stopPropagation()
    try{
      await likeService.likeUser(user.userId)
      toast.success('Liked back')
    }catch(err){
      toast.error('Unable to like back')
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={()=>navigate(`/chat?matchId=${user.matchId || ''}&userId=${user.userId}`)}
      className="group flex flex-col justify-between overflow-hidden rounded-[24px] border p-5 shadow-[0_12px_40px_rgba(124,92,255,0.08)] transition-transform hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(124,92,255,0.14)]"
      style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--card-bg)' }}
    >
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="h-28 w-28 overflow-hidden rounded-xl border-2 transition-transform group-hover:scale-105" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-bg)' }}>
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-semibold" style={{ color: 'var(--accent)' }}>{user.fullName?.[0] || 'U'}</div>
            )}
          </div>
          <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border ${user.online ? 'bg-emerald-400' : 'bg-[#64748B]'}`} style={{ borderColor: 'var(--surface-bg)' }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="truncate text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{user.fullName}{user.age ? `, ${user.age}` : ''}</h3>
            {user.compatibilityScore != null && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCompatibility((prev) => !prev)
                }}
                className="ml-auto rounded-full px-2 py-1 text-xs font-semibold transition"
                style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}
              >
                {user.compatibilityScore}%
              </button>
            )}
          </div>
          <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{user.college || user.branch}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(user.mutualInterests || []).slice(0,3).map((i) => (
              <span key={i} className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>{i}</span>
            ))}
          </div>
        </div>
      </div>

      {showCompatibility && user.compatibilityScore != null && (
        <div className="mt-4">
          <CompatibilityBreakdown currentUser={currentUser} otherUser={user} score={user.compatibilityScore} defaultOpen />
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={openProfile}
          className="btn-secondary px-4 py-3 text-sm"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={likeBack}
          className="btn-primary flex items-center gap-2 px-4 py-3 text-sm"
        >
          <MessageSquare className="h-4 w-4" /> Like Back
        </button>
      </div>
    </div>
  )
}
