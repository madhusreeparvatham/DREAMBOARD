import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save, User, Mail, FileText, Palette, Shield, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { storageService } from '../lib/db'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const themes = [
  { id: 'lavender', label: 'Lavender Dream', color: '#DCCBFF' },
  { id: 'rose', label: 'Rose Garden', color: '#E9AFC5' },
  { id: 'blue', label: 'Sky Blue', color: '#D9ECFF' },
  { id: 'cream', label: 'Warm Cream', color: '#FFF9F1' },
]

export default function Profile() {
  const { user, profile, updateProfile } = useAuth()
  const [form, setForm] = useState({ username: profile?.username || '', bio: profile?.bio || '', theme: profile?.theme || 'lavender' })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null)
  const fileRef = useRef()

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 14, border: '1px solid #DCCBFF', background: 'rgba(255,255,255,0.7)', color: '#59436F', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.username.trim()) return toast.error('Username is required')
    setSaving(true)
    const { error } = await updateProfile({ username: form.username.trim(), bio: form.bio, theme: form.theme })
    if (error) toast.error(error.message)
    else toast.success('Profile updated! ✨')
    setSaving(false)
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please select an image')
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB')
    
    setUploading(true)
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
    
    const { url, error } = await storageService.uploadAvatar(user.id, file)
    if (error) { toast.error('Upload failed: ' + error.message); setAvatarPreview(profile?.avatar_url || null) }
    else {
      await updateProfile({ avatar_url: url })
      toast.success('Avatar updated! 🌟')
    }
    setUploading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF9F1' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#59436F', fontWeight: 700, marginBottom: 4 }}>My Profile ✨</h1>
          <p style={{ color: 'rgba(89,67,111,0.6)', fontSize: 15 }}>Manage your account and preferences</p>
        </motion.div>

        <form onSubmit={handleSave}>
          {/* Avatar section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 24, border: '1px solid rgba(220,203,255,0.3)', boxShadow: '0 4px 24px rgba(89,67,111,0.08)', padding: '32px', marginBottom: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: avatarPreview ? 'transparent' : 'linear-gradient(135deg,#DCCBFF,#E9AFC5)',
                  border: '3px solid rgba(220,203,255,0.5)',
                  overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(89,67,111,0.15)',
                }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 36, fontWeight: 700, color: '#59436F' }}>
                      {(profile?.username?.[0] || '?').toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 30, height: 30, borderRadius: '50%',
                    background: '#59436F', border: '2px solid white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {uploading ? '...' : <Camera size={13} color="white" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </div>

              <div>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: '#59436F', fontWeight: 600, marginBottom: 4 }}>
                  {profile?.username || 'Your Name'}
                </h2>
                <p style={{ color: 'rgba(89,67,111,0.6)', fontSize: 14 }}>{user?.email}</p>
                <p style={{ color: 'rgba(89,67,111,0.4)', fontSize: 12, marginTop: 4 }}>
                  Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 24, border: '1px solid rgba(220,203,255,0.3)', boxShadow: '0 4px 24px rgba(89,67,111,0.08)', padding: '28px 32px', marginBottom: 20 }}
          >
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, color: '#59436F', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} /> Profile Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(89,67,111,0.8)', display: 'block', marginBottom: 6 }}>Username</label>
                <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="your_username" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = '0 0 0 2px #DCCBFF'; e.target.style.background = 'white' }}
                  onBlur={e => { e.target.style.borderColor = '#DCCBFF'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.7)' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(89,67,111,0.8)', display: 'block', marginBottom: 6 }}>Email</label>
                <input value={user?.email || ''} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
                <p style={{ fontSize: 12, color: 'rgba(89,67,111,0.4)', marginTop: 4 }}>Email cannot be changed here</p>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(89,67,111,0.8)', display: 'block', marginBottom: 6 }}>Bio</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell us about yourself and your dreams..." rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                  onFocus={e => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = '0 0 0 2px #DCCBFF'; e.target.style.background = 'white' }}
                  onBlur={e => { e.target.style.borderColor = '#DCCBFF'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.7)' }} />
              </div>
            </div>
          </motion.div>

          {/* Theme preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 24, border: '1px solid rgba(220,203,255,0.3)', boxShadow: '0 4px 24px rgba(89,67,111,0.08)', padding: '28px 32px', marginBottom: 24 }}
          >
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, color: '#59436F', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Palette size={18} /> Theme Preferences
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {themes.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, theme: theme.id }))}
                  style={{
                    padding: '16px', borderRadius: 16, cursor: 'pointer',
                    border: form.theme === theme.id ? '2px solid #59436F' : '2px solid transparent',
                    background: 'rgba(255,255,255,0.6)',
                    boxShadow: form.theme === theme.id ? '0 4px 16px rgba(89,67,111,0.2)' : 'none',
                    transition: 'all 0.2s', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: theme.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#59436F' }}>{theme.label}</div>
                    {form.theme === theme.id && <div style={{ fontSize: 11, color: 'rgba(89,67,111,0.6)' }}>Active</div>}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Save button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, padding: '13px 32px' }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
