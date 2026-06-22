import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CampusConnect — Built with care
      </div>
    </footer>
  )
}
