import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Mail, Phone, BookOpen, Calendar, Edit3, X, User, Save, Check, MapPin, Tag 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useItems } from '../hooks/useItems'
import { formatDate, timeAgo } from '../utils/helpers'
import styles from './Profile.module.css'

const AVATAR_OPTIONS = ['👤', '👨‍🎓', '👩‍🎓', '🧑‍💻', '🎮', '🎨', '⚽', '🍕', '🐱', '🦉']

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { items } = useItems()
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saved, setSaved] = useState(false)

  // Filter items by user _id
  const myItems = items.filter(i => i.user?._id === user?._id)
  const myLost = myItems.filter(i => i.type === 'lost')
  const myFound = myItems.filter(i => i.type === 'found')
  const myResolved = myItems.filter(i => i.status === 'resolved')
  const myClaimed = items.filter(i => i.claimedBy === user?.email)

  const startEditing = () => {
    setEditData({
      name: user.name || '',
      avatar: user.avatar || '👤',
      phone: user.phone || '',
      department: user.department || '',
      bio: user.bio || '',
    })
    setEditing(true)
    setSaved(false)
  }

  const cancelEditing = () => {
    setEditing(false)
  }

  const saveProfile = async () => {
    try {
      await updateProfile(editData)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      alert('Failed to update profile')
    }
  }

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.page}>
      {/* Success Toast */}
      {saved && (
        <div className={styles.toast}>
          <Check size={16} /> Profile updated successfully!
        </div>
      )}

      {/* Profile Header Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileGlow} />

        {!editing ? (
          <>
            <div className={styles.avatar}>{user.avatar || '👤'}</div>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.email}><Mail size={14} /> {user.email}</p>
            {user.phone && (
              <p className={styles.email}><Phone size={14} /> {user.phone}</p>
            )}
            {user.department && (
              <p className={styles.email}><BookOpen size={14} /> {user.department}</p>
            )}
            {user?.bio && (
              <p className={styles.bio}>{user.bio}</p>
            )}
            <p className={styles.joined}><Calendar size={14} /> Joined {formatDate(user?.createdAt)}</p>

            <button className={styles.editBtn} onClick={startEditing}>
              <Edit3 size={15} /> Edit Profile
            </button>
          </>
        ) : (
          <div className={styles.editForm}>
            <div className={styles.editHeader}>
              <h2 className={styles.editTitle}><Edit3 size={18} /> Edit Profile</h2>
              <button className={styles.closeBtn} onClick={cancelEditing}><X size={18} /></button>
            </div>

            {/* Avatar Picker */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Choose Avatar</label>
              <div className={styles.avatarGrid}>
                {AVATAR_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    className={`${styles.avatarChoice} ${editData.avatar === emoji ? styles.avatarSelected : ''}`}
                    onClick={() => handleChange('avatar', emoji)}
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}><User size={13} /> Display Name</label>
              <input
                className={styles.fieldInput}
                type="text"
                value={editData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Your name"
              />
            </div>

            {/* Phone */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}><Phone size={13} /> Phone Number</label>
              <input
                className={styles.fieldInput}
                type="tel"
                value={editData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Department */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}><BookOpen size={13} /> Department</label>
              <input
                className={styles.fieldInput}
                type="text"
                value={editData.department}
                onChange={e => handleChange('department', e.target.value)}
                placeholder="e.g. Computer Science"
              />
            </div>

            {/* Bio */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Bio</label>
              <textarea
                className={styles.fieldTextarea}
                value={editData.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={3}
              />
            </div>

            <div className={styles.editActions}>
              <button className={styles.cancelBtn} onClick={cancelEditing}>Cancel</button>
              <button className={styles.saveBtn} onClick={saveProfile}>
                <Save size={15} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {!editing && (
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{myItems.length}</span>
              <span className={styles.statLabel}>Posted</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{myLost.length}</span>
              <span className={styles.statLabel}>Lost</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{myFound.length}</span>
              <span className={styles.statLabel}>Found</span>
            </div>
            <div className={styles.stat}>
              <span className={`${styles.statNum} ${styles.green}`}>{myResolved.length}</span>
              <span className={styles.statLabel}>Resolved</span>
            </div>
          </div>
        )}
      </div>

      {/* Activity Sections */}
      <div className={styles.sections}>
        <ActivitySection title="🔍 My Lost Items" items={myLost} emptyMsg="You haven't reported any lost items yet." />
        <ActivitySection title="✅ My Found Items" items={myFound} emptyMsg="You haven't reported any found items yet." />
        {myClaimed.length > 0 && (
          <ActivitySection title="📋 My Claims" items={myClaimed} emptyMsg="" />
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionGrid}>
          <Link to="/report?type=lost" className={styles.actionCard}>
            <span className={styles.actionEmoji}>🔍</span>
            <span>Report Lost</span>
          </Link>
          <Link to="/report?type=found" className={styles.actionCard}>
            <span className={styles.actionEmoji}>✅</span>
            <span>Report Found</span>
          </Link>
          <Link to="/smart-match" className={styles.actionCard}>
            <span className={styles.actionEmoji}>🤖</span>
            <span>Smart Match</span>
          </Link>
          <Link to="/browse" className={styles.actionCard}>
            <span className={styles.actionEmoji}>📋</span>
            <span>Browse All</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ActivitySection({ title, items, emptyMsg }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {items.length === 0 ? (
        <p className={styles.emptyText}>{emptyMsg}</p>
      ) : (
        <div className={styles.itemList}>
          {items.map(item => (
            <Link key={item._id} to={`/item/${item._id}`} className={styles.itemRow}>
              <div>
                <strong>{item.title}</strong>
                <div className={styles.itemMeta}>
                  <span><MapPin size={11} /> {item.location}</span>
                  <span><Tag size={11} /> {item.category}</span>
                </div>
              </div>
              <div className={styles.itemRight}>
                <span className={`${styles.statusBadge} ${item.status === 'resolved' ? styles.resolved : styles.open}`}>
                  {item.status}
                </span>
                <span className={styles.itemTime}>{timeAgo(item.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
