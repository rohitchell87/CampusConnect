import api from '../api/axios'

const likeUser = (receiverId) => api.post(`/api/likes/${receiverId}`).then(r=>r.data)
const unlikeUser = (receiverId) => api.delete(`/api/likes/${receiverId}`).then(r=>r.data)

export default { likeUser, unlikeUser }
