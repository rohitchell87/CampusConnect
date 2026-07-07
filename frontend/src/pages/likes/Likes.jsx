import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import SkeletonCard from '../../components/common/SkeletonCard'
import LikeCard from '../../components/ui/LikeCard'
import IllustratedEmptyState from '../../components/common/IllustratedEmptyState'

export default function Likes() {
  const [loading] = useState(false)
  const [likes] = useState([])

  return (
    <div className="animate-fade-in">
      <div className="mx-auto w-[min(90vw,1500px)] max-w-[1500px] space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#8B5CF6]">❤️ People Who Liked You</p>
            <h1 className="text-3xl font-bold text-white mt-2">People Who Liked You</h1>
            <p className="text-sm text-[#94A3B8] mt-2">See who has shown interest in your profile.</p>
          </div>

          <div className="ml-auto">
            <div className="inline-flex items-center gap-3 rounded-full bg-[rgba(124,92,255,0.08)] px-4 py-2">
              <div className="h-7 w-7 rounded-full bg-[#7C5CFF] flex items-center justify-center text-white font-semibold">{likes.length}</div>
              <div className="text-sm text-[#DAD6FF]">Likes</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} className="rounded-[24px] bg-[#0b0d17] border-white/6" />)}
          </div>
        ) : likes.length === 0 ? (
          <IllustratedEmptyState
            icon={Heart}
            title="No likes yet"
            subtitle="Keep completing your profile to increase your visibility."
            buttonLabel="Complete Profile"
            href="/complete-profile"
          />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {likes.map(l => <LikeCard key={l.userId} user={l} />)}
          </div>
        )}
      </div>
    </div>
  )
}