import React, { useEffect, useMemo, useState, useContext, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Edit3, Upload, Heart, MapPin, Sparkles, Dumbbell, Code, Film, Plane, Music, BookOpen, Plus, Eye, ThumbsUp, Users, Check, MessageSquare, MoreHorizontal, Image as ImageIcon, X, Monitor, Smartphone } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import profileService from '../../services/profileService'
import { AuthContext } from '../../context/AuthContext'
import { calculateCompatibility } from '../../utils/compatibility'
import ProfileGallery from '../../components/profile/gallery/ProfileGallery'
import PhotoViewerModal from '../../components/profile/gallery/PhotoViewerModal'
import ProfileVisitors from '../../components/profile/visitors/ProfileVisitors'
import CompatibilityBreakdown from '../../components/compatibility/CompatibilityBreakdown'
import ReportModal from '../../components/moderation/ReportModal'
import BlockConfirmation from '../../components/moderation/BlockConfirmation'
import VerifiedBadge from '../../components/verification/VerifiedBadge'
import { getMockProfileById } from '../../components/discover/todaysPicksMock'
import VerificationModal from '../../components/verification/VerificationModal'
import { subscribeToVerificationChanges, getVerificationStatus } from '../../components/verification/VerificationService'
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

export default function Profile() {
  const [searchParams] = useSearchParams()
  const requestedUserId = searchParams.get('userId')
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [profile, setProfile] = useState(null)
  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [showReasons, setShowReasons] = useState(false)
  const [profileUploadProgress, setProfileUploadProgress] = useState(0)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverUploadProgress, setCoverUploadProgress] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerPhotos, setViewerPhotos] = useState([])
  const [viewerIndex, setViewerIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [blockOpen, setBlockOpen] = useState(false)
  const [blockedMessage, setBlockedMessage] = useState('')
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState('Not Verified')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTab, setPreviewTab] = useState('profile-view')
  const photosInputRef = useRef(null)

  useEffect(() => {
    loadProfile()
    const sync = () => setVerificationStatus(getVerificationStatus(profile?.id || 'self'))
    sync()
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview)
      if (coverPreview) URL.revokeObjectURL(coverPreview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!profile) return
    const sync = () => setVerificationStatus(getVerificationStatus(profile?.id || 'self'))
    sync()
    return subscribeToVerificationChanges(sync)
  }, [profile])

  useEffect(() => {
    if (!previewOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPreviewOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previewOpen])

  const loadProfile = async () => {
    setLoading(true)
    setHasLoaded(false)
    try {
      if (requestedUserId) {
        const mockProfile = getMockProfileById(requestedUserId)
        if (mockProfile) {
          setProfile(mockProfile)
          return
        }
      }
      const data = await profileService.getMyProfile()
      setProfile(data)
    } catch (err) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  const onSelectProfile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileFile(file)
    setProfilePreview(URL.createObjectURL(file))
  }

  const onSelectCover = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleAddPhotosClick = () => {
    photosInputRef.current?.click()
  }

  const uploadProfile = async () => {
    if (!profileFile) {
      toast('No profile image selected')
      return
    }
    try {
      setProfileUploadProgress(0)
      const res = await profileService.uploadProfilePhoto(profileFile, setProfileUploadProgress)
      toast.success('Profile photo uploaded')
      setProfile((prev) => ({ ...prev, profilePhoto: res.profilePhoto || res }))
      setProfileFile(null)
      setProfilePreview(null)
    } catch (err) {
      toast.error('Upload failed')
    }
  }

  const uploadCover = async () => {
    if (!coverFile) {
      toast('No cover image selected')
      return
    }
    try {
      setCoverUploadProgress(0)
      const res = await profileService.uploadCoverPhoto(coverFile, setCoverUploadProgress)
      toast.success('Cover photo uploaded')
      setProfile((prev) => ({ ...prev, coverPhoto: res.coverPhoto || res }))
      setCoverFile(null)
      setCoverPreview(null)
    } catch (err) {
      toast.error('Upload failed')
    }
  }

  const { user: currentUser } = useContext(AuthContext)
  const isOwnProfile = !requestedUserId && (!currentUser || (profile?.id && currentUser.id === profile.id))
  const heroImageSrc = profile?.coverPhoto || coverPreview || ''
  const effectiveIsOwnProfile = !previewOpen && isOwnProfile

  useEffect(() => {
    if (!profile) {
      setHeroReady(true)
      return
    }

    if (!heroImageSrc) {
      setHeroReady(true)
      return
    }

    setHeroReady(false)

    const img = new Image()
    img.src = heroImageSrc
    img.onload = () => setHeroReady(true)
    img.onerror = () => setHeroReady(true)
  }, [profile?.id, heroImageSrc])

  const computedInterests = useMemo(() => {
    if (!profile) return []
    if (Array.isArray(profile.interests)) return profile.interests
    if (typeof profile.interests === 'string') return profile.interests.split(',').map((item) => item.trim()).filter(Boolean)
    return []
  }, [profile])

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
    // If viewing own profile, fallback to completion
    if (!currentUser || (profile.id && currentUser.id === profile.id)) return profile.compatibilityScore ?? completion

    // Calculate compatibility between current user and this profile
    try{
      const { score } = calculateCompatibility(currentUser, profile)
      return score
    }catch(e){
      return profile.compatibilityScore ?? completion
    }
  }, [completion, profile, currentUser])

  const compatibilityDetails = useMemo(() => {
    if (!profile || !currentUser) return { reasons: [] }
    if (currentUser.id === profile.id) return { reasons: [] }
    try{
      return calculateCompatibility(currentUser, profile)
    }catch(e){
      return { reasons: [] }
    }
  }, [profile, currentUser])

  const galleryPhotos = useMemo(() => {
    if (!profile) return []
    if (Array.isArray(profile.galleryPhotos)) return profile.galleryPhotos
    return []
  }, [profile])
  const promptCards = useMemo(() => {
    if (!profile) return []
    const cards = []
    if (profile.relationshipIntent) cards.push({ title: 'Relationship style', text: formatProfileText(profile.relationshipIntent) })
    if (profile.personalityType) cards.push({ title: 'Personality', text: formatProfileText(profile.personalityType) })
    if (profile.lookingFor) cards.push({ title: 'Looking for', text: formatProfileText(profile.lookingFor) })
    return cards
  }, [profile])

  const profileLocation = profile?.location || profile?.hometown || 'Location unavailable'
  const onlineStatus = profile ? 'Online' : ''

  const openPhotoViewer = (photo, index = 0, photos = []) => {
    const sources = photos.filter(Boolean)
    if (!sources.length && photo) {
      setViewerPhotos([photo])
      setViewerIndex(0)
      setViewerOpen(true)
      return
    }
    setViewerPhotos(sources)
    setViewerIndex(index >= 0 && index < sources.length ? index : 0)
    setViewerOpen(true)
  }

  const closePhotoViewer = () => setViewerOpen(false)
  const goToPrevPhoto = () => setViewerIndex((prev) => (prev === 0 ? viewerPhotos.length - 1 : prev - 1))
  const goToNextPhoto = () => setViewerIndex((prev) => (prev === viewerPhotos.length - 1 ? 0 : prev + 1))

  const handleShareProfile = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${profile?.fullName || 'CampusConnect'}'s Profile`, url })
        return
      } catch (err) {
        // ignore share dismissal
      }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Profile link copied')
        return
      } catch (err) {
        toast.error('Unable to copy link')
        return
      }
    }
    window.prompt('Copy this profile link', url)
  }
  const formatStat = (val) => (val === null || val === undefined ? 0 : val)

  const isVerified = verificationStatus === 'Verified Student' || profile?.emailVerified || profile?.verified

  if (!hasLoaded || !profile || !heroReady) {
    return (
      <div className="animate-fade-in">
        <div className="profile-shell w-full overflow-x-hidden">
          <div className="flex gap-3 w-full h-full">
          <div className="flex-1 space-y-3 px-3 py-4 min-w-0">
            <div className="h-36 rounded-[18px] profile-surface-soft animate-pulse" />
            <div className="h-28 rounded-[18px] profile-surface-soft animate-pulse" />
            <div className="grid gap-3 grid-cols-2">
              <div className="h-28 rounded-[18px] profile-surface-soft animate-pulse" />
              <div className="h-28 rounded-[18px] profile-surface-soft animate-pulse" />
            </div>
          </div>
          <div className="w-56 space-y-3 flex-shrink-0 px-3 py-4">
            <div className="h-20 rounded-[18px] profile-surface-soft animate-pulse" />
            <div className="h-20 rounded-[18px] profile-surface-soft animate-pulse" />
            <div className="h-28 rounded-[18px] profile-surface-soft animate-pulse" />
          </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="min-h-screen profile-shell px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-[min(85vw,1500px)] max-w-[1500px] space-y-10">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-[28px] profile-surface-soft shadow-[0_35px_100px_rgba(0,0,0,0.45)]">
          <button
            type="button"
            onClick={() => openPhotoViewer(profile?.coverPhoto || coverPreview, 0, [profile?.coverPhoto || coverPreview].filter(Boolean))}
            className="absolute inset-0 w-full cursor-zoom-in"
          >
            <div className="absolute inset-0">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
              ) : profile?.coverPhoto ? (
                <img src={profile.coverPhoto} alt="Cover" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full profile-shell" />
              )}
            </div>
          </button>
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.35)] to-transparent" />
          </div>

          <div className="relative flex h-[340px] flex-col justify-between p-8">
            <div className="flex justify-end gap-3">
              {!isOwnProfile && !previewOpen ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--accent-secondary)]/20 bg-[color:var(--surface-elevated)]/90 text-[color:var(--text-primary)] shadow-[0_12px_30px_rgba(124,92,255,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--surface-bg)]"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-[18px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/95 p-2 shadow-[0_20px_45px_rgba(0,0,0,0.3)]">
                      <button type="button" onClick={() => { handleShareProfile(); setMenuOpen(false) }} className="flex w-full items-center rounded-[12px] px-3 py-2 text-left text-sm text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface-bg)]">Share Profile</button>
                      <button type="button" onClick={() => { setReportOpen(true); setMenuOpen(false) }} className="flex w-full items-center rounded-[12px] px-3 py-2 text-left text-sm text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface-bg)]">Report User</button>
                      <button type="button" onClick={() => { setBlockOpen(true); setMenuOpen(false) }} className="flex w-full items-center rounded-[12px] px-3 py-2 text-left text-sm text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface-bg)]">Block User</button>
                    </div>
                  )}
                </div>
              ) : null}
              {!previewOpen && isOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={handleShareProfile}
                    className="inline-flex items-center justify-center rounded-full border border-[color:var(--accent-secondary)]/20 bg-[color:var(--surface-elevated)]/90 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,92,255,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--surface-bg)]"
                  >
                    Share Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,92,255,0.15)] transition duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
                  >
                    <Eye className="h-4 w-4" />
                    Preview Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => (window.location.href = '/complete-profile')}
                    className="inline-flex items-center justify-center rounded-full border border-[color:var(--accent-secondary)]/20 bg-[color:var(--surface-elevated)]/90 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,92,255,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--surface-bg)]"
                  >
                    Edit Profile
                  </button>
                </>
              ) : null}
              {previewOpen ? (
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--accent-secondary)]/20 bg-[color:var(--surface-elevated)]/90 text-white shadow-[0_12px_30px_rgba(124,92,255,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--surface-bg)]"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : null}
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-6">
                <div className="relative">
                  {!previewOpen ? (
                    <button
                      type="button"
                      onClick={() => openPhotoViewer(profile?.profilePhoto || profilePreview, 0, [profile?.profilePhoto || profilePreview].filter(Boolean))}
                      className="h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-[color:var(--accent-secondary)]/40 bg-[color:var(--bg-primary)] shadow-[0_20px_40px_rgba(0,0,0,0.45)] cursor-zoom-in"
                    >
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile" className="h-full w-full object-cover" />
                    ) : profile?.profilePhoto ? (
                      <img src={profile.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#0B0F1E] text-[#A1A1AA]">
                        <Camera className="h-6 w-6" />
                      </div>
                    )}
                  </button>
                  ) : (
                    <div className="h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-[color:var(--accent-secondary)]/40 bg-[color:var(--card-bg)] shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
                      {profilePreview ? (
                        <img src={profilePreview} alt="Profile" className="h-full w-full object-cover" />
                      ) : profile?.profilePhoto ? (
                        <img src={profile.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[color:var(--surface-bg)] text-[color:var(--text-muted)]">
                          <Camera className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  )}
                  {!previewOpen ? (
                    <label className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-secondary)] text-[color:var(--surface-elevated)] shadow-[0_12px_30px_rgba(124,92,255,0.35)] transition hover:brightness-110 cursor-pointer">
                      <Camera className="h-4 w-4" />
                      <input type="file" accept="image/*" onChange={onSelectProfile} className="hidden" />
                    </label>
                  ) : null}
                  <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5 rounded-full bg-emerald-400 ring-2 ring-[#090B14]" />
                </div>

                <div className="min-w-0 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  <div className="flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight">
                    <h1 className="truncate text-white">{profile?.fullName || 'Your Name'}</h1>
                    <span className="text-xl font-semibold text-white">{profile?.age || '24'}</span>
                    {isVerified ? (
                      <VerifiedBadge user={profile?.id || 'self'} className="px-3 py-1" />
                    ) : (
                      <button type="button" onClick={() => setVerificationOpen(true)} className="rounded-full border border-[color:var(--accent-primary)]/25 bg-[color:var(--accent-primary)]/12 px-3 py-1 text-sm font-semibold text-[color:var(--accent-primary)] transition hover:bg-[color:var(--accent-primary)]/20">
                        Verify student
                      </button>
                    )}
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-white sm:text-base">
                    <p>{formatProfileText(profile?.college, 'College unknown')}</p>
                    <p>{formatProfileText(profile?.branch, 'Branch unknown')} • {profile?.year ? `Year ${profile.year}` : 'Year unknown'}</p>
                    <div className="flex flex-wrap items-center gap-2 text-white">
                      <MapPin className="h-4 w-4 text-white flex-shrink-0" />
                      <span>{profileLocation}</span>
                      <span>•</span>
                      <span>{onlineStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {coverPreview && (
            <div className="absolute right-6 top-6 z-10">
              <button type="button" onClick={uploadCover} className="rounded-full bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-secondary)] px-4 py-2 text-xs font-semibold text-[color:var(--surface-elevated)] shadow-[0_8px_24px_rgba(124,92,255,0.3)] transition hover:brightness-110">
                {coverUploadProgress > 0 ? `${coverUploadProgress}%` : 'Save Cover'}
              </button>
            </div>
          )}
        </section>

        {/* ABOUT ME */}
        <section className="rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--card-bg)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
          <div className="flex items-center gap-3 text-2xl font-semibold text-[color:var(--text-primary)]">
            <Sparkles className="h-5 w-5 text-[color:var(--accent-secondary)]" />
            <span>About Me</span>
          </div>
          <div className="mt-6 text-[15px] leading-8 text-[color:var(--text-secondary)]">
            {profile?.bio ? profile.bio : 'No bio available yet. Add a few sentences about yourself and what you are looking for.'}
          </div>
        </section>

        {!previewOpen ? <ProfileVisitors limit={5} /> : null}

        {/* INTERESTS */}
        <section className="rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--card-bg)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
          <div className="flex items-center gap-3 text-2xl font-semibold text-[color:var(--text-primary)]">
            <Sparkles className="h-5 w-5 text-[color:var(--accent-secondary)]" />
            <span>Interests</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {computedInterests.slice(0, 5).length > 0 ? (
              computedInterests.slice(0, 5).map((interest, index) => {
                const Icon = getInterestIcon(interest)
                return (
                  <span key={index} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--text-primary)] transition duration-200 hover:bg-[color:var(--surface-elevated)]">
                    <Icon className="h-4 w-4 text-[color:var(--accent-secondary)]" />
                    {typeof interest === 'object' ? interest.name ?? interest.label ?? '' : interest}
                  </span>
                )
              })
            ) : (
              <div className="rounded-[24px] border border-dashed border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] px-5 py-4 text-sm text-[color:var(--text-muted)]">
                No interests added yet.
              </div>
            )}
          </div>
        </section>

        {/* PHOTO GALLERY */}
        <section className="rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
          <div className="flex items-center justify-between gap-5">
            <h2 className="text-2xl font-semibold text-[color:var(--text-primary)]">Photos</h2>
            {!previewOpen && galleryPhotos.length > 0 ? (
              <button type="button" onClick={handleAddPhotosClick} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--text-primary)] transition duration-200 hover:bg-[color:var(--surface-elevated)]">
                <Plus className="h-4 w-4 text-[color:var(--accent-secondary)]" />
                Add Photos
              </button>
            ) : null}
          </div>
          <div className="mt-8">
            <input ref={photosInputRef} type="file" accept="image/*" onChange={onSelectProfile} className="hidden" />
            <ProfileGallery
              photos={galleryPhotos}
              emptyTitle="No photos added"
              emptySubtitle="Profiles with more photos receive more matches."
              onAddPhotos={handleAddPhotosClick}
            />
          </div>
        </section>

        {/* DATING PROMPTS */}
        <section className="rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
          <h2 className="text-2xl font-semibold text-[color:var(--text-primary)]">Dating Prompts</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {promptCards.length > 0 ? (
              promptCards.map((card, index) => (
                <div key={index} className="rounded-[24px] border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-secondary)]">
                    <Sparkles className="h-4 w-4" />
                    <span>{card.title}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">{card.text}</p>
                </div>
              ))
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {['We’ll get along if...', 'Perfect Sunday...', 'Ideal vacation...'].map((title, index) => (
                  <div key={index} className="rounded-[24px] border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-secondary)]">
                      <Sparkles className="h-4 w-4" />
                      <span>{title}</span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">Add your own prompts to share what makes your vibe unique.</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PROFILE STATS */}
        <section className="rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
          <h2 className="text-2xl font-semibold text-[color:var(--text-primary)]">Profile Stats</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <div className="rounded-[24px] bg-[color:var(--surface-bg)] p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.22)]">
              <Heart className="mx-auto h-7 w-7 text-[color:var(--accent-secondary)]" />
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowReasons((s) => !s)}
                  className="text-3xl font-bold text-[color:var(--text-primary)] transition hover:text-[color:var(--text-secondary)]"
                >
                  {compatibilityScore}%
                </button>
              </div>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Compatibility</p>
            </div>
            <div className="rounded-[24px] bg-[color:var(--surface-bg)] p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.22)]">
              <Eye className="mx-auto h-7 w-7 text-[color:var(--accent-secondary)]" />
              <div className="mt-4 text-3xl font-bold text-[color:var(--text-primary)]">{formatStat(profile?.views)}</div>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Profile Views</p>
            </div>
            <div className="rounded-[24px] bg-[color:var(--surface-bg)] p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.22)]">
              <ThumbsUp className="mx-auto h-7 w-7 text-[color:var(--accent-secondary)]" />
              <div className="mt-4 text-3xl font-bold text-[color:var(--text-primary)]">{formatStat(profile?.likesReceived)}</div>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Likes</p>
            </div>
            <div className="rounded-[24px] bg-[color:var(--surface-bg)] p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.22)]">
              <Users className="mx-auto h-7 w-7 text-[color:var(--accent-secondary)]" />
              <div className="mt-4 text-3xl font-bold text-[color:var(--text-primary)]">{formatStat(profile?.matches)}</div>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Matches</p>
            </div>
          </div>
        </section>
        <PhotoViewerModal
          open={viewerOpen}
          photos={viewerPhotos}
          currentIndex={viewerIndex}
          onClose={closePhotoViewer}
          onPrev={goToPrevPhoto}
          onNext={goToNextPhoto}
        />

        <AnimatePresence>
          {previewOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] overflow-y-auto bg-[color:var(--bg-primary)]/85 px-3 py-4 backdrop-blur-xl sm:px-6 sm:py-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="mx-auto flex min-h-full w-full max-w-6xl flex-col rounded-[32px] border border-[color:var(--border-primary)] bg-[color:var(--card-bg)] shadow-[0_40px_140px_rgba(0,0,0,0.45)]"
              >
                <div className="flex items-center justify-between border-b border-[color:var(--border-primary)] px-4 py-4 sm:px-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--accent-secondary)]">Profile Preview</p>
                    <p className="mt-1 text-sm text-[color:var(--text-secondary)]">See your profile the way others will.</p>
                  </div>
                  <button type="button" onClick={() => setPreviewOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] text-[color:var(--text-primary)] hover:bg-[color:var(--surface-elevated)]">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 border-b border-[color:var(--border-primary)] px-4 py-4 sm:px-6">
                  {[
                    { id: 'profile-view', label: 'Profile View', icon: Monitor },
                    { id: 'discover-card', label: 'Discover Card', icon: Smartphone },
                  ].map((tab) => {
                    const Icon = tab.icon
                    const active = previewTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPreviewTab(tab.id)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-secondary)] text-[color:var(--surface-elevated)]' : 'bg-[color:var(--surface-bg)] text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-elevated)]'}`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
                  {previewTab === 'profile-view' ? (
                    <div className="space-y-6">
                      <section className="overflow-hidden rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                        <div className="relative h-[220px] sm:h-[320px]">
                          <img src={profile?.coverPhoto || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'} alt="Cover" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bg-primary)]/95 via-[color:var(--bg-primary)]/50 to-transparent" />
                          <div className="absolute left-6 right-6 bottom-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                              <img src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'} alt="Profile" className="h-24 w-24 rounded-full border-4 border-[color:var(--accent-secondary)]/40 object-cover sm:h-28 sm:w-28" />
                              <div className="text-[color:var(--text-primary)]">
                                <h2 className="text-2xl font-semibold">{profile?.fullName || 'Your Name'}</h2>
                                <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{profile?.college || 'College'} • {profile?.branch || 'Branch'} • {profile?.year ? `Year ${profile.year}` : 'Year unknown'}</p>
                              </div>
                            </div>
                            <div className="rounded-full border border-[color:var(--accent-secondary)]/20 bg-[color:var(--surface-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--text-primary)]">{compatibilityScore}% compatible</div>
                          </div>
                        </div>
                        <div className="p-6 sm:p-8">
                          <div className="text-[15px] leading-8 text-[color:var(--text-secondary)]">{profile?.bio || 'No bio available yet.'}</div>
                          <div className="mt-6 flex flex-wrap gap-3">
                            {computedInterests.length > 0 ? computedInterests.slice(0, 5).map((interest, index) => {
                              const Icon = getInterestIcon(interest)
                              return <span key={index} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--text-primary)]"> <Icon className="h-4 w-4 text-[color:var(--accent-secondary)]" />{typeof interest === 'object' ? interest.name ?? interest.label ?? '' : interest}</span>
                            }) : <span className="rounded-full bg-[color:var(--surface-bg)] px-4 py-2 text-sm text-[color:var(--text-muted)]">No interests listed</span>}
                          </div>
                        </div>
                      </section>
                      <section className="rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
                        <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">Photos</h3>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {galleryPhotos.length > 0 ? galleryPhotos.slice(0, 6).map((photo, index) => (
                            <img key={`${photo}-${index}`} src={photo} alt={`Photo ${index + 1}`} className="h-40 w-full rounded-[22px] object-cover" />
                          )) : (
                            <div className="col-span-full rounded-[22px] border border-dashed border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] p-8 text-center text-sm text-[color:var(--text-muted)]">No photos added yet.</div>
                          )}
                        </div>
                      </section>
                    </div>
                  ) : (
                    <div className="mx-auto flex max-w-[420px] justify-center">
                      <div className="w-full overflow-hidden rounded-[30px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/85 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
                        <div className="relative h-[520px]">
                          <img src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'} alt="Discover preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#090B14]/95 via-[#090B14]/30 to-transparent" />
                          <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                            <div className="rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-secondary)]">CampusConnect</div>
                            <div className="rounded-full border border-[color:var(--accent-secondary)]/30 bg-[color:var(--accent-secondary)]/15 px-3 py-1 text-sm font-semibold text-[color:var(--text-primary)]">{compatibilityScore}%</div>
                          </div>
                          <div className="absolute bottom-6 left-5 right-5">
                            <h3 className="text-3xl font-semibold text-[color:var(--text-primary)]">{profile?.fullName || 'Your Name'}</h3>
                            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{profile?.college || 'College'} • {profile?.branch || 'Branch'} • {profile?.year ? `Year ${profile.year}` : 'Year unknown'}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {computedInterests.slice(0, 4).map((interest, index) => (
                                <span key={index} className="rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] px-3 py-1.5 text-sm text-[color:var(--text-primary)]">{typeof interest === 'object' ? interest.name ?? interest.label ?? '' : interest}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} profile={profile} />
        <BlockConfirmation open={blockOpen} onClose={() => setBlockOpen(false)} profile={profile} onBlocked={() => setBlockedMessage(`${profile?.fullName || 'This user'} was blocked.`)} />

        {showReasons && !previewOpen && (
          <section className="rounded-[24px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/70 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
            <CompatibilityBreakdown currentUser={currentUser} otherUser={profile} score={compatibilityScore} defaultOpen />
          </section>
        )}
      </div>
    </div>
    </div>
  )
}
