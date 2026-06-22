import api from '../api/axios'

const discover = (page = 0, size = 10) => {
  return api.get('/api/users/discover', { params: { page, size } }).then(r => r.data)
}

export default { discover }
