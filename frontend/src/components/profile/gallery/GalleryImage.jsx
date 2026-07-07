import React from 'react'
import { motion } from 'framer-motion'

export default function GalleryImage({ src, alt, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group aspect-square overflow-hidden rounded-[24px] border border-white/10 bg-[#111827] shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
    >
      <img src={src} alt={alt} className="h-full w-full object-cover transition duration-300 group-hover:brightness-110" />
      <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-transparent transition group-hover:border-[#7C5CFF]/50" />
    </motion.button>
  )
}
