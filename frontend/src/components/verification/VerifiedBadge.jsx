import React from 'react'
import { BadgeCheck, Clock3, CircleAlert } from 'lucide-react'
import { getVerificationStatus } from './VerificationService'

export default function VerifiedBadge({ user, className = '' }) {
  const status = user?.verificationStatus || (user?.verified ? 'Verified Student' : getVerificationStatus(user))

  if (status === 'Verified Student') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#60A5FA]/25 bg-[#2563EB]/15 px-2.5 py-1 text-[11px] font-semibold text-[#DBEAFE] ${className}`}>
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified Student
      </span>
    )
  }

  if (status === 'Verification Pending') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200 ${className}`}>
        <Clock3 className="h-3.5 w-3.5" />
        Verification Pending
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[#C7D2FE] ${className}`}>
      <CircleAlert className="h-3.5 w-3.5" />
      Not Verified
    </span>
  )
}
