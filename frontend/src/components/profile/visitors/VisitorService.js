const mockVisitors = [
  {
    id: '1',
    fullName: 'Priya Sharma',
    college: 'IIIT Delhi',
    profilePhoto: null,
    viewedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    profileId: 'u1'
  },
  {
    id: '2',
    fullName: 'Aarav Mehta',
    college: 'IIT Delhi',
    profilePhoto: null,
    viewedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    profileId: 'u2'
  },
  {
    id: '3',
    fullName: 'Naina Verma',
    college: 'DTU',
    profilePhoto: null,
    viewedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    profileId: 'u3'
  },
  {
    id: '4',
    fullName: 'Kabir Singh',
    college: 'NSIT',
    profilePhoto: null,
    viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    profileId: 'u4'
  },
  {
    id: '5',
    fullName: 'Meera Rao',
    college: 'JNU',
    profilePhoto: null,
    viewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    profileId: 'u5'
  },
  {
    id: '6',
    fullName: 'Vikram Das',
    college: 'BITS Pilani',
    profilePhoto: null,
    viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    profileId: 'u6'
  }
]

export const getProfileVisitors = async () => mockVisitors

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
