import api from '../api/axios'

const getMyProfile = () => api.get('/api/profile/me').then(r=>r.data)

const updateProfile = (payload) => api.put('/api/profile/me', payload).then(r=>r.data)

const getInterests = () => api.get('/api/interests').then(r=>r.data)

const updateInterests = (payload) => api.put('/api/profile/interests', payload).then(r=>r.data)

const uploadProfilePhoto = (file, onProgress) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/api/profile/photo', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if(onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
    }
  }).then(r=>r.data)
}

const uploadCoverPhoto = (file, onProgress) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.put('/api/profile/cover', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if(onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
    }
  }).then(r=>r.data)
}

export default {
  getMyProfile,
  updateProfile,
  getInterests,
  updateInterests,
  uploadProfilePhoto,
  uploadCoverPhoto
}
