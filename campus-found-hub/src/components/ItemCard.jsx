import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Tag, ImageIcon } from 'lucide-react'
import { formatDate, timeAgo } from '../utils/helpers'
import styles from './ItemCard.module.css'

export default function ItemCard({ item }) {
  const isLost = item.type === 'lost'

  return (
    <Link to={`/item/${item._id}`} className={styles.card}>
      {/* Image */}
      {item.image && (
        <div className={styles.imageWrap}>
          <img src={item.image} alt={item.title} className={styles.image} />
        </div>
      )}

      <div className={styles.header}>
        <span className={`${styles.badge} ${isLost ? styles.lost : styles.found}`}>
          {isLost ? '🔍 Lost' : '✅ Found'}
        </span>
        {item.status === 'resolved' && (
          <span className={styles.resolved}>Resolved</span>
        )}
        <span className={styles.time}>{timeAgo(item.createdAt)}</span>
      </div>

      <h3 className={styles.title}>{item.title}</h3>

      <p className={styles.desc}>{item.description}</p>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <MapPin size={12} />
          {item.location}
        </span>
        <span className={styles.metaItem}>
          <Calendar size={12} />
          {formatDate(item.date)}
        </span>
      </div>

      <div className={styles.footer}>
        <span className={styles.category}>
          <Tag size={11} />
          {item.category}
        </span>
        <span className={`${styles.dot} ${isLost ? styles.dotLost : styles.dotFound}`} />
      </div>
    </Link>
  )
}
