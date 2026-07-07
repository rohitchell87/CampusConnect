const mockBlockedUsers = []
const mockReports = []
const listeners = new Set()

const notify = () => {
  listeners.forEach((listener) => listener())
}

export const moderationStorage = {
  getBlockedUsers: () => mockBlockedUsers.map((user) => ({ ...user })),
  addBlockedUser: (user) => {
    const normalizedUser = {
      ...user,
      blockedAt: user.blockedAt || new Date().toISOString(),
    }
    if (!mockBlockedUsers.some((item) => String(item.id) === String(user.id))) {
      mockBlockedUsers.push(normalizedUser)
      notify()
    }
    return mockBlockedUsers.map((item) => ({ ...item }))
  },
  removeBlockedUser: (userId) => {
    const index = mockBlockedUsers.findIndex((item) => String(item.id) === String(userId))
    if (index >= 0) mockBlockedUsers.splice(index, 1)
    notify()
    return mockBlockedUsers.map((item) => ({ ...item }))
  },
  addReport: (report) => {
    mockReports.push(report)
    return mockReports
  },
  getReports: () => mockReports,
}

export const reportReasons = [
  'Fake Profile',
  'Spam',
  'Harassment',
  'Inappropriate Content',
  'Underage User',
  'Other',
]

export const submitReport = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 350))
  moderationStorage.addReport(payload)
  return { success: true }
}

export const blockUser = async (user) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  moderationStorage.addBlockedUser(user)
  return { success: true }
}

export const unblockUser = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 250))
  moderationStorage.removeBlockedUser(userId)
  return { success: true }
}

export const getBlockedUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return moderationStorage.getBlockedUsers()
}

export const getBlockedUserIds = () => moderationStorage.getBlockedUsers().map((user) => String(user.id))

export const isBlockedUser = (userId) => getBlockedUserIds().includes(String(userId))

export const subscribeToModerationChanges = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
