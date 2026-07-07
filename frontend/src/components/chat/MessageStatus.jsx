import React from 'react'
import { CheckCheck, Check } from 'lucide-react'

export default function MessageStatus({ status = 'sent', isIncoming = false }) {
  if (isIncoming) return null

  const iconClass = status === 'seen' ? 'text-[#A78BFA]' : 'text-[#D8D4FF]'

  return (
    <div className="ml-2 inline-flex items-center gap-1 text-[11px] text-[#D8D4FF]">
      {status === 'sent' && <Check className="h-3.5 w-3.5" />}
      {status === 'delivered' && <CheckCheck className="h-3.5 w-3.5" />}
      {status === 'seen' && <CheckCheck className="h-3.5 w-3.5 text-[#A78BFA]" />}
      <span className={iconClass}>
        {status === 'sent' && 'Sent'}
        {status === 'delivered' && 'Delivered'}
        {status === 'seen' && 'Seen'}
      </span>
    </div>
  )
}
