import React, { useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'

export default function ConversationSuggestion({ suggestion, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(suggestion.text)
    }
    setCopied(true)
    onCopy?.(suggestion.text)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-[20px] border p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-bg)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl text-lg chat-accent" style={{ backgroundColor: 'rgba(124,92,255,0.12)' }}>
            {suggestion.icon || '✨'}
          </div>
          <div>
            <p className="text-sm font-semibold chat-secondary">{suggestion.title}</p>
            <p className="mt-2 text-sm leading-6 chat-secondary">“{suggestion.text}”</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition hover:border-[var(--accent)]"
          style={{ borderColor: 'rgba(124,92,255,0.2)', backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
