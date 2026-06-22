import React, { useEffect, useState } from 'react'
import discoverService from '../../services/discoverService'
import likeService from '../../services/likeService'
import DiscoverCard from '../../components/ui/DiscoverCard'
import SkeletonCard from '../../components/common/SkeletonCard'
import toast from 'react-hot-toast'

export default function Discover(){
  const [page, setPage] = useState(0)
  const [size] = useState(6)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 })

  useEffect(()=>{ load() }, [page])

  const load = async ()=>{
    setLoading(true)
    try{
      const res = await discoverService.discover(page, size)
      setData(res)
    }catch(err){
      toast.error('Failed to load users')
    }finally{ setLoading(false) }
  }

  const handleLike = async (user) => {
    try{
      await likeService.likeUser(user.id)
      toast.success(`Liked ${user.fullName}`)
      setData(prev=> ({ ...prev, content: prev.content.filter(u=>u.id!==user.id), totalElements: prev.totalElements-1 }))
    }catch(err){ toast.error('Failed to like') }
  }

  const handleSkip = (user) => {
    setData(prev=> ({ ...prev, content: prev.content.filter(u=>u.id!==user.id), totalElements: prev.totalElements-1 }))
  }

  const goPrev = ()=> setPage(p=> Math.max(0, p-1))
  const goNext = ()=> setPage(p=> Math.min(data.totalPages-1, p+1))

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Discover</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Browse profiles and build meaningful connections.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : data.content.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 shadow rounded p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">No matches found</h2>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your profile or check back later.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.content.map(u=> (
              <DiscoverCard key={u.id} user={u} onLike={handleLike} onSkip={handleSkip} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button onClick={goPrev} disabled={page===0} className="rounded-lg border border-slate-300 px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700">Prev</button>
            <span className="text-sm text-slate-600 dark:text-slate-400">Page {page+1} of {data.totalPages || 1}</span>
            <button onClick={goNext} disabled={page >= (data.totalPages-1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700">Next</button>
          </div>
        </>
      )}
    </div>
  )
}
 
