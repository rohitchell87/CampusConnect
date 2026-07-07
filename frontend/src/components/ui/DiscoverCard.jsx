import React from 'react'

export default function DiscoverCard({ user, onLike, onSkip }){
  return (
    <div className="card overflow-hidden flex flex-col transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-56 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {user.profilePhoto ? (
          <img src={user.profilePhoto} alt={user.fullName} className="object-cover w-full h-full" />
        ) : (
          <div className="text-slate-400">No photo</div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user.fullName}</h4>
            <div className="text-sm text-slate-500 dark:text-slate-400">{user.branch} • {user.year}</div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{user.sharedInterests} shared</div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 flex-1">{user.bio || 'No bio provided.'}</p>

        <div className="mt-2 flex gap-3">
          <button onClick={()=>onSkip(user)} className="flex-1 btn-secondary">Skip</button>
          <button onClick={()=>onLike(user)} className="flex-1 btn-primary">Like</button>
        </div>
      </div>
    </div>
  )
}
