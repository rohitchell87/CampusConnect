import React from 'react'

export default function NotificationSkeleton(){
  return (
    <div className="animate-pulse flex items-start gap-4 rounded-[24px] border-l-4 p-4 bg-[rgba(11,13,23,0.6)] border-white/6">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-slate-700" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-4 w-1/3 rounded bg-slate-700" />
        <div className="h-3 w-2/3 rounded bg-slate-700" />
        <div className="h-8 w-24 rounded bg-slate-700" />
      </div>
    </div>
  )
}
