import React, { useMemo, useState } from 'react'
import { X, School, ShieldCheck, Upload, Sparkles, CheckCircle2, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { approveVerification, submitVerificationRequest, VERIFICATION_STATUSES } from './VerificationService'

const steps = [
  {
    title: 'Confirm your student identity',
    description: 'We’ll verify that you’re an active campus student using your college details.',
    icon: School,
  },
  {
    title: 'Upload proof of enrollment',
    description: 'Add a student ID, fee receipt, or admission letter for review.',
    icon: Upload,
  },
  {
    title: 'Review and secure your profile',
    description: 'We’ll protect your profile with a verified badge once your documents are approved.',
    icon: ShieldCheck,
  },
]

export default function VerificationModal({ open, onClose, user, onStatusChange }) {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [developerMode, setDeveloperMode] = useState(false)

  const currentStatus = useMemo(() => {
    if (!user) return 'Not Verified'
    const stored = localStorage.getItem('campusconnect_verification_state')
    if (!stored) return 'Not Verified'
    try {
      const parsed = JSON.parse(stored)
      const key = String(user.id || user.userId || user.email || 'self')
      return parsed?.statuses?.[key] || 'Not Verified'
    } catch (error) {
      return 'Not Verified'
    }
  }, [user, open])

  if (!open) return null

  const handleSubmit = async () => {
    if (!user) return

    setSubmitting(true)
    try {
      submitVerificationRequest(user)
      toast.success('Verification request submitted')
      onStatusChange?.('Verification Pending')
      onClose()
    } catch (error) {
      toast.error('Unable to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApprove = async () => {
    if (!user) return
    try {
      approveVerification(user)
      toast.success('Verification approved for demo purposes')
      onStatusChange?.('Verified Student')
      onClose()
    } catch (error) {
      toast.error('Unable to approve verification')
    }
  }

  const currentStep = steps[step]
  const StepIcon = currentStep.icon

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#05070D]/80 px-4 py-6 backdrop-blur-xl">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0F1324] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#8B5CF6]">Student verification</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Secure your campus profile</h3>
            <p className="mt-2 text-sm text-[#A8A8B8]">This flow is mock-only and designed to be easy to replace with a real backend later.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-[#E5E7EB] transition hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-[22px] border border-white/10 bg-[#161A2D] p-5">
          <div className="flex items-center justify-between text-sm text-[#D8D4FF]">
            <span className="font-medium">Current status</span>
            <span className="rounded-full bg-[#2563EB]/15 px-3 py-1 text-[12px] font-semibold text-[#DBEAFE]">{currentStatus}</span>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-white/10 bg-[#0E1222] p-4">
            <div className="rounded-full bg-[#2563EB]/15 p-2 text-[#60A5FA]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{currentStep.title}</p>
              <p className="text-sm text-[#A8A8B8]">{currentStep.description}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {steps.map((item, index) => {
              const Icon = item.icon
              const active = index === step
              return (
                <div key={item.title} className={`rounded-[16px] border p-3 ${active ? 'border-[#7C5CFF] bg-[#1B1434]' : 'border-white/10 bg-[#0E1222]'}`}>
                  <div className={`mb-2 inline-flex rounded-full p-2 ${active ? 'bg-[#7C5CFF]/20 text-[#D8D4FF]' : 'bg-white/5 text-[#A8A8B8]'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-[18px] border border-dashed border-[#7C5CFF]/30 bg-[#0E1222] p-4 text-sm text-[#D8D4FF]">
            <p className="font-semibold text-white">Mock document upload</p>
            <p className="mt-2 text-[#A8A8B8]">Choose a document to simulate a verification submission. The badge appears instantly after approval.</p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2563EB]/15 px-3 py-2 text-sm font-semibold text-[#DBEAFE]">
              <Upload className="h-4 w-4" />
              Upload student ID
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep((prev) => Math.max(0, prev - 1))} disabled={step === 0} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#E5E7EB] disabled:cursor-not-allowed disabled:opacity-50">Back</button>
            <button type="button" onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))} className="rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-4 py-2 text-sm font-semibold text-[#D8D4FF]">Next</button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {developerMode && (
              <button type="button" onClick={handleApprove} className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200">
                <UserCheck className="h-4 w-4" />
                Approve (dev)
              </button>
            )}
            <button type="button" onClick={() => setDeveloperMode((prev) => !prev)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-[#E5E7EB]">{developerMode ? 'Dev on' : 'Dev mode'}</button>
            <button type="button" onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C5CFF] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              <CheckCircle2 className="h-4 w-4" />
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
