import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Clock, CheckCircle, Archive, Zap, RotateCcw, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useItems } from '../hooks/useItems'
import { findMatches } from '../utils/matching'
import { timeAgo, formatDate } from '../utils/helpers'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { items, updateStatus, deleteItem } = useItems()
  const { logout } = useAuth()
  const [filter, setFilter] = useState('all')

  const safeItems = Array.isArray(items) ? items : []
  const lostOpen = safeItems.filter(i => i.type === 'lost' && i.status === 'open').length
  const foundOpen = safeItems.filter(i => i.type === 'found' && i.status === 'open').length
  const resolved = safeItems.filter(i => i.status === 'resolved').length
  const claimed = safeItems.filter(i => i.claimedBy).length
  const total = safeItems.length
  const matches = useMemo(() => findMatches(safeItems), [safeItems])

  const filtered = filter === 'all' ? safeItems
    : filter === 'lost' ? safeItems.filter(i => i.type === 'lost')
    : filter === 'found' ? safeItems.filter(i => i.type === 'found')
    : safeItems.filter(i => i.status === 'resolved')

  // Category data for horizontal chart
  const categoryData = useMemo(() => {
    const counts = {}
    safeItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [safeItems])
  const maxCatCount = categoryData.length > 0 ? categoryData[0][1] : 1

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.sub}>Overview of all campus lost & found activity</p>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      {/* Stat cards */}
      <div className={styles.statGrid}>
        <StatCard icon={<Clock size={20}/>} label="Lost (Open)" value={lostOpen} color="red" />
        <StatCard icon={<CheckCircle size={20}/>} label="Found (Open)" value={foundOpen} color="green" />
        <StatCard icon={<Archive size={20}/>} label="Resolved" value={resolved} color="teal" />
        <StatCard icon={<Zap size={20}/>} label="AI Matches" value={matches.length} color="accent" />
      </div>

      {/* Charts Section */}
      <div className={styles.chartsRow}>
        {/* Donut Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Status Overview</h3>
          <div className={styles.donutWrap}>
            <svg className={styles.donut} viewBox="0 0 36 36">
              <circle className={styles.donutBg} cx="18" cy="18" r="15.915" fill="none" strokeWidth="3" />
              <circle
                className={styles.donutSegment}
                cx="18" cy="18" r="15.915" fill="none" strokeWidth="3"
                stroke="#f87171"
                strokeDasharray={`${total > 0 ? (lostOpen / total) * 100 : 0} ${100 - (total > 0 ? (lostOpen / total) * 100 : 0)}`}
                strokeDashoffset="25"
              />
              <circle
                className={styles.donutSegment}
                cx="18" cy="18" r="15.915" fill="none" strokeWidth="3"
                stroke="#34d399"
                strokeDasharray={`${total > 0 ? (foundOpen / total) * 100 : 0} ${100 - (total > 0 ? (foundOpen / total) * 100 : 0)}`}
                strokeDashoffset={`${25 - (total > 0 ? (lostOpen / total) * 100 : 0)}`}
              />
              <circle
                className={styles.donutSegment}
                cx="18" cy="18" r="15.915" fill="none" strokeWidth="3"
                stroke="#2dd4bf"
                strokeDasharray={`${total > 0 ? (resolved / total) * 100 : 0} ${100 - (total > 0 ? (resolved / total) * 100 : 0)}`}
                strokeDashoffset={`${25 - (total > 0 ? ((lostOpen + foundOpen) / total) * 100 : 0)}`}
              />
            </svg>
            <div className={styles.donutCenter}>
              <span className={styles.donutTotal}>{total}</span>
              <span className={styles.donutLabel}>Total</span>
            </div>
          </div>
          <div className={styles.legend}>
            <span><i style={{ background: '#f87171' }} /> Lost ({lostOpen})</span>
            <span><i style={{ background: '#34d399' }} /> Found ({foundOpen})</span>
            <span><i style={{ background: '#2dd4bf' }} /> Resolved ({resolved})</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Top Categories</h3>
          <div className={styles.barChart}>
            {categoryData.map(([cat, count]) => (
              <div key={cat} className={styles.barRow}>
                <span className={styles.barLabel}>{cat}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(count / maxCatCount) * 100}%` }}
                  />
                </div>
                <span className={styles.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={styles.tabs}>
        {['all','lost','found','resolved'].map(t => (
          <button
            key={t}
            className={`${styles.tab} ${filter === t ? styles.activeTab : ''}`}
            onClick={() => setFilter(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className={styles.tabCount}>
              {t === 'all' ? total
                : t === 'lost' ? safeItems.filter(i=>i.type==='lost').length
                : t === 'found' ? safeItems.filter(i=>i.type==='found').length
                : resolved}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Category</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item._id}>
                <td>
                  <Link to={`/item/${item._id}`} className={styles.itemLink}>
                    {item.title}
                  </Link>
                  <div className={styles.timeAgo}>{timeAgo(item.createdAt)}</div>
                </td>
                <td>
                  <span className={`${styles.typeBadge} ${item.type === 'lost' ? styles.lost : styles.found}`}>
                    {item.type === 'lost' ? '🔍' : '✅'} {item.type}
                  </span>
                </td>
                <td className={styles.dim}>{item.category}</td>
                <td className={styles.dim}>{item.location}</td>
                <td className={styles.dim}>{formatDate(item.date)}</td>
                <td>
                  <span className={`${styles.status} ${item.status === 'resolved' ? styles.statusResolved : styles.statusOpen}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className={styles.rowActions}>
                    {item.status === 'open' ? (
                      <button
                        className={styles.resolveBtn}
                        onClick={() => updateStatus(item._id, 'resolved')}
                        title="Mark resolved"
                      >
                        <CheckCircle size={14}/>
                      </button>
                    ) : (
                      <button
                        className={styles.reopenBtn}
                        onClick={() => updateStatus(item._id, 'open')}
                        title="Reopen"
                      >
                        <RotateCcw size={14}/>
                      </button>
                    )}
                    <button
                      className={styles.deleteBtn}
                      onClick={() => { if(window.confirm('Delete?')) deleteItem(item._id) }}
                      title="Delete"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.empty}>No listings in this filter.</div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`${styles.statCard} ${styles[`c_${color}`]}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div>
        <div className={styles.statVal}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}
