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
    <div className="rounded-[20px] border border-white/10 bg-[#111429]/90 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#7C5CFF]/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#7C5CFF]/12 text-lg text-[#A78BFA]">
            {suggestion.icon || '✨'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{suggestion.title}</p>
            <p className="mt-2 text-sm leading-6 text-[#D8D4FF]">“{suggestion.text}”</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFF]/20 bg-[#1B1434] px-3 py-2 text-xs font-semibold text-[#EDE8FF] transition hover:border-[#7C5CFF]/50 hover:shadow-[0_0_0_1px_rgba(124,92,255,0.15)]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
