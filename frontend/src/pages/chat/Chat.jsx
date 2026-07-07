import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, MessageCircle, Smile, Send, Phone, Video, MoreHorizontal, Copy, MessageSquareText } from 'lucide-react'
import chatService from '../../services/chatService'
import matchesService from '../../services/matchesService'
import { AuthContext } from '../../context/AuthContext'
import ConversationStarter from '../../components/chat/ConversationStarter'
import { subscribeToModerationChanges, isBlockedUser } from '../../components/moderation/ModerationService'
import MessageStatus from '../../components/chat/MessageStatus'
import VerifiedBadge from '../../components/verification/VerifiedBadge'
import { subscribeToVerificationChanges, getVerificationStatus } from '../../components/verification/VerificationService'
import IllustratedEmptyState from '../../components/common/IllustratedEmptyState'
import toast from 'react-hot-toast'

export default function Chat() {
  const { user: currentUser } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const receiverId = searchParams.get('userId')
  const [matches, setMatches] = useState([])
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [sending, setSending] = useState(false)
  const [matchLoading, setMatchLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredMessage, setHoveredMessage] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  const selectedMatch = useMemo(
    () => matches.find((match) => String(match.userId) === String(receiverId)),
    [matches, receiverId]
  )

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches
    return matches.filter((match) =>
      String(match.fullName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(match.branch).toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [matches, searchQuery])

  const title = selectedMatch ? `${selectedMatch.fullName}` : 'Chat'
  const subtitle = selectedMatch?.branch || `${matches.length} matches`

  useEffect(() => {
    loadMatches()
  }, [])

  useEffect(() => {
    if (receiverId) {
      loadConversation(receiverId)
    }
  }, [receiverId])

  useEffect(() => {
    const unsubscribe = subscribeToModerationChanges(() => {
      setMatches((prev) => prev.filter((match) => !isBlockedUser(match.userId || match.id)))
      setMessages((prev) => prev.filter((message) => !isBlockedUser(message.senderId || message.receiverId)))
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const sync = () => {
      setMatches((prev) => prev.map((match) => ({ ...match, verificationStatus: getVerificationStatus(match) })))
    }
    sync()
    return subscribeToVerificationChanges(sync)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
  }, [text])

  useEffect(() => {
    if (!isRecording) return
    const timer = window.setInterval(() => setRecordingSeconds((prev) => prev + 1), 1000)
    return () => window.clearInterval(timer)
  }, [isRecording])

  const loadMatches = async () => {
    setMatchLoading(true)
    setHasLoaded(false)
    try {
      const data = await matchesService.getMatches()
      setMatches(data)
      if (!receiverId && data.length) {
        navigate(`/chat?userId=${data[0].userId}`, { replace: true })
      }
    } catch (err) {
      toast.error('Unable to load matched conversations')
    } finally {
      setMatchLoading(false)
      setHasLoaded(true)
    }
  }

  const loadConversation = async (id) => {
    setLoading(true)
    try {
      const data = await chatService.getConversation(id)
      setMessages(data)
    } catch (err) {
      toast.error('Unable to load conversation')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim() || !receiverId) return

    setSending(true)
    const trimmedText = text.trim()

    try {
      const response = await chatService.sendMessage({
        receiverId: parseInt(receiverId, 10),
        content: trimmedText,
      })
      
      if (response && response.id) {
        setMessages((prev) => [...prev, response])
        setText('')
        
        window.setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
          }
        }, 80)
        
        toast.success('Message sent')
      }
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleEmojiSelect = (emoji) => {
    setText((prev) => `${prev}${emoji}`)
    setEmojiPickerOpen(false)
    textareaRef.current?.focus()
  }

  const handleCopyMessage = (message) => {
    navigator.clipboard?.writeText(message.content || '')
    toast.success('Message copied')
    setHoveredMessage(null)
  }

  const handleMenuAction = (action) => {
    setMenuOpen(false)
    if (action === 'profile') {
      if (selectedMatch?.userId) {
        navigate(`/profile?userId=${selectedMatch.userId}`)
      } else {
        toast.success('Coming soon')
      }
      return
    }
    if (action === 'mute') {
      toast.success('Chat muted')
      return
    }
    if (action === 'clear') {
      toast.info('Clear chat not yet supported with backend')
      return
    }
    if (action === 'delete') {
      toast.info('Delete conversation not yet supported with backend')
      return
    }
    toast.success('Coming soon')
  }

  const toggleRecording = () => {
    if (!receiverId) {
      toast.error('Select a conversation first')
      return
    }
    if (isRecording) {
      setIsRecording(false)
      toast.info('Voice messages not yet supported with backend')
      return
    }
    setRecordingSeconds(0)
    setIsRecording(true)
  }

  const openCallModal = () => {
    setCallModalOpen(true)
  }

  const openVideoModal = () => {
    setVideoModalOpen(true)
  }

  const formatDateSeparator = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const isSameDay = (a, b) => a.toDateString() === b.toDateString()
    if (isSameDay(date, today)) return 'Today'
    if (isSameDay(date, yesterday)) return 'Yesterday'
    return date.toLocaleDateString([], { weekday: 'long' })
  }

  const noMatches = !matchLoading && matches.length === 0
  const noSelection = !receiverId && !noMatches

  if (!hasLoaded) {
    return (
      <div className="animate-fade-in h-[calc(100vh-4rem)] overflow-hidden bg-[#090B14]">
        <div className="mx-auto flex h-full w-[min(85vw,1500px)] max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-full w-full grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="flex min-h-0 flex-col rounded-[24px] border border-[#1B1F35] bg-[#090B14]/90 shadow-[0_30px_70px_rgba(0,0,0,0.35)] overflow-hidden h-full p-5">
              <div className="h-8 w-32 animate-pulse rounded-full bg-[#111429]" />
              <div className="mt-5 h-10 w-full animate-pulse rounded-3xl bg-[#111429]" />
              <div className="mt-4 space-y-3">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="h-20 rounded-[24px] bg-[#111429] animate-pulse" />
                ))}
              </div>
            </div>
            <div className="flex min-h-0 flex-col rounded-[24px] border border-[#1B1F35] bg-[#090B14]/95 shadow-[0_30px_70px_rgba(0,0,0,0.35)] overflow-hidden h-full p-6">
              <div className="h-16 w-full animate-pulse rounded-[20px] bg-[#111429]" />
              <div className="mt-6 flex-1 space-y-3">
                <div className="h-24 rounded-[28px] bg-[#111429] animate-pulse" />
                <div className="h-24 rounded-[28px] bg-[#111429] animate-pulse" />
                <div className="h-24 rounded-[28px] bg-[#111429] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-4rem)] overflow-hidden bg-[#090B14]">
      <div className="mx-auto flex h-full w-[min(85vw,1500px)] max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="h-full w-full grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col rounded-[24px] border border-[#1B1F35] bg-[#090B14]/90 shadow-[0_30px_70px_rgba(0,0,0,0.35)] overflow-hidden h-full">
            <div className="border-b border-[#1B1F35] px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[#A78BFA]">Conversations</p>
                  <p className="mt-2 text-sm text-[#D8D4FF]">{matches.length} matches</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111429] text-[#7C5CFF] shadow-[0_10px_30px_rgba(124,92,255,0.12)]">
                  <Search className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C5CFF]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations"
                  className="w-full rounded-3xl border border-[#1B1F35] bg-[#0B0D17] py-3 pl-11 pr-4 text-sm text-[#E5E7EB] placeholder:text-[#6B7280] outline-none transition duration-200 focus:border-[#7C5CFF] focus:ring-2 focus:ring-[#7C5CFF]/15"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
              {matchLoading ? (
                <div className="space-y-3 px-3">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="h-20 rounded-[24px] bg-[#111429] animate-pulse" />
                  ))}
                </div>
              ) : noMatches ? (
                <div className="flex h-full items-center justify-center px-4 py-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111429]/80 text-[#A78BFA] shadow-[0_10px_24px_rgba(124,92,255,0.10)]">
                      <MessageSquareText className="h-7 w-7" />
                    </div>
                    <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-[#7C5CFF]/70 to-transparent" />
                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#EDE8FF]">No conversations yet</p>
                  </div>
                </div>
              ) : (
                filteredMatches.map((match) => {
                  const active = String(match.userId) === String(receiverId)
                  return (
                    <button
                      key={match.userId}
                      type="button"
                      onClick={() => navigate(`/chat?userId=${match.userId}`)}
                      className={`w-full rounded-[24px] border border-transparent px-4 py-4 text-left transition duration-200 ${
                        active
                          ? 'bg-[#171B33] ring-1 ring-[#7C5CFF]/20 shadow-[0_10px_30px_rgba(124,92,255,0.18)]'
                          : 'hover:border-[#2F3250] hover:bg-[#101328]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 rounded-[20px] overflow-hidden bg-[#111429] border border-[#1B1F35]">
                          {match.profilePhoto ? (
                            <img src={match.profilePhoto} alt={match.fullName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#111429] text-[#7C5CFF]">
                              <span className="text-lg font-semibold">{match.fullName?.[0] || 'U'}</span>
                            </div>
                          )}
                          <span
                            className={`absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border border-[#0B0D17] ${
                              match.online ? 'bg-emerald-400' : 'bg-[#64748B]'
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-[#F8FAFC]">{match.fullName}</p>
                            <VerifiedBadge user={match} className="ml-1" />
                            {match.unreadCount > 0 && (
                              <span className="rounded-full bg-[#7C5CFF] px-2 py-0.5 text-[11px] font-semibold text-white">{match.unreadCount}</span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-[13px] text-[#94A3B8]">{match.lastMessage || match.branch || 'No message yet'}</p>
                        </div>
                        <div className="text-[11px] font-medium text-[#6B7280]">
                          {match.lastMessageAt ? new Date(match.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col rounded-[24px] border border-[#1B1F35] bg-[#090B14]/95 shadow-[0_30px_70px_rgba(0,0,0,0.35)] overflow-hidden h-full">
            <div className="border-b border-[#1B1F35] px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-[20px] overflow-hidden bg-[#111429] border border-[#1B1F35]">
                    {selectedMatch?.profilePhoto ? (
                      <img src={selectedMatch.profilePhoto} alt={selectedMatch.fullName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#111429] text-[#7C5CFF]">
                        <span className="text-lg font-semibold">{selectedMatch?.fullName?.[0] || 'U'}</span>
                      </div>
                    )}
                    <span
                      className={`absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border border-[#0B0D17] ${
                        selectedMatch?.online ? 'bg-emerald-400' : 'bg-[#64748B]'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-semibold text-[#F8FAFC]">{selectedMatch?.fullName || 'Select a conversation'}</div>
                      {selectedMatch && <VerifiedBadge user={selectedMatch} className="" />}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#94A3B8]">
                      <span className={`h-2.5 w-2.5 rounded-full ${selectedMatch?.online ? 'bg-emerald-400' : 'bg-[#64748B]'}`} />
                      <span>{selectedMatch ? (selectedMatch.online ? 'Online' : 'Last seen 2 hours ago') : 'No active conversation'}</span>
                      {selectedMatch?.compatibilityScore != null && (
                        <span className="rounded-full bg-[#1B1434] px-2.5 py-1 text-[11px] font-semibold text-[#D8D4FF]">
                          {selectedMatch.compatibilityScore}% match
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center gap-3">
                  <button type="button" onClick={openCallModal} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1B1F35] bg-[#0B0D17] text-[#E5E7EB] transition hover:border-[#7C5CFF] hover:text-[#FFFFFF]">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={openVideoModal} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1B1F35] bg-[#0B0D17] text-[#E5E7EB] transition hover:border-[#7C5CFF] hover:text-[#FFFFFF]">
                    <Video className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <button type="button" onClick={() => setMenuOpen((prev) => !prev)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1B1F35] bg-[#0B0D17] text-[#E5E7EB] transition hover:border-[#7C5CFF] hover:text-[#FFFFFF]">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    <AnimatePresence>
                      {menuOpen && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute right-0 mt-2 w-44 rounded-[18px] border border-white/10 bg-[#0F1324] p-2 shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
                          <button type="button" onClick={() => handleMenuAction('profile')} className="flex w-full rounded-[12px] px-3 py-2 text-left text-sm text-[#F8FAFC] hover:bg-white/10">View Profile</button>
                          <button type="button" onClick={() => handleMenuAction('mute')} className="flex w-full rounded-[12px] px-3 py-2 text-left text-sm text-[#F8FAFC] hover:bg-white/10">Mute Chat</button>
                          <button type="button" onClick={() => handleMenuAction('clear')} className="flex w-full rounded-[12px] px-3 py-2 text-left text-sm text-[#F8FAFC] hover:bg-white/10">Clear Chat</button>
                          <button type="button" onClick={() => handleMenuAction('delete')} className="flex w-full rounded-[12px] px-3 py-2 text-left text-sm text-[#FCA5A5] hover:bg-white/10">Delete Conversation</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
              <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, idx) => (
                      <div key={idx} className="h-24 rounded-[28px] bg-[#111429] animate-pulse" />
                    ))}
                  </div>
                ) : noMatches ? (
                  <div className="flex h-full items-center justify-center px-6 py-6">
                    <IllustratedEmptyState
                      icon={MessageSquareText}
                      title="No conversations yet"
                      subtitle="Once you match with someone, your conversations will appear here."
                      buttonLabel="Discover Students"
                      href="/discover"
                      className="w-full max-w-lg"
                    />
                  </div>
                ) : noSelection ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-[#94A3B8]">
                    <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#171B33] via-[#101429] to-[#0B0D17] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1B1434] text-[#A78BFA]">
                        <MessageCircle className="h-10 w-10" />
                      </div>
                      <div className="mt-5 text-xl font-semibold text-[#F8FAFC]">Select a conversation to start chatting.</div>
                      <div className="mt-2 max-w-md text-sm text-[#A8A8B8]">Choose a match from the left panel to open your conversation thread.</div>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col gap-4">
                    {selectedMatch && currentUser && (
                      <ConversationStarter profile={currentUser} match={selectedMatch} />
                    )}
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#12162b] via-[#0e1222] to-[#111429] px-6 py-8 text-center text-[#94A3B8] shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                      <div className="rounded-full bg-[#1B1434] p-3 text-[#A78BFA]">
                        <MessageSquareText className="h-7 w-7" />
                      </div>
                      <div className="text-xl font-semibold text-[#F8FAFC]">Start with a warm opener</div>
                      <div className="max-w-md text-sm">Share a quick hello or let the conversation flow naturally.</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => {
                      const messageKey = msg.id
                      const isIncoming = String(msg.senderId) === String(receiverId)
                      const showDateSeparator = index === 0 || (index > 0 && new Date(messages[index - 1].sentAt).toDateString() !== new Date(msg.sentAt).toDateString())
                      return (
                        <div key={messageKey}>
                          {showDateSeparator && (
                            <div className="mb-4 flex items-center justify-center">
                              <div className="rounded-full border border-white/10 bg-[#0F1324]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A8A8B8]">
                                {formatDateSeparator(msg.sentAt)}
                              </div>
                            </div>
                          )}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`group flex ${isIncoming ? 'justify-start' : 'justify-end'}`}
                            onMouseEnter={() => setHoveredMessage(messageKey)}
                            onMouseLeave={() => setHoveredMessage(null)}
                          >
                            <div className={`relative max-w-[85%] rounded-[28px] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.22)] transition duration-200 ${
                              isIncoming ? 'bg-[#111429] text-[#E5E7EB]' : 'bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] text-white'
                            }`}>
                              <div className="text-sm leading-7">{msg.content}</div>
                              <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-[#94A3B8]">
                                <span>{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {!isIncoming && <MessageStatus status={msg.isRead ? 'seen' : 'sent'} isIncoming={isIncoming} />}
                              </div>
                              {!isIncoming && hoveredMessage === messageKey && (
                                <div className="absolute -right-2 top-2 flex items-center gap-1 rounded-full border border-white/10 bg-[#0B0D17] p-1 shadow-lg">
                                  <button type="button" onClick={() => handleCopyMessage(msg)} className="rounded-full p-1.5 text-[#D8D4FF] hover:bg-white/10"><Copy className="h-3.5 w-3.5" /></button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <form onSubmit={send} className="border-t border-[#1B1F35] bg-[#090B14]/95 px-6 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex flex-1 flex-col rounded-[24px] border border-[#1B1F35] bg-[#0B0D17] px-3 py-2">
                    <div className="flex items-end gap-2">
                      <div className="relative">
                        <button type="button" onClick={() => setEmojiPickerOpen((prev) => !prev)} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#E5E7EB] transition hover:bg-[#161a2e]">
                          <Smile className="h-5 w-5" />
                        </button>
                        <AnimatePresence>
                          {emojiPickerOpen && (
                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute bottom-12 left-0 flex gap-2 rounded-[16px] border border-white/10 bg-[#0F1324] p-2 shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
                              {['😊', '😂', '❤️', '🔥', '👍', '🎉'].map((emoji) => (
                                <button key={emoji} type="button" onClick={() => handleEmojiSelect(emoji)} className="rounded-full bg-white/5 p-2 text-lg transition hover:bg-white/10">{emoji}</button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <textarea
                        ref={textareaRef}
                        rows={1}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            send(e)
                          }
                        }}
                        placeholder={selectedMatch ? 'Type a message...' : 'Select a conversation to begin'}
                        disabled={!receiverId}
                        className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent py-2 text-sm text-[#E5E7EB] placeholder:text-[#6B7280] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending || !text.trim() || !receiverId}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] px-6 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(124,92,255,0.35)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
      <AnimatePresence>
        {callModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070D]/80 px-4 backdrop-blur">
            <motion.div initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 8 }} className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#0F1324] p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#7C5CFF]/15 text-[#D8D4FF]">
                <Phone className="h-8 w-8 animate-pulse" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">Calling {selectedMatch?.fullName || 'Student'}...</h3>
              <p className="mt-2 text-sm text-[#A8A8B8]">Ringing • Tap below to end the call</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#7C5CFF] animate-bounce" />
                <div className="h-3 w-3 rounded-full bg-[#A78BFA] animate-bounce [animation-delay:0.15s]" />
                <div className="h-3 w-3 rounded-full bg-[#D8D4FF] animate-bounce [animation-delay:0.3s]" />
              </div>
              <button type="button" onClick={() => setCallModalOpen(false)} className="mt-6 rounded-full bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-200">End Call</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {videoModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070D]/80 px-4 backdrop-blur">
            <motion.div initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 8 }} className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0F1324] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#A78BFA]">Video call</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{selectedMatch?.fullName || 'Student'} • Live</h3>
                </div>
                <button type="button" onClick={() => setVideoModalOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-[#E5E7EB]">✕</button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="flex h-36 items-center justify-center rounded-[22px] border border-white/10 bg-[#14182d] text-[#D8D4FF]">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7C5CFF]/15 text-[#D8D4FF]">👤</div>
                    <p className="mt-3 text-sm font-semibold text-white">{selectedMatch?.fullName || 'Student'}</p>
                  </div>
                </div>
                <div className="flex h-36 items-center justify-center rounded-[22px] border border-white/10 bg-[#14182d] text-[#D8D4FF]">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7C5CFF]/15 text-[#D8D4FF]">You</div>
                    <p className="mt-3 text-sm font-semibold text-white">Camera ready</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button type="button" onClick={() => setCameraOn((prev) => !prev)} className={`rounded-full px-4 py-2 text-sm font-semibold ${cameraOn ? 'bg-[#111429] text-[#E5E7EB]' : 'bg-[#7C5CFF]/20 text-[#D8D4FF]'}`}>{cameraOn ? 'Camera on' : 'Camera off'}</button>
                <button type="button" onClick={() => setMicOn((prev) => !prev)} className={`rounded-full px-4 py-2 text-sm font-semibold ${micOn ? 'bg-[#111429] text-[#E5E7EB]' : 'bg-[#7C5CFF]/20 text-[#D8D4FF]'}`}>{micOn ? 'Mic on' : 'Mic off'}</button>
                <button type="button" onClick={() => setVideoModalOpen(false)} className="rounded-full bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-200">End Call</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
