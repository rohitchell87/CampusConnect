import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Discover from '../pages/discover/Discover'
import Profile from '../pages/profile/Profile'
import CompleteProfile from '../pages/profile/CompleteProfile'
import Matches from '../pages/matches/Matches'
import Notifications from '../pages/notifications/Notifications'
import Chat from '../pages/chat/Chat'
import Likes from '../pages/likes/Likes'
import Settings from '../pages/settings/SettingsNew'
import BlockedUsersPage from '../components/moderation/BlockedUsersPage'
import NotFound from '../pages/NotFound'
import ProtectedRoute from '../components/common/ProtectedRoute'
import RequireProfileComplete from '../components/common/RequireProfileComplete'
import AppLayout from '../components/layout/AppLayout'
import { AuthContext } from '../context/AuthContext'

function RootRedirect() {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) return <div className="page-center">Loading...</div>
  return isAuthenticated() ? <Navigate to="/discover" replace /> : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="discover"
          element={
            <RequireProfileComplete>
              <Discover />
            </RequireProfileComplete>
          }
        />
        <Route path="likes" element={<Likes />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="matches" element={<Matches />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/blocked-users" element={<BlockedUsersPage />} />
      </Route>

      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
