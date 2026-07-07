import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import NotificationCard from '../../components/ui/NotificationCard'
import NotificationSkeleton from '../../components/common/NotificationSkeleton'
import ActivityFeed from '../../components/activity/ActivityFeed'
import api from '../../api/axios'

function groupByDay(notifications) {
  const today = []
  const yesterday = []
  const earlier = []

  const now = new Date()
  notifications.forEach((n) => {
    const t = new Date(n.timestamp)
    const diff = Math.floor((now - t) / (1000 * 60 * 60 * 24))
    if (diff === 0) today.push(n)
    else if (diff === 1) yesterday.push(n)
    else earlier.push(n)
  })

  return { today, yesterday, earlier }
}

function mapNotification(notification) {
  const type = String(notification.type || '').toLowerCase()
  const isUnread = notification.isRead === false || notification.unread === true

  return {
    id: notification.id,
    type,
    title: notification.title || 'Notification',
    description: notification.message || '',
    timestamp: notification.createdAt || notification.timestamp || new Date().toISOString(),
    unread: isUnread,
    actor: {
      fullName: notification.actorName || 'User',
      profilePhoto: notification.actorProfilePhoto || null
    },
    action: type === 'like' ? 'profile' : 'chat',
    actionLabel: type === 'like' ? 'View Profile' : type === 'match' ? 'Start Chat' : 'Reply',
    userId: notification.actorId
  }
}

export default function Notifications() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/notifications')
      const mapped = (data || [])
        .map(mapNotification)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      setNotifications(mapped)
    } catch (error) {
      toast.error('Unable to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [location.pathname])

  const handleNotificationRead = async (notificationId) => {
    const previous = notifications
    setNotifications((prev) => prev.map((notification) => (
      notification.id === notificationId ? { ...notification, unread: false } : notification
    )))

    try {
      await api.put(`/api/notifications/${notificationId}/read`)
      window.dispatchEvent(new Event('notifications-updated'))
    } catch (error) {
      setNotifications(previous)
      toast.error('Unable to update notification')
    }
  }

  const handleMarkAllRead = async () => {
    if (!notifications.some((notification) => notification.unread)) return

    const previous = notifications
    setNotifications((prev) => prev.map((notification) => ({ ...notification, unread: false })))

    try {
      await api.put('/api/notifications/read-all')
      window.dispatchEvent(new Event('notifications-updated'))
    } catch (error) {
      setNotifications(previous)
      toast.error('Unable to mark notifications as read')
    }
  }

  const grouped = useMemo(() => groupByDay(notifications), [notifications])

  return (
    <div className="animate-fade-in">
      <div className="mx-auto w-[min(90vw,1500px)] max-w-[1500px] space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">🔔 Notifications</h1>
            <p className="mt-1 text-sm text-[#94A3B8]">Stay updated with everything happening on CampusConnect.</p>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" className="text-sm text-[#B9BBCC]" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
            <div className="inline-flex items-center gap-3 rounded-full bg-[rgba(124,92,255,0.08)] px-3 py-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7C5CFF] text-sm font-semibold text-white">
                {notifications.filter((notification) => notification.unread).length}
              </div>
              <div className="text-sm text-[#DAD6FF]">New</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <NotificationSkeleton key={i} />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="glass-card rounded-[24px] p-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(124,92,255,0.12)] text-3xl">
                  🔔
                </div>
                <h2 className="text-2xl font-semibold text-white">You&apos;re all caught up.</h2>
                <p className="mt-3 text-sm text-[#94A3B8]">We&apos;ll notify you whenever something important happens.</p>
                <div className="mt-6">
                  <a href="/discover" className="btn-primary px-6 py-3">
                    Go to Discover
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {grouped.today.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-[#B9BBCC]">Today</h3>
                    <div className="space-y-3">
                      {grouped.today.map((n) => (
                        <NotificationCard key={n.id} notification={n} onRead={handleNotificationRead} />
                      ))}
                    </div>
                  </section>
                )}

                {grouped.yesterday.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-[#B9BBCC]">Yesterday</h3>
                    <div className="space-y-3">
                      {grouped.yesterday.map((n) => (
                        <NotificationCard key={n.id} notification={n} onRead={handleNotificationRead} />
                      ))}
                    </div>
                  </section>
                )}

                {grouped.earlier.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-[#B9BBCC]">Earlier</h3>
                    <div className="space-y-3">
                      {grouped.earlier.map((n) => (
                        <NotificationCard key={n.id} notification={n} onRead={handleNotificationRead} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          <ActivityFeed title="Recent Activity" />
        </div>
      </div>
    </div>
  )
}
