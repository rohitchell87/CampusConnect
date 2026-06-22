import React, { useEffect, useState } from 'react'
import matchesService from '../../services/matchesService'
import MatchCard from '../../components/ui/MatchCard'
import SkeletonCard from '../../components/common/SkeletonCard'
import toast from 'react-hot-toast'

export default function Matches(){
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ loadMatches() }, [])

  const loadMatches = async ()=>{
    setLoading(true)
    try{
      const data = await matchesService.getMatches()
      setMatches(data)
    }catch(err){
      toast.error('Unable to load matches')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Matches</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Chat with your matches and stay connected.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 shadow rounded p-8 text-center">
          <h2 className="text-xl font-semibold">No matches yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Keep discovering people to build your network.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {matches.map(match => <MatchCard key={match.matchId} match={match} />)}
        </div>
      )}
    </div>
  )
}
