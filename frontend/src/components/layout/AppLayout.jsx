import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileBottomNav from './MobileBottomNav'
import NotificationBell from '../notifications/NotificationBell'

export default function AppLayout() {
  const [bellHidden, setBellHidden] = useState(false)

  useEffect(() => {
    const handleBellVisibility = (event) => {
      setBellHidden(Boolean(event.detail?.hidden))
    }

    window.addEventListener('campusconnect:bell-visibility', handleBellVisibility)
    return () => window.removeEventListener('campusconnect:bell-visibility', handleBellVisibility)
  }, [])

  return (
    <div
      className="min-h-screen text-[var(--text-primary)]"
      style={{
        backgroundColor: 'var(--bg-primary)',
        backgroundImage:
          'radial-gradient(circle at top, rgba(99,102,241,0.08), transparent 35%)',
      }}
    >
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-[260px] min-w-0">
        <div className="w-full px-6 py-6 md:px-8 lg:px-10">
          <Outlet />
        </div>
      </main>

      {/* Fixed Notification Bell visible across authenticated pages */}
      <div className={`fixed top-6 right-6 z-[9999] ${bellHidden ? 'pointer-events-none' : 'pointer-events-auto'}`} aria-hidden={bellHidden}>
        <NotificationBell isHidden={bellHidden} />
      </div>

      <MobileBottomNav />
    </div>
  )
}

