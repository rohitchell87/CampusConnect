import React from 'react'
import { motion } from 'framer-motion'

export default function FilterSection({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-[#94A3B8]">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  )
}
