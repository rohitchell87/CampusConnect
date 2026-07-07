import React, { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, RefreshCw, Sparkles, Trash2, UploadCloud, X } from 'lucide-react'
import profileService from '../../services/profileService'
import { AuthContext } from '../../context/AuthContext'
import AIProfileAssistant from '../../components/profile/AIProfileAssistant'
import toast from 'react-hot-toast'

function PhotoUploadCard({ label, description, uploadType, onUpload }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [viewerOpen, setViewerOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    }
  }, [preview])

  useEffect(() => {
    if (!viewerOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setViewerOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewerOpen])

  const openPicker = () => inputRef.current?.click()

  const handleFileSelection = async (selectedFile) => {
    if (!selectedFile) return

    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    const nextPreview = URL.createObjectURL(selectedFile)

    setFile(selectedFile)
    setPreview(nextPreview)
    setError('')
    setProgress(0)
    setIsUploading(true)

    try {
      await onUpload(selectedFile, (percent) => setProgress(percent))
      setProgress(100)
      setIsUploading(false)
    } catch (err) {
      setIsUploading(false)
      setError('Upload failed. Please try again.')
    }
  }

  const handleRetry = () => {
    if (!file) return
    handleFileSelection(file)
  }

  const handleRemove = () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview('')
    setFile(null)
    setIsUploading(false)
    setProgress(0)
    setError('')
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    setIsDragging(false)
    const droppedFile = event.dataTransfer.files?.[0]
    await handleFileSelection(droppedFile)
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={openPicker}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        className={`group relative overflow-hidden rounded-[24px] border bg-[#111827]/85 p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.22)] transition ${
          isDragging ? 'border-[#8B5CF6] bg-[#171c31]' : 'border-dashed border-white/15 hover:border-[#8B5CF6] hover:bg-white/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFileSelection(event.target.files?.[0])}
        />

        {preview ? (
          <>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#0F1425]">
              <img src={preview} alt={label} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04070d]/80 via-[#04070d]/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setViewerOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1428]/90 px-3 py-2 text-xs font-semibold text-white backdrop-blur"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    openPicker()
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1428]/90 px-3 py-2 text-xs font-semibold text-white backdrop-blur"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleRemove()
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1428]/90 px-3 py-2 text-xs font-semibold text-white backdrop-blur"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-[250px] flex-col items-center justify-center">
            <motion.div
              animate={isDragging ? { y: [0, -4, 0], scale: [1, 1.03, 1] } : { y: [0, -4, 0], scale: [1, 1.01, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#8B5CF6]/25 bg-[#7C5CFF]/10 text-[#A78BFA]"
            >
              <UploadCloud className="h-8 w-8" />
            </motion.div>
            <div className="mt-5 text-lg font-semibold text-white">{label}</div>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{description}</p>
          </div>
        )}

        {isUploading && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0F1425] p-4 text-left">
            <div className="flex items-center justify-between text-sm text-[#E2E8F0]">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#8B5CF6]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-left text-sm text-rose-200">
            <div className="font-medium">{error}</div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                handleRetry()
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-100"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {viewerOpen && preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#04060e]/85 px-3 py-5 backdrop-blur-xl"
            onClick={() => setViewerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setViewerOpen(false)}
                className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0d1428]/90 text-white shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#090B14] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                <img src={preview} alt={label} className="max-h-[78vh] w-full object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function CompleteProfile() {
  const navigate = useNavigate()
  const { user, setUser, isProfileComplete } = useContext(AuthContext)
  const { register, handleSubmit, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [interests, setInterests] = useState([])
  const [selectedInterests, setSelectedInterests] = useState([])
  const [assistantOpen, setAssistantOpen] = useState(false)
  const currentBio = watch('bio', '')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await profileService.getInterests()
        setInterests(data)
        if (user?.interests) {
          setSelectedInterests(user.interests.map((i) => i.id))
        }
        setValue('fullName', user?.fullName || '')
      } catch (err) {
        toast.error('Failed to load interests')
      }
    }
    load()
  }, [user, setValue])

  const onToggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const completionChecklist = [
    { label: 'Profile Photo', done: Boolean(user?.profilePhoto) },
    { label: 'Cover Photo', done: Boolean(user?.coverPhoto) },
    { label: 'Interests', done: selectedInterests.length > 0 },
    { label: 'Bio', done: Boolean(user?.bio) },
    { label: 'Gallery Photos', done: Boolean(user?.galleryPhotos?.length) }
  ]

  const completionCount = completionChecklist.filter((item) => item.done).length
  const completionPercent = Math.round((completionCount / completionChecklist.length) * 100)

  const handleApplyBio = (bioText) => {
    setValue('bio', bioText, { shouldDirty: true, shouldValidate: true })
    setAssistantOpen(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const profilePayload = {
        fullName: data.fullName,
        college: data.college,
        hometown: data.hometown,
        bio: data.bio,
        height: data.height ? Number(data.height) : null,
        gender: data.gender || null,
        branch: data.branch || null,
        year: data.year ? Number(data.year) : null,
        interestedIn: data.interestedIn || null,
        relationshipIntent: data.relationshipIntent || null,
        workoutHabit: data.workoutHabit || null,
        smokingHabit: data.smokingHabit || null,
        drinkingHabit: data.drinkingHabit || null,
        personalityType: data.personalityType || null,
        lookingFor: data.lookingFor || null
      }
      const profile = await profileService.updateProfile(profilePayload)
      const interestsResponse = await profileService.updateInterests({ interestIds: selectedInterests })
      const updatedProfile = { ...profile, interests: interestsResponse }
      setUser(updatedProfile)
      toast.success('Profile updated')
      if (isProfileComplete(updatedProfile)) {
        navigate('/discover')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Profile save failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut', delay }
    })
  }

  const handlePhotoUpload = async (file, onProgress, uploadType = 'profile') => {
    try {
      const response = uploadType === 'cover'
        ? await profileService.uploadCoverPhoto(file, onProgress)
        : await profileService.uploadProfilePhoto(file, onProgress)

      if (response?.profilePhoto || response?.coverPhoto) {
        toast.success('Photo uploaded')
      }
      return response
    } catch (err) {
      throw err
    }
  }

  return (
    <div className="relative pb-40">
      <div className="mx-auto w-[min(90vw,1500px)] max-w-[1500px] space-y-10 px-4 pt-10 sm:px-6 lg:px-8">
        <motion.section
          initial="hidden"
          animate="visible"
          custom={0}
          variants={sectionVariants}
          className="glass-card overflow-hidden border border-white/10 bg-[#0B0F1E]/90 p-8 shadow-glass"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#A78BFA]">Complete Your Profile</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Complete Your Profile</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#CBD5E1]">
                The more information you add, the better your matches become.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-right text-sm text-[#E2E8F0] shadow-sm backdrop-blur-sm">
              <div className="text-3xl font-semibold text-white">{completionPercent}%</div>
              <div className="mt-1 text-xs uppercase tracking-[0.25em] text-[#A78BFA]">Completion</div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-start lg:gap-8">
            <div className="rounded-[24px] border border-white/10 bg-[#111827]/80 p-6 shadow-[0_28px_70px_-32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">Checklist</span>
                <span className="rounded-full bg-[#161B2A] px-3 py-1 text-xs text-[#D8D4FF]">{completionCount} of 5 done</span>
              </div>
              <div className="space-y-3">
                {completionChecklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 rounded-3xl bg-white/5 px-4 py-3 text-sm text-[#E2E8F0] transition hover:bg-white/10">
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${item.done ? 'bg-[#7C5CFF]' : 'bg-white/5'} text-sm font-semibold text-white`}>
                      {item.done ? '✓' : '○'}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#111827]/80 p-6 shadow-[0_28px_70px_-32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="mb-3 text-sm uppercase tracking-[0.25em] text-[#A78BFA]">Profile progress</div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" style={{ width: `${completionPercent}%` }} />
              </div>
              <div className="mt-3 text-sm text-[#94A3B8]">
                Fill in the essentials and keep your profile polished for better matches.
              </div>
            </div>
          </div>
        </motion.section>

        <form id="complete-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={sectionVariants}
            className="glass-card border border-white/10 bg-[#0B0F1E]/90 p-8 shadow-glass"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-title">👤 Basic Information</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Your essential details</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#C4C7D1]">A clean profile helps you show up in more great matches.</p>
            </div>

            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Full Name</label>
                <input {...register('fullName')} required className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">College</label>
                <input {...register('college')} className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Hometown</label>
                <input {...register('hometown')} className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Branch</label>
                <input {...register('branch')} className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Year</label>
                <input type="number" {...register('year')} className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Age</label>
                <input type="number" {...register('age')} className="input-glass w-full" />
              </div>
              <div className="sm:col-span-2 xl:col-span-1">
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Height</label>
                <input type="number" {...register('height')} className="input-glass w-full" />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={sectionVariants}
            className="glass-card border border-white/10 bg-[#0B0F1E]/90 p-8 shadow-glass"
          >
            <div className="mb-6">
              <p className="section-title">✨ About You</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Tell your story</h2>
            </div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-[#D8D4FF]">Bio</label>
              <button
                type="button"
                onClick={() => setAssistantOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/20 bg-[#0F1326]/90 px-3 py-2 text-xs font-semibold text-[#EDE8FF] shadow-[0_8px_24px_rgba(124,92,255,0.12)] transition hover:-translate-y-0.5 hover:border-[#7C5CFF]/50 hover:shadow-[0_0_0_1px_rgba(124,92,255,0.15)]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#A78BFA]" />
                ✨ Improve with AI
              </button>
            </div>
            <textarea
              {...register('bio')}
              rows={7}
              placeholder="Share a little about what makes you, you..."
              className="input-glass min-h-[220px] w-full resize-none"
            />
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={sectionVariants}
            className="glass-card border border-white/10 bg-[#0B0F1E]/90 p-8 shadow-glass"
          >
            <div className="mb-6">
              <p className="section-title">💜 Lifestyle</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">How you live and connect</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Gender</label>
                <select {...register('gender')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NON_BINARY">Non Binary</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Interested In</label>
                <select {...register('interestedIn')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="EVERYONE">Everyone</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Looking For</label>
                <select {...register('lookingFor')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="DATING">Dating</option>
                  <option value="FRIENDSHIP">Friendship</option>
                  <option value="STUDY_PARTNER">Study partner</option>
                  <option value="HACKATHON_TEAM">Hackathon team</option>
                  <option value="GYM_BUDDY">Gym buddy</option>
                  <option value="GAMING_PARTNER">Gaming partner</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-5 grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Workout Habit</label>
                <select {...register('workoutHabit')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="NEVER">Never</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Smoking Habit</label>
                <select {...register('smokingHabit')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="NO">No</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="YES">Yes</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Drinking Habit</label>
                <select {...register('drinkingHabit')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="NO">No</option>
                  <option value="SOCIALLY">Socially</option>
                  <option value="YES">Yes</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-5 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#D8D4FF]">Personality</label>
                <select {...register('personalityType')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="INTROVERT">Introvert</option>
                  <option value="AMBIVERT">Ambivert</option>
                  <option value="EXTROVERT">Extrovert</option>
                </select>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={sectionVariants}
            className="glass-card border border-white/10 bg-[#0B0F1E]/90 p-8 shadow-glass"
          >
            <div className="mb-6">
              <p className="section-title">🎯 Interests</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Choose what makes you unique</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {interests.map((interest) => {
                const active = selectedInterests.includes(interest.id)
                return (
                  <button
                    type="button"
                    key={interest.id}
                    onClick={() => onToggleInterest(interest.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-[#7C5CFF] text-white shadow-glow'
                        : 'border border-white/10 bg-[#111827]/85 text-[#D8D4FF] hover:border-[#8B5CF6] hover:bg-white/5'
                    }`}
                  >
                    <span>{interest.icon}</span>
                    <span>{interest.name}</span>
                  </button>
                )
              })}
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.5}
            variants={sectionVariants}
            className="glass-card border border-white/10 bg-[#0B0F1E]/90 p-8 shadow-glass"
          >
            <div className="mb-6">
              <p className="section-title">📷 Photos</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Add your profile visuals</h2>
            </div>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <PhotoUploadCard
                label="Profile Photo"
                description="Tap to add a profile photo or drag and drop here."
                uploadType="profile"
                onUpload={(file, onProgress) => handlePhotoUpload(file, onProgress, 'profile')}
              />
              <PhotoUploadCard
                label="Cover Photo"
                description="Tap to add a cover photo or drag and drop here."
                uploadType="cover"
                onUpload={(file, onProgress) => handlePhotoUpload(file, onProgress, 'cover')}
              />
              <PhotoUploadCard
                label="Gallery Photo 1"
                description="Tap to add a gallery photo or drag and drop here."
                uploadType="gallery"
                onUpload={(file, onProgress) => handlePhotoUpload(file, onProgress, 'profile')}
              />
              <PhotoUploadCard
                label="Gallery Photo 2"
                description="Tap to add a gallery photo or drag and drop here."
                uploadType="gallery"
                onUpload={(file, onProgress) => handlePhotoUpload(file, onProgress, 'profile')}
              />
            </div>
          </motion.section>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary px-8 py-4 text-base">
              {loading ? 'Saving...' : 'Save & Continue →'}
            </button>
          </div>
        </form>
      </div>

      <AIProfileAssistant
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        currentBio={currentBio}
        onApply={handleApplyBio}
      />
    </div>
  )
}
