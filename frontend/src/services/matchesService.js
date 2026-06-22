import api from '../api/axios'

const getMatches = () => api.get('/api/matches').then(r => r.data)

export default { getMatches }
