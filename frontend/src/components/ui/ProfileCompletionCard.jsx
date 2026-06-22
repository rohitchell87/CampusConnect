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
    <div className="bg-white dark:bg-slate-900 shadow rounded p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">Profile completion</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Finish setup to unlock Discover.</p>
        </div>
        <span className="text-sm font-semibold text-primary-600">{completionPercentage}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-4">
        <div className="h-2 bg-primary-500" style={{ width: `${completionPercentage}%` }} />
      </div>
      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.label} className="flex items-center justify-between text-sm">
            <span>{section.label}</span>
            <span className={`font-semibold ${section.complete ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
              {section.complete ? 'Done' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
