import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, Trash2, Zap, MessageSquare, CheckCircle, Info } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import styles from './NotificationCenter.module.css'

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const ICONS = {
  match: <Zap size={16} />,
  claim: <MessageSquare size={16} />,
  resolved: <CheckCircle size={16} />,
  info: <Info size={16} />,
}

const COLORS = {
  match: '#f59e0b',
  claim: '#6366f1',
  resolved: '#34d399',
  info: '#06b6d4',
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications()

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleClick = (notif) => {
    markAsRead(notif.id)
    if (notif.link) navigate(notif.link)
    setOpen(false)
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.bellBtn} onClick={() => setOpen(o => !o)} aria-label="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h4>Notifications</h4>
            <div className={styles.headerActions}>
              {unreadCount > 0 && (
                <button onClick={markAllRead} title="Mark all read">
                  <Check size={14} /> Read all
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} title="Clear all">
                  <Trash2 size={14} /> Clear
                </button>
              )}
            </div>
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <Bell size={24} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}
                  onClick={() => handleClick(n)}
                >
                  <div className={styles.notifIcon} style={{ background: `${COLORS[n.type]}18`, color: COLORS[n.type] }}>
                    {ICONS[n.type]}
                  </div>
                  <div className={styles.notifContent}>
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <span className={styles.notifTime}>{timeAgo(n.time)}</span>
                  </div>
                  {!n.read && <span className={styles.dot} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
