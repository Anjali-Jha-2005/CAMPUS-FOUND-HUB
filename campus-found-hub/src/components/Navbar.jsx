import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MapPin, Menu, X, User, Sun, Moon } from 'lucide-react'
import NotificationCenter from './NotificationCenter'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('cfh_theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cfh_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const links = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
    { to: '/report', label: 'Report Item' },
    { to: '/smart-match', label: '🤖 Smart Match' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analytics', label: '📊 Analytics' },
  ]

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <MapPin size={20} strokeWidth={2.5} />
        <span>Campus<strong>Found</strong>Hub</span>
      </Link>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        {links.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={pathname === l.to ? styles.active : ''}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/report" className={styles.cta} onClick={() => setOpen(false)}>
            + Post Item
          </Link>
        </li>
      </ul>

      <div className={styles.rightSection}>
        <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <NotificationCenter />
        <Link to="/profile" className={styles.profileBtn} title="My Profile">
          <User size={18} />
        </Link>
      </div>

      <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </nav>
  )
}
