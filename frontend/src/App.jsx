import React from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/layout/Navbar'
import ErrorBoundary from './components/common/ErrorBoundary'

export default function App() {
  const location = useLocation()
  const isAuthRoute = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="app-shell" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {isAuthRoute && <Navbar />}
      <main className={`page-container ${isAuthRoute ? 'flex-1 flex items-center justify-center py-0' : 'flex-1'}`}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
    </div>
  )
}
