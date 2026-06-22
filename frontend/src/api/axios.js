import axios from 'axios'

const baseURL = import.meta?.env?.VITE_API_BASE || 'http://localhost:8080'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach token from localStorage to every request if present
api.interceptors.request.use((cfg)=>{
  const token = localStorage.getItem('cc_token')
  if(token){
    cfg.headers['Authorization'] = `Bearer ${token}`
  }
  return cfg
}, (err)=>Promise.reject(err))

export default api
