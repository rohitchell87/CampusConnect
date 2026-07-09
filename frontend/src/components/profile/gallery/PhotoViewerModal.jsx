import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'

export default function PhotoViewerModal({ open, photos, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext?.()
      if (event.key === 'ArrowLeft') onPrev?.()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, onNext, onPrev])

  if (!open || !photos?.length) return null

  const activePhoto = photos[currentIndex] || photos[0]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-[color:var(--bg-primary)]/85 px-3 py-4 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-5xl"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 text-[color:var(--text-primary)] shadow-lg transition hover:border-[color:var(--accent-secondary)]/40 hover:bg-[color:var(--surface-bg)]"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="overflow-hidden rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--card-bg)] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[color:var(--border-primary)] px-4 py-3 text-sm text-[color:var(--text-secondary)] sm:px-5">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[color:var(--accent-secondary)]" />
                <span>{currentIndex + 1} / {photos.length}</span>
              </div>
              <span className="text-[color:var(--text-muted)]">Fullscreen view</span>
            </div>

            <div className="relative flex items-center justify-center bg-[color:var(--surface-bg)] p-3 sm:p-6">
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={onPrev}
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 text-[color:var(--text-primary)] shadow-lg transition hover:border-[color:var(--accent-secondary)]/40 hover:bg-[color:var(--surface-bg)]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/80 text-[color:var(--text-primary)] shadow-lg transition hover:border-[color:var(--accent-secondary)]/40 hover:bg-[color:var(--surface-bg)]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <img
                src={activePhoto}
                alt={`Photo ${currentIndex + 1}`}
                className="max-h-[70vh] w-full max-w-full rounded-[20px] object-contain"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
