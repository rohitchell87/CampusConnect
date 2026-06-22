import React, { createContext, useState, useEffect } from 'react'
import api from '../api/axios'
import profileService from '../services/profileService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('cc_token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(()=>{
    if(token){
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  useEffect(()=>{
    const loadProfile = async () => {
      if (!token) return
      setProfileLoading(true)
      try{
        const profile = await profileService.getMyProfile()
        setUser(profile)
      }catch(err){
        console.error('Failed to load profile', err)
        logout()
      }finally{
        setProfileLoading(false)
      }
    }

    loadProfile()
  }, [token])

  const isProfileComplete = (profile) => {
    return !!profile && !!profile.profilePhoto && !!profile.coverPhoto && Array.isArray(profile.interests) && profile.interests.length > 0
  }

  const login = async (credentials) => {
    setLoading(true)
    try{
      const res = await api.post('/api/auth/login', credentials)
      const jwt = res.data.token || res.data.accessToken || res.data.access_token || res.data.jwt
      if(!jwt) throw new Error('No token in response')
      localStorage.setItem('cc_token', jwt)
      setToken(jwt)
      api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
      const profile = await profileService.getMyProfile()
      setUser(profile)
      toast.success('Logged in')
      navigate(isProfileComplete(profile) ? '/discover' : '/complete-profile')
    }catch(err){
      const msg = err?.response?.data?.message || err?.response?.data || err.message || 'Login failed'
      toast.error(msg)
      throw err
    }finally{ setLoading(false) }
  }

  const register = async (payload) => {
    setLoading(true)
    try{
      const res = await api.post('/api/auth/register', payload)
      toast.success('Registered successfully. Please login.')
      navigate('/login')
      return res.data
    }catch(err){
      const msg = err?.response?.data?.message || err?.response?.data || err.message || 'Register failed'
      toast.error(msg)
      throw err
    }finally{ setLoading(false) }
  }

  const logout = ()=>{
    localStorage.removeItem('cc_token')
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common['Authorization']
    navigate('/login')
  }

  const isAuthenticated = () => !!token

  return (
    <AuthContext.Provider value={{ token, user, setUser, loading, profileLoading, login, logout, register, isAuthenticated, isProfileComplete }}>
      {children}
    </AuthContext.Provider>
  )
}
