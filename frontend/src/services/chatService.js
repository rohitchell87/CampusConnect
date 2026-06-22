import api from '../api/axios'

const getConversation = (receiverId) => api.get(`/api/chat/conversation/${receiverId}`).then(r => r.data)

const sendMessage = (payload) => api.post('/api/chat/send', payload).then(r => r.data)

export default {
  getConversation,
  sendMessage,
}
