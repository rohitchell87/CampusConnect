import React, { useEffect, useMemo, useState } from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'
import ConversationSuggestion from './ConversationSuggestion'
import conversationStarterService from './conversationStarterService'

export default function ConversationStarter({ profile, match }) {
  const [suggestions, setSuggestions] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const seed = useMemo(() => `${profile?.id || 'me'}-${match?.id || 'match'}`, [profile?.id, match?.id])

  const generateSuggestions = () => {
    const nextSuggestions = conversationStarterService.generateConversationStarters(profile, match, 3)
    setSuggestions(nextSuggestions)
  }

  useEffect(() => {
    generateSuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      generateSuggestions()
      setIsRefreshing(false)
    }, 250)
  }

  if (!profile || !match) return null

  return (
    <div className="mb-5 overflow-hidden rounded-[24px] border p-5 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl" style={{ borderColor: 'rgba(124,92,255,0.2)', backgroundColor: 'var(--surface-bg)' }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl chat-accent" style={{ backgroundColor: 'rgba(124,92,255,0.16)' }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold chat-secondary">✨ AI Conversation Starter</h3>
            <p className="mt-1 text-sm leading-6 chat-secondary">
              Need help breaking the ice? Here are some ideas based on your shared interests.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition hover:border-[var(--accent)]"
          style={{ borderColor: 'rgba(124,92,255,0.2)', backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
        >
          <RotateCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Suggestions
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.text}-${index}`}
            className="animate-[fadeIn_280ms_ease-out]"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <ConversationSuggestion suggestion={suggestion} />
          </div>
        ))}
      </div>
    </div>
  )
}
