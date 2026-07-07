const STORAGE_KEY = 'campusconnect_verification_state'
const listeners = new Set()

const loadState = () => {
  if (typeof window === 'undefined') return { statuses: {}, submissions: {} }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return { statuses: {}, submissions: {} }
    const parsed = JSON.parse(stored)
    return {
      statuses: parsed?.statuses || {},
      submissions: parsed?.submissions || {},
    }
  } catch (error) {
    return { statuses: {}, submissions: {} }
  }
}

let state = loadState()

const persist = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const notify = () => {
  listeners.forEach((listener) => listener())
}

const normalizeKey = (user) => {
  if (user === null || user === undefined) return 'self'
  if (typeof user === 'object') {
    return String(user.id || user.userId || user.email || 'self')
  }
  return String(user)
}

export const VERIFICATION_STATUSES = ['Verified Student', 'Verification Pending', 'Not Verified']

const getDefaultStatus = (key) => {
  if (key === 'self') return 'Verification Pending'
  const hash = Array.from(key).reduce((total, char) => total + char.charCodeAt(0), 0)
  const mod = hash % 3
  if (mod === 0) return 'Verified Student'
  if (mod === 1) return 'Verification Pending'
  return 'Not Verified'
}

export const getVerificationStatus = (user) => {
  const key = normalizeKey(user)
  return state.statuses[key] || getDefaultStatus(key)
}

export const getVerificationBadgeLabel = (user) => {
  const status = getVerificationStatus(user)
  if (status === 'Verified Student') return 'Verified Student'
  if (status === 'Verification Pending') return 'Verification Pending'
  return 'Not Verified'
}

export const setVerificationStatus = (user, status) => {
  const key = normalizeKey(user)
  state.statuses[key] = status
  persist()
  notify()
  return getVerificationStatus(user)
}

export const submitVerificationRequest = (user) => {
  const key = normalizeKey(user)
  state.statuses[key] = 'Verification Pending'
  state.submissions[key] = {
    submittedAt: new Date().toISOString(),
    status: 'Verification Pending',
  }
  persist()
  notify()
  return getVerificationStatus(user)
}

export const approveVerification = (user) => {
  const key = normalizeKey(user)
  state.statuses[key] = 'Verified Student'
  state.submissions[key] = {
    ...(state.submissions[key] || {}),
    status: 'Verified Student',
    approvedAt: new Date().toISOString(),
  }
  persist()
  notify()
  return getVerificationStatus(user)
}

export const getVerificationSubmission = (user) => {
  const key = normalizeKey(user)
  return state.submissions[key] || null
}

export const subscribeToVerificationChanges = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const resetVerificationState = () => {
  state = { statuses: {}, submissions: {} }
  persist()
  notify()
  return state
}

export const isVerificationVerified = (user) => getVerificationStatus(user) === 'Verified Student'
