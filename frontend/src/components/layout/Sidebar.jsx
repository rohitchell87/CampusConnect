import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, ThumbsUp, Users, MessageCircle, UserCircle, Settings } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'

const navItems = [
  { label: 'Discover', path: '/discover', icon: Heart },
  { label: 'Likes', path: '/likes', icon: ThumbsUp },
  { label: 'Matches', path: '/matches', icon: Users },
  { label: 'Chats', path: '/chat', icon: MessageCircle },
  { label: 'Profile', path: '/profile', icon: UserCircle },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] flex-col justify-between overflow-hidden rounded-r-[32px] border-r backdrop-blur-3xl shadow-[0_40px_120px_rgba(15,23,42,0.35)] px-4 py-5"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <div>
        <div className="mb-6 flex justify-center px-1">
          <div
            className="w-full max-w-full rounded-[22px] p-5 backdrop-blur-3xl"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-primary)',
              boxShadow: '0 18px 40px rgba(124,92,255,0.08)',
            }}
          >
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 6px 18px rgba(139,92,246,0.18))' }}
              >
                <path d="M12 3 L2 8 L12 13 L22 8 L12 3 Z" />
                <path d="M12 13 L12 21" />
                <path d="M7 17 C9 18.5 15 18.5 17 17" />
              </svg>

              <div className="hidden h-10 w-px md:block" style={{ backgroundColor: 'var(--border-primary)' }} />

              <div className="min-w-0">
                <p className="text-[22px] font-extrabold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  <span>Campus </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]">Connect</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-[18px] px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${active ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] shadow-[0_18px_50px_rgba(124,92,255,0.2)]' : 'hover:bg-[color:var(--surface-bg)]'}`}
                style={active ? { color: 'var(--surface-elevated)' } : { color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-[18px] border ${active ? 'shadow-lg' : 'group-hover:opacity-100'}`}
                  style={active ? { borderColor: 'var(--border-primary)', color: 'var(--surface-elevated)', backgroundColor: 'rgba(255,255,255,0.14)' } : { borderColor: 'var(--border-primary)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-bg)' }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="space-y-4 px-1 pb-2">
        <div className="rounded-[20px] border p-3 shadow-inner backdrop-blur-xl"
          style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-bg)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border shadow-inner"
              style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}
            >
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.fullName || 'User avatar'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center"
                  style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}
                >
                  <UserCircle className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.fullName || 'Guest User'}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user?.college || 'Student account'}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full rounded-[16px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] px-4 py-3 text-sm font-semibold shadow-[0_18px_40px_rgba(124,92,255,0.22)] transition hover:-translate-y-0.5 hover:brightness-105"
          style={{ color: 'var(--surface-elevated)' }}
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
