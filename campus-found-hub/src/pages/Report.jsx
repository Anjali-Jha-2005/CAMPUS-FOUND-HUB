import React, { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ImagePlus, X } from 'lucide-react'
import { useItems } from '../hooks/useItems'
import { CATEGORIES, LOCATIONS } from '../utils/helpers'
import styles from './Report.module.css'

const INITIAL = {
  type: 'lost',
  title: '',
  category: '',
  description: '',
  location: '',
  date: '',
  contact: '',
  tags: '',
}

export default function Report() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { addItem } = useItems()
  const [form, setForm] = useState({ ...INITIAL, type: params.get('type') || 'lost' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be under 5MB' }))
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      setErrors(prev => { const { image, ...rest } = prev; return rest })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.category) e.category = 'Pick a category'
    if (!form.description.trim() || form.description.length < 20) e.description = 'Description must be at least 20 characters'
    if (!form.location) e.location = 'Location is required'
    if (!form.date) e.date = 'Date is required'
    if (!form.contact.trim()) e.contact = 'Contact is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('type', form.type);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('date', form.date);
    formData.append('contact', form.contact); // Note: Backend model might need updating if you want to store contact specifically, or just include it in description. 
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const id = await addItem(formData);
      setSubmitted(true);
      setTimeout(() => navigate(`/item/${id}`), 1800);
    } catch (err) {
      setErrors({ server: 'Failed to post item. Please try again.' });
    }
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <span>🎉</span>
        <h2>Item Posted!</h2>
        <p>Redirecting to your listing…</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Report an Item</h1>
        <p className={styles.sub}>Fill in the details below to post your listing.</p>

        {/* Type toggle */}
        <div className={styles.typeToggle}>
          <button
            className={`${styles.toggleBtn} ${form.type === 'lost' ? styles.lostActive : ''}`}
            onClick={() => set('type', 'lost')}
          >🔍 I Lost Something</button>
          <button
            className={`${styles.toggleBtn} ${form.type === 'found' ? styles.foundActive : ''}`}
            onClick={() => set('type', 'found')}
          >✅ I Found Something</button>
        </div>

        <div className={styles.form}>
          <Field label="Item Title *" error={errors.title}>
            <input
              placeholder="e.g. Blue North Face Backpack"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </Field>

          <div className={styles.row}>
            <Field label="Category *" error={errors.category}>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Date *" error={errors.date}>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </Field>
          </div>

          <Field label="Location *" error={errors.location}>
            <select value={form.location} onChange={e => set('location', e.target.value)}>
              <option value="">Select location…</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </Field>

          <Field label="Description * (min 20 chars)" error={errors.description}>
            <textarea
              rows={4}
              placeholder="Describe the item in detail — color, brand, distinguishing marks, where exactly you lost/found it…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </Field>

          {/* Image Upload */}
          <Field label="📸 Upload Image (optional)" error={errors.image}>
            <div className={styles.imageUploadArea}>
              {imagePreview ? (
                <div className={styles.imagePreviewWrapper}>
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                  <button className={styles.imageRemoveBtn} onClick={removeImage} type="button">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  className={styles.imageUploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <ImagePlus size={28} />
                  <span>Click to upload an image</span>
                  <span className={styles.imageHint}>JPG, PNG or WEBP — max 5MB</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </Field>

          <Field label="Contact (Email or Phone) *" error={errors.contact}>
            <input
              placeholder="your@email.com or 98xxxxxxxx"
              value={form.contact}
              onChange={e => set('contact', e.target.value)}
            />
          </Field>

          <Field label="Tags (comma-separated, optional)">
            <input
              placeholder="e.g. black, leather, wallet"
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
            />
          </Field>

          <button className={styles.submit} onClick={handleSubmit}>
            Post Listing
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.03em' }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--red)' }}>{error}</span>}
    </div>
  )
}
