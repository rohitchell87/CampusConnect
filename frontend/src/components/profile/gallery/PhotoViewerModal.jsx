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
        className="fixed inset-0 z-[60] flex items-center justify-center bg-[#06070d]/85 px-3 py-4 backdrop-blur-xl"
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
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0b0f1e]/80 text-white shadow-lg transition hover:border-[#7C5CFF]/40 hover:bg-[#14182c]"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#090b14] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-[#D8D4FF] sm:px-5">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[#A78BFA]" />
                <span>{currentIndex + 1} / {photos.length}</span>
              </div>
              <span className="text-[#A1A1AA]">Fullscreen view</span>
            </div>

            <div className="relative flex items-center justify-center bg-[#06070d] p-3 sm:p-6">
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={onPrev}
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0b0f1e]/80 text-white shadow-lg transition hover:border-[#7C5CFF]/40 hover:bg-[#14182c]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0b0f1e]/80 text-white shadow-lg transition hover:border-[#7C5CFF]/40 hover:bg-[#14182c]"
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
