import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const reactions = ['❤️', '😂', '👍', '😮', '😢', '🔥']

export default function MessageReaction({ messageId, onReact }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('')

  const handleSelect = (emoji) => {
    setSelected(emoji)
    onReact?.(messageId, emoji)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-white/10 bg-[#0b0d17]/70 px-2 py-1 text-[11px] text-[#D8D4FF] transition hover:bg-[#141830]"
      >
        +
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute bottom-8 left-0 z-10 flex gap-1 rounded-full border border-white/10 bg-[#0f1428] p-1 shadow-lg"
          >
            {reactions.map((emoji) => (
              <button key={emoji} type="button" onClick={() => handleSelect(emoji)} className="rounded-full px-2 py-1 text-sm transition hover:bg-white/10">
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {selected && <span className="ml-2 text-sm">{selected}</span>}
    </div>
  )
}
