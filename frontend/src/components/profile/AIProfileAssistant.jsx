import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Copy, Check, Wand2, X } from 'lucide-react'

const buildMockSuggestions = (bio = '') => {
  const trimmed = (bio || '').trim()
  const base = trimmed || 'I like coding, music, and meaningful conversations.'

  return [
    {
      title: 'Version 1',
      text: `${base} I’m someone who enjoys discovering new ideas, building genuine connections, and making everyday moments feel a little more memorable.`,
    },
    {
      title: 'Version 2',
      text: `Curious, upbeat, and always open to great conversations. ${base} I enjoy meeting people who are thoughtful, fun, and genuinely themselves.`,
    },
    {
      title: 'Version 3',
      text: `${base} I’m passionate about growth, creativity, and connecting with people who bring good energy and interesting perspectives.`,
    },
  ]
}

export default function AIProfileAssistant({ open, onClose, currentBio, onApply }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const memoizedBio = useMemo(() => currentBio || '', [currentBio])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const timer = window.setTimeout(() => {
      setSuggestions(buildMockSuggestions(memoizedBio))
      setLoading(false)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [open, memoizedBio])

  const handleRefresh = () => {
    setLoading(true)
    window.setTimeout(() => {
      setSuggestions(buildMockSuggestions(memoizedBio))
      setLoading(false)
    }, 250)
  }

  const handleCopy = async (text) => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(text)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#090B14]/80 px-4 py-6 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/10 bg-[#0B0F1E]/95 shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-7">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#A78BFA]">
                <Sparkles className="h-4 w-4" />
                AI Profile Assistant
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">✨ AI Profile Assistant</h2>
              <p className="mt-2 text-sm leading-6 text-[#C4C7D1]">
                Make your profile more engaging while staying true to your personality.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-[#D8D4FF] transition hover:border-[#7C5CFF]/30 hover:bg-[#7C5CFF]/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 py-6 sm:px-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="rounded-full border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-3 py-1 text-sm text-[#D8D4FF]">
                Based on your current bio
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/20 bg-[#12162A] px-3 py-2 text-sm font-medium text-[#EDE8FF] transition hover:border-[#7C5CFF]/50 hover:shadow-[0_0_0_1px_rgba(124,92,255,0.15)]"
              >
                <Wand2 className="h-4 w-4" />
                Refresh
              </button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-24 animate-pulse rounded-[20px] border border-white/10 bg-white/5" />
                  ))}
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <motion.div
                    key={`${suggestion.title}-${index}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.06 }}
                    className="rounded-[20px] border border-white/10 bg-[#111827]/85 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{suggestion.title}</p>
                        <p className="mt-2 text-sm leading-7 text-[#D8D4FF]">“{suggestion.text}”</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(suggestion.text)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/20 bg-[#1B1434] px-3 py-2 text-xs font-semibold text-[#EDE8FF] transition hover:border-[#7C5CFF]/40"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => onApply(suggestion.text)}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                        >
                          Use This
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
