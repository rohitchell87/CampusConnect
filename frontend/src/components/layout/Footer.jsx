import React from 'react'

export default function Footer(){
  return (
    <footer className="mt-12 border-t border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} CampusConnect — Designed for meaningful connections.
      </div>
    </footer>
  )
}
