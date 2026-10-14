import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, ShieldCheck, Bell } from 'lucide-react'
import ItemCard from '../components/ItemCard'
import { useItems } from '../hooks/useItems'
import styles from './Home.module.css'

export default function Home() {
  const { items } = useItems()
  const safeItems = Array.isArray(items) ? items : []
  const recent = safeItems.slice(0, 6)
  const lostCount = safeItems.filter(i => i.type === 'lost' && i.status === 'open').length
  const foundCount = safeItems.filter(i => i.type === 'found' && i.status === 'open').length
  const resolvedCount = safeItems.filter(i => i.status === 'resolved').length

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.pill}>🎓 Campus Lost & Found Network</div>
          <h1 className={styles.heroTitle}>
            Lost something?<br />
            <span className={styles.accent}>We'll help you find it.</span>
          </h1>
          <p className={styles.heroSub}>
            A campus-wide portal to report lost items and reunite found belongings with their owners. Fast, simple, free.
          </p>
          <div className={styles.heroActions}>
            <Link to="/report?type=lost" className={styles.btnPrimary}>
              <Search size={16} /> I Lost Something
            </Link>
            <Link to="/report?type=found" className={styles.btnSecondary}>
              <Plus size={16} /> I Found Something
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{lostCount}</span>
          <span className={styles.statLabel}>Active Lost Reports</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{foundCount}</span>
          <span className={styles.statLabel}>Items Found</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={`${styles.statNum} ${styles.green}`}>{resolvedCount}</span>
          <span className={styles.statLabel}>Successfully Reunited</span>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.steps}>
          {[
            { icon: <Search size={22}/>, title: 'Report', desc: 'Post a lost or found item with location, date, and description.' },
            { icon: <Bell size={22}/>, title: 'Connect', desc: 'Browse the portal. Contact the reporter directly via email.' },
            { icon: <ShieldCheck size={22}/>, title: 'Reunite', desc: "Mark the item as resolved once it's returned. Community helps community." },
          ].map((s, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent items */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <Link to="/browse" className={styles.viewAll}>View all →</Link>
        </div>
        <div className={styles.grid}>
          {recent.map(item => <ItemCard key={item._id} item={item} />)}
        </div>
      </section>
    </div>
  )
}
