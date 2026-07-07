import React from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function NotificationCard({ notification, onRead }){
  const navigate = useNavigate()

  const openAction = (e) => {
    e.stopPropagation()
    if (onRead && notification.unread) {
      onRead(notification.id)
    }
    if(notification.action === 'profile') navigate(`/profile/${notification.userId}`)
    if(notification.action === 'chat') navigate(`/chat?userId=${notification.userId}`)
  }

  return (
    <div
      className={`flex items-start gap-4 rounded-[24px] border-l-4 p-4 bg-[rgba(11,13,23,0.6)] border-white/6 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(124,92,255,0.08)] cursor-pointer ${notification.unread ? 'border-l-purple-400/60 ring-1 ring-purple-600/10' : 'opacity-80'}`}
      onClick={(e) => {
        if (onRead && notification.unread) {
          onRead(notification.id)
        }
        openAction(e)
      }}
    >
      <div className="flex-shrink-0">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-[#0B0D17] border border-[#1B1F35]">
          {notification.actor?.profilePhoto ? (
            <img src={notification.actor.profilePhoto} alt={notification.actor.fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#7C5CFF] font-semibold">{notification.actor?.fullName?.[0] || 'U'}</div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-white">{iconFor(notification.type)}<span>{notification.title}</span></div>
          <div className="ml-auto text-xs text-[#94A3B8]">{notification.timeAgo || ''}</div>
        </div>
        <div className="mt-1 text-sm text-[#B9BBCC]">{notification.description}</div>
        {notification.actionLabel && (
          <div className="mt-3">
            <button onClick={openAction} className="btn-primary px-4 py-2 text-sm">{notification.actionLabel}</button>
          </div>
        )}
      </div>

      <div className="self-start">
        {notification.unread && <div className="h-2 w-2 rounded-full bg-purple-400 mt-1" />}
      </div>
    </div>
  )
}
