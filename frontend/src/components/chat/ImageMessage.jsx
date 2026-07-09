import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function ImageMessage({ src, alt = 'Image message' }) {
  const [viewerOpen, setViewerOpen] = useState(false)

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={() => setViewerOpen(true)}
        className="mt-3 overflow-hidden rounded-[20px] border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-bg)' }}
      >
        <img src={src} alt={alt} className="max-h-64 w-full object-cover" />
      </motion.button>

      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-3 py-5 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(2,6,23,0.8)' }}
            onClick={() => setViewerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" onClick={() => setViewerOpen(false)} className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(15,23,42,0.72)', color: 'var(--surface-elevated)' }}>
                <X className="h-5 w-5" />
              </button>
              <img src={src} alt={alt} className="max-h-[80vh] w-full rounded-[24px] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
