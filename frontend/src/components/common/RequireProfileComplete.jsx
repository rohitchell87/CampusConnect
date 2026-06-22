import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

export default function RequireProfileComplete({ children }){
  const { user, profileLoading, isProfileComplete } = useContext(AuthContext)
  const location = useLocation()

  if(profileLoading) {
    return <div className="page-center">Loading profile...</div>
  }

  if(!user) {
    return <div className="page-center">Loading profile...</div>
  }

  if(!isProfileComplete(user) && location.pathname !== '/complete-profile'){
    return <Navigate to="/complete-profile" replace />
  }

  return children
}
