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
        className={`group relative overflow-hidden rounded-[24px] border bg-[color:var(--surface-bg)]/85 p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.22)] transition ${
          isDragging ? 'border-[color:var(--accent-secondary)] bg-[color:var(--surface-elevated)]' : 'border-dashed border-[color:var(--border-primary)] hover:border-[color:var(--accent-secondary)] hover:bg-[color:var(--surface-elevated)]/70'
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[color:var(--surface-elevated)]">
              <img src={preview} alt={label} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bg-primary)]/80 via-[color:var(--bg-primary)]/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setViewerOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 px-3 py-2 text-xs font-semibold text-[color:var(--text-primary)] backdrop-blur"
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
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 px-3 py-2 text-xs font-semibold text-[color:var(--text-primary)] backdrop-blur"
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
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 px-3 py-2 text-xs font-semibold text-[color:var(--text-primary)] backdrop-blur"
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
              className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[color:var(--accent-secondary)]/25 bg-[color:var(--accent)]/10 text-[color:var(--accent-secondary)]"
            >
              <UploadCloud className="h-8 w-8" />
            </motion.div>
            <div className="mt-5 text-lg font-semibold text-[color:var(--text-primary)]">{label}</div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{description}</p>
          </div>
        )}

        {isUploading && (
          <div className="mt-4 rounded-2xl border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] p-4 text-left">
            <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:var(--surface-elevated)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-secondary)]"
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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[color:var(--bg-primary)]/85 px-3 py-5 backdrop-blur-xl"
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
                className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 text-[color:var(--text-primary)] shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="overflow-hidden rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--card-bg)] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
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
          className="glass-card overflow-hidden border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 p-8 shadow-glass"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--accent-secondary)]">Complete Your Profile</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--text-primary)]">Complete Your Profile</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[color:var(--text-secondary)]">
                The more information you add, the better your matches become.
              </p>
            </div>
            <div className="rounded-3xl border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] px-5 py-4 text-right text-sm text-[color:var(--text-secondary)] shadow-sm backdrop-blur-sm">
              <div className="text-3xl font-semibold text-[color:var(--text-primary)]">{completionPercent}%</div>
              <div className="mt-1 text-xs uppercase tracking-[0.25em] text-[color:var(--accent-secondary)]">Completion</div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-start lg:gap-8">
            <div className="rounded-[24px] border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] p-6 shadow-[0_28px_70px_-32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-secondary)]">Checklist</span>
                <span className="rounded-full bg-[color:var(--surface-elevated)] px-3 py-1 text-xs text-[color:var(--text-secondary)]">{completionCount} of 5 done</span>
              </div>
              <div className="space-y-3">
                {completionChecklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 rounded-3xl bg-[color:var(--surface-elevated)]/70 px-4 py-3 text-sm text-[color:var(--text-secondary)] transition hover:bg-[color:var(--surface-elevated)]">
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${item.done ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--surface-bg)]'} text-sm font-semibold text-[color:var(--surface-elevated)]`}>
                      {item.done ? '✓' : '○'}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] p-6 shadow-[0_28px_70px_-32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="mb-3 text-sm uppercase tracking-[0.25em] text-[color:var(--accent-secondary)]">Profile progress</div>
              <div className="h-3 overflow-hidden rounded-full bg-[color:var(--surface-elevated)]">
                <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent-primary)] to-[color:var(--accent-secondary)]" style={{ width: `${completionPercent}%` }} />
              </div>
              <div className="mt-3 text-sm text-[color:var(--text-muted)]">
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
            className="glass-card border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 p-8 shadow-glass"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-title">👤 Basic Information</p>
                <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">Your essential details</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[color:var(--text-secondary)]">A clean profile helps you show up in more great matches.</p>
            </div>

            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Full Name</label>
                <input {...register('fullName')} required className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">College</label>
                <input {...register('college')} className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Hometown</label>
                <input {...register('hometown')} className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Branch</label>
                <input {...register('branch')} className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Year</label>
                <input type="number" {...register('year')} className="input-glass w-full" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Age</label>
                <input type="number" {...register('age')} className="input-glass w-full" />
              </div>
              <div className="sm:col-span-2 xl:col-span-1">
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Height</label>
                <input type="number" {...register('height')} className="input-glass w-full" />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={sectionVariants}
            className="glass-card border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 p-8 shadow-glass"
          >
            <div className="mb-6">
              <p className="section-title">✨ About You</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">Tell your story</h2>
            </div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-[color:var(--text-secondary)]">Bio</label>
              <button
                type="button"
                onClick={() => setAssistantOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-secondary)]/20 bg-[color:var(--surface-bg)] px-3 py-2 text-xs font-semibold text-[color:var(--text-primary)] shadow-[0_8px_24px_rgba(124,92,255,0.12)] transition hover:-translate-y-0.5 hover:border-[color:var(--accent-secondary)]/50 hover:shadow-[0_0_0_1px_rgba(124,92,255,0.15)]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent-secondary)]" />
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
            className="glass-card border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 p-8 shadow-glass"
          >
            <div className="mb-6">
              <p className="section-title">💜 Lifestyle</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">How you live and connect</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Gender</label>
                <select {...register('gender')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NON_BINARY">Non Binary</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Interested In</label>
                <select {...register('interestedIn')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="EVERYONE">Everyone</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Looking For</label>
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
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Workout Habit</label>
                <select {...register('workoutHabit')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="NEVER">Never</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Smoking Habit</label>
                <select {...register('smokingHabit')} className="input-glass w-full appearance-none">
                  <option value="">Select</option>
                  <option value="NO">No</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="YES">Yes</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Drinking Habit</label>
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
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">Personality</label>
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
            className="glass-card border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 p-8 shadow-glass"
          >
            <div className="mb-6">
              <p className="section-title">🎯 Interests</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">Choose what makes you unique</h2>
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
                        ? 'bg-[color:var(--accent)] text-[color:var(--surface-elevated)] shadow-glow'
                        : 'border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-secondary)] hover:bg-[color:var(--surface-elevated)]/70'
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
            className="glass-card border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 p-8 shadow-glass"
          >
            <div className="mb-6">
              <p className="section-title">📷 Photos</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">Add your profile visuals</h2>
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
