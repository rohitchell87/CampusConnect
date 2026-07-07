import React, { useEffect, useState } from 'react'
import { ArrowLeft, UserRoundMinus, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getBlockedUsers, unblockUser } from './ModerationService'
import toast from 'react-hot-toast'

export default function BlockedUsersPage() {
  const navigate = useNavigate()
  const [blockedUsers, setBlockedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingUnblock, setPendingUnblock] = useState(null)

  useEffect(() => {
    loadBlockedUsers()
  }, [])

  const loadBlockedUsers = async () => {
    setLoading(true)
    try {
      const data = await getBlockedUsers()
      setBlockedUsers(data)
    } catch (error) {
      toast.error('Unable to load blocked users')
    } finally {
      setLoading(false)
    }
  }

  const confirmUnblock = async (user) => {
    if (!user) return
    try {
      await unblockUser(user.id)
      setBlockedUsers((prev) => prev.filter((item) => String(item.id) !== String(user.id)))
      toast.success(`Unblocked ${user.fullName}`)
      setPendingUnblock(null)
    } catch (error) {
      toast.error('Unable to unblock user')
    }
  }

  return (
    <div className="min-h-screen bg-[#090B14] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-[min(90vw,1200px)] max-w-[1200px]">
        <button type="button" onClick={() => navigate('/settings')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D8D4FF]">
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </button>

        <div className="rounded-[28px] border border-white/10 bg-[#0B0F1F]/85 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#A78BFA]">Moderation</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Blocked Users</h1>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-[20px] border border-white/10 bg-[#101529] px-4 py-5 text-sm text-[#A9ABC1]">Loading blocked users…</div>
            ) : blockedUsers.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-white/10 bg-[#101529] px-4 py-8 text-center text-sm text-[#A9ABC1]">No blocked users yet.</div>
            ) : (
              blockedUsers.map((user) => (
                <div key={user.id} className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-[#101529]/90 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#1B1F35] text-lg font-semibold text-[#EDE8FF]">
                      {user.profilePhoto ? <img src={user.profilePhoto} alt={user.fullName} className="h-full w-full object-cover" /> : user.fullName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{user.fullName}</p>
                      <p className="mt-1 text-sm text-[#A9ABC1]">{user.college || 'CampusConnect user'}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#8B8B9F]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>Blocked {user.blockedAt ? new Date(user.blockedAt).toLocaleDateString() : 'recently'}</span>
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={() => setPendingUnblock(user)} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#D8D4FF] transition hover:bg-white/10">
                    <UserRoundMinus className="h-4 w-4" />
                    Unblock
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {pendingUnblock && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#02040b]/70 px-4 py-6 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#0B0F1F]/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
            <h2 className="text-xl font-semibold text-white">Unblock {pendingUnblock.fullName}?</h2>
            <p className="mt-3 text-sm leading-7 text-[#A9ABC1]">This will remove them from your blocked list and allow them to interact with you again.</p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setPendingUnblock(null)} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-[#D8D4FF]">Cancel</button>
              <button type="button" onClick={() => confirmUnblock(pendingUnblock)} className="rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] px-4 py-2 text-sm font-semibold text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
