import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, ChevronDown } from 'lucide-react'
import { buildCompatibilityInsight } from './CompatibilityService'

export default function CompatibilityBreakdown({ currentUser, otherUser, score, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [insight, setInsight] = useState({ score: score || 0, reasons: [], breakdown: [], summary: '' })

  useEffect(() => {
    const next = buildCompatibilityInsight(currentUser, otherUser)
    setInsight({ ...next, score: score ?? next.score })
  }, [currentUser, otherUser, score])

  return (
    <div className="rounded-[24px] border p-4 shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-glass)' }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-secondary)' }} />
            <span>✨ Why You Match</span>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Here&apos;s what you have in common.</p>
        </div>
        <div className="rounded-full border px-3 py-1 text-sm font-semibold" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>
          {insight.score}%
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
              <div className="rounded-[20px] border border-white/10 bg-[#12162b]/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Compatibility breakdown</p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{insight.summary || 'You share a lot of great energy.'}</p>
                  </div>
                  <div className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{insight.score}%</div>
                </div>

                <div className="mt-4 space-y-3">
                  {insight.breakdown.map((item, index) => (
                    <div key={`${item.label}-${index}`}>
                      <div className="mb-1 flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span>{item.label}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--surface-bg)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 0.6, delay: index * 0.08 }}
                          className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border p-4" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-bg)' }}>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-secondary)' }} />
                  <span>What stands out</span>
                </div>
                <div className="mt-3 space-y-3">
                  {insight.reasons.length > 0 ? insight.reasons.map((reason, index) => (
                    <motion.div
                      key={`${reason.title}-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.06 }}
                      className="rounded-[16px] border p-3" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-bg)' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-lg">{reason.icon}</div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{reason.title}</p>
                          <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{reason.detail}</p>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="rounded-[16px] border border-dashed p-3 text-sm leading-7" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-bg)', color: 'var(--text-muted)' }}>
                      You both have different interests, which could make conversations more interesting.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
