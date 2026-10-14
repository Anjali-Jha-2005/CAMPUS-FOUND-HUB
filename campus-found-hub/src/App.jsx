import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Report from './pages/Report'
import ItemDetail from './pages/ItemDetail'
import Dashboard from './pages/Dashboard'
import SmartMatch from './pages/SmartMatch'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [authView, setAuthView] = useState('login')

  if (loading) return <div className="loading-screen">Loading...</div>

  if (!isAuthenticated) {
    if (authView === 'login') {
      return <Login onGoToSignup={() => setAuthView('signup')} />
    } else {
      return <Signup onGoToLogin={() => setAuthView('login')} />
    }
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/report" element={<Report />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/smart-match" element={<SmartMatch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
