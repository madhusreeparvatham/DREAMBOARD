import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, Check, Target, Trophy, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { goalsService } from '../lib/db'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const categories = ['personal', 'career', 'health', 'finance', 'travel', 'education', 'creative', 'relationships']
const priorities = ['low', 'medium', 'high']

const categoryColors = {
  personal: '#DCCBFF', career: '#D9ECFF', health: '#E9AFC5',
  finance: '#F8D9E8', travel: '#D9ECFF', education: '#DCCBFF',
  creative: '#F8D9E8', relationships: '#E9AFC5',
}

const priorityColors = {
  low: { bg: '#D9ECFF', text: '#3D7DC8' },
  medium: { bg: '#F8D9E8', text: '#C85A8A' },
  high: { bg: '#DCCBFF', text: '#7A6490' },
}

function ProgressBar({ progress }) {
  return (
    <div style={{ width: '100%', height: 8, background: 'rgba(220,203,255,0.3)', borderRadius: 99, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          height: '100%',
          borderRadius: 99,
          background: progress >= 100 ? 'linear-gradient(90deg,#4CAF50,#8BC34A)' :
            progress >= 50 ? 'linear-gradient(90deg,#DCCBFF,#E9AFC5)' : 'linear-gradient(90deg,#D9ECFF,#DCCBFF)',
        }}
      />
    </div>
  )
}

function GoalCard({ goal, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [progress, setProgress] = useState(goal.progress)
  const [updating, setUpdating] = useState(false)

  async function toggleComplete() {
    setUpdating(true)
    const { error } = await onUpdate(goal.id, { is_completed: !goal.is_completed, progress: !goal.is_completed ? 100 : goal.progress })
    setUpdating(false)
  }

  async function updateProgress(newProg) {
    const p = Math.min(100, Math.max(0, Number(newProg)))
    setProgress(p)
    await onUpdate(goal.id, { progress: p, is_completed: p >= 100 })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      style={{
        background: 'rgba(255,255,255,0.85)', borderRadius: 20,
        border: `1px solid ${goal.is_completed ? 'rgba(76,175,80,0.3)' : 'rgba(220,203,255,0.3)'}`,
        boxShadow: '0 4px 16px rgba(89,67,111,0.07)',
        overflow: 'hidden',
        opacity: goal.is_completed ? 0.8 : 1,
      }}
    >
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Complete toggle */}
          <button
            onClick={toggleComplete}
            disabled={updating}
            style={{
              width: 24, height: 24, borderRadius: '50%', border: `2px solid ${goal.is_completed ? '#4CAF50' : '#DCCBFF'}`,
              background: goal.is_completed ? '#4CAF50' : 'transparent',
              cursor: 'pointer', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {goal.is_completed && <Check size={13} color="white" strokeWidth={3} />}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
              <h3 style={{
                fontFamily: '"Playfair Display", serif', fontSize: 16, color: '#59436F',
                fontWeight: 600, margin: 0, textDecoration: goal.is_completed ? 'line-through' : 'none',
                opacity: goal.is_completed ? 0.6 : 1,
              }}>{goal.title}</h3>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <span style={{ ...priorityColors[goal.priority], background: priorityColors[goal.priority].bg, borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{goal.priority}</span>
                <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(89,67,111,0.5)', padding: 2 }}>
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ background: categoryColors[goal.category] + '55', color: '#59436F', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 500 }}>{goal.category}</span>
              {goal.target_date && (
                <span style={{ color: 'rgba(89,67,111,0.5)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={10} /> {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <ProgressBar progress={goal.progress} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#59436F', minWidth: 36 }}>{goal.progress}%</span>
            </div>
          </div>
        </div>

        {/* Expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(220,203,255,0.3)' }}>
                {goal.description && (
                  <p style={{ fontSize: 13, color: 'rgba(89,67,111,0.7)', marginBottom: 16, lineHeight: 1.6 }}>{goal.description}</p>
                )}
                {/* Progress slider */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#59436F', display: 'block', marginBottom: 8 }}>Update Progress: {progress}%</label>
                  <input
                    type="range" min={0} max={100} value={progress}
                    onChange={e => setProgress(Number(e.target.value))}
                    onMouseUp={() => updateProgress(progress)}
                    onTouchEnd={() => updateProgress(progress)}
                    style={{ width: '100%', accentColor: '#59436F' }}
                  />
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => onDelete(goal.id)} style={{ background: 'none', border: '1px solid rgba(220,203,255,0.5)', borderRadius: 10, cursor: 'pointer', color: 'rgba(89,67,111,0.5)', padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const emptyForm = { title: '', description: '', category: 'personal', priority: 'medium', target_date: '', progress: 0 }

export default function GoalTracker() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadGoals() }, [user])

  async function loadGoals() {
    const { data } = await goalsService.getAll(user?.id)
    if (data) setGoals(data)
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Enter a goal title')
    setSaving(true)
    const { data, error } = await goalsService.create(user.id, form)
    if (error) toast.error('Could not create goal')
    else { toast.success('Goal created! 🎯'); setGoals(prev => [data, ...prev]); setShowModal(false); setForm(emptyForm) }
    setSaving(false)
  }

  async function handleUpdate(id, updates) {
    const { data, error } = await goalsService.update(id, updates)
    if (!error) setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
    return { error }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this goal?')) return
    const { error } = await goalsService.delete(id)
    if (!error) { setGoals(prev => prev.filter(g => g.id !== id)); toast.success('Goal deleted') }
  }

  const filtered = goals.filter(g => {
    if (filter === 'completed') return g.is_completed
    if (filter === 'active') return !g.is_completed
    return true
  })

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.is_completed).length,
    active: goals.filter(g => !g.is_completed).length,
    avgProgress: goals.length ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0,
  }

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 14, border: '1px solid #DCCBFF', background: 'rgba(255,255,255,0.7)', color: '#59436F', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF9F1' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#59436F', fontWeight: 700, marginBottom: 4 }}>Goal Tracker 🎯</motion.h1>
            <p style={{ color: 'rgba(89,67,111,0.6)', fontSize: 15 }}>Transform your dreams into actionable goals</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <Plus size={18} /> Add Goal
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: '🎯', label: 'Total Goals', value: stats.total, color: 'rgba(220,203,255,0.4)' },
            { icon: '✅', label: 'Completed', value: stats.completed, color: 'rgba(217,236,255,0.4)' },
            { icon: '🔥', label: 'In Progress', value: stats.active, color: 'rgba(248,217,232,0.4)' },
            { icon: '📈', label: 'Avg Progress', value: `${stats.avgProgress}%`, color: 'rgba(233,175,197,0.3)' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 16px rgba(89,67,111,0.07)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#59436F', fontFamily: '"Playfair Display", serif' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(89,67,111,0.6)', fontWeight: 500 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['all', 'active', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500, transition: 'all 0.2s',
              background: filter === f ? '#59436F' : 'rgba(220,203,255,0.3)', color: filter === f ? 'white' : '#59436F',
            }}>{f === 'all' ? 'All Goals' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>

        {/* Goals list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} style={{ width: 36, height: 36, border: '3px solid #DCCBFF', borderTopColor: '#59436F', borderRadius: '50%', margin: '0 auto 16px' }} />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 24px', background: 'rgba(255,255,255,0.6)', borderRadius: 24, border: '2px dashed rgba(220,203,255,0.5)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: '#59436F', marginBottom: 10 }}>{filter === 'completed' ? 'No completed goals yet' : filter === 'active' ? 'No active goals' : 'Set your first goal'}</h3>
            <p style={{ color: 'rgba(89,67,111,0.6)', fontSize: 15, marginBottom: 24 }}>Break your big dreams into achievable steps</p>
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Add Goal
            </button>
          </motion.div>
        ) : (
          <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {filtered.map(goal => (
                <GoalCard key={goal.id} goal={goal} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(89,67,111,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'white', borderRadius: 28, padding: 36, width: '100%', maxWidth: 500, boxShadow: '0 24px 80px rgba(89,67,111,0.25)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <span style={{ fontSize: 36 }}>🎯</span>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, color: '#59436F', marginTop: 10 }}>New Goal</h2>
                <p style={{ color: 'rgba(89,67,111,0.6)', fontSize: 14, marginTop: 4 }}>What do you want to achieve?</p>
              </div>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(89,67,111,0.8)', display: 'block', marginBottom: 6 }}>Goal Title *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Run a 5K marathon" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = '0 0 0 2px #DCCBFF' }}
                    onBlur={e => { e.target.style.borderColor = '#DCCBFF'; e.target.style.boxShadow = 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(89,67,111,0.8)', display: 'block', marginBottom: 6 }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your goal..." rows={3}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                    onFocus={e => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = '0 0 0 2px #DCCBFF' }}
                    onBlur={e => { e.target.style.borderColor = '#DCCBFF'; e.target.style.boxShadow = 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(89,67,111,0.8)', display: 'block', marginBottom: 6 }}>Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(89,67,111,0.8)', display: 'block', marginBottom: 6 }}>Priority</label>
                    <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(89,67,111,0.8)', display: 'block', marginBottom: 6 }}>Target Date</label>
                  <input type="date" value={form.target_date} onChange={e => setForm(p => ({ ...p, target_date: e.target.value }))} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = '0 0 0 2px #DCCBFF' }}
                    onBlur={e => { e.target.style.borderColor = '#DCCBFF'; e.target.style.boxShadow = 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    {saving ? 'Creating...' : '🎯 Create Goal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
