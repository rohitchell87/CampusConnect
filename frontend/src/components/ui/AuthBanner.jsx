import React from 'react'

export default function AuthBanner({ title, subtitle, cta }) {
  return (
    <div className="auth-banner rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-4">
        <div className="logo-mark">CC</div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">CampusConnect</p>
          <p className="text-sm text-slate-400">Modern campus matching</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{subtitle}</p>
      {cta && <div className="mt-6 rounded-3xl bg-slate-950/50 p-4 text-sm text-slate-300">{cta}</div>}
    </div>
  )
}
