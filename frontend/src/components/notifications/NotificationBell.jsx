import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function mapNotification(notification) {
  const type = String(notification.type || '').toLowerCase()
  return {
    id: notification.id,
    type,
    title: notification.title || 'Notification',
    description: notification.message || '',
    timestamp: notification.createdAt || notification.timestamp || new Date().toISOString(),
    unread: notification.isRead === false || notification.unread === true,
    actor: {
      fullName: notification.actorName || 'User',
      profilePhoto: notification.actorProfilePhoto || null
    },
    action: type === 'like' ? 'profile' : 'chat',
    actionLabel: type === 'like' ? 'View Profile' : type === 'match' ? 'Start Chat' : 'Reply',
    userId: notification.actorId
  }
}

export default function NotificationBell({ isHidden = false }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])

  const unreadCount = notifications.filter((notification) => notification.unread).length

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/api/notifications')
        const mapped = (data || []).map(mapNotification)
        setNotifications(mapped)
      } catch (error) {
        setNotifications((prev) => prev)
      }
    }

    fetchNotifications()

    const handleNotificationsUpdated = () => {
      fetchNotifications()
    }

    window.addEventListener('notifications-updated', handleNotificationsUpdated)
    return () => window.removeEventListener('notifications-updated', handleNotificationsUpdated)
  }, [])

  const handleBellClick = () => {
    navigate('/notifications')
  }

  return (
    <motion.div
      animate={{ opacity: isHidden ? 0 : 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`relative ${isHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}
    >
      <motion.button
        type="button"
        onClick={handleBellClick}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
        animate={unreadCount > 0 ? { scale: [1, 1.04, 1], y: [0, -1, 0] } : { scale: 1, y: 0 }}
        transition={{ duration: 2.2, repeat: unreadCount > 0 ? Infinity : 0, ease: 'easeInOut' }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[rgba(255,255,255,0.02)] shadow-sm transition-colors hover:bg-[rgba(124,92,255,0.08)] hover:shadow-[0_6px_20px_rgba(124,92,255,0.12)] focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-[#DAD6FF]" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0.85, opacity: 0.9 }}
            animate={{ scale: [1, 1.18, 1], opacity: [1, 0.95, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-xs font-semibold text-white"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  )
}
