import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function IllustratedEmptyState({
  icon: Icon,
  title,
  subtitle,
  buttonLabel,
  href,
  onClick,
  className = '',
}) {
  const buttonContent = (
    <>
      {buttonLabel}
      <ArrowRight className="h-4 w-4" />
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`rounded-[28px] border border-[color:var(--border-primary)] bg-[color:var(--surface-elevated)]/90 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-3xl ${className}`}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[color:var(--accent)]/20 via-[color:var(--accent-secondary)]/12 to-[color:var(--accent-secondary)]/10 text-[color:var(--accent-secondary)] ring-1 ring-[color:var(--border-primary)]">
        {Icon ? <Icon className="h-10 w-10" /> : null}
      </div>

      <div className="mx-auto mt-6 h-2.5 w-24 rounded-full bg-gradient-to-r from-[color:var(--accent)]/0 via-[color:var(--accent)]/40 to-[color:var(--accent)]/0" />
      <h2 className="mt-6 text-2xl font-semibold text-[color:var(--text-primary)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[color:var(--text-secondary)]">{subtitle}</p>

      {buttonLabel && (href || onClick) ? (
        <div className="mt-7 flex justify-center">
          {href ? (
            <Link
              to={href}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              {buttonContent}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClick}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              {buttonContent}
            </button>
          )}
        </div>
      ) : null}
    </motion.div>
  )
}
