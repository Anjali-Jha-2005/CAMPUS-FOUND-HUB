import { useState, useEffect } from 'react'

const NOTIF_KEY = 'cfh_notifications'

function loadNotifs() {
  try {
    const raw = localStorage.getItem(NOTIF_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return getDefaultNotifications()
}

function saveNotifs(notifs) {
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs)) } catch {}
}

function getDefaultNotifications() {
  return [
    {
      id: 'n1',
      type: 'match',
      title: 'Potential Match Found!',
      message: 'A found "iPhone 14 (Black)" near Cafeteria might match a lost item.',
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      link: '/smart-match',
    },
    {
      id: 'n2',
      type: 'claim',
      title: 'New Claim Request',
      message: 'Someone claimed the "Set of Keys" you found at Hostel D.',
      time: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      link: '/dashboard',
    },
    {
      id: 'n3',
      type: 'resolved',
      title: 'Item Resolved 🎉',
      message: 'The "Set of Keys (3 keys + fob)" has been successfully reunited!',
      time: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      link: '/item/seed-4',
    },
    {
      id: 'n4',
      type: 'info',
      title: 'Welcome to Campus Found Hub!',
      message: 'Start by browsing items or reporting something you lost or found.',
      time: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      link: '/browse',
    },
  ]
}

export function useNotifications() {
  const [notifications, setNotifications] = useState(loadNotifs)

  useEffect(() => { saveNotifs(notifications) }, [notifications])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = (notif) => {
    const newNotif = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: new Date().toISOString(),
      read: false,
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return { notifications, unreadCount, addNotification, markAsRead, markAllRead, clearAll }
}
