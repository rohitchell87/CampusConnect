import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Discover from '../pages/discover/Discover'
import Profile from '../pages/profile/Profile'
import CompleteProfile from '../pages/profile/CompleteProfile'
import Matches from '../pages/matches/Matches'
import Chat from '../pages/chat/Chat'
import NotFound from '../pages/NotFound'
import ProtectedRoute from '../components/common/ProtectedRoute'
import RequireProfileComplete from '../components/common/RequireProfileComplete'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/discover" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/discover" element={<ProtectedRoute><RequireProfileComplete><Discover /></RequireProfileComplete></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
