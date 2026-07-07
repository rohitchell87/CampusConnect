import { calculateCompatibility } from '../../utils/compatibility'

const normalizeText = (value) => (value == null ? '' : String(value).trim())

const normalizeList = (value) => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(typeof item === 'object' ? item?.name || item?.label || item?.value || '' : item))
      .filter(Boolean)
  }
  return String(value)
    .split(',')
    .map((item) => normalizeText(item))
    .filter(Boolean)
}

const sameValue = (left, right) => {
  const a = normalizeText(left).toLowerCase()
  const b = normalizeText(right).toLowerCase()
  return Boolean(a && b && a === b)
}

const overlapCount = (left, right) => {
  const a = normalizeList(left)
  const b = new Set(normalizeList(right).map((item) => item.toLowerCase()))
  return a.filter((item) => b.has(item.toLowerCase())).length
}

export function buildCompatibilityInsight(currentUser = {}, otherUser = {}) {
  if (!currentUser || !otherUser) return { score: 0, reasons: [], breakdown: [], summary: 'You both have different interests, which could make conversations more interesting.' }

  const fallback = calculateCompatibility(currentUser, otherUser)
  const sharedInterests = overlapCount(currentUser.interests || [], otherUser.interests || [])
  const reasons = []
  const breakdown = []

  if (sameValue(currentUser.college, otherUser.college)) {
    reasons.push({ title: 'Same College', detail: normalizeText(otherUser.college) || 'Same campus', icon: '🎓' })
    breakdown.push({ label: 'Education', percent: 20, tone: 'from-[#7C5CFF] to-[#A78BFA]' })
  }

  if (sameValue(currentUser.branch, otherUser.branch)) {
    reasons.push({ title: 'Same Branch', detail: normalizeText(otherUser.branch) || 'Same field', icon: '💻' })
  }

  if (sameValue(currentUser.year, otherUser.year)) {
    reasons.push({ title: 'Same Year', detail: `Year ${normalizeText(otherUser.year)}`, icon: '📚' })
  }

  if (sharedInterests > 0) {
    const sharedList = normalizeList(currentUser.interests || []).filter((item) => {
      const lower = item.toLowerCase()
      return normalizeList(otherUser.interests || []).some((candidate) => candidate.toLowerCase() === lower)
    })
    reasons.push({ title: 'Shared Interests', detail: sharedList.slice(0, 5).join(', '), icon: '❤️' })
    breakdown.push({ label: 'Shared Interests', percent: Math.min(40, 10 + sharedInterests * 6), tone: 'from-[#A78BFA] to-[#7C5CFF]' })
  }

  if (sameValue(currentUser.relationshipIntent, otherUser.relationshipIntent)) {
    reasons.push({ title: 'Similar Relationship Goals', detail: normalizeText(otherUser.relationshipIntent) || 'Looking for meaningful connections.', icon: '🎯' })
    breakdown.push({ label: 'Relationship Goals', percent: 15, tone: 'from-[#34D399] to-[#2DD4BF]' })
  }

  if (sameValue(currentUser.personalityType, otherUser.personalityType)) {
    reasons.push({ title: 'Personality', detail: normalizeText(otherUser.personalityType) || 'Both adventurous and outgoing.', icon: '🧠' })
    breakdown.push({ label: 'Personality', percent: 10, tone: 'from-[#FB923C] to-[#F59E0B]' })
  }

  if (normalizeText(currentUser.location || currentUser.city || currentUser.hometown) && normalizeText(otherUser.location || otherUser.city || otherUser.hometown)) {
    if (sameValue(currentUser.location || currentUser.city || currentUser.hometown, otherUser.location || otherUser.city || otherUser.hometown)) {
      reasons.push({ title: 'Same City', detail: normalizeText(otherUser.location || otherUser.city || otherUser.hometown), icon: '📍' })
      breakdown.push({ label: 'Location', percent: 10, tone: 'from-[#38BDF8] to-[#60A5FA]' })
    }
  }

  if (reasons.length === 0) {
    return {
      score: fallback.score,
      reasons: [],
      breakdown: [
        { label: 'Shared Interests', percent: 25, tone: 'from-[#A78BFA] to-[#7C5CFF]' },
        { label: 'Lifestyle', percent: 20, tone: 'from-[#38BDF8] to-[#60A5FA]' },
        { label: 'Education', percent: 20, tone: 'from-[#34D399] to-[#2DD4BF]' },
      ],
      summary: 'You both have different interests, which could make conversations more interesting.',
    }
  }

  const orderedBreakdown = []
  const seen = new Set()
  const preferredOrder = ['Shared Interests', 'Education', 'Relationship Goals', 'Personality', 'Location', 'Lifestyle']
  ;[...preferredOrder, ...breakdown.map((item) => item.label)].forEach((label) => {
    if (!label || seen.has(label)) return
    seen.add(label)
    const existing = breakdown.find((item) => item.label === label)
    if (existing) orderedBreakdown.push(existing)
  })

  if (orderedBreakdown.length < 4) {
    const extras = [
      { label: 'Lifestyle', percent: 15, tone: 'from-[#F472B6] to-[#E879F9]' },
      { label: 'Activity', percent: 10, tone: 'from-[#F59E0B] to-[#FB923C]' },
    ]
    extras.forEach((item) => {
      if (!orderedBreakdown.some((existing) => existing.label === item.label)) orderedBreakdown.push(item)
    })
  }

  const total = orderedBreakdown.reduce((sum, item) => sum + (item.percent || 0), 0)
  if (total !== 100) {
    const deficit = 100 - total
    const filler = orderedBreakdown[orderedBreakdown.length - 1]
    if (filler) filler.percent = (filler.percent || 0) + deficit
  }

  return { score: fallback.score, reasons, breakdown: orderedBreakdown, summary: fallback.reasons?.[0] || 'You share a lot of good energy.' }
}
