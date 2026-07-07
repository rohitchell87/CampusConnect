import React, { useEffect, useMemo, useState, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, MapPin, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import discoverService from '../../services/discoverService'
import likeService from '../../services/likeService'
import { AuthContext } from '../../context/AuthContext'
import { calculateCompatibility } from '../../utils/compatibility'
import FilterDrawer from '../../components/discover/FilterDrawer'
import FilterChip from '../../components/discover/FilterChip'
import CompatibilityBreakdown from '../../components/compatibility/CompatibilityBreakdown'
import { subscribeToModerationChanges, isBlockedUser } from '../../components/moderation/ModerationService'
import VerifiedBadge from '../../components/verification/VerifiedBadge'
import { subscribeToVerificationChanges, getVerificationStatus } from '../../components/verification/VerificationService'
import PhotoViewerModal from '../../components/profile/gallery/PhotoViewerModal'
import toast from 'react-hot-toast'

export default function Discover(){
  const { user: currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [size] = useState(6)
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [cardReady, setCardReady] = useState(false)
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(0)
  const [bioExpanded, setBioExpanded] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showCompatibility, setShowCompatibility] = useState(false)
  const [filters, setFilters] = useState({
    college: '',
    branch: '',
    year: '',
    ageRange: [18, 30],
    gender: 'Any',
    lookingFor: '',
    interests: [],
    onlyVerified: false,
    onlineNow: false
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [todayPickId, setTodayPickId] = useState(null)
  const [celebrationOpen, setCelebrationOpen] = useState(false)
  const [celebrationProfile, setCelebrationProfile] = useState(null)
  const [celebrationDetails, setCelebrationDetails] = useState({ sharedInterests: ['Anime', 'Gym', 'Coding'], matchPercentage: 92 })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewProfile, setPreviewProfile] = useState(null)
  const [previewPhotoViewerOpen, setPreviewPhotoViewerOpen] = useState(false)
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(0)

  useEffect(() => { load() }, [page])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('campusconnect:bell-visibility', { detail: { hidden: drawerOpen } }))
    return () => {
      window.dispatchEvent(new CustomEvent('campusconnect:bell-visibility', { detail: { hidden: false } }))
    }
  }, [drawerOpen])

  useEffect(() => {
    const unsubscribe = subscribeToModerationChanges(() => {
      setData((prev) => ({ ...prev, content: prev.content.filter((profile) => !isBlockedUser(profile.id || profile.userId)) }))
      setFilteredProfiles((prev) => prev.filter((profile) => !isBlockedUser(profile.id || profile.userId)))
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const sync = () => {
      setData((prev) => ({ ...prev, content: prev.content.map((profile) => ({ ...profile, verificationStatus: getVerificationStatus(profile) })) }))
      setFilteredProfiles((prev) => prev.map((profile) => ({ ...profile, verificationStatus: getVerificationStatus(profile) })))
    }
    sync()
    return subscribeToVerificationChanges(sync)
  }, [])

  useEffect(() => {
    if (!data.content?.length) {
      setFilteredProfiles([])
      setTodayPickId(null)
      return
    }

    const matches = data.content.filter((profile) => {
      const profileCollege = profile.college || ''
      const profileBranch = profile.branch || ''
      const profileYear = profile.year ? String(profile.year) : ''
      const profileGender = profile.gender || ''
      const profileLookingFor = profile.lookingFor || ''
      const profileInterests = Array.isArray(profile.interests)
        ? profile.interests.map((interest) => (typeof interest === 'object' ? interest.name || interest.label || '' : interest)).filter(Boolean)
        : []
      const profileAge = Number(profile.age || 0)
      const activeInterests = appliedFilters.interests || []

      const matchesCollege = !appliedFilters.college || profileCollege.toLowerCase().includes(appliedFilters.college.toLowerCase())
      const matchesBranch = !appliedFilters.branch || profileBranch.toLowerCase().includes(appliedFilters.branch.toLowerCase())
      const matchesYear = !appliedFilters.year || profileYear === String(appliedFilters.year)
      const matchesAge = !appliedFilters.ageRange || (profileAge >= appliedFilters.ageRange[0] && profileAge <= appliedFilters.ageRange[1])
      const matchesGender = !appliedFilters.gender || appliedFilters.gender === 'Any' || profileGender.toLowerCase() === appliedFilters.gender.toLowerCase()
      const matchesLookingFor = !appliedFilters.lookingFor || profileLookingFor.toLowerCase().includes(appliedFilters.lookingFor.toLowerCase())
      const matchesInterests = !activeInterests.length || activeInterests.every((interest) => profileInterests.some((profileInterest) => profileInterest.toLowerCase().includes(interest.toLowerCase())))
      const matchesVerified = !appliedFilters.onlyVerified || Boolean(profile.verified)
      const matchesOnline = !appliedFilters.onlineNow || Boolean(profile.online)
      const notBlocked = !isBlockedUser(profile.id || profile.userId)

      return notBlocked && matchesCollege && matchesBranch && matchesYear && matchesAge && matchesGender && matchesLookingFor && matchesInterests && matchesVerified && matchesOnline
    })

    setFilteredProfiles(matches)
  }, [data.content, appliedFilters])

  useEffect(() => {
    if (!filteredProfiles.length) {
      setTodayPickId(null)
      return
    }

    const pick = filteredProfiles[Math.floor(Math.random() * filteredProfiles.length)]
    setTodayPickId(pick?.id || null)
  }, [filteredProfiles, page])

  const load = async () => {
    setLoading(true)
    setHasLoaded(false)

    try {
      const res = await discoverService.discover(page, size)
      setData(res)
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  const handleLike = async (user) => {
    setIsAnimating(true)
    setSwipeDirection(1)
    try {
      await likeService.likeUser(user.id)
      toast.success(`Liked ${user.fullName}`)
    } catch (err) {
      toast.error('Failed to like')
    }

    const details = buildMockMatchDetails(user)
    const isMatch = Number(user?.id || 0) % 4 === 0 || Boolean(details.matchPercentage > 90)

    if (isMatch) {
      setCelebrationProfile(user)
      setCelebrationDetails(details)
      setCelebrationOpen(true)
      setIsAnimating(false)
      setSwipeDirection(0)
      return
    }

    setTimeout(() => {
      setData(prev => ({ ...prev, content: prev.content.filter(u => u.id !== user.id), totalElements: prev.totalElements - 1 }))
      setIsAnimating(false)
      setSwipeDirection(0)
    }, 260)
  }

  const handleKeepSwiping = () => {
    if (!celebrationProfile) {
      setCelebrationOpen(false)
      return
    }

    setData(prev => ({ ...prev, content: prev.content.filter(u => u.id !== celebrationProfile.id), totalElements: prev.totalElements - 1 }))
    setCelebrationOpen(false)
    setCelebrationProfile(null)
    setCelebrationDetails({ sharedInterests: ['Anime', 'Gym', 'Coding'], matchPercentage: 92 })
  }

  const handleSendMessage = () => {
    if (!celebrationProfile) return
    setCelebrationOpen(false)
    navigate(`/chat?userId=${celebrationProfile.id}`)
  }

  const handleSkip = (user) => {
    setIsAnimating(true)
    setSwipeDirection(-1)
    setTimeout(() => {
      setData(prev=> ({ ...prev, content: prev.content.filter(u=>u.id!==user.id), totalElements: prev.totalElements-1 }))
      setIsAnimating(false)
      setSwipeDirection(0)
    }, 220)
  }

  const normalizeInterests = (interests) => {
    if (!interests) return []
    if (Array.isArray(interests)) return interests.map(i => (typeof i === 'object' ? i.name || i.label || '' : i)).filter(Boolean)
    return interests.split(',').map(i => i.trim()).filter(Boolean)
  }

  const getProfilePhotos = (profile) => {
    if (!profile) return []

    const candidates = [
      profile?.photos,
      profile?.images,
      profile?.profilePhotos,
      profile?.photoList,
      profile?.profilePhoto,
      profile?.photo
    ]

    const photos = []
    const pushCandidate = (candidate) => {
      if (!candidate) return
      if (Array.isArray(candidate)) {
        candidate.filter(Boolean).forEach(pushCandidate)
        return
      }
      if (typeof candidate === 'string') photos.push(candidate)
    }

    candidates.forEach(pushCandidate)
    return Array.from(new Set(photos))
  }

  const openProfilePreview = (profile) => {
    setPreviewProfile(profile)
    setPreviewOpen(true)
    setPreviewPhotoViewerOpen(false)
    setPreviewPhotoIndex(0)
  }

  const closeProfilePreview = () => {
    setPreviewOpen(false)
    setPreviewProfile(null)
    setPreviewPhotoViewerOpen(false)
    setPreviewPhotoIndex(0)
  }

  const openPreviewPhotoViewer = (index) => {
    setPreviewPhotoIndex(index)
    setPreviewPhotoViewerOpen(true)
  }

  const closePreviewPhotoViewer = () => setPreviewPhotoViewerOpen(false)

  const goPrevPreviewPhoto = () => setPreviewPhotoIndex((prev) => (prev === 0 ? previewPhotos.length - 1 : prev - 1))
  const goNextPreviewPhoto = () => setPreviewPhotoIndex((prev) => (prev === previewPhotos.length - 1 ? 0 : prev + 1))

  const buildMockMatchDetails = (user) => {
    const profileInterests = normalizeInterests(user?.interests)
    const userInterests = normalizeInterests(currentUser?.interests)
    const shared = profileInterests.filter((interest) => userInterests.includes(interest))
    const sharedInterests = shared.length >= 3 ? shared.slice(0, 3) : ['Anime', 'Gym', 'Coding']
    const matchPercentage = Math.min(99, 82 + ((Number(user?.id || 0) + Number(currentUser?.id || 0)) % 12))
    return { sharedInterests, matchPercentage }
  }

  const goPrev = ()=> setPage(p=> Math.max(0, p-1))
  const goNext = ()=> setPage(p=> Math.min(data.totalPages-1, p+1))

  const activeProfile = filteredProfiles[0] || data.content[0]
  const interests = normalizeInterests(activeProfile?.interests)
  const sharedInterests = interests.slice(0, 4)
  const discoverCardImageSrc = activeProfile?.profilePhoto || activeProfile?.photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
  const imagesCount = activeProfile ? (activeProfile.photos?.length || activeProfile.images?.length || (activeProfile.profilePhotos?.length) || (activeProfile.photoList?.length) || (activeProfile.profilePhoto ? 1 : 0)) : 0
  const bioLong = (activeProfile?.bio || '').length > 220

  const compatibilityData = useMemo(() => {
    if (!activeProfile || !currentUser) return { score: 0, reasons: [] }
    if (currentUser.id && activeProfile.id && currentUser.id === activeProfile.id) {
      return { score: 100, reasons: ['This is your profile'] }
    }
    try {
      return calculateCompatibility(currentUser, activeProfile)
    } catch (error) {
      return { score: 0, reasons: [] }
    }
  }, [activeProfile, currentUser])

  useEffect(() => {
    if (!activeProfile) {
      setCardReady(true)
      return
    }

    if (!discoverCardImageSrc) {
      setCardReady(true)
      return
    }

    setCardReady(false)

    const img = new Image()
    img.src = discoverCardImageSrc
    img.onload = () => setCardReady(true)
    img.onerror = () => setCardReady(true)
  }, [activeProfile?.id, discoverCardImageSrc])

  const matchPct = compatibilityData.score
  const compatibilityReasons = compatibilityData.reasons.slice(0, 4)

  const previewCompatibilityData = useMemo(() => {
    if (!previewProfile || !currentUser) return { score: 0, reasons: [] }
    if (currentUser.id && previewProfile.id && currentUser.id === previewProfile.id) {
      return { score: 100, reasons: ['This is your profile'] }
    }
    try {
      return calculateCompatibility(currentUser, previewProfile)
    } catch (error) {
      return { score: 0, reasons: [] }
    }
  }, [previewProfile, currentUser])

  const previewMatchPct = previewCompatibilityData.score
  const previewCompatibilityReasons = previewCompatibilityData.reasons.slice(0, 4)
  const previewPhotos = useMemo(() => getProfilePhotos(previewProfile), [previewProfile])
  const previewInterests = useMemo(() => normalizeInterests(previewProfile?.interests), [previewProfile])

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: (direction) => ({ opacity: 0, x: direction * 520, scale: 0.94, rotate: direction * 8 }),
  }

  const activeFilterCount = useMemo(() => {
    const count = [
      appliedFilters.college,
      appliedFilters.branch,
      appliedFilters.year,
      appliedFilters.gender && appliedFilters.gender !== 'Any' ? appliedFilters.gender : null,
      appliedFilters.lookingFor,
      appliedFilters.interests?.length ? appliedFilters.interests.length : null,
      appliedFilters.onlyVerified ? 'verified' : null,
      appliedFilters.onlineNow ? 'online' : null
    ].filter(Boolean).length
    return count
  }, [appliedFilters])

  const removeFilterChip = (chip) => {
    if (chip.startsWith('College:')) {
      setAppliedFilters((prev) => ({ ...prev, college: '' }))
      return
    }
    if (chip.startsWith('Branch:')) {
      setAppliedFilters((prev) => ({ ...prev, branch: '' }))
      return
    }
    if (chip.startsWith('Year')) {
      setAppliedFilters((prev) => ({ ...prev, year: '' }))
      return
    }
    if (chip.startsWith('Gender:')) {
      setAppliedFilters((prev) => ({ ...prev, gender: 'Any' }))
      return
    }
    if (chip.startsWith('Looking for:')) {
      setAppliedFilters((prev) => ({ ...prev, lookingFor: '' }))
      return
    }
    if (chip.startsWith('Interests:')) {
      setAppliedFilters((prev) => ({ ...prev, interests: [] }))
      return
    }
    if (chip === 'Verified only') {
      setAppliedFilters((prev) => ({ ...prev, onlyVerified: false }))
      return
    }
    if (chip === 'Online now') {
      setAppliedFilters((prev) => ({ ...prev, onlineNow: false }))
      return
    }
  }

  const activeFilterChips = useMemo(() => {
    const chips = []
    if (appliedFilters.college) chips.push(`College: ${appliedFilters.college}`)
    if (appliedFilters.branch) chips.push(`Branch: ${appliedFilters.branch}`)
    if (appliedFilters.year) chips.push(`Year ${appliedFilters.year}`)
    if (appliedFilters.gender && appliedFilters.gender !== 'Any') chips.push(`Gender: ${appliedFilters.gender}`)
    if (appliedFilters.lookingFor) chips.push(`Looking for: ${appliedFilters.lookingFor}`)
    if (appliedFilters.interests?.length) chips.push(`Interests: ${appliedFilters.interests.join(', ')}`)
    if (appliedFilters.onlyVerified) chips.push('Verified only')
    if (appliedFilters.onlineNow) chips.push('Online now')
    return chips
  }, [appliedFilters])

  if (!hasLoaded || !activeProfile || !cardReady) {
    return (
      <div className="animate-fade-in h-full bg-[#080A14] text-white overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(124,92,255,0.14), transparent 22%), radial-gradient(circle at bottom right, rgba(159,122,234,0.10), transparent 18%)' }}>
        <div className="h-full mx-auto flex w-full max-w-[1080px] flex-col items-center justify-center px-4 py-6 sm:px-6">
          <div className="mb-4 flex w-full max-w-[680px] justify-end">
            <div className="h-10 w-32 animate-pulse rounded-full bg-[#111429]" />
          </div>
          <div className="w-full max-w-[680px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0B1021]/60 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.48)] backdrop-blur-3xl">
            <div className="h-[560px] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#0B1021]/80 to-[#070810]/70">
              <div className="h-[380px] w-full animate-pulse bg-slate-800" />
              <div className="p-6">
                <div className="h-6 w-48 animate-pulse rounded-full bg-slate-800" />
                <div className="mt-3 h-4 w-32 animate-pulse rounded-full bg-slate-800" />
                <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in h-full bg-[#080A14] text-white overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(124,92,255,0.14), transparent 22%), radial-gradient(circle at bottom right, rgba(159,122,234,0.10), transparent 18%)' }}>
      <div className="h-full mx-auto flex w-full max-w-[1080px] flex-col items-center justify-center px-4 py-6 sm:px-6">
        <div className="mb-4 flex w-full max-w-[680px] justify-end">
          <motion.button
            type="button"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/30 bg-[#0f1220]/80 px-4 py-2 text-sm font-semibold text-[#EDE8FF] shadow-[0_12px_30px_rgba(124,92,255,0.16)] backdrop-blur"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#A78BFA]" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-[#7C5CFF] px-2 py-0.5 text-[11px] font-semibold text-white">{activeFilterCount}</span>
            )}
          </motion.button>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="mb-4 flex w-full max-w-[680px] flex-wrap gap-2">
            {activeFilterChips.map((chip) => (
              <FilterChip key={chip} label={chip} onRemove={() => removeFilterChip(chip)} />
            ))}
          </div>
        )}
        {loading ? (
          <div className="w-full max-w-[680px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0B1021]/60 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.48)] backdrop-blur-3xl">
            <div className="h-[560px] overflow-hidden rounded-[28px] bg-gradient-to-b from-[#0B1021]/80 to-[#070810]/70">
              <div className="h-[380px] w-full animate-pulse bg-slate-800" />
              <div className="p-6">
                <div className="h-6 w-48 animate-pulse rounded-full bg-slate-800" />
                <div className="mt-3 h-4 w-32 animate-pulse rounded-full bg-slate-800" />
                <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-slate-800" />
              </div>
            </div>
          </div>
        ) : data.content.length === 0 ? (
          <div className="w-full max-w-[640px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0B1021]/95 p-8 text-center text-[#A1A1AA] shadow-[0_40px_90px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFF]/10 to-[#9F7AEA]/8 text-3xl shadow-lg">✨</div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">You're all caught up</h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#D8D4FF]">Check back later for new students.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button onClick={goPrev} disabled={page===0} className="btn-secondary min-w-[150px] rounded-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
              <button onClick={goNext} disabled={page >= (data.totalPages-1)} className="btn-secondary min-w-[150px] rounded-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50">Next</button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[680px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProfile.id}
                custom={swipeDirection}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onClick={() => openProfilePreview(activeProfile)}
                className="overflow-hidden rounded-[30px] border border-white/8 bg-[rgba(10,12,20,0.55)] shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur-3xl transition-transform duration-300 hover:-translate-y-1"
                style={{ maxWidth: 700 }}
              >
                <div className="relative h-[560px]">
                  <div className="relative h-[400px] overflow-hidden bg-[#0f1220] rounded-t-[30px]">
                    <img
                      src={discoverCardImageSrc}
                      alt={`${activeProfile.fullName} profile`}
                      className="h-full w-full object-cover"
                    />
                    {todayPickId && String(activeProfile.id) === String(todayPickId) && (
                      <div
                        title="Recommended for you based on your profile."
                        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/40 bg-[#F59E0B]/15 px-3 py-1.5 text-[12px] font-semibold text-[#FDE68A] shadow-[0_8px_24px_rgba(245,158,11,0.22)] backdrop-blur"
                      >
                        <span className="text-sm">⭐</span>
                        <span>Today&apos;s Pick</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,10,20,0.9)] via-[rgba(8,10,20,0.45)] to-transparent" />

                    {/* Compatibility badge top-left */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setShowCompatibility((prev) => !prev)
                      }}
                      className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#0f1220]/70 px-3 py-2 text-sm font-semibold text-white border border-white/6 shadow-md"
                    >
                      <span className="text-lg leading-none">✦</span>
                      <span className="text-sm">{matchPct}% compatible</span>
                    </button>

                    {/* Carousel indicators top-center */}
                    {imagesCount > 1 && (
                      <div className="absolute left-1/2 top-4 -translate-x-1/2 flex items-center gap-2">
                        {Array.from({ length: imagesCount }).map((_, i) => (
                          <span key={i} className={`h-2 w-2 rounded-full ${i===0 ? 'bg-white' : 'bg-white/30'}`} />
                        ))}
                      </div>
                    )}

                    {/* Online indicator top-right */}
                    <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#0d1224]/80 px-3 py-2 text-xs font-semibold text-[#D7D2F1] border border-white/6">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.08)]" />
                      Online
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        openProfilePreview(activeProfile)
                      }}
                      className="absolute right-4 top-16 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0f1220]/70 px-3 py-2 text-sm font-semibold text-[#EDE8FF] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur"
                    >
                      <Eye className="h-4 w-4 text-[#A78BFA]" />
                      Preview
                    </button>
                  </div>

                  {/* Floating info panel attached to bottom of photo */}
                  <div className="absolute left-6 right-6 -bottom-10">
                    <div className="rounded-[30px] border border-white/8 bg-[rgba(7,9,16,0.55)] p-6 backdrop-blur-xl shadow-[0_24px_60px_rgba(15,23,42,0.5)]">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <h1 className="truncate text-[30px] font-bold text-white">{activeProfile.fullName}</h1>
                            <span className="rounded-full bg-[#7C5CFF]/12 px-3 py-1 text-sm font-semibold text-[#EDE8FF]">{activeProfile.age || '—'}</span>
                            <VerifiedBadge user={activeProfile} className="ml-1" />
                          </div>
                          <div className="mt-4 flex items-center gap-4 text-[15px] text-[#B9B4D7]">
                            <span className="truncate">{activeProfile.branch || 'Unknown course'}{activeProfile.year ? ` · Year ${activeProfile.year}` : ''}</span>
                            <span className="truncate">· {activeProfile.college || 'Unknown college'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {interests.length > 0 ? interests.slice(0, 5).map((interest, index) => (
                          <span key={index} className="flex items-center gap-2 rounded-full bg-[rgba(124,92,255,0.16)] px-3 py-1.5 text-[14px] font-medium text-white">{interest}</span>
                        )) : (
                          <span className="rounded-full bg-white/5 px-3 py-1.5 text-sm font-medium text-[#A1A1AA]">No interests listed</span>
                        )}
                      </div>

                      <div className="mt-6 relative text-[15px] text-[#D8D4FF]">
                        <div style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: bioExpanded ? '100' : 3, WebkitBoxOrient: 'vertical' }}>
                          <p>{activeProfile.bio || 'A thoughtful campus explorer seeking meaningful campus connections.'}</p>
                        </div>
                        {!bioExpanded && bioLong && (
                          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-[rgba(7,9,16,0.55)] to-transparent" />
                        )}
                        {bioLong && (
                          <button onClick={(event) => {
                            event.stopPropagation()
                            setBioExpanded((s) => !s)
                          }} className="mt-3 text-sm font-semibold text-[#9F7AEA]">{bioExpanded ? 'Show less' : 'Read more'}</button>
                        )}
                      </div>

                      <div className="mt-5">
                        {showCompatibility ? (
                          <CompatibilityBreakdown currentUser={currentUser} otherUser={activeProfile} score={matchPct} defaultOpen />
                        ) : (
                          <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-white">Why you&apos;re compatible</p>
                              <span className="text-xs font-medium text-[#A78BFA]">{matchPct}%</span>
                            </div>
                            <ul className="mt-3 space-y-2">
                              {compatibilityReasons.length > 0 ? (
                                compatibilityReasons.map((reason, index) => (
                                  <li key={`${reason}-${index}`} className="flex items-center gap-2 text-sm text-[#D8D4FF]">
                                    <span className="text-[#7C5CFF]">✔</span>
                                    <span>{reason}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-sm text-[#A1A1AA]">We’ll compare your profile details once enough matching data is available.</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex items-center gap-3 text-[15px] text-[#B9B4D7]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s8-4.5 8-10.5S15.866 3 12 3 4 6 4 10.5 12 21 12 21z" />
                        </svg>
                        <span className="truncate">{activeProfile.location || activeProfile.city || activeProfile.town || 'Location unavailable'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary action area (centered) */}
                <div className="mt-14 px-6 pb-8 flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleSkip(activeProfile)
                    }}
                    disabled={isAnimating}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111827] text-2xl font-semibold text-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
                    aria-label="Skip profile"
                  >
                    ✕
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleLike(activeProfile)
                    }}
                    disabled={isAnimating}
                    className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#9F7AEA] text-3xl text-white shadow-[0_30px_60px_rgba(124,92,255,0.28)] transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Like profile"
                  >
                    ❤
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-[#A1A1AA]">
              <button onClick={goPrev} disabled={page===0} className="btn-secondary rounded-full px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
              <button onClick={goNext} disabled={page >= (data.totalPages-1)} className="btn-secondary rounded-full px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {previewOpen && previewProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-[#02040A]/85 px-3 py-5 backdrop-blur-xl sm:px-6 sm:py-6"
            onClick={closeProfilePreview}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="mx-auto flex min-h-full w-[min(92vw,1560px)] max-w-[1560px] flex-col rounded-[32px] border border-white/10 bg-[#080B14] shadow-[0_40px_140px_rgba(0,0,0,0.45)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A78BFA]">Profile Preview</p>
                  <p className="mt-1 text-sm text-[#AAB0C2]">A read-only look at this profile without leaving Discover.</p>
                </div>
                <button type="button" onClick={closeProfilePreview} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
                <div className="grid gap-8 lg:grid-cols-[0.6fr_0.4fr] lg:gap-8">
                  <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0B0F1F]/80 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                    <div className="relative h-[340px] sm:h-[460px]">
                      <img
                        src={previewProfile.profilePhoto || previewProfile.photo || previewProfile.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                        alt={previewProfile.fullName}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090B14]/95 via-[#090B14]/45 to-transparent" />
                      <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                        <div className="rounded-full border border-white/10 bg-[#111827]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#D8D4FF]">CampusConnect</div>
                        <div className="rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/15 px-3 py-1 text-sm font-semibold text-[#EDE8FF]">{previewMatchPct}%</div>
                      </div>
                      <div className="absolute bottom-6 left-5 right-5">
                        <h3 className="text-3xl font-semibold text-white">{previewProfile.fullName}</h3>
                        <p className="mt-2 text-sm text-[#D8D4FF]">{previewProfile.college || 'College'} • {previewProfile.branch || 'Branch'} • {previewProfile.year ? `Year ${previewProfile.year}` : 'Year unknown'}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {previewInterests.slice(0, 6).map((interest, index) => (
                            <span key={`${interest}-${index}`} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-[#F8FAFC]">{interest}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-2 text-lg font-semibold text-white">
                        <Sparkles className="h-5 w-5 text-[#A78BFA]" />
                        <span>About</span>
                      </div>
                      <p className="mt-4 text-[15px] leading-8 text-[#D8D4FF]">{previewProfile.bio || 'A thoughtful campus explorer looking for meaningful connections.'}</p>
                      <div className="mt-6 flex items-center gap-2 text-[#B9B4D7]">
                        <MapPin className="h-4 w-4 text-[#A78BFA]" />
                        <span>{previewProfile.location || previewProfile.city || previewProfile.town || 'Location unavailable'}</span>
                      </div>
                    </div>
                  </section>

                  <div className="space-y-6">
                    <section className="w-full rounded-[28px] border border-white/10 bg-[#0B0F1F]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-xl font-semibold text-white">Gallery</h4>
                        <span className="text-sm text-[#A1A1AA]">{previewPhotos.length} photos</span>
                      </div>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {previewPhotos.length > 0 ? (
                          previewPhotos.slice(0, 6).map((photo, index) => (
                            <button
                              key={`${photo}-${index}`}
                              type="button"
                              onClick={() => openPreviewPhotoViewer(index)}
                              className="overflow-hidden rounded-[20px] border border-white/10 bg-[#111827]"
                            >
                              <img src={photo} alt={`Photo ${index + 1}`} className="h-32 w-full object-cover transition hover:scale-105" />
                            </button>
                          ))
                        ) : (
                          <div className="col-span-full rounded-[20px] border border-dashed border-white/10 bg-[#111827]/70 p-6 text-center text-sm text-[#A9ABC1]">No photos available yet.</div>
                        )}
                      </div>
                    </section>

                    <section className="w-full rounded-[28px] border border-white/10 bg-[#0B0F1F]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
                      <h4 className="text-xl font-semibold text-white">Why you match</h4>
                      <ul className="mt-4 space-y-3">
                        {previewCompatibilityReasons.length > 0 ? (
                          previewCompatibilityReasons.map((reason, index) => (
                            <li key={`${reason}-${index}`} className="flex items-start gap-2 text-sm text-[#D8D4FF]">
                              <span className="mt-1 text-[#7C5CFF]">✔</span>
                              <span>{reason}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-[#A1A1AA]">Compatibility insights will appear as more profile details are shared.</li>
                        )}
                      </ul>
                    </section>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 border-t border-white/10 px-4 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleSkip(previewProfile)
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111827] text-2xl font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.55)] transition-transform duration-200 hover:scale-105 active:scale-95"
                  aria-label="Skip profile"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleLike(previewProfile)
                  }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#9F7AEA] text-3xl text-white shadow-[0_30px_60px_rgba(124,92,255,0.28)] transition-transform duration-200 hover:scale-105 active:scale-95"
                  aria-label="Like profile"
                >
                  ❤
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PhotoViewerModal
        open={previewPhotoViewerOpen}
        photos={previewPhotos}
        currentIndex={previewPhotoIndex}
        onClose={closePreviewPhotoViewer}
        onPrev={goPrevPreviewPhoto}
        onNext={goNextPreviewPhoto}
      />

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialFilters={filters}
        activeCount={activeFilterCount}
        onApply={(nextFilters) => {
          setFilters(nextFilters)
          setAppliedFilters(nextFilters)
        }}
      />

      <AnimatePresence>
        {celebrationOpen && celebrationProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#03040A]/90 px-4 py-6 backdrop-blur-xl"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#7C5CFF]/30 blur-[120px]" />
              <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-[#9F7AEA]/20 blur-[120px]" />
              {Array.from({ length: 24 }).map((_, index) => (
                <motion.span
                  key={index}
                  className="absolute left-1/2 top-0 h-2.5 w-1.5 rounded-full bg-[#FDE68A]"
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: [0, (index % 2 === 0 ? 1 : -1) * (18 + (index % 5) * 14)],
                    y: [0, 220 + (index % 6) * 24],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 2.1, ease: 'easeOut', delay: index * 0.01 }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[34px] border border-white/10 bg-[rgba(7,9,16,0.9)] p-8 shadow-[0_40px_140px_rgba(124,92,255,0.18)]"
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#7C5CFF]/15 to-transparent" />
              <div className="relative text-center">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/30 bg-[#121729]/90 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#D8D4FF]">
                  <span className="text-base">🎉</span>
                  It&apos;s a Match!
                </motion.div>

                <div className="mt-7 flex items-center justify-center gap-4 sm:gap-8">
                  <motion.div initial={{ x: -120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="flex flex-col items-center">
                    <img
                      src={currentUser?.profilePhoto || currentUser?.photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                      alt="Your profile"
                      className="h-28 w-28 rounded-[24px] border border-white/10 object-cover shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:h-32 sm:w-32"
                    />
                    <p className="mt-3 text-sm font-semibold text-white">You</p>
                  </motion.div>

                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }} className="text-4xl text-[#D8D4FF]">♥</motion.div>

                  <motion.div initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="flex flex-col items-center">
                    <img
                      src={celebrationProfile.profilePhoto || celebrationProfile.photo || celebrationProfile.image || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'}
                      alt={celebrationProfile.fullName}
                      className="h-28 w-28 rounded-[24px] border border-white/10 object-cover shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:h-32 sm:w-32"
                    />
                    <p className="mt-3 text-sm font-semibold text-white">{celebrationProfile.fullName}</p>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">Compatibility</p>
                      <p className="mt-1 text-sm text-[#D8D4FF]">You both like:</p>
                    </div>
                    <div className="rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-3 py-2 text-sm font-semibold text-[#EDE8FF]">
                      {celebrationDetails.matchPercentage}%
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {celebrationDetails.sharedInterests.map((interest) => (
                      <span key={interest} className="rounded-full border border-white/10 bg-[#111429] px-3 py-1.5 text-sm text-[#F8FAFC]">• {interest}</span>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <motion.button
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSendMessage}
                    className="rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#9F7AEA] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(124,92,255,0.25)]"
                  >
                    💬 Send Message
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleKeepSwiping}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-[#EDE8FF]"
                  >
                    Keep Swiping
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

