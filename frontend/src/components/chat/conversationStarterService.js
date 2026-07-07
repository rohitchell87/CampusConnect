const starterTemplates = [
  {
    key: 'interest',
    icon: '💡',
    title: 'shared interest',
    build: (profile, match) => {
      const shared = profile?.interests?.filter((interest) => match?.interests?.includes(interest)) || []
      if (shared.length > 0) {
        const interest = shared[0]
        return {
          title: `You both like ${interest}`,
          text: `What ${interest.toLowerCase()} are you into lately?`,
        }
      }
      return {
        title: 'You both have a lot in common',
        text: 'What made you join CampusConnect?',
      }
    },
  },
  {
    key: 'college',
    icon: '🏫',
    title: 'same college',
    build: (profile, match) => {
      if (profile?.college && match?.college && String(profile.college).toLowerCase() === String(match.college).toLowerCase()) {
        return {
          title: 'You both go to the same college',
          text: 'What is your favorite part about campus life so far?',
        }
      }
      return null
    },
  },
  {
    key: 'branch',
    icon: '💻',
    title: 'same branch',
    build: (profile, match) => {
      if (profile?.branch && match?.branch && String(profile.branch).toLowerCase() === String(match.branch).toLowerCase()) {
        return {
          title: 'You both share the same branch',
          text: 'What has been the most interesting part of your course lately?',
        }
      }
      return null
    },
  },
  {
    key: 'year',
    icon: '📚',
    title: 'same year',
    build: (profile, match) => {
      if (profile?.year && match?.year && String(profile.year) === String(match.year)) {
        return {
          title: 'You’re in the same year',
          text: 'How has your semester been going so far?',
        }
      }
      return null
    },
  },
  {
    key: 'personality',
    icon: '✨',
    title: 'similar personality',
    build: (profile, match) => {
      if (profile?.personalityType && match?.personalityType && String(profile.personalityType).toLowerCase() === String(match.personalityType).toLowerCase()) {
        return {
          title: 'You seem to have similar vibes',
          text: 'What kind of weekend plans are your favorite?',
        }
      }
      return null
    },
  },
  {
    key: 'goal',
    icon: '💬',
    title: 'similar goals',
    build: (profile, match) => {
      if (profile?.relationshipIntent && match?.relationshipIntent && String(profile.relationshipIntent).toLowerCase() === String(match.relationshipIntent).toLowerCase()) {
        return {
          title: 'You both have similar relationship goals',
          text: 'What kind of connection are you hoping to find here?',
        }
      }
      return null
    },
  },
]

const genericSuggestions = [
  {
    title: 'Friendly opener',
    text: 'What made you join CampusConnect?',
  },
  {
    title: 'Easy conversation starter',
    text: "What's something you're passionate about lately?",
  },
  {
    title: 'Warm opener',
    text: 'What’s been the highlight of your week so far?',
  },
]

export function generateConversationStarters(profile, match, count = 3) {
  const currentProfile = profile || {}
  const currentMatch = match || {}
  const starters = []

  for (const template of starterTemplates) {
    const suggestion = template.build(currentProfile, currentMatch)
    if (suggestion) {
      starters.push({
        ...suggestion,
        icon: template.icon,
      })
      if (starters.length >= count) break
    }
  }

  if (starters.length < count) {
    const remaining = count - starters.length
    const extras = genericSuggestions.slice(0, remaining)
    starters.push(...extras)
  }

  return starters.slice(0, count)
}

export function createConversationStarterService() {
  return {
    generateConversationStarters,
  }
}

export default createConversationStarterService()
