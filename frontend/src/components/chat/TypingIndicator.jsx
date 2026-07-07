import React from 'react'
import { motion } from 'framer-motion'

export default function TypingIndicator({ name = 'Someone' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="mb-3 flex justify-start"
    >
      <div className="rounded-[20px] border border-white/10 bg-[#111429] px-4 py-3 text-sm text-[#D8D4FF] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-2">
          <span>{name} is typing</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.12 }}
                className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
