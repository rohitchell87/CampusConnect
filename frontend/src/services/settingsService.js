import api from '../api/axios'

const settingsService = {
  getSettings: async () => {
    const response = await api.get('/api/settings')
    return response.data
  },
  updateSettings: async (updates) => {
    const response = await api.put('/api/settings', updates)
    return response.data
  },
}

export default settingsService
