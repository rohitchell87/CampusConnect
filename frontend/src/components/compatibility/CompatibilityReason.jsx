import React from 'react'
import { motion } from 'framer-motion'

export default function CompatibilityReason({ icon, title, detail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-[16px] border border-white/10 bg-[#0F1426]/80 p-3"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-lg">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-[#F8FAFC]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[#A9ABC1]">{detail}</p>
        </div>
      </div>
    </motion.div>
  )
}
