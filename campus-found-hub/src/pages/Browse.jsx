import React, { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import ItemCard from '../components/ItemCard'
import { useItems } from '../hooks/useItems'
import { CATEGORIES, LOCATIONS } from '../utils/helpers'
import styles from './Browse.module.css'

export default function Browse() {
  const { items } = useItems()
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('open')

  const filtered = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : []
    return safeItems.filter(item => {
      if (type !== 'all' && item.type !== type) return false
      if (category && item.category !== category) return false
      if (location && item.location !== location) return false
      if (status !== 'all' && item.status !== status) return false
      if (q) {
        const lower = q.toLowerCase()
        return (
          item.title.toLowerCase().includes(lower) ||
          item.description.toLowerCase().includes(lower) ||
          item.location.toLowerCase().includes(lower) ||
          (item.tags || []).some(t => t.includes(lower))
        )
      }
      return true
    })
  }, [items, q, type, category, location, status])

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <h1 className={styles.title}>Browse Items</h1>
        <p className={styles.sub}>{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by title, description, location, or tag..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label><SlidersHorizontal size={13}/> Type</label>
          <div className={styles.pills}>
            {['all','lost','found'].map(t => (
              <button
                key={t}
                className={`${styles.pill} ${type === t ? styles.active : ''}`}
                onClick={() => setType(t)}
              >
                {t === 'all' ? 'All' : t === 'lost' ? '🔍 Lost' : '✅ Found'}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>
          <div className={styles.pills}>
            {['open','resolved','all'].map(s => (
              <button
                key={s}
                className={`${styles.pill} ${status === s ? styles.active : ''}`}
                onClick={() => setStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.selects}>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">All Locations</option>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyEmoji}>🔎</span>
          <h3>No items match your filters</h3>
          <p>Try adjusting the search or filters above.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(item => <ItemCard key={item._id} item={item} />)}
        </div>
      )}
    </div>
  )
}
