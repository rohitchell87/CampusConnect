import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated } = useContext(AuthContext)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const logoTarget = isAuthenticated() ? '/discover' : '/login'

  const LogoContent = (
    <>
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">
        CC
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-semibold text-white">CampusConnect</p>
        <p className="text-xs text-[#B8B8B8] leading-none">Find connections</p>
      </div>
    </>
  )

  return (
    <header className="h-[60px] fixed top-0 w-full z-40 backdrop-blur-md bg-[rgba(5,5,5,0.8)] border-b border-white/10">
      <div className="h-full px-6 flex items-center">
        {isAuthPage ? (
          <div className="flex items-center gap-3 transition" style={{ cursor: 'default' }}>
            {LogoContent}
          </div>
        ) : (
          <Link to={logoTarget} className="flex items-center gap-3 hover:opacity-90 transition">
            {LogoContent}
          </Link>
        )}
      </div>
    </header>
  )
}
