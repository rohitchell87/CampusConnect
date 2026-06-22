import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import chatService from '../../services/chatService'
import matchesService from '../../services/matchesService'
import toast from 'react-hot-toast'

export default function Chat(){
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const receiverId = searchParams.get('userId')
  const [matches, setMatches] = useState([])
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [matchLoading, setMatchLoading] = useState(false)
  const scrollRef = useRef(null)

  const selectedMatch = useMemo(() => matches.find(match => String(match.userId) === String(receiverId)), [matches, receiverId])
  const title = selectedMatch ? `Chat with ${selectedMatch.fullName}` : 'Chat'

  useEffect(()=>{
    loadMatches()
  }, [])

  useEffect(()=>{
    if(receiverId){
      loadConversation(receiverId)
    }
  }, [receiverId])

  useEffect(()=>{
    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const loadMatches = async ()=>{
    setMatchLoading(true)
    try{
      const data = await matchesService.getMatches()
      setMatches(data)
      if(!receiverId && data.length){
        navigate(`/chat?userId=${data[0].userId}`, { replace: true })
      }
    }catch(err){
      toast.error('Unable to load matched conversations')
    }finally{ setMatchLoading(false) }
  }

  const loadConversation = async (id)=>{
    setLoading(true)
    try{
      const data = await chatService.getConversation(id)
      setMessages(data)
    }catch(err){
      toast.error('Unable to load conversation')
      setMessages([])
    }finally{ setLoading(false) }
  }

  const send = async (e)=>{
    e.preventDefault()
    if(!text.trim() || !receiverId) return
    setSending(true)
    try{
      const sent = await chatService.sendMessage({ receiverId: Number(receiverId), content: text.trim() })
      setMessages(prev => [...prev, sent])
      setText('')
    }catch(err){
      toast.error('Send failed')
    }finally{ setSending(false) }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr] animate-fade-in">
      <aside className="bg-white dark:bg-slate-900 shadow rounded overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 p-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {matchLoading ? (
            <div className="space-y-3 p-4">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-700" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400">No matches yet. Start connecting in Discover.</div>
          ) : (
            matches.map(match => (
              <button
                key={match.userId}
                type="button"
                onClick={() => navigate(`/chat?userId=${match.userId}`)}
                className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 ${String(match.userId) === String(receiverId) ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {match.profilePhoto ? <img src={match.profilePhoto} alt={match.fullName} className="w-full h-full object-cover" /> : <span className="text-slate-500 dark:text-slate-300">?</span>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{match.fullName}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{match.branch}</div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="bg-white dark:bg-slate-900 shadow rounded flex flex-col overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {selectedMatch && <p className="text-sm text-slate-500 dark:text-slate-400">{selectedMatch.branch}</p>}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
              ))}
            </div>
          ) : !receiverId ? (
            <div className="text-center text-slate-500 dark:text-slate-400 mt-10">Select a conversation to view messages.</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 mt-10">No messages yet. Send the first one.</div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`max-w-xl rounded-2xl px-4 py-3 ${String(msg.senderId) === String(receiverId) ? 'self-start bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100' : 'self-end bg-primary-500 text-white'}`}
              >
                <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">{msg.senderName}</div>
                <div>{msg.content}</div>
                <div className="text-[11px] text-slate-400 mt-2 text-right">{new Date(msg.sentAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={send} className="border-t border-slate-200 dark:border-slate-700 p-4 flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            disabled={!receiverId}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 dark:disabled:bg-slate-800"
          />
          <button type="submit" disabled={sending || !text.trim() || !receiverId} className="rounded-full bg-primary-500 px-6 text-white disabled:opacity-50">
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
    </div>
  )
}
