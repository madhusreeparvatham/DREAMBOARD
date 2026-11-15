import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Compass,
  Sparkles,
  Target,
  CheckCircle2,
  Clock,
  Copy,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Share2,
  Palette
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { boardsService, goalsService } from '../lib/db'
import { getDailyQuote } from '../data/quotes'
import Navbar from '../components/Navbar'
import AIAssistantModal from '../components/AIAssistantModal'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [boards, setBoards] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newBgGradient, setNewBgGradient] = useState('linear-gradient(135deg, #DCCBFF 0%, #F8D9E8 50%, #FFF9F1 100%)')
  const [creating, setCreating] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)

  const dailyQuote = getDailyQuote()

  useEffect(() => {
    loadData()
  }, [user])

  async function loadData() {
    setLoading(true)
    try {
      const [boardsRes, goalsRes] = await Promise.all([
        boardsService.getAll(user?.id),
        goalsService.getAll(user?.id)
      ])
      if (boardsRes.data) setBoards(boardsRes.data)
      if (goalsRes.data) setGoals(goalsRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateBoard(e) {
    e.preventDefault()
    if (!newTitle.trim()) return toast.error('Please enter a board name')
    setCreating(true)
    try {
      const { data, error } = await boardsService.create(user.id, {
        title: newTitle.trim(),
        description: newDesc.trim(),
        background_gradient: newBgGradient
      })
      if (error) {
        toast.error('Failed to create board')
      } else {
        toast.success('Vision Board created! ✨')
        setBoards([data, ...boards])
        setShowCreateModal(false)
        setNewTitle('')
        setNewDesc('')
        navigate(`/board/${data.id}`)
      }
    } catch (err) {
      toast.error('Error creating board')
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteBoard(e, boardId, title) {
    e.stopPropagation()
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      await boardsService.delete(boardId)
      setBoards(boards.filter(b => b.id !== boardId))
      toast.success('Board deleted')
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  async function handleDuplicateBoard(e, board) {
    e.stopPropagation()
    try {
      const { data } = await boardsService.duplicate(board, user.id)
      if (data) {
        setBoards([data, ...boards])
        toast.success(`Duplicated "${board.title}" ✨`)
      }
    } catch (err) {
      toast.error('Failed to duplicate')
    }
  }

  // Derived Goal statistics
  const totalGoals = goals.length
  const completedGoals = goals.filter(g => g.is_completed).length
  const inProgressGoals = goals.filter(g => !g.is_completed).length

  const gradientPresets = [
    'linear-gradient(135deg, #DCCBFF 0%, #F8D9E8 50%, #FFF9F1 100%)',
    'linear-gradient(135deg, #D9ECFF 0%, #DCCBFF 50%, #F8D9E8 100%)',
    'linear-gradient(135deg, #59436F 0%, #9B7EC8 50%, #E9AFC5 100%)',
    'linear-gradient(135deg, #FFF9F1 0%, #F8D9E8 50%, #DCCBFF 100%)',
    'linear-gradient(135deg, #E9AFC5 0%, #F8D9E8 50%, #FFF9F1 100%)',
  ]

  return (
    <div className="min-h-screen bg-cream pb-20">
      <Navbar onOpenAI={() => setIsAIModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Welcome Banner & Quote Header */}
        <section className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-lavender/40 via-pastel-pink/30 to-baby-blue/40 border border-white p-8 sm:p-10 shadow-dreamy">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-soft-rose/20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md text-xs font-semibold text-deep-purple border border-white shadow-xs">
              <Sparkles size={14} className="text-soft-rose-dark animate-sparkle" />
              <span>Manifest Your Reality</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-deep-purple leading-tight">
              Welcome back,{' '}
              <span className="text-gradient font-black">
                {profile?.username || user?.email?.split('@')[0] || 'Dreamer'}
              </span>
              {' '}🌸
            </h1>

            {/* Daily Quote Box */}
            <div className="pt-2">
              <blockquote className="font-display italic text-lg sm:text-xl text-deep-purple/85 leading-relaxed">
                "{dailyQuote.quote}"
              </blockquote>
              <cite className="block text-xs font-semibold uppercase tracking-wider text-deep-purple/60 mt-1 not-italic">
                — {dailyQuote.author}
              </cite>
            </div>
          </div>

          {/* Quick Action Buttons inside Header */}
          <div className="mt-8 flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Create New Board</span>
            </button>
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Sparkles size={16} className="text-soft-rose-dark" />
              <span>AI Inspiration</span>
            </button>
            <Link
              to="/templates"
              className="btn-secondary flex items-center gap-2"
            >
              <Compass size={16} />
              <span>Browse Templates</span>
            </Link>
          </div>
        </section>

        {/* 4 Overview Metric Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card p-6 bg-white/80 border-white/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-lavender/50 flex items-center justify-center text-deep-purple shadow-sm">
              <Palette size={22} />
            </div>
            <div>
              <p className="text-xs text-deep-purple/60 font-medium">Vision Boards</p>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-deep-purple mt-0.5">
                {boards.length}
              </h3>
            </div>
          </div>

          <div className="card p-6 bg-white/80 border-white/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-baby-blue/60 flex items-center justify-center text-deep-purple shadow-sm">
              <Target size={22} />
            </div>
            <div>
              <p className="text-xs text-deep-purple/60 font-medium">Total Goals</p>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-deep-purple mt-0.5">
                {totalGoals}
              </h3>
            </div>
          </div>

          <div className="card p-6 bg-white/80 border-white/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 shadow-sm">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs text-deep-purple/60 font-medium">Completed</p>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-deep-purple mt-0.5">
                {completedGoals}
              </h3>
            </div>
          </div>

          <div className="card p-6 bg-white/80 border-white/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pastel-pink/60 flex items-center justify-center text-deep-purple shadow-sm">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-deep-purple/60 font-medium">In Progress</p>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-deep-purple mt-0.5">
                {inProgressGoals}
              </h3>
            </div>
          </div>
        </section>

        {/* Vision Boards Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-deep-purple">
                Your Vision Boards
              </h2>
              <p className="text-xs text-deep-purple/60 mt-0.5">
                Canvases where your aspirations take visual flight
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-xs font-semibold text-deep-purple flex items-center gap-1 hover:text-soft-rose-dark transition"
            >
              <span>+ Add Board</span>
            </button>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card h-64 animate-pulse bg-white/50" />
              ))}
            </div>
          ) : boards.length === 0 ? (
            <div className="card p-12 text-center bg-white/60 border-dashed border-2 border-lavender/50 space-y-4">
              <div className="w-16 h-16 rounded-full bg-lavender/30 mx-auto flex items-center justify-center text-3xl">
                ✨
              </div>
              <h3 className="font-display font-bold text-xl text-deep-purple">
                No vision boards yet
              </h3>
              <p className="text-xs text-deep-purple/60 max-w-sm mx-auto">
                Begin with a blank canvas or explore our designed aesthetic templates.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary text-xs"
                >
                  Create Vision Board
                </button>
                <Link to="/templates" className="btn-secondary text-xs">
                  Browse Templates
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <motion.div
                  key={board.id}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/board/${board.id}`)}
                  className="card group cursor-pointer overflow-hidden border-white bg-white/90 shadow-dreamy hover:shadow-dreamy-lg transition-all duration-300 flex flex-col"
                >
                  {/* Visual Board Preview Header */}
                  <div
                    className="h-44 p-4 relative flex flex-col justify-between overflow-hidden"
                    style={{ background: board.background_gradient || '#F8D9E8' }}
                  >
                    {/* Decorative preview floating elements */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />
                    
                    <div className="flex items-center justify-between relative z-10">
                      <span className="badge bg-white/80 backdrop-blur-md text-deep-purple text-[10px] font-bold">
                        {board.is_public ? 'Public Board' : 'Private Board'}
                      </span>
                      
                      {/* Action buttons on card hover */}
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => handleDuplicateBoard(e, board)}
                          className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-deep-purple shadow-xs"
                          title="Duplicate board"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteBoard(e, board.id, board.title)}
                          className="p-1.5 rounded-lg bg-white/80 hover:bg-red-50 text-red-500 shadow-xs"
                          title="Delete board"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="font-display font-bold text-xl text-deep-purple drop-shadow-sm truncate">
                        {board.title}
                      </h3>
                      {board.description && (
                        <p className="text-xs text-deep-purple/80 line-clamp-1 mt-0.5 font-medium">
                          {board.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Info */}
                  <div className="p-4 bg-white flex items-center justify-between text-xs text-deep-purple/60 border-t border-lavender/20">
                    <span>
                      Updated {new Date(board.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-semibold text-deep-purple flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Canvas <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Add Board Quick Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowCreateModal(true)}
                className="card border-2 border-dashed border-lavender hover:border-deep-purple cursor-pointer p-8 flex flex-col items-center justify-center text-center bg-white/40 hover:bg-white/70 transition-all duration-300 min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-lavender/40 flex items-center justify-center text-deep-purple mb-3 shadow-xs">
                  <Plus size={22} />
                </div>
                <h4 className="font-display font-semibold text-deep-purple text-base">
                  Create Another Board
                </h4>
                <p className="text-xs text-deep-purple/60 mt-1 max-w-[200px]">
                  Design a space for travel, fitness, career, or lifestyle dreams.
                </p>
              </motion.div>
            </div>
          )}
        </section>

        {/* Goals Snapshot Widget */}
        <section className="card p-6 sm:p-8 bg-white/85 border-white space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-deep-purple">
                Active Goals Progress
              </h3>
              <p className="text-xs text-deep-purple/60 mt-0.5">
                Track how close you are to manifesting your milestones
              </p>
            </div>
            <Link
              to="/goals"
              className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
            >
              <span>Manage Goals</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="p-4 rounded-2xl bg-cream/70 border border-lavender/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${goal.is_completed ? 'bg-green-500' : 'bg-soft-rose'}`} />
                    <h4 className="font-medium text-sm text-deep-purple">
                      {goal.title}
                    </h4>
                    <span className="badge bg-lavender/40 text-[10px] text-deep-purple font-semibold">
                      {goal.category}
                    </span>
                  </div>
                  {goal.target_date && (
                    <p className="text-[11px] text-deep-purple/60 pl-4.5">
                      Target: {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:w-60">
                  <div className="flex-1 h-2 bg-lavender/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-deep-purple to-soft-rose rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-deep-purple min-w-[36px] text-right">
                    {goal.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Create Board Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-purple/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-cream rounded-3xl p-6 sm:p-8 shadow-dreamy-lg border border-white"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-deep-purple">
                    Create New DreamBoard
                  </h3>
                  <p className="text-xs text-deep-purple/60 mt-0.5">
                    Give your future vision an inspiring home
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-xl hover:bg-lavender/30 text-deep-purple/60 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBoard} className="space-y-4">
                <div>
                  <label className="label">Board Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Dream Life 2025, Bali Retreat, Creative Era..."
                    className="input"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="label">Description / Intention</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What emotions and dreams are you cultivating here?"
                    rows={2}
                    className="input resize-none"
                  />
                </div>

                <div>
                  <label className="label">Canvas Gradient Theme</label>
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {gradientPresets.map((grad, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewBgGradient(grad)}
                        className={`h-10 rounded-xl transition-all duration-200 border-2 ${
                          newBgGradient === grad ? 'border-deep-purple scale-105 shadow-sm' : 'border-transparent'
                        }`}
                        style={{ background: grad }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-lavender/30">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary py-2.5 px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2"
                  >
                    <Plus size={15} />
                    <span>{creating ? 'Creating...' : 'Open Canvas'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  )
}

