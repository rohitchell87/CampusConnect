import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { AuthContext } from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const authenticated = isAuthenticated()

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 text-primary-600 font-semibold">
          <div className="h-8 w-8 rounded bg-primary-500 flex items-center justify-center text-white">CC</div>
          <span className="text-lg">CampusConnect</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {authenticated && (
            <nav className="hidden md:flex gap-4 items-center">
              <NavLink to="/discover" className={({ isActive }) => isActive ? 'text-primary-600 font-medium' : 'text-slate-600 dark:text-slate-300'}>Discover</NavLink>
              <NavLink to="/matches" className={({ isActive }) => isActive ? 'text-primary-600 font-medium' : 'text-slate-600 dark:text-slate-300'}>Matches</NavLink>
              <NavLink to="/chat" className={({ isActive }) => isActive ? 'text-primary-600 font-medium' : 'text-slate-600 dark:text-slate-300'}>Chat</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-primary-600 font-medium' : 'text-slate-600 dark:text-slate-300'}>Profile</NavLink>
            </nav>
          )}

          {!authenticated ? (
            <>
              <Link to="/login" className="hidden md:inline text-slate-600 dark:text-slate-300">Login</Link>
              <Link to="/register" className="hidden md:inline px-3 py-1 rounded bg-primary-500 text-white">Sign up</Link>
            </>
          ) : (
            <button onClick={logout} className="hidden md:inline px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">Logout</button>
          )}

          <button className="md:hidden p-2 text-slate-600 dark:text-slate-300">
            <FaBars />
          </button>
        </div>
      </div>
    </header>
  )
}
