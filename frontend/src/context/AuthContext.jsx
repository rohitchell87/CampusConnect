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

  // Handle OAuth redirect with token param (e.g. /?token=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const t = params.get('token') || params.get('access_token')
      const err = params.get('error')
      if (err) {
        toast.error(`Google sign-in failed: ${err}`)
      }
      if (t && !token) {
        localStorage.setItem('cc_token', t)
        setToken(t)
        api.defaults.headers.common['Authorization'] = `Bearer ${t}`
        // remove token from URL
        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        url.searchParams.delete('access_token')
        window.history.replaceState({}, document.title, url.pathname + url.search)
      }
    } catch (err) {
      console.error('Failed to process OAuth token from URL', err)
    }
  }, [])

  useEffect(()=>{
    const loadProfile = async () => {
      if (!token) return
      setProfileLoading(true)
      try{
        const profile = await profileService.getMyProfile()
        setUser(profile)
        // If we landed on the root or login page after OAuth redirect, navigate appropriately
        const currentPath = window.location.pathname
        if (currentPath === '/' || currentPath === '/login') {
          navigate(isProfileComplete(profile) ? '/discover' : '/complete-profile')
        }
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

  const requestPasswordReset = async (email) => {
    try{
      const res = await api.post('/api/auth/forgot-password', { email })
      return res.data
    }catch(err){
      const msg = err?.response?.data?.message || err?.response?.data || err.message || 'Failed to request password reset'
      toast.error(msg)
      throw err
    }
  }

  const loginWithGoogle = async () => {
    try{
      const backend = import.meta?.env?.VITE_API_BASE || 'http://localhost:8080'
      // Redirect the browser to Spring Security's OAuth2 authorization endpoint
      window.location.href = `${backend}/oauth2/authorization/google`
    }catch(err){
      toast.error('Unable to start Google sign-in. Try again later.')
    }
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
    <AuthContext.Provider value={{ token, user, setUser, loading, profileLoading, login, logout, register, isAuthenticated, isProfileComplete, requestPasswordReset, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
