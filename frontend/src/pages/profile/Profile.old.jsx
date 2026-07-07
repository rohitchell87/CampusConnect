import React, { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Edit3, Upload, Heart, Users, MessageCircle, Eye, MapPin, Sparkles, Dumbbell, Code, Film, Plane, Music, BookOpen, Plus } from 'lucide-react'
import profileService from '../../services/profileService'
import toast from 'react-hot-toast'

const getInterestIcon = (interest) => {
  const label = String(interest).toLowerCase()
  if (label.includes('gym') || label.includes('fitness') || label.includes('workout')) return Dumbbell
  if (label.includes('code') || label.includes('programming') || label.includes('coding')) return Code
  if (label.includes('anime') || label.includes('movies')) return Film
  if (label.includes('travel') || label.includes('trip') || label.includes('wander')) return Plane
  if (label.includes('music') || label.includes('song')) return Music
  if (label.includes('study') || label.includes('books')) return BookOpen
  return Sparkles
}

const formatProfileText = (value, fallback = '') => {
  if (value === null || value === undefined || value === '') return fallback
  if (typeof value === 'object') return value.name ?? value.label ?? fallback
  return value
}

export default function Profile(){
  const { register, handleSubmit, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [profileUploadProgress, setProfileUploadProgress] = useState(0)

  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverUploadProgress, setCoverUploadProgress] = useState(0)

  useEffect(()=>{
    loadProfile()
    return ()=>{
      if(profilePreview) URL.revokeObjectURL(profilePreview)
      if(coverPreview) URL.revokeObjectURL(coverPreview)
    }
  }, [])

  const loadProfile = async ()=>{
    setLoading(true)
    try{
      const data = await profileService.getMyProfile()
      setProfile(data)
      const fields = ['fullName','age','branch','year','college','bio','height','personalityType','relationshipIntent','workoutHabit','smokingHabit','drinkingHabit','lookingFor']
      fields.forEach(f => setValue(f, data[f]))
    }catch(err){
      toast.error('Failed to load profile')
    }finally{ setLoading(false) }
  }

  const onSave = async (vals)=>{
    setLoading(true)
    try{
      const updated = await profileService.updateProfile(vals)
      setProfile(updated)
      toast.success('Profile updated')
    }catch(err){
      const msg = err?.response?.data?.message || 'Update failed'
      toast.error(msg)
    }finally{ setLoading(false) }
  }

  const onSelectProfile = (e)=>{
    const f = e.target.files?.[0]
    if(!f) return
    setProfileFile(f)
    setProfilePreview(URL.createObjectURL(f))
  }

  const onSelectCover = (e)=>{
    const f = e.target.files?.[0]
    if(!f) return
    setCoverFile(f)
    setCoverPreview(URL.createObjectURL(f))
  }

  const uploadProfile = async ()=>{
    if(!profileFile){ toast('No profile image selected'); return }
    try{
      setProfileUploadProgress(0)
      const res = await profileService.uploadProfilePhoto(profileFile, setProfileUploadProgress)
      toast.success('Profile photo uploaded')
      setProfile(prev=> ({...prev, profilePhoto: res.profilePhoto || res}))
      setProfileFile(null)
      setProfilePreview(null)
    }catch(err){ toast.error('Upload failed') }
  }

  const uploadCover = async ()=>{
    if(!coverFile){ toast('No cover image selected'); return }
    try{
      setCoverUploadProgress(0)
      const res = await profileService.uploadCoverPhoto(coverFile, setCoverUploadProgress)
      toast.success('Cover photo uploaded')
      setProfile(prev=> ({...prev, coverPhoto: res.coverPhoto || res}))
      setCoverFile(null)
      setCoverPreview(null)
    }catch(err){ toast.error('Upload failed') }
  }

  const computedInterests = useMemo(() => {
    if (!profile) return []
    if (Array.isArray(profile.interests)) return profile.interests
    if (typeof profile.interests === 'string') return profile.interests.split(',').map((item) => item.trim()).filter(Boolean)
    return []
  }, [profile])

  const getDisplayText = (value) => {
    if (value === null || value === undefined || value === '') return ''
    if (typeof value === 'object') return value.name ?? value.label ?? ''
    return value
  }

  const completion = useMemo(() => {
    if (!profile) return 0
    const fields = [
      'fullName',
      'college',
      'branch',
      'year',
      'bio',
      'profilePhoto',
      'coverPhoto',
      'height',
      'personalityType',
      'relationshipIntent',
    ]
    const filled = fields.reduce((acc, key) => {
      const value = profile[key]
      return acc + (value || value === 0 ? 1 : 0)
    }, 0)
    return Math.round((filled / fields.length) * 100)
  }, [profile])

  const compatibilityScore = useMemo(() => {
    if (!profile) return completion
    return profile.compatibilityScore ?? completion
  }, [profile, completion])

  const galleryPhotos = useMemo(() => {
    if (!profile) return []
    if (Array.isArray(profile.galleryPhotos)) return profile.galleryPhotos.slice(0, 4)
    return []
  }, [profile])

  const isVerified = profile?.emailVerified || profile?.verified

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#09090B] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1320px] flex-col justify-center overflow-hidden">
          <div className="space-y-6 animate-pulse">
            <div className="h-[420px] rounded-[32px] bg-[#12131A]/80" />
            <div className="rounded-[32px] border border-white/10 bg-[#09090B]/80 p-8">
              <div className="mb-6 h-10 w-1/2 rounded-2xl bg-[#12131A]/80" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="h-40 rounded-[28px] bg-[#12131A]/80" />
                <div className="h-40 rounded-[28px] bg-[#12131A]/80" />
                <div className="h-40 rounded-[28px] bg-[#12131A]/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1320px] flex-col justify-center overflow-hidden">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#12131A]/80 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
          <div className="relative h-[420px] overflow-hidden rounded-[32px] bg-[#12131A]">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
            ) : profile?.coverPhoto ? (
              <img src={profile.coverPhoto} alt="Cover" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#0C0D13] text-slate-500">Upload a cover photo to personalize your profile</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/90 via-transparent to-transparent" />
            <div className="absolute right-6 top-6 rounded-[26px] border border-white/10 bg-[#0B0D1F]/90 p-4 shadow-[0_22px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121820]/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                Upload Cover Photo
                <input type="file" accept="image/*" onChange={onSelectCover} className="hidden" />
              </button>
              {coverPreview && (
                <button type="button" onClick={uploadCover} className="mt-3 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#9F7AEA] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
                  Save cover
                </button>
              )}
            </div>
          </div>

          <div className="absolute left-1/2 top-[360px] z-20 -translate-x-1/2">
            <div className="pointer-events-none relative mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-[#09090B] bg-[#09090B]/95 shadow-[0_35px_65px_rgba(0,0,0,0.45)]">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : profile?.profilePhoto ? (
                <img src={profile.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">No photo</div>
              )}
            </div>
          </div>

          <div className="relative px-6 pb-10 pt-14 sm:px-10">
            <div className="mx-auto max-w-[1080px] rounded-[32px] border border-white/10 bg-[#09090B]/80 px-6 py-8 shadow-[0_35px_90px_rgba(0,0,0,0.35)] backdrop-blur-3xl sm:px-8">
              <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="space-y-6">
                  <div className="space-y-4 text-center sm:text-left">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                          <h1 className="text-5xl font-semibold tracking-tight text-white">{profile?.fullName || 'Your Name'}</h1>
                          {isVerified && (
                            <span className="rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#9F7AEA] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-sm">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400 sm:justify-start">
                          <span>{getDisplayText(profile?.branch) || 'Branch'}</span>
                          <span>•</span>
                          <span>{getDisplayText(profile?.year) || 'Year'}</span>
                          <span>•</span>
                          <span>{getDisplayText(profile?.college) || 'College'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-3 sm:items-end">
                        <button type="button" onClick={() => setIsEditing(true)} className="rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#9F7AEA] px-6 py-3 text-sm font-semibold text-white shadow-[0_25px_70px_rgba(124,92,255,0.26)] transition hover:-translate-y-0.5 hover:brightness-110">
                          Edit Profile
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#12141D]/90 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                          Upload Profile Photo
                          <input type="file" accept="image/*" onChange={onSelectProfile} className="hidden" />
                        </button>
                      </div>
                    </div>
                    <p className="mx-auto max-w-3xl text-base leading-8 text-[#D8D4FF] sm:mx-0">
                      {profile?.bio || 'Write a concise, premium bio that highlights your campus story, goals, and personality for others to discover.'}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-[28px] border border-white/10 bg-[#0B0D1E]/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition hover:-translate-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#8B5CF6]">Likes Received</p>
                      <p className="mt-4 text-3xl font-semibold text-white">{profile?.likesReceived ?? '—'}</p>
                    </div>
                    <div className="rounded-[28px] border border-white/10 bg-[#0B0D1E]/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition hover:-translate-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#8B5CF6]">Matches</p>
                      <p className="mt-4 text-3xl font-semibold text-white">{profile?.matches ?? '—'}</p>
                    </div>
                    <div className="rounded-[28px] border border-white/10 bg-[#0B0D1E]/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition hover:-translate-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#8B5CF6]">Chats</p>
                      <p className="mt-4 text-3xl font-semibold text-white">{profile?.chats ?? '—'}</p>
                    </div>
                  </div>
                </div>

                <aside className="space-y-6 rounded-[28px] border border-white/10 bg-[#09090B]/90 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                  <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8B5CF6]">Compatibility</p>
                    <div className="rounded-[28px] bg-[#0B0D1E]/90 p-5">
                      <p className="text-sm text-slate-400">Your score</p>
                      <p className="mt-3 text-4xl font-semibold text-white">{compatibilityScore}%</p>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                        <div style={{ width: `${compatibilityScore}%` }} className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#9F7AEA] transition-all duration-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8B5CF6]">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {computedInterests.length > 0 ? computedInterests.map((interest, index) => (
                        <span key={index} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#D8D4FF] transition hover:bg-white/10">
                          {typeof interest === 'object' && interest !== null ? interest.name ?? interest.label ?? '' : interest}
                        </span>
                      )) : (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#A1A1AA]">No interests added yet</span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-[#0B0D1E]/90 p-5 text-sm text-slate-300 shadow-inner">
                    <p className="font-semibold text-white">Profile completion</p>
                    <p className="mt-2 text-sm text-slate-400">Keep your profile up to date for better matches and more visibility.</p>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <div style={{ width: `${completion}%` }} className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#9F7AEA] transition-all duration-500" />
                    </div>
                  </div>
                </aside>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] border border-white/10 bg-[#16181D]/90 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8B5CF6]">Photo gallery</p>
                    <button className="rounded-full border border-white/10 bg-[#09090B]/90 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10">
                      Upload photos
                    </button>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {galleryPhotos.length > 0 ? galleryPhotos.map((photo, index) => (
                      <div key={index} className="aspect-[4/3] overflow-hidden rounded-[28px] bg-[#09090B]/80 border border-white/10 shadow-inner">
                        <img src={photo} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                      </div>
                    )) : (
                      <div className="col-span-full rounded-[28px] border border-dashed border-white/15 bg-[#09090B]/80 p-8 text-center text-sm text-slate-500">
                        Add campus pictures to showcase your lifestyle.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#16181D]/90 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#8B5CF6]">Profile stats</p>
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-[24px] border border-white/10 bg-[#0B0D1E]/90 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total likes</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{profile?.likesReceived ?? '—'}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-[#0B0D1E]/90 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Matches</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{profile?.matches ?? '—'}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-[#0B0D1E]/90 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Chats</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{profile?.chats ?? '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
