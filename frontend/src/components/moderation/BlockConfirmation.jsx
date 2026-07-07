import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShieldBan } from 'lucide-react'
import toast from 'react-hot-toast'
import { blockUser } from './ModerationService'

export default function BlockConfirmation({ open, onClose, profile, onBlocked }) {
  if (!profile) return null

  const handleBlock = async () => {
    try {
      await blockUser({
        id: profile.id || profile.userId,
        fullName: profile.fullName,
        profilePhoto: profile.profilePhoto,
        college: profile.college,
      })
      toast.success(`Blocked ${profile.fullName}`)
      onBlocked?.()
      onClose()
    } catch (error) {
      toast.error('Unable to block user right now')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#02040b]/70 px-4 py-6 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#0B0F1F]/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#A78BFA]">
                  <ShieldBan className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">Block User</p>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">Block {profile.fullName || 'this user'}?</h2>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-[#D8D4FF] transition hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-[20px] border border-white/10 bg-[#101529]/80 p-4 text-sm leading-7 text-[#A9ABC1]">
              <p>Blocked users:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>cannot message you</li>
                <li>disappear from Discover</li>
                <li>disappear from Matches</li>
                <li>cannot view your profile</li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-[#D8D4FF]">Cancel</button>
              <button type="button" onClick={handleBlock} className="rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(124,92,255,0.25)]">
                Block User
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
