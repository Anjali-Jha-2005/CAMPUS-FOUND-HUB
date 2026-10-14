import { useState, useEffect } from 'react'

const USER_KEY = 'cfh_user'

const DEFAULT_USER = {
  name: 'Student',
  email: '',
  avatar: '👤',
  joinedAt: new Date().toISOString(),
}

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_USER
}

function saveUser(user) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)) } catch {}
}

export function useUser() {
  const [user, setUser] = useState(loadUser)

  useEffect(() => { saveUser(user) }, [user])

  const login = (email, name) => {
    const u = {
      ...DEFAULT_USER,
      email,
      name: name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      joinedAt: new Date().toISOString(),
    }
    setUser(u)
  }

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const logout = () => {
    setUser(DEFAULT_USER)
    localStorage.removeItem(USER_KEY)
  }

  return { user, login, updateUser, logout }
}
