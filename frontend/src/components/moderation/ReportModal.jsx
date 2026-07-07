import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportReasons, submitReport } from './ModerationService'

export default function ReportModal({ open, onClose, profile }) {
  const [reason, setReason] = useState('Fake Profile')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isOther = useMemo(() => reason === 'Other', [reason])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!profile) return
    setSubmitting(true)
    try {
      await submitReport({
        targetUserId: profile.id || profile.userId,
        targetName: profile.fullName,
        reason,
        details: isOther ? details : '',
      })
      toast.success('Report submitted. Thanks for helping keep CampusConnect safe.')
      onClose()
    } catch (error) {
      toast.error('Unable to submit report right now')
    } finally {
      setSubmitting(false)
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
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-[24px] border border-white/10 bg-[#0B0F1F]/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#A78BFA]">
                  <ShieldAlert className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">Report User</p>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">Report User</h2>
                <p className="mt-2 text-sm text-[#A9ABC1]">Help us keep CampusConnect safe.</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-[#D8D4FF] transition hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                {reportReasons.map((item) => (
                  <label key={item} className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-[#101529]/80 px-3 py-3 text-sm text-[#E5E7EB]">
                    <input
                      type="radio"
                      name="report-reason"
                      checked={reason === item}
                      onChange={() => setReason(item)}
                      className="h-4 w-4 border-white/20 bg-transparent text-[#A78BFA] focus:ring-[#A78BFA]"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {isOther && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Tell us more</label>
                  <textarea
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    rows={4}
                    placeholder="Add a few details..."
                    className="w-full rounded-[16px] border border-white/10 bg-[#101529] px-3 py-3 text-sm text-white outline-none ring-0"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-[#D8D4FF]">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(124,92,255,0.25)] disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
