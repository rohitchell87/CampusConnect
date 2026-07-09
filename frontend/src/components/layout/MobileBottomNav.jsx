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
    <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t backdrop-blur-xl px-3 py-3"
      style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-glass)' }}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-2 py-2 text-xs transition ${active ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)]' : 'hover:bg-[color:var(--surface-bg)]'}`}
              style={active ? { color: 'var(--surface-elevated)' } : { color: 'var(--text-secondary)', backgroundColor: 'var(--surface-bg)' }}
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
