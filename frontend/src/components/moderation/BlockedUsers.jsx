import React, { useEffect, useState } from 'react'
import { UserRoundMinus, UserRoundCheck } from 'lucide-react'
import { getBlockedUsers, unblockUser } from './ModerationService'
import toast from 'react-hot-toast'

export default function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleUnblock = async (userId) => {
    try {
      await unblockUser(userId)
      setBlockedUsers((prev) => prev.filter((user) => user.id !== userId))
      toast.success('User unblocked')
    } catch (error) {
      toast.error('Unable to unblock user')
    }
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#141414] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 text-lg font-semibold text-white">
        <UserRoundMinus className="h-5 w-5 text-[#A78BFA]" />
        <span>Blocked Users</span>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="rounded-[18px] border border-white/10 bg-[#101529] px-4 py-4 text-sm text-[#A9ABC1]">Loading blocked users…</div>
        ) : blockedUsers.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-white/10 bg-[#101529] px-4 py-4 text-sm text-[#A9ABC1]">No blocked users yet.</div>
        ) : (
          blockedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-[#101529] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#1B1F35] text-sm font-semibold text-[#EDE8FF]">
                  {user.profilePhoto ? <img src={user.profilePhoto} alt={user.fullName} className="h-full w-full object-cover" /> : user.fullName?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.fullName}</p>
                  <p className="text-xs text-[#A9ABC1]">{user.college || 'CampusConnect user'}</p>
                </div>
              </div>
              <button type="button" onClick={() => handleUnblock(user.id)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-[#D8D4FF] transition hover:bg-white/10">
                <UserRoundCheck className="h-4 w-4" />
                Unblock
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
