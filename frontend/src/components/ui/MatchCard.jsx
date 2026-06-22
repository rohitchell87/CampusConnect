import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function MatchCard({ match }){
  const navigate = useNavigate()

  return (
    <button type="button" onClick={()=>navigate(`/chat?matchId=${match.matchId}&userId=${match.userId}`)} className="bg-white dark:bg-slate-900 shadow rounded overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
      <div className="h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {match.profilePhoto ? (
          <img src={match.profilePhoto} alt={match.fullName} className="object-cover w-full h-full" />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-400">No photo</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{match.fullName}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{match.branch} • Year {match.year}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Matched on {new Date(match.matchedAt).toLocaleDateString()}</p>
      </div>
    </button>
  )
}
