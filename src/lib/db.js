import { supabase, isSupabaseConfigured } from './supabase'

const LS_BOARDS = 'dreamboard_boards'
const LS_ELEMENTS = 'dreamboard_elements'
const LS_GOALS = 'dreamboard_goals'
const LS_QUOTES = 'dreamboard_quotes'

// Initial seed data for a luxury, inspiring experience right out of the box
const SEED_BOARDS = [
  {
    id: 'board-seed-1',
    user_id: 'guest-dreamer-01',
    title: 'Dream Life 2025 ✨',
    description: 'Abundance, health, mindfulness and intentional living.',
    background_color: '#FFF9F1',
    background_gradient: 'linear-gradient(135deg, #DCCBFF 0%, #F8D9E8 50%, #FFF9F1 100%)',
    thumbnail_url: null,
    is_public: true,
    share_token: 'dream-life-public-2025',
    template_id: 'dream-life',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'board-seed-2',
    user_id: 'guest-dreamer-01',
    title: 'Wanderlust & Horizons ✈️',
    description: 'Kyoto cherry blossoms, Amalfi coast, Swiss Alps, and sunset beaches.',
    background_color: '#D9ECFF',
    background_gradient: 'linear-gradient(135deg, #D9ECFF 0%, #DCCBFF 50%, #F8D9E8 100%)',
    thumbnail_url: null,
    is_public: false,
    share_token: 'wanderlust-share-777',
    template_id: 'travel-goals',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'board-seed-3',
    user_id: 'guest-dreamer-01',
    title: 'Creative Empire & Studio 💼',
    description: 'Launch digital studio, publish book, host creative retreats.',
    background_color: '#59436F',
    background_gradient: 'linear-gradient(135deg, #59436F 0%, #9B7EC8 50%, #E9AFC5 100%)',
    thumbnail_url: null,
    is_public: true,
    share_token: 'creative-studio-empire',
    template_id: 'career-goals',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
]

const SEED_ELEMENTS = [
  // Board 1 elements
  {
    id: 'el-1',
    board_id: 'board-seed-1',
    user_id: 'guest-dreamer-01',
    type: 'quote',
    content: '"Your dreams deserve a place to grow."\n— DreamBoard',
    x: 60, y: 50, width: 280, height: 140, rotation: -2, z_index: 2,
    styles: { background: 'rgba(255, 255, 255, 0.85)', color: '#59436F', fontSize: 16, fontStyle: 'italic', borderRadius: 20 }
  },
  {
    id: 'el-2',
    board_id: 'board-seed-1',
    user_id: 'guest-dreamer-01',
    type: 'note',
    content: '🌸 Daily Ritual:\n• 10 min gratitude journaling\n• Matcha with fresh berries\n• Movement & outdoor walk\n• Deep focused creative time',
    x: 370, y: 70, width: 260, height: 180, rotation: 3, z_index: 3,
    styles: { background: 'rgba(248, 217, 232, 0.9)', color: '#59436F', fontSize: 13, borderRadius: 16 }
  },
  {
    id: 'el-3',
    board_id: 'board-seed-1',
    user_id: 'guest-dreamer-01',
    type: 'sticker',
    content: '🌟 Manifesting Magic',
    x: 100, y: 230, width: 200, height: 70, rotation: -4, z_index: 4,
    styles: { background: 'linear-gradient(135deg, #DCCBFF, #F8D9E8)', color: '#59436F', fontSize: 15, fontWeight: 'bold', borderRadius: 99 }
  },
  {
    id: 'el-4',
    board_id: 'board-seed-1',
    user_id: 'guest-dreamer-01',
    type: 'image',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    content: 'Beach Serenity',
    x: 660, y: 40, width: 250, height: 190, rotation: 2, z_index: 1,
    styles: { borderRadius: 20, boxShadow: '0 8px 30px rgba(89,67,111,0.15)' }
  },
  {
    id: 'el-5',
    board_id: 'board-seed-1',
    user_id: 'guest-dreamer-01',
    type: 'image',
    image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    content: 'Sunlit Studio',
    x: 340, y: 280, width: 270, height: 200, rotation: -1, z_index: 2,
    styles: { borderRadius: 20 }
  },
  {
    id: 'el-6',
    board_id: 'board-seed-1',
    user_id: 'guest-dreamer-01',
    type: 'sticker',
    content: '✨ You Are Limitless',
    x: 680, y: 260, width: 190, height: 60, rotation: 5, z_index: 5,
    styles: { background: 'linear-gradient(135deg, #D9ECFF, #FFF9F1)', color: '#59436F', borderRadius: 99 }
  }
]

const SEED_GOALS = [
  {
    id: 'goal-1',
    user_id: 'guest-dreamer-01',
    title: 'Launch Dream Studio & Portfolio',
    description: 'Design and deploy the creative brand identity and client showcase.',
    category: 'career',
    priority: 'high',
    target_date: '2025-06-30',
    progress: 75,
    is_completed: false,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'goal-2',
    user_id: 'guest-dreamer-01',
    title: 'Spend 2 Weeks in Southern Italy',
    description: 'Explore Positano, Ravello, Capri, and indulge in Mediterranean culture.',
    category: 'travel',
    priority: 'medium',
    target_date: '2025-08-15',
    progress: 40,
    is_completed: false,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'goal-3',
    user_id: 'guest-dreamer-01',
    title: 'Morning Mindfulness & Yoga (30 Days)',
    description: 'Complete 30 consecutive sunrise yoga sessions and sound meditation.',
    category: 'health',
    priority: 'high',
    target_date: '2025-04-10',
    progress: 100,
    is_completed: true,
    created_at: new Date(Date.now() - 86400000 * 35).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'goal-4',
    user_id: 'guest-dreamer-01',
    title: 'Build $25,000 Emergency & Freedom Fund',
    description: 'Automate weekly deposits into high-yield savings to cultivate peace of mind.',
    category: 'finance',
    priority: 'medium',
    target_date: '2025-12-31',
    progress: 55,
    is_completed: false,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString()
  }
]

function getLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(raw)
  } catch (e) {
    return fallback
  }
}

function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

// ─── Vision Boards Service ──────────────────────────────────────────────────
export const boardsService = {
  async getAll(userId) {
    if (isSupabaseConfigured && userId) {
      try {
        const { data, error } = await supabase.from('vision_boards').select('*').eq('user_id', userId).order('updated_at', { ascending: false })
        if (!error && data && data.length > 0) return { data, error: null }
      } catch (e) {}
    }
    const all = getLocal(LS_BOARDS, SEED_BOARDS)
    const userBoards = all.filter(b => !userId || b.user_id === userId || b.user_id === 'guest-dreamer-01')
    return { data: userBoards.length > 0 ? userBoards : all, error: null }
  },

  async getById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('vision_boards').select('*, board_elements(*)').eq('id', id).single()
        if (!error && data) return { data, error: null }
      } catch (e) {}
    }
    const all = getLocal(LS_BOARDS, SEED_BOARDS)
    const board = all.find(b => b.id === id) || all[0]
    const allElements = getLocal(LS_ELEMENTS, SEED_ELEMENTS)
    const boardElements = allElements.filter(e => e.board_id === board.id)
    return { data: { ...board, board_elements: boardElements }, error: null }
  },

  async create(userId, data) {
    const newBoard = {
      id: 'board-' + Date.now(),
      user_id: userId,
      title: data.title || 'Untitled Board',
      description: data.description || '',
      background_color: data.background_color || '#FFF9F1',
      background_gradient: data.background_gradient || 'linear-gradient(135deg,#DCCBFF,#F8D9E8)',
      thumbnail_url: data.thumbnail_url || null,
      is_public: Boolean(data.is_public),
      share_token: 'share-' + Math.random().toString(36).substring(2, 10),
      template_id: data.template_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      try {
        const res = await supabase.from('vision_boards').insert({ user_id: userId, ...data }).select().single()
        if (!res.error && res.data) return res
      } catch (e) {}
    }

    const all = getLocal(LS_BOARDS, SEED_BOARDS)
    const updated = [newBoard, ...all]
    setLocal(LS_BOARDS, updated)
    return { data: newBoard, error: null }
  },

  async update(id, data) {
    if (isSupabaseConfigured) {
      try {
        const res = await supabase.from('vision_boards').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single()
        if (!res.error && res.data) return res
      } catch (e) {}
    }

    const all = getLocal(LS_BOARDS, SEED_BOARDS)
    let updatedBoard = null
    const updated = all.map(b => {
      if (b.id === id) {
        updatedBoard = { ...b, ...data, updated_at: new Date().toISOString() }
        return updatedBoard
      }
      return b
    })
    setLocal(LS_BOARDS, updated)
    return { data: updatedBoard, error: null }
  },

  async delete(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('vision_boards').delete().eq('id', id)
      } catch (e) {}
    }
    const all = getLocal(LS_BOARDS, SEED_BOARDS)
    setLocal(LS_BOARDS, all.filter(b => b.id !== id))
    return { error: null }
  },

  async duplicate(board, userId) {
    const { id, created_at, updated_at, share_token, ...rest } = board
    return this.create(userId, { ...rest, title: `${board.title} (Copy)` })
  }
}

// ─── Board Elements Service ─────────────────────────────────────────────────
export const elementsService = {
  async getByBoard(boardId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('board_elements').select('*').eq('board_id', boardId).order('z_index')
        if (!error && data) return { data, error: null }
      } catch (e) {}
    }
    const all = getLocal(LS_ELEMENTS, SEED_ELEMENTS)
    return { data: all.filter(e => e.board_id === boardId), error: null }
  },

  async create(data) {
    const newEl = {
      id: 'el-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      ...data,
      created_at: new Date().toISOString()
    }
    if (isSupabaseConfigured) {
      try {
        const res = await supabase.from('board_elements').insert(data).select().single()
        if (!res.error && res.data) return res
      } catch (e) {}
    }
    const all = getLocal(LS_ELEMENTS, SEED_ELEMENTS)
    const updated = [...all, newEl]
    setLocal(LS_ELEMENTS, updated)
    return { data: newEl, error: null }
  },

  async update(id, data) {
    if (isSupabaseConfigured) {
      try {
        const res = await supabase.from('board_elements').update(data).eq('id', id).select().single()
        if (!res.error && res.data) return res
      } catch (e) {}
    }
    const all = getLocal(LS_ELEMENTS, SEED_ELEMENTS)
    let updatedItem = null
    const updated = all.map(el => {
      if (el.id === id) {
        updatedItem = { ...el, ...data }
        return updatedItem
      }
      return el
    })
    setLocal(LS_ELEMENTS, updated)
    return { data: updatedItem, error: null }
  },

  async delete(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('board_elements').delete().eq('id', id)
      } catch (e) {}
    }
    const all = getLocal(LS_ELEMENTS, SEED_ELEMENTS)
    setLocal(LS_ELEMENTS, all.filter(e => e.id !== id))
    return { error: null }
  },

  async saveAll(boardId, elements) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('board_elements').delete().eq('board_id', boardId)
        if (elements.length > 0) {
          await supabase.from('board_elements').insert(elements)
        }
      } catch (e) {}
    }
    const all = getLocal(LS_ELEMENTS, SEED_ELEMENTS)
    const rest = all.filter(e => e.board_id !== boardId)
    setLocal(LS_ELEMENTS, [...rest, ...elements])
    return { error: null }
  }
}

// ─── Goals Service ──────────────────────────────────────────────────────────
export const goalsService = {
  async getAll(userId) {
    if (isSupabaseConfigured && userId) {
      try {
        const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
        if (!error && data && data.length > 0) return { data, error: null }
      } catch (e) {}
    }
    const all = getLocal(LS_GOALS, SEED_GOALS)
    const userGoals = all.filter(g => !userId || g.user_id === userId || g.user_id === 'guest-dreamer-01')
    return { data: userGoals.length > 0 ? userGoals : all, error: null }
  },

  async create(userId, data) {
    const newGoal = {
      id: 'goal-' + Date.now(),
      user_id: userId,
      title: data.title,
      description: data.description || '',
      category: data.category || 'personal',
      priority: data.priority || 'medium',
      target_date: data.target_date || null,
      progress: Number(data.progress) || 0,
      is_completed: Boolean(data.is_completed),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    if (isSupabaseConfigured) {
      try {
        const res = await supabase.from('goals').insert({ user_id: userId, ...data }).select().single()
        if (!res.error && res.data) return res
      } catch (e) {}
    }
    const all = getLocal(LS_GOALS, SEED_GOALS)
    const updated = [newGoal, ...all]
    setLocal(LS_GOALS, updated)
    return { data: newGoal, error: null }
  },

  async update(id, data) {
    if (isSupabaseConfigured) {
      try {
        const res = await supabase.from('goals').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single()
        if (!res.error && res.data) return res
      } catch (e) {}
    }
    const all = getLocal(LS_GOALS, SEED_GOALS)
    let updatedGoal = null
    const updated = all.map(g => {
      if (g.id === id) {
        updatedGoal = { ...g, ...data, updated_at: new Date().toISOString() }
        return updatedGoal
      }
      return g
    })
    setLocal(LS_GOALS, updated)
    return { data: updatedGoal, error: null }
  },

  async delete(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('goals').delete().eq('id', id)
      } catch (e) {}
    }
    const all = getLocal(LS_GOALS, SEED_GOALS)
    setLocal(LS_GOALS, all.filter(g => g.id !== id))
    return { error: null }
  }
}

// ─── Quotes Service ─────────────────────────────────────────────────────────
export const quotesService = {
  async getAll(userId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('saved_quotes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
        if (!error && data) return { data, error: null }
      } catch (e) {}
    }
    return { data: getLocal(LS_QUOTES, []), error: null }
  },

  async save(userId, quote, author = 'Unknown', category = 'inspiration') {
    const item = {
      id: 'quote-' + Date.now(),
      user_id: userId,
      quote,
      author,
      category,
      created_at: new Date().toISOString()
    }
    if (isSupabaseConfigured) {
      try {
        const res = await supabase.from('saved_quotes').insert({ user_id: userId, quote, author, category }).select().single()
        if (!res.error && res.data) return res
      } catch (e) {}
    }
    const all = getLocal(LS_QUOTES, [])
    const updated = [item, ...all]
    setLocal(LS_QUOTES, updated)
    return { data: item, error: null }
  },

  async delete(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('saved_quotes').delete().eq('id', id)
      } catch (e) {}
    }
    const all = getLocal(LS_QUOTES, [])
    setLocal(LS_QUOTES, all.filter(q => q.id !== id))
    return { error: null }
  }
}

// ─── Storage Service ────────────────────────────────────────────────────────
export const storageService = {
  async uploadBoardImage(userId, file) {
    if (isSupabaseConfigured) {
      try {
        const ext = file.name.split('.').pop()
        const path = `${userId}/${Date.now()}.${ext}`
        const { data, error } = await supabase.storage.from('board-images').upload(path, file)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('board-images').getPublicUrl(path)
          return { url: publicUrl, error: null }
        }
      } catch (e) {}
    }

    // Convert file to Base64 data URL for instant client-side preview
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve({ url: reader.result, error: null })
      }
      reader.onerror = () => {
        resolve({ url: null, error: new Error('Failed to read image') })
      }
      reader.readAsDataURL(file)
    })
  },

  async uploadAvatar(userId, file) {
    return this.uploadBoardImage(userId, file)
  }
}
