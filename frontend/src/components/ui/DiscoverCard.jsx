import React from 'react'

export default function DiscoverCard({ user, onLike, onSkip }){
  return (
    <div className="bg-white dark:bg-slate-900 shadow rounded overflow-hidden flex flex-col transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-56 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {user.profilePhoto ? (
          <img src={user.profilePhoto} alt={user.fullName} className="object-cover w-full h-full" />
        ) : (
          <div className="text-slate-400">No photo</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user.fullName}</h4>
            <div className="text-sm text-slate-500 dark:text-slate-400">{user.branch} • {user.year}</div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{user.sharedInterests} shared</div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 flex-1">{user.bio || 'No bio provided.'}</p>

        <div className="mt-4 flex gap-3">
          <button onClick={()=>onSkip(user)} className="flex-1 py-2 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">Skip</button>
          <button onClick={()=>onLike(user)} className="flex-1 py-2 rounded bg-primary-500 text-white">Like</button>
        </div>
      </div>
    </div>
  )
}
