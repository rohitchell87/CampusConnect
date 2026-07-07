const mockRecommendations = [
  {
    id: 'maya',
    fullName: 'Maya Chen',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    verified: true,
    compatibility: 96,
    sharedInterests: ['Anime', 'Football'],
    reason: 'You both like Anime',
    college: 'IIT Delhi',
    branch: 'CSE',
  },
  {
    id: 'arjun',
    fullName: 'Arjun Rao',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    verified: true,
    compatibility: 94,
    sharedInterests: ['Coding', 'Cricket'],
    reason: 'Same college',
    college: 'NIT Trichy',
    branch: 'CSE',
  },
  {
    id: 'sara',
    fullName: 'Sara Malik',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    verified: false,
    compatibility: 92,
    sharedInterests: ['Music', 'Travel'],
    reason: 'Both study CSE',
    college: 'BITS Pilani',
    branch: 'CSE',
  },
  {
    id: 'kavya',
    fullName: 'Kavya S',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    verified: true,
    compatibility: 91,
    sharedInterests: ['Photography', 'Football'],
    reason: 'Both like Football',
    college: 'Christ University',
    branch: 'ECE',
  },
  {
    id: 'neil',
    fullName: 'Neil Patil',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    verified: false,
    compatibility: 90,
    sharedInterests: ['Anime', 'Music'],
    reason: 'You both like Anime',
    college: 'IIT Bombay',
    branch: 'Mechanical',
  },
]

export const getTodaysPicks = (currentUser) => {
  const refreshSeed = Date.now()
  const base = mockRecommendations.map((profile, index) => ({
    ...profile,
    compatibility: Math.min(99, profile.compatibility + ((refreshSeed + index) % 3)),
  }))

  return base
    .map((profile) => ({
      ...profile,
      sortKey: (profile.id.charCodeAt(0) + (refreshSeed % 17) + (currentUser?.college ? currentUser.college.length : 0)) % 19,
    }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, 3)
}

export const getMockProfileById = (id) => mockRecommendations.find((profile) => profile.id === id) || null
