const normalizeText = (value) => (value == null ? '' : String(value).trim())

const normalizeList = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(item => normalizeText(typeof item === 'object' ? item?.name || item?.label || item?.value || '' : item)).filter(Boolean)
  return String(value)
    .split(',')
    .map(item => normalizeText(item))
    .filter(Boolean)
}

const sameValue = (left, right) => {
  const a = normalizeText(left).toLowerCase()
  const b = normalizeText(right).toLowerCase()
  return a && b && a === b
}

const overlapCount = (left, right) => {
  const a = normalizeList(left)
  const b = new Set(normalizeList(right).map(item => item.toLowerCase()))
  return a.filter(item => b.has(item.toLowerCase())).length
}

export function intersectCount(a = [], b = []){
  return overlapCount(a, b)
}

export function calculateCompatibility(current = {}, other = {}) {
  if (!other || !current) return { score: 0, reasons: [] }

  const criteria = []

  const sharedInterests = overlapCount(current.interests || [], other.interests || [])
  if (sharedInterests > 0) {
    const points = Math.min(sharedInterests, 6) * 7
    criteria.push({
      key: 'sharedInterests',
      points,
      detail: `${sharedInterests} shared interests`,
    })
  }

  if (sameValue(current.college, other.college)) {
    criteria.push({ key: 'sameCollege', points: 16, detail: 'Same college' })
  }

  if (sameValue(current.branch, other.branch)) {
    criteria.push({ key: 'sameBranch', points: 10, detail: 'Same branch' })
  }

  if (sameValue(current.year, other.year)) {
    criteria.push({ key: 'sameYear', points: 8, detail: 'Same year' })
  }

  if (sameValue(current.relationshipIntent, other.relationshipIntent)) {
    criteria.push({ key: 'intent', points: 12, detail: 'Similar relationship goals' })
  }

  if (sameValue(current.personalityType, other.personalityType)) {
    criteria.push({ key: 'personality', points: 7, detail: 'Similar personality' })
  }

  if (current.lookingFor && other.lookingFor) {
    const overlap = overlapCount(current.lookingFor, other.lookingFor)
    if (overlap > 0) {
      criteria.push({ key: 'lookingFor', points: 8, detail: 'Aligned about what you’re looking for' })
    }
  }

  const lifestyleKeys = ['smoking', 'drinking', 'diet', 'lifestyle']
  for (const key of lifestyleKeys) {
    if (sameValue(current[key], other[key])) {
      criteria.push({ key: `lifestyle_${key}`, points: 4, detail: `Similar ${key} habits` })
    }
  }

  if (current.age != null && other.age != null) {
    const diff = Math.abs(Number(current.age) - Number(other.age))
    if (diff <= 2) {
      criteria.push({ key: 'age', points: 12, detail: 'Close in age' })
    } else if (diff <= 4) {
      criteria.push({ key: 'age', points: 6, detail: 'Ages are fairly close' })
    } else if (diff <= 8) {
      criteria.push({ key: 'age', points: 3, detail: 'Age gap is manageable' })
    }
  }

  const achieved = criteria.reduce((sum, item) => sum + (item.points || 0), 0)
  let potential = 0

  if ((current.interests && current.interests.length) || (other.interests && other.interests.length)) potential += 42
  if (current.college || other.college) potential += 16
  if (current.branch || other.branch) potential += 10
  if (current.year || other.year) potential += 8
  if (current.relationshipIntent || other.relationshipIntent) potential += 12
  if (current.personalityType || other.personalityType) potential += 7
  if (current.lookingFor || other.lookingFor) potential += 8
  for (const key of lifestyleKeys) if (current[key] || other[key]) potential += 4
  if (current.age != null || other.age != null) potential += 12

  const score = potential > 0 ? Math.min(99, Math.round((achieved / potential) * 100)) : 0
  const reasons = criteria
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .map(item => item.detail)

  return { score, reasons, details: criteria }
}
