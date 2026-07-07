import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, ThumbsUp, Users, MessageCircle, UserCircle } from 'lucide-react'

const navItems = [
  { label: 'Discover', path: '/discover', icon: Heart },
  { label: 'Likes', path: '/likes', icon: ThumbsUp },
  { label: 'Matches', path: '/matches', icon: Users },
  { label: 'Chat', path: '/chat', icon: MessageCircle },
  { label: 'Profile', path: '/profile', icon: UserCircle },
]

export default function MobileBottomNav() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-white/10 bg-[#090909]/95 backdrop-blur-xl px-3 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-2 py-2 text-xs transition ${active ? 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white' : 'bg-[#141414] text-[#B5B5B5] hover:bg-[#1f1f1f]'}`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
