import React, { useMemo } from 'react'
import { BarChart3, TrendingUp, MapPin, Clock, PieChart, Activity } from 'lucide-react'
import { useItems } from '../hooks/useItems'
import { CATEGORIES, LOCATIONS } from '../utils/helpers'
import styles from './Analytics.module.css'

export default function Analytics() {
  const { items } = useItems()

  const stats = useMemo(() => {
    const total = items.length
    const lost = items.filter(i => i.type === 'lost')
    const found = items.filter(i => i.type === 'found')
    const open = items.filter(i => i.status === 'open')
    const resolved = items.filter(i => i.status === 'resolved')
    const claimed = items.filter(i => i.claimedBy)
    const recoveryRate = total > 0 ? Math.round((resolved.length / total) * 100) : 0

    // Category breakdown
    const catCounts = {}
    items.forEach(i => { catCounts[i.category] = (catCounts[i.category] || 0) + 1 })
    const categoryData = Object.entries(catCounts).sort((a, b) => b[1] - a[1])
    const maxCat = categoryData.length > 0 ? categoryData[0][1] : 1

    // Location breakdown
    const locCounts = {}
    items.forEach(i => { locCounts[i.location] = (locCounts[i.location] || 0) + 1 })
    const locationData = Object.entries(locCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    const maxLoc = locationData.length > 0 ? locationData[0][1] : 1

    // Lost vs Found by category
    const catLostFound = {}
    CATEGORIES.forEach(c => { catLostFound[c] = { lost: 0, found: 0 } })
    items.forEach(i => {
      if (catLostFound[i.category]) catLostFound[i.category][i.type]++
    })
    const catCompare = Object.entries(catLostFound)
      .filter(([, v]) => v.lost + v.found > 0)
      .sort((a, b) => (b[1].lost + b[1].found) - (a[1].lost + a[1].found))

    // Time distribution (by day of week)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayCounts = [0, 0, 0, 0, 0, 0, 0]
    items.forEach(i => {
      const d = new Date(i.date).getDay()
      if (!isNaN(d)) dayCounts[d]++
    })
    const maxDay = Math.max(...dayCounts, 1)

    return {
      total, lost: lost.length, found: found.length,
      open: open.length, resolved: resolved.length,
      claimed: claimed.length, recoveryRate,
      categoryData, maxCat,
      locationData, maxLoc,
      catCompare,
      dayNames, dayCounts, maxDay,
    }
  }, [items])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerIcon}><BarChart3 size={24} /></div>
        <div>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.sub}>Campus lost & found insights and trends at a glance.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KpiCard label="Total Items" value={stats.total} icon={<Activity size={18} />} color="accent" />
        <KpiCard label="Lost Items" value={stats.lost} icon={<Clock size={18} />} color="red" />
        <KpiCard label="Found Items" value={stats.found} icon={<TrendingUp size={18} />} color="green" />
        <KpiCard label="Recovery Rate" value={`${stats.recoveryRate}%`} icon={<PieChart size={18} />} color="teal" />
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Donut */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Status Distribution</h3>
          <div className={styles.donutWrap}>
            <svg className={styles.donut} viewBox="0 0 36 36">
              <circle className={styles.donutBg} cx="18" cy="18" r="15.915" fill="none" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="15.915" fill="none" strokeWidth="3.5"
                stroke="#f87171"
                strokeDasharray={`${stats.total > 0 ? ((stats.lost - (stats.resolved > 0 ? Math.round(stats.resolved * stats.lost / stats.total) : 0)) / stats.total) * 100 : 0} 100`}
                strokeDashoffset="25"
                strokeLinecap="round"
              />
              <circle cx="18" cy="18" r="15.915" fill="none" strokeWidth="3.5"
                stroke="#34d399"
                strokeDasharray={`${stats.total > 0 ? (stats.found / stats.total) * 100 : 0} 100`}
                strokeDashoffset={`${25 - (stats.total > 0 ? (stats.lost / stats.total) * 100 : 0)}`}
                strokeLinecap="round"
              />
              <circle cx="18" cy="18" r="15.915" fill="none" strokeWidth="3.5"
                stroke="#2dd4bf"
                strokeDasharray={`${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0} 100`}
                strokeDashoffset={`${25 - (stats.total > 0 ? ((stats.lost + stats.found) / stats.total) * 100 : 0)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.donutCenter}>
              <span className={styles.donutTotal}>{stats.total}</span>
              <span className={styles.donutLabel}>Items</span>
            </div>
          </div>
          <div className={styles.legend}>
            <span><i style={{ background: '#f87171' }} /> Lost ({stats.lost})</span>
            <span><i style={{ background: '#34d399' }} /> Found ({stats.found})</span>
            <span><i style={{ background: '#2dd4bf' }} /> Resolved ({stats.resolved})</span>
          </div>
        </div>

        {/* Weekly Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Weekly Activity Pattern</h3>
          <div className={styles.weekChart}>
            {stats.dayNames.map((day, i) => (
              <div key={day} className={styles.weekCol}>
                <span className={styles.weekCount}>{stats.dayCounts[i]}</span>
                <div className={styles.weekBarTrack}>
                  <div
                    className={styles.weekBarFill}
                    style={{ height: `${(stats.dayCounts[i] / stats.maxDay) * 100}%` }}
                  />
                </div>
                <span className={styles.weekDay}>{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category & Location */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Top Categories</h3>
          <div className={styles.barChart}>
            {stats.categoryData.map(([cat, count]) => (
              <div key={cat} className={styles.barRow}>
                <span className={styles.barLabel}>{cat}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${(count / stats.maxCat) * 100}%` }} />
                </div>
                <span className={styles.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}><MapPin size={16} /> Hotspot Locations</h3>
          <div className={styles.barChart}>
            {stats.locationData.map(([loc, count]) => (
              <div key={loc} className={styles.barRow}>
                <span className={styles.barLabel}>{loc}</span>
                <div className={styles.barTrack}>
                  <div className={`${styles.barFill} ${styles.barFillCyan}`} style={{ width: `${(count / stats.maxLoc) * 100}%` }} />
                </div>
                <span className={styles.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lost vs Found comparison */}
      <div className={styles.chartCardFull}>
        <h3 className={styles.chartTitle}>Lost vs Found by Category</h3>
        <div className={styles.compareGrid}>
          {stats.catCompare.map(([cat, { lost, found }]) => {
            const max = Math.max(lost, found, 1)
            return (
              <div key={cat} className={styles.compareRow}>
                <span className={styles.compareLabel}>{cat}</span>
                <div className={styles.compareBars}>
                  <div className={styles.compareBarLeft}>
                    <div className={styles.compareFillLost} style={{ width: `${(lost / max) * 100}%` }} />
                  </div>
                  <span className={styles.compareCount}>{lost}</span>
                  <span className={styles.compareDivider}>|</span>
                  <span className={styles.compareCount}>{found}</span>
                  <div className={styles.compareBarRight}>
                    <div className={styles.compareFillFound} style={{ width: `${(found / max) * 100}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
          <div className={styles.compareLegend}>
            <span className={styles.legendLost}>🔍 Lost</span>
            <span className={styles.legendFound}>✅ Found</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, icon, color }) {
  return (
    <div className={`${styles.kpiCard} ${styles[`k_${color}`]}`}>
      <div className={styles.kpiIcon}>{icon}</div>
      <div>
        <div className={styles.kpiValue}>{value}</div>
        <div className={styles.kpiLabel}>{label}</div>
      </div>
    </div>
  )
}
