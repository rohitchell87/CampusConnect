import React from 'react'
import { Heart, MessageSquare, Eye, Zap } from 'lucide-react'

function iconFor(type){
  switch(type){
    case 'like': return <Heart className="h-5 w-5 text-pink-400" />
    case 'match': return <Zap className="h-5 w-5 text-amber-400" />
    case 'message': return <MessageSquare className="h-5 w-5 text-cyan-300" />
    case 'view': return <Eye className="h-5 w-5 text-slate-400" />
    default: return <Zap className="h-5 w-5 text-purple-300" />
  }
}

export default function NotificationItem({ notification }){
  const timeAgo = (()=>{
    const diff = Math.floor((Date.now() - new Date(notification.timestamp).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
    return `${Math.floor(diff/86400)}d ago`
  })()

  return (
    <div className={`flex items-start gap-3 rounded-[16px] p-3 transition-all cursor-pointer ${notification.unread ? 'bg-[rgba(124,92,255,0.04)] ring-1 ring-purple-600/6 border-l-4 border-l-purple-400/60' : 'bg-[rgba(255,255,255,0.01)]'}`}>
      <div className="flex-shrink-0">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-[#0B0D17] border border-[#1B1F35] flex items-center justify-center">
          {notification.actor?.profilePhoto ? (
            <img src={notification.actor.profilePhoto} alt={notification.actor.fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="text-[#7C5CFF] font-semibold">{notification.actor?.fullName?.[0] || 'U'}</div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-white flex items-center gap-2">{iconFor(notification.type)}<span>{notification.title}</span></div>
          <div className="ml-auto text-xs text-[#94A3B8]">{timeAgo}</div>
        </div>
        <div className="mt-1 text-sm text-[#B9BBCC]">{notification.description}</div>
        {notification.actionLabel && (
          <div className="mt-3">
            <button className="btn-primary px-3 py-2 text-sm">{notification.actionLabel}</button>
          </div>
        )}
      </div>

      {notification.unread && <div className="self-start mt-2 h-2 w-2 rounded-full bg-purple-400" />}
    </div>
  )
}
