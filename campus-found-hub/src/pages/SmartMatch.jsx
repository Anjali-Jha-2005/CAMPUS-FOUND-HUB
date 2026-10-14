import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Zap, MapPin, Calendar, Tag, ArrowRight } from 'lucide-react'
import { useItems } from '../hooks/useItems'
import { findMatches } from '../utils/matching'
import { formatDate } from '../utils/helpers'
import styles from './SmartMatch.module.css'

export default function SmartMatch() {
  const { items } = useItems()
  const matches = useMemo(() => findMatches(items, 20), [items])

  const highMatches = matches.filter(m => m.confidence === 'high')
  const medMatches = matches.filter(m => m.confidence === 'medium')
  const lowMatches = matches.filter(m => m.confidence === 'low')

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerIcon}><Zap size={24} /></div>
        <div>
          <h1 className={styles.title}>Smart Match AI</h1>
          <p className={styles.sub}>
            Our algorithm analyzes lost & found items to suggest potential matches based on category, location, date, and description.
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryNum}>{matches.length}</span>
          <span className={styles.summaryLabel}>Total Matches</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryNum} ${styles.high}`}>{highMatches.length}</span>
          <span className={styles.summaryLabel}>High Confidence</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryNum} ${styles.medium}`}>{medMatches.length}</span>
          <span className={styles.summaryLabel}>Medium</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={`${styles.summaryNum} ${styles.low}`}>{lowMatches.length}</span>
          <span className={styles.summaryLabel}>Low</span>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyEmoji}>🤖</span>
          <h3>No matches found yet</h3>
          <p>As more items are reported, matches will appear here automatically.</p>
        </div>
      ) : (
        <div className={styles.matchList}>
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}

function MatchCard({ match }) {
  const { lostItem, foundItem, score, reasons, confidence } = match

  return (
    <div className={`${styles.matchCard} ${styles[`conf_${confidence}`]}`}>
      <div className={styles.matchHeader}>
        <div className={`${styles.confidenceBadge} ${styles[confidence]}`}>
          <Zap size={12} />
          {score}% Match — {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
        </div>
        <div className={styles.reasons}>
          {reasons.map((r, i) => (
            <span key={i} className={styles.reason}>{r}</span>
          ))}
        </div>
      </div>

      <div className={styles.matchBody}>
        {/* Lost item */}
        <Link to={`/item/${lostItem.id}`} className={styles.matchItem}>
          <div className={styles.matchItemType}>
            <span className={styles.lostBadge}>🔍 LOST</span>
          </div>
          <h4>{lostItem.title}</h4>
          <div className={styles.matchMeta}>
            <span><MapPin size={11} /> {lostItem.location}</span>
            <span><Calendar size={11} /> {formatDate(lostItem.date)}</span>
            <span><Tag size={11} /> {lostItem.category}</span>
          </div>
          <p className={styles.matchDesc}>{lostItem.description}</p>
        </Link>

        {/* Arrow */}
        <div className={styles.matchArrow}>
          <ArrowRight size={20} />
        </div>

        {/* Found item */}
        <Link to={`/item/${foundItem.id}`} className={styles.matchItem}>
          <div className={styles.matchItemType}>
            <span className={styles.foundBadge}>✅ FOUND</span>
          </div>
          <h4>{foundItem.title}</h4>
          <div className={styles.matchMeta}>
            <span><MapPin size={11} /> {foundItem.location}</span>
            <span><Calendar size={11} /> {formatDate(foundItem.date)}</span>
            <span><Tag size={11} /> {foundItem.category}</span>
          </div>
          <p className={styles.matchDesc}>{foundItem.description}</p>
        </Link>
      </div>
    </div>
  )
}
