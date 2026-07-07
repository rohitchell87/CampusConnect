import api from '../../api/axios'

function mapActivity(notification) {
  const type = String(notification.type || '').toUpperCase()
  return {
    id: notification.id,
    type,
    title: notification.title || 'Notification',
    description: notification.message || '',
    createdAt: notification.createdAt || new Date().toISOString(),
    unread: notification.isRead === false || notification.unread === true,
    route: type === 'LIKE' ? '/likes' : type === 'MATCH' ? '/matches' : type === 'MESSAGE' ? '/chat' : '/notifications'
  }
}

export const getActivities = async () => {
  const { data } = await api.get('/api/notifications')
  return (data || []).map(mapActivity)
}

export const formatRelativeTime = (timestamp) => {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return 'Earlier'
}
