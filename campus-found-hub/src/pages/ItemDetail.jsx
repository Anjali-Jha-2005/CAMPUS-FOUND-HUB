import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Calendar, Mail, Tag, ArrowLeft, CheckCircle, Trash2, MessageSquare, X, Send, Image } from 'lucide-react'
import { useItems } from '../hooks/useItems'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../hooks/useUser'
import { formatDate, timeAgo } from '../utils/helpers'
import styles from './ItemDetail.module.css'

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, updateStatus, deleteItem, claimItem, loading } = useItems()
  const { user } = useAuth()
  const item = items.find(i => i._id === id)
  const [showClaim, setShowClaim] = useState(false)
  const [claimMsg, setClaimMsg] = useState('')
  const [claimSent, setClaimSent] = useState(false)

  if (!item) {
    return (
      <div className={styles.notFound}>
        <h2>Item not found</h2>
        <Link to="/browse">← Back to Browse</Link>
      </div>
    )
  }

  const isLost = item.type === 'lost'
  const isClaimed = !!item.claimedBy // Note: This logic will need update if we fetch real claims
  const isMyItem = item.user._id === user?._id
  const iMyClaim = item.claimedBy === user?.email

  const handleDelete = () => {
    if (window.confirm('Delete this listing?')) {
      deleteItem(id)
      navigate('/browse')
    }
  }

  const handleClaim = async () => {
    if (!claimMsg.trim()) return
    try {
      await claimItem(id, claimMsg)
      setClaimSent(true)
      setTimeout(() => {
        setShowClaim(false)
        setClaimSent(false)
      }, 2000)
    } catch (err) {
      alert('Failed to send claim')
    }
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${isLost ? styles.lost : styles.found}`}>
              {isLost ? '🔍 Lost' : '✅ Found'}
            </span>
            {item.status === 'resolved' && (
              <span className={styles.resolved}>✓ Resolved</span>
            )}
            {isClaimed && (
              <span className={styles.claimedBadge}>📋 Claimed</span>
            )}
          </div>
          <span className={styles.time}>{timeAgo(item.createdAt)}</span>
        </div>

        {item.image && (
          <div className={styles.detailImage}>
            <img src={item.image} alt={item.title} />
          </div>
        )}

        <h1 className={styles.title}>{item.title}</h1>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <MapPin size={15} />
            <div>
              <span className={styles.metaLabel}>Location</span>
              <span className={styles.metaVal}>{item.location}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <Calendar size={15} />
            <div>
              <span className={styles.metaLabel}>Date</span>
              <span className={styles.metaVal}>{formatDate(item.date)}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <Tag size={15} />
            <div>
              <span className={styles.metaLabel}>Category</span>
              <span className={styles.metaVal}>{item.category}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <Mail size={15} />
            <div>
              <span className={styles.metaLabel}>Reporter</span>
              <a href={`mailto:${item.user?.email}`} className={styles.contact}>{item.user?.name}</a>
            </div>
          </div>
        </div>

        <div className={styles.desc}>
          <h3>Description</h3>
          <p>{item.description}</p>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className={styles.tags}>
            {item.tags.map(t => (
              <span key={t} className={styles.tag}>#{t}</span>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          {item.status === 'open' ? (
            <button
              className={styles.resolveBtn}
              onClick={() => updateStatus(id, 'resolved')}
            >
              <CheckCircle size={16} /> Mark as Resolved
            </button>
          ) : (
            <button
              className={styles.reopenBtn}
              onClick={() => updateStatus(id, 'open')}
            >
              Reopen Listing
            </button>
          )}
          <button className={styles.deleteBtn} onClick={handleDelete}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Claim Section */}
      {item.status === 'open' && (
        <div className={styles.claimSection}>
          <h3><MessageSquare size={18} /> Claim This Item</h3>
          <p>
            {isLost
              ? 'Found this item? Submit a claim and the owner will be notified.'
              : 'Is this yours? Submit a claim to get it back.'}
          </p>

          {isClaimed && !iMyClaim && (
            <div className={styles.claimInfo}>
              <span className={styles.claimInfoIcon}>📋</span>
              <div>
                <strong>This item has been claimed</strong>
                <p>by {item.claimerName} — {timeAgo(item.claimedAt)}</p>
                {isMyItem && (
                  <>
                    <p className={styles.claimMsgText}>"{item.claimMessage}"</p>
                    <button className={styles.unclaimBtn} onClick={() => unclaimItem(id)}>
                      Reject Claim
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {iMyClaim && (
            <div className={styles.claimInfo}>
              <span className={styles.claimInfoIcon}>✅</span>
              <div>
                <strong>You claimed this item</strong>
                <p>Your message: "{item.claimMessage}"</p>
                <button className={styles.unclaimBtn} onClick={() => unclaimItem(id)}>
                  Cancel Claim
                </button>
              </div>
            </div>
          )}

          {!isClaimed && !showClaim && (
            <button className={styles.claimBtn} onClick={() => setShowClaim(true)}>
              <MessageSquare size={16} /> Submit a Claim
            </button>
          )}

          {showClaim && !claimSent && (
            <div className={styles.claimForm}>
              <div className={styles.claimFormHeader}>
                <strong>Describe how this item belongs to you</strong>
                <button onClick={() => setShowClaim(false)}><X size={16} /></button>
              </div>
              <textarea
                rows={3}
                placeholder="e.g., It's my blue backpack with a duck keychain. I lost it on March 10th near the library..."
                value={claimMsg}
                onChange={e => setClaimMsg(e.target.value)}
              />
              <button className={styles.claimSubmitBtn} onClick={handleClaim} disabled={!claimMsg.trim()}>
                <Send size={14} /> Send Claim
              </button>
            </div>
          )}

          {claimSent && (
            <div className={styles.claimSuccess}>
              <span>🎉</span> Claim submitted successfully! The reporter will be notified.
            </div>
          )}
        </div>
      )}

      <div className={styles.contactBox}>
        <h3>Get in Touch</h3>
        <p>
          {isLost
            ? 'If you found this item, please reach out to the owner directly.'
            : 'If this is your item, please contact the finder to reclaim it.'}
        </p>
        <a href={`mailto:${item.contact}?subject=Regarding: ${item.title}`} className={styles.emailBtn}>
          <Mail size={15} /> Email {item.contact}
        </a>
      </div>
    </div>
  )
}
