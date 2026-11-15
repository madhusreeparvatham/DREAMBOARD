import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Download,
  Share2,
  Undo2,
  Redo2,
  Plus,
  Image as ImageIcon,
  Type,
  Quote,
  StickyNote,
  Smile,
  Trash2,
  Copy,
  Palette,
  Sparkles,
  Maximize2,
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Layers
} from 'lucide-react'
import * as htmlToImage from 'html-to-image'
import { boardsService, elementsService, storageService } from '../lib/db'
import { useAuth } from '../contexts/AuthContext'
import AIAssistantModal from '../components/AIAssistantModal'
import toast from 'react-hot-toast'

const STICKERS = [
  '✨', '🌸', '🌟', '💫', '💖', '🌴', '✈️', '🏡', '🦋', '☕',
  '💎', '🕊️', '🧘‍♀️', '🎨', '📚', '☀️', '🌙', '🌊', '🌈', '🔥'
]

const GRADIENT_PRESETS = [
  { id: 'lavender-dream', label: 'Lavender Dream', bg: 'linear-gradient(135deg, #DCCBFF 0%, #F8D9E8 50%, #FFF9F1 100%)' },
  { id: 'sky-haze', label: 'Sky Haze', bg: 'linear-gradient(135deg, #D9ECFF 0%, #DCCBFF 50%, #F8D9E8 100%)' },
  { id: 'deep-galaxy', label: 'Deep Galaxy', bg: 'linear-gradient(135deg, #59436F 0%, #9B7EC8 50%, #E9AFC5 100%)' },
  { id: 'warm-cream', label: 'Warm Cream', bg: 'linear-gradient(135deg, #FFF9F1 0%, #F8D9E8 50%, #DCCBFF 100%)' },
  { id: 'rose-sunset', label: 'Rose Sunset', bg: 'linear-gradient(135deg, #E9AFC5 0%, #F8D9E8 50%, #FFF9F1 100%)' },
  { id: 'pure-cream', label: 'Pure Cream', bg: '#FFF9F1' },
]

const FRAME_STYLES = [
  { id: 'none', label: 'Modern Clean', class: 'rounded-2xl shadow-card' },
  { id: 'polaroid', label: 'Polaroid Style', class: 'p-3 pb-8 bg-white rounded-md shadow-dreamy' },
  { id: 'glass', label: 'Frosted Glass', class: 'glass rounded-3xl' },
  { id: 'glow', label: 'Dreamy Glow', class: 'rounded-3xl shadow-glow border-2 border-lavender' },
  { id: 'rose-border', label: 'Rose Accent', class: 'rounded-2xl border-2 border-soft-rose p-1 bg-white/90' },
]

export default function BoardEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [board, setBoard] = useState(null)
  const [elements, setElements] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showBgModal, setShowBgModal] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Undo / Redo history stacks
  const [history, setHistory] = useState([])
  const [redoStack, setRedoStack] = useState([])

  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Dragging state
  const [dragState, setDragState] = useState(null)

  useEffect(() => {
    if (id) loadBoard()
  }, [id])

  async function loadBoard() {
    setLoading(true)
    try {
      const { data, error } = await boardsService.getById(id)
      if (error || !data) {
        toast.error('Board not found')
        navigate('/dashboard')
        return
      }
      setBoard(data)
      setElements(data.board_elements || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Push to history before mutating elements
  const pushHistory = (newElements) => {
    setHistory((prev) => [...prev.slice(-15), elements])
    setRedoStack([])
    setElements(newElements)
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setRedoStack((prevRedo) => [...prevRedo, elements])
    setHistory((prevHist) => prevHist.slice(0, -1))
    setElements(prev)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setHistory((prevHist) => [...prevHist, elements])
    setRedoStack((prevRedo) => prevRedo.slice(0, -1))
    setElements(next)
  }

  // Save changes to db / localStorage
  const handleSave = async () => {
    setSaving(true)
    try {
      await boardsService.update(board.id, {
        background_gradient: board.background_gradient,
        title: board.title
      })
      await elementsService.saveAll(board.id, elements)
      toast.success('Vision board saved! ✨')
    } catch (e) {
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  // Add a new Text element
  const addTextElement = () => {
    const newEl = {
      id: 'el-' + Date.now(),
      board_id: board.id,
      user_id: user.id,
      type: 'text',
      content: 'Manifest your vision',
      x: 100 + Math.random() * 80,
      y: 100 + Math.random() * 80,
      width: 240,
      height: 70,
      rotation: 0,
      z_index: elements.length + 1,
      styles: {
        fontSize: 18,
        fontFamily: 'Playfair Display',
        color: '#59436F',
        fontWeight: '600',
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 16,
        padding: '12px',
        frame: 'none'
      }
    }
    pushHistory([...elements, newEl])
    setSelectedId(newEl.id)
  }

  // Add a new Quote element
  const addQuoteElement = (prefilled = null) => {
    const newEl = {
      id: 'el-' + Date.now(),
      board_id: board.id,
      user_id: user.id,
      type: 'quote',
      content: prefilled || '"She remembered who she was and the game changed."\n— Lalah Delia',
      x: 120 + Math.random() * 60,
      y: 120 + Math.random() * 60,
      width: 280,
      height: 120,
      rotation: -1,
      z_index: elements.length + 1,
      styles: {
        fontSize: 15,
        fontFamily: 'Playfair Display',
        fontStyle: 'italic',
        color: '#59436F',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: '16px',
        frame: 'glass'
      }
    }
    pushHistory([...elements, newEl])
    setSelectedId(newEl.id)
  }

  // Add a Note element
  const addNoteElement = () => {
    const newEl = {
      id: 'el-' + Date.now(),
      board_id: board.id,
      user_id: user.id,
      type: 'note',
      content: '🌟 Intention for this season:\n• Align with joy\n• Protect my peace\n• Take inspired bold action',
      x: 140 + Math.random() * 60,
      y: 140 + Math.random() * 60,
      width: 260,
      height: 150,
      rotation: 2,
      z_index: elements.length + 1,
      styles: {
        fontSize: 13,
        fontFamily: 'Inter',
        color: '#59436F',
        background: 'rgba(248, 217, 232, 0.95)',
        borderRadius: 16,
        padding: '16px',
        frame: 'none'
      }
    }
    pushHistory([...elements, newEl])
    setSelectedId(newEl.id)
  }

  // Add a Sticker element
  const addStickerElement = (emoji) => {
    const newEl = {
      id: 'el-' + Date.now(),
      board_id: board.id,
      user_id: user.id,
      type: 'sticker',
      content: emoji,
      x: 180 + Math.random() * 80,
      y: 180 + Math.random() * 80,
      width: 80,
      height: 80,
      rotation: (Math.random() - 0.5) * 15,
      z_index: elements.length + 1,
      styles: {
        fontSize: 42,
        borderRadius: 99,
        background: 'rgba(255, 255, 255, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
    pushHistory([...elements, newEl])
    setSelectedId(newEl.id)
  }

  // Handle Image Upload from device
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const toastId = toast.loading('Adding your inspirational image...')
    try {
      const { url, error } = await storageService.uploadBoardImage(user.id, file)
      if (error || !url) throw new Error('Upload failed')

      const newEl = {
        id: 'el-' + Date.now(),
        board_id: board.id,
        user_id: user.id,
        type: 'image',
        image_url: url,
        content: file.name.replace(/\.[^/.]+$/, ''),
        x: 150 + Math.random() * 60,
        y: 150 + Math.random() * 60,
        width: 260,
        height: 200,
        rotation: (Math.random() - 0.5) * 6,
        z_index: elements.length + 1,
        styles: {
          borderRadius: 20,
          frame: 'polaroid'
        }
      }
      pushHistory([...elements, newEl])
      setSelectedId(newEl.id)
      toast.success('Image pinned to board! 📸', { id: toastId })
    } catch (err) {
      toast.error('Could not load image', { id: toastId })
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Add an image from an external URL (e.g. Free AI Generated artwork)
  const addImageElementFromUrl = (url, caption = 'AI Dream Artwork') => {
    const newEl = {
      id: 'el-' + Date.now(),
      board_id: board.id,
      user_id: user?.id || 'guest',
      type: 'image',
      image_url: url,
      content: caption,
      x: 160 + Math.random() * 60,
      y: 160 + Math.random() * 60,
      width: 280,
      height: 210,
      rotation: (Math.random() - 0.5) * 6,
      z_index: elements.length + 1,
      styles: {
        borderRadius: 20,
        frame: 'polaroid'
      }
    }
    pushHistory([...elements, newEl])
    setSelectedId(newEl.id)
    toast.success('AI Artwork pinned to board! ✨')
  }

  // Duplicate selected element
  const duplicateSelected = () => {
    if (!selectedId) return
    const el = elements.find((e) => e.id === selectedId)
    if (!el) return
    const dup = {
      ...el,
      id: 'el-' + Date.now(),
      x: el.x + 25,
      y: el.y + 25,
      z_index: elements.length + 1
    }
    pushHistory([...elements, dup])
    setSelectedId(dup.id)
    toast.success('Element duplicated')
  }

  // Delete selected element
  const deleteSelected = () => {
    if (!selectedId) return
    pushHistory(elements.filter((e) => e.id !== selectedId))
    setSelectedId(null)
    toast.success('Removed')
  }

  // Bring to front
  const bringToFront = () => {
    if (!selectedId) return
    const maxZ = Math.max(...elements.map(e => e.z_index || 1), 1)
    const updated = elements.map(e => e.id === selectedId ? { ...e, z_index: maxZ + 1 } : e)
    pushHistory(updated)
  }

  // Update styles of selected element
  const updateSelectedStyle = (key, val) => {
    if (!selectedId) return
    const updated = elements.map((e) => {
      if (e.id === selectedId) {
        return {
          ...e,
          styles: { ...(e.styles || {}), [key]: val }
        }
      }
      return e
    })
    setElements(updated)
  }

  // Update content of selected element
  const updateSelectedContent = (val) => {
    if (!selectedId) return
    const updated = elements.map((e) => e.id === selectedId ? { ...e, content: val } : e)
    setElements(updated)
  }

  // Rotate selected element
  const rotateSelected = (degrees = 15) => {
    if (!selectedId) return
    const updated = elements.map((e) => {
      if (e.id === selectedId) {
        return { ...e, rotation: ((e.rotation || 0) + degrees) % 360 }
      }
      return e
    })
    pushHistory(updated)
  }

  // Drag handlers for canvas elements
  const handleMouseDown = (e, id) => {
    e.stopPropagation()
    setSelectedId(id)
    const el = elements.find((item) => item.id === id)
    if (!el) return
    setDragState({
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y
    })
  }

  const handleMouseMove = (e) => {
    if (!dragState) return
    const deltaX = (e.clientX - dragState.startX) / zoomLevel
    const deltaY = (e.clientY - dragState.startY) / zoomLevel
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === dragState.id) {
          return {
            ...el,
            x: Math.max(0, dragState.origX + deltaX),
            y: Math.max(0, dragState.origY + deltaY)
          }
        }
        return el
      })
    )
  }

  const handleMouseUp = () => {
    if (dragState) {
      setDragState(null)
      // register into history
      setHistory((prev) => [...prev.slice(-15), elements])
    }
  }

  // Touch handlers for mobile
  const handleTouchStart = (e, id) => {
    setSelectedId(id)
    const touch = e.touches[0]
    const el = elements.find((item) => item.id === id)
    if (!el) return
    setDragState({
      id,
      startX: touch.clientX,
      startY: touch.clientY,
      origX: el.x,
      origY: el.y
    })
  }

  const handleTouchMove = (e) => {
    if (!dragState) return
    const touch = e.touches[0]
    const deltaX = (touch.clientX - dragState.startX) / zoomLevel
    const deltaY = (touch.clientY - dragState.startY) / zoomLevel
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === dragState.id) {
          return {
            ...el,
            x: Math.max(0, dragState.origX + deltaX),
            y: Math.max(0, dragState.origY + deltaY)
          }
        }
        return el
      })
    )
  }

  // Export board as PNG
  const handleDownloadPNG = async () => {
    if (!canvasRef.current) return
    const toastId = toast.loading('Rendering high-res vision board...')
    try {
      setSelectedId(null) // deselect to remove selection outline
      await new Promise(r => setTimeout(r, 100))
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#FFF9F1'
      })
      const link = document.createElement('a')
      link.download = `${board?.title || 'dreamboard'}.png`
      link.href = dataUrl
      link.click()
      toast.success('Downloaded vision board! 🌸', { id: toastId })
    } catch (err) {
      toast.error('Download failed', { id: toastId })
    }
  }

  // Set as wallpaper (formats for desktop / phone aspect)
  const handleDownloadWallpaper = async () => {
    handleDownloadPNG()
  }

  const selectedEl = elements.find((e) => e.id === selectedId)

  if (loading) {
    return (
      <div className="min-h-screen gradient-dreamboard flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-3 border-deep-purple border-t-transparent mx-auto mb-3"
          />
          <p className="font-display text-lg text-deep-purple">Loading your Dream Canvas...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-cream flex flex-col select-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Top Floating App Bar */}
      <header className="h-16 bg-white/85 backdrop-blur-md border-b border-lavender/40 px-4 flex items-center justify-between z-30 shadow-xs">
        
        {/* Left: Back & Board Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl text-deep-purple/70 hover:text-deep-purple hover:bg-lavender/20 transition"
            title="Return to Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <input
              type="text"
              value={board?.title || ''}
              onChange={(e) => setBoard({ ...board, title: e.target.value })}
              className="font-display font-bold text-lg text-deep-purple bg-transparent border-b border-transparent hover:border-lavender focus:border-deep-purple focus:outline-none px-1"
            />
            <p className="text-[10px] text-deep-purple/50 px-1 font-semibold uppercase tracking-wider">
              Vision Board Canvas
            </p>
          </div>
        </div>

        {/* Center: Undo / Redo & Zoom */}
        <div className="hidden md:flex items-center gap-1.5 bg-lavender/30 p-1 rounded-2xl border border-lavender/40">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-1.5 rounded-xl hover:bg-white text-deep-purple disabled:opacity-30 transition"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-1.5 rounded-xl hover:bg-white text-deep-purple disabled:opacity-30 transition"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
          <div className="w-[1px] h-4 bg-lavender/50 mx-1" />
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
            className="p-1.5 rounded-xl hover:bg-white text-deep-purple transition"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-[11px] font-bold text-deep-purple/70 px-1 min-w-[36px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
            className="p-1.5 rounded-xl hover:bg-white text-deep-purple transition"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Right: Board Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBgModal(true)}
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
            title="Canvas Theme"
          >
            <Palette size={15} />
            <span className="hidden sm:inline">Theme</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
            title="Share Board"
          >
            <Share2 size={15} />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
            title="Export PNG"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Editor Main Canvas Body */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Left Floating Palette / Creation Toolbar */}
        <aside className="absolute left-4 top-4 z-20 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-dreamy border border-white">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl hover:bg-lavender/30 text-deep-purple flex flex-col items-center gap-1 text-[10px] font-semibold transition"
            title="Add Image from Device"
          >
            <ImageIcon size={20} className="text-soft-rose-dark" />
            <span>Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={addTextElement}
            className="p-3 rounded-xl hover:bg-lavender/30 text-deep-purple flex flex-col items-center gap-1 text-[10px] font-semibold transition"
            title="Add Text"
          >
            <Type size={20} className="text-deep-purple" />
            <span>Text</span>
          </button>

          <button
            onClick={() => addQuoteElement()}
            className="p-3 rounded-xl hover:bg-lavender/30 text-deep-purple flex flex-col items-center gap-1 text-[10px] font-semibold transition"
            title="Add Quote"
          >
            <Quote size={20} className="text-deep-purple/70" />
            <span>Quote</span>
          </button>

          <button
            onClick={addNoteElement}
            className="p-3 rounded-xl hover:bg-lavender/30 text-deep-purple flex flex-col items-center gap-1 text-[10px] font-semibold transition"
            title="Add Sticky Note"
          >
            <StickyNote size={20} className="text-yellow-500" />
            <span>Note</span>
          </button>

          {/* Stickers Dropdown Menu */}
          <div className="relative group">
            <button
              className="p-3 rounded-xl hover:bg-lavender/30 text-deep-purple flex flex-col items-center gap-1 text-[10px] font-semibold transition w-full"
              title="Add Sticker"
            >
              <Smile size={20} className="text-soft-rose" />
              <span>Sticker</span>
            </button>
            <div className="hidden group-hover:grid grid-cols-4 gap-1 p-2 bg-white rounded-2xl shadow-dreamy-lg border border-lavender/40 absolute left-full top-0 ml-2 w-48 z-40">
              {STICKERS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => addStickerElement(s)}
                  className="text-2xl p-1.5 hover:bg-lavender/30 rounded-xl transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[1px] bg-lavender/30 my-1" />

          {/* AI Spark trigger */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="p-3 rounded-xl bg-gradient-to-tr from-lavender/60 to-pastel-pink/60 text-deep-purple flex flex-col items-center gap-1 text-[10px] font-bold shadow-xs hover:shadow-glow transition"
            title="AI Ideas & Inspiration"
          >
            <Sparkles size={18} className="animate-spin-slow text-deep-purple" />
            <span>AI Spark</span>
          </button>
        </aside>

        {/* Selected Element Floating Toolbar */}
        <AnimatePresence>
          {selectedEl && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-24 right-4 z-20 flex items-center justify-between bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-dreamy border border-lavender/40 gap-3 overflow-x-auto"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-deep-purple/60">
                  {selectedEl.type}
                </span>

                {/* Text Editing Inline */}
                {(selectedEl.type === 'text' || selectedEl.type === 'quote' || selectedEl.type === 'note') && (
                  <input
                    type="text"
                    value={selectedEl.content}
                    onChange={(e) => updateSelectedContent(e.target.value)}
                    className="px-2 py-1 bg-lavender/20 rounded-lg text-xs text-deep-purple border border-lavender/40 focus:outline-none min-w-[200px]"
                    placeholder="Edit text..."
                  />
                )}

                {/* Font Size */}
                {(selectedEl.type === 'text' || selectedEl.type === 'quote' || selectedEl.type === 'note') && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateSelectedStyle('fontSize', Math.max(10, (selectedEl.styles?.fontSize || 16) - 2))}
                      className="px-2 py-1 rounded bg-lavender/30 text-xs font-bold text-deep-purple"
                    >
                      A-
                    </button>
                    <span className="text-xs font-semibold text-deep-purple px-1">
                      {selectedEl.styles?.fontSize || 16}px
                    </span>
                    <button
                      onClick={() => updateSelectedStyle('fontSize', Math.min(64, (selectedEl.styles?.fontSize || 16) + 2))}
                      className="px-2 py-1 rounded bg-lavender/30 text-xs font-bold text-deep-purple"
                    >
                      A+
                    </button>
                  </div>
                )}

                {/* Frame / Border Preset */}
                {selectedEl.type === 'image' && (
                  <div className="flex items-center gap-1">
                    {FRAME_STYLES.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => updateSelectedStyle('frame', f.id)}
                        className={`text-[10px] px-2 py-1 rounded-lg border font-semibold ${
                          (selectedEl.styles?.frame || 'none') === f.id
                            ? 'bg-deep-purple text-white border-deep-purple'
                            : 'bg-white text-deep-purple/70 border-lavender/40'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => rotateSelected(15)}
                  className="p-1.5 rounded-lg hover:bg-lavender/20 text-deep-purple"
                  title="Rotate 15°"
                >
                  <RotateCw size={15} />
                </button>
                <button
                  onClick={bringToFront}
                  className="p-1.5 rounded-lg hover:bg-lavender/20 text-deep-purple"
                  title="Bring to Front"
                >
                  <Layers size={15} />
                </button>
                <button
                  onClick={duplicateSelected}
                  className="p-1.5 rounded-lg hover:bg-lavender/20 text-deep-purple"
                  title="Duplicate"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={deleteSelected}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Vision Board Infinite Canvas */}
        <div
          className="flex-1 w-full h-full overflow-auto relative cursor-crosshair p-8"
          onClick={() => setSelectedId(null)}
        >
          <div
            ref={canvasRef}
            className="w-[1600px] h-[1200px] relative rounded-4xl shadow-dreamy-lg border border-white/60 transition-transform origin-top-left"
            style={{
              background: board?.background_gradient || '#FFF9F1',
              transform: `scale(${zoomLevel})`
            }}
          >
            {/* Watermark / Logo on canvas */}
            <div className="absolute bottom-6 right-8 pointer-events-none opacity-40 flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="font-display font-bold text-lg text-deep-purple tracking-widest">
                DreamBoard
              </span>
            </div>

            {/* Elements on Canvas */}
            {elements.map((el) => {
              const isSelected = el.id === selectedId
              const frameConfig = FRAME_STYLES.find(f => f.id === el.styles?.frame) || FRAME_STYLES[0]

              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleMouseDown(e, el.id)}
                  onTouchStart={(e) => handleTouchStart(e, el.id)}
                  className={`absolute cursor-grab active:cursor-grabbing transition-shadow ${
                    isSelected ? 'ring-2 ring-deep-purple ring-offset-2 ring-offset-cream shadow-dreamy-lg' : ''
                  }`}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: el.width ? `${el.width}px` : 'auto',
                    minHeight: el.height ? `${el.height}px` : 'auto',
                    transform: `rotate(${el.rotation || 0}deg)`,
                    zIndex: el.z_index || 1,
                  }}
                >
                  {/* 1. Image Element */}
                  {el.type === 'image' && (
                    <div className={`overflow-hidden ${frameConfig.class} bg-white transition-all`}>
                      <img
                        src={el.image_url}
                        alt={el.content || 'Dream image'}
                        className="w-full h-auto object-cover rounded-xl pointer-events-none"
                        style={{ maxHeight: '400px' }}
                      />
                      {el.styles?.frame === 'polaroid' && (
                        <p className="font-display italic text-center text-xs text-deep-purple/80 pt-2 pb-1 font-medium">
                          {el.content || 'Dream memory ✨'}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 2. Text Element */}
                  {el.type === 'text' && (
                    <div
                      className="p-3 shadow-sm rounded-2xl"
                      style={{
                        background: el.styles?.background || 'rgba(255,255,255,0.85)',
                        color: el.styles?.color || '#59436F',
                        fontSize: `${el.styles?.fontSize || 18}px`,
                        fontWeight: el.styles?.fontWeight || '600',
                        fontFamily: el.styles?.fontFamily || 'Playfair Display',
                        borderRadius: `${el.styles?.borderRadius || 16}px`
                      }}
                    >
                      {el.content}
                    </div>
                  )}

                  {/* 3. Quote Element */}
                  {el.type === 'quote' && (
                    <div
                      className="p-5 rounded-3xl shadow-dreamy border border-white/60"
                      style={{
                        background: el.styles?.background || 'rgba(255,255,255,0.9)',
                        color: el.styles?.color || '#59436F',
                        fontSize: `${el.styles?.fontSize || 15}px`,
                        fontFamily: 'Playfair Display',
                        fontStyle: 'italic',
                        lineHeight: 1.5
                      }}
                    >
                      <Quote size={16} className="text-soft-rose mb-1 opacity-70" />
                      <p className="whitespace-pre-line">{el.content}</p>
                    </div>
                  )}

                  {/* 4. Note Element */}
                  {el.type === 'note' && (
                    <div
                      className="p-5 rounded-2xl shadow-dreamy border border-pastel-pink/50"
                      style={{
                        background: el.styles?.background || 'rgba(248, 217, 232, 0.95)',
                        color: el.styles?.color || '#59436F',
                        fontSize: `${el.styles?.fontSize || 13}px`,
                        fontFamily: 'Inter',
                        lineHeight: 1.6
                      }}
                    >
                      <p className="whitespace-pre-line font-medium">{el.content}</p>
                    </div>
                  )}

                  {/* 5. Sticker Element */}
                  {el.type === 'sticker' && (
                    <div
                      className="flex items-center justify-center p-2 transition-transform hover:scale-110"
                      style={{
                        fontSize: `${el.styles?.fontSize || 42}px`,
                        background: el.styles?.background || 'transparent',
                        borderRadius: '99px'
                      }}
                    >
                      {el.content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Background Palette Modal */}
      <AnimatePresence>
        {showBgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-purple/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-cream rounded-3xl p-6 shadow-dreamy-lg border border-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-xl text-deep-purple">
                  Canvas Background Theme
                </h3>
                <button onClick={() => setShowBgModal(false)} className="p-1 rounded-lg hover:bg-lavender/30">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {GRADIENT_PRESETS.map((grad) => (
                  <button
                    key={grad.id}
                    onClick={() => {
                      setBoard({ ...board, background_gradient: grad.bg })
                      setShowBgModal(false)
                      toast.success(`Theme updated to ${grad.label}`)
                    }}
                    className="p-3 rounded-2xl text-left border-2 border-white hover:border-deep-purple transition shadow-xs flex flex-col justify-between h-24"
                    style={{ background: grad.bg }}
                  >
                    <span className="badge bg-white/80 text-[10px] font-bold text-deep-purple self-start">
                      {grad.label}
                    </span>
                    {board?.background_gradient === grad.bg && (
                      <span className="self-end bg-deep-purple text-white p-1 rounded-full text-xs">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Board Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-purple/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-cream rounded-3xl p-6 shadow-dreamy-lg border border-white space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xl text-deep-purple">
                  Share Your Vision Board
                </h3>
                <button onClick={() => setShowShareModal(false)} className="p-1 rounded-lg hover:bg-lavender/30">✕</button>
              </div>
              <p className="text-xs text-deep-purple/70">
                Anyone with this private link can view your aesthetic board without edit access.
              </p>
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-lavender/40">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/board/${board?.id}`}
                  className="bg-transparent text-xs text-deep-purple flex-1 outline-none px-2"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/board/${board?.id}`)
                    toast.success('Share link copied! 🔗')
                  }}
                  className="btn-primary py-1.5 px-3 text-xs"
                >
                  Copy
                </button>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyToBoard={(item) => {
          if (item.type === 'quote') {
            addQuoteElement(item.content)
          } else if (item.type === 'image') {
            addImageElementFromUrl(item.image_url, item.content)
          } else {
            addTextElement()
          }
        }}
      />
    </div>
  )
}

