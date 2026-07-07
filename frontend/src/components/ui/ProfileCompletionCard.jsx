import React from 'react'

export default function ProfileCompletionCard({ profile }){
  const sections = [
    { label: 'Profile photo', complete: !!profile?.profilePhoto },
    { label: 'Cover photo', complete: !!profile?.coverPhoto },
    { label: 'Interests', complete: Array.isArray(profile?.interests) && profile.interests.length > 0 },
  ]

  const completedCount = sections.filter(section => section.complete).length
  const completionPercentage = Math.round((completedCount / sections.length) * 100)

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Profile status</p>
          <h2 className="section-title mt-2">Complete your profile</h2>
          <p className="subtle-text mt-2">Unlock Discover once your profile has all key details.</p>
        </div>
        <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
          <span>{completionPercentage}% complete</span>
        </div>
      </div>

      <div className="mt-6 rounded-full bg-slate-200/60 dark:bg-slate-800 overflow-hidden h-3">
        <div className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 transition-all" style={{ width: `${completionPercentage}%` }} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {sections.map((section) => (
          <div key={section.label} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="font-semibold text-slate-900 dark:text-slate-100">{section.label}</div>
            <div className={`mt-2 text-sm font-medium ${section.complete ? 'text-success' : 'text-slate-500 dark:text-slate-400'}`}>
              {section.complete ? 'Done' : 'Pending'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
