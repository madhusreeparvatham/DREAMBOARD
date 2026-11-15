import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Compass,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Plane,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Coins,
  Sprout,
  Home,
  Palette,
  CheckSquare
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { boardsService, elementsService } from '../lib/db'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const TEMPLATES = [
  {
    id: 'dream-life',
    title: 'Dream Life 2025',
    category: 'Lifestyle',
    description: 'An ethereal collage balancing health, passion, mindfulness, and everyday luxury.',
    emoji: '🌟',
    gradient: 'linear-gradient(135deg, #DCCBFF 0%, #F8D9E8 50%, #FFF9F1 100%)',
    tags: ['Aesthetic', 'Daily Habits', 'Abundance'],
    previewElements: [
      { type: 'quote', content: '"Your dreams deserve a place to grow."', x: 40, y: 30, rotation: -2 },
      { type: 'sticker', content: '✨ Manifesting', x: 180, y: 110, rotation: 3 },
      { type: 'note', content: '🌸 Morning Matcha & Sunrise Journal', x: 30, y: 150, rotation: 1 }
    ]
  },
  {
    id: 'travel-goals',
    title: 'Wanderlust & Horizons',
    category: 'Travel',
    description: 'Stunning coasts, passport stamps, European train journeys, and sunset ocean swims.',
    emoji: '✈️',
    gradient: 'linear-gradient(135deg, #D9ECFF 0%, #DCCBFF 50%, #F8D9E8 100%)',
    tags: ['Adventure', 'Ocean', 'Discovery'],
    previewElements: [
      { type: 'quote', content: '"Collect horizons, not things."', x: 40, y: 30, rotation: -3 },
      { type: 'sticker', content: '🌴 Amalfi Coast', x: 170, y: 100, rotation: 4 },
      { type: 'note', content: '📍 Kyoto, Santorini, Swiss Alps', x: 30, y: 150, rotation: -1 }
    ]
  },
  {
    id: 'career-goals',
    title: 'Career & Studio Empire',
    category: 'Career',
    description: 'Build your creative brand, lead high-impact projects, and unlock leadership milestones.',
    emoji: '💼',
    gradient: 'linear-gradient(135deg, #59436F 0%, #9B7EC8 50%, #E9AFC5 100%)',
    tags: ['Leadership', 'Creation', 'Success'],
    previewElements: [
      { type: 'quote', content: '"Execute with intention."', x: 40, y: 30, rotation: -1 },
      { type: 'sticker', content: '💎 Keynote Speaker', x: 160, y: 100, rotation: 2 },
      { type: 'note', content: '🎯 Launch Studio & 100k Club', x: 30, y: 150, rotation: 2 }
    ]
  },
  {
    id: 'study-motivation',
    title: 'Study & Mind Expansion',
    category: 'Education',
    description: 'Late night library sessions, high academic honors, foreign languages, and certificates.',
    emoji: '📚',
    gradient: 'linear-gradient(135deg, #F8D9E8 0%, #D9ECFF 50%, #FFF9F1 100%)',
    tags: ['Mindset', 'Growth', 'Knowledge'],
    previewElements: [
      { type: 'quote', content: '"Knowledge is quiet confidence."', x: 40, y: 30, rotation: -2 },
      { type: 'sticker', content: '🎓 Straight A’s', x: 180, y: 110, rotation: 3 }
    ]
  },
  {
    id: 'fitness-goals',
    title: 'Radiant Wellness & Pilates',
    category: 'Health',
    description: 'Sunrise pilates, nourishing foods, long ocean walks, hydration, and vibrant stamina.',
    emoji: '💪',
    gradient: 'linear-gradient(135deg, #E9AFC5 0%, #F8D9E8 50%, #FFF9F1 100%)',
    tags: ['Vitality', 'Nourish', 'Energy'],
    previewElements: [
      { type: 'quote', content: '"Honor your body daily."', x: 40, y: 30, rotation: 2 },
      { type: 'sticker', content: '🧘‍♀️ Daily Movement', x: 170, y: 110, rotation: -2 }
    ]
  },
  {
    id: 'financial-goals',
    title: 'Abundance & Financial Freedom',
    category: 'Finance',
    description: 'Investments, passive income streams, guilt-free luxury, and debt-free peace.',
    emoji: '💰',
    gradient: 'linear-gradient(135deg, #D9ECFF 0%, #FFF9F1 50%, #DCCBFF 100%)',
    tags: ['Wealth', 'Freedom', 'Security'],
    previewElements: [
      { type: 'quote', content: '"Abundance flows with ease."', x: 40, y: 30, rotation: -1 },
      { type: 'sticker', content: '💸 $50k Freedom Fund', x: 160, y: 110, rotation: 3 }
    ]
  },
  {
    id: 'self-growth',
    title: 'Gentle Self Growth & Healing',
    category: 'Personal',
    description: 'Emotional boundaries, positive affirmations, meditation, and radical self-compassion.',
    emoji: '🌱',
    gradient: 'linear-gradient(135deg, #DCCBFF 0%, #D9ECFF 50%, #FFF9F1 100%)',
    tags: ['Peace', 'Soul', 'Boundaries'],
    previewElements: [
      { type: 'quote', content: '"Bloom at your own pace."', x: 40, y: 30, rotation: 2 },
      { type: 'sticker', content: '🌸 Inner Peace', x: 170, y: 110, rotation: -3 }
    ]
  },
  {
    id: 'dream-home',
    title: 'Dream Sanctuary Home',
    category: 'Home',
    description: 'Sunlit floor-to-ceiling windows, private courtyard garden, ceramic kitchenware, and cozy linen.',
    emoji: '🏡',
    gradient: 'linear-gradient(135deg, #FFF9F1 0%, #F8D9E8 50%, #D9ECFF 100%)',
    tags: ['Interior', 'Sanctuary', 'Architecture'],
    previewElements: [
      { type: 'quote', content: '"Peace begins in your home."', x: 40, y: 30, rotation: -2 },
      { type: 'sticker', content: '🪴 Sunroom Garden', x: 170, y: 110, rotation: 3 }
    ]
  },
  {
    id: 'creative-life',
    title: 'Creative Life & Art Studio',
    category: 'Creative',
    description: 'Oil paintings, pottery wheel, podcast studio, poetry drafts, and bohemian art galleries.',
    emoji: '🎨',
    gradient: 'linear-gradient(135deg, #F8D9E8 0%, #DCCBFF 50%, #E9AFC5 100%)',
    tags: ['Art', 'Expression', 'Writing'],
    previewElements: [
      { type: 'quote', content: '"Create what you want to exist."', x: 40, y: 30, rotation: 1 },
      { type: 'sticker', content: '🖌️ Solo Exhibition', x: 170, y: 110, rotation: -2 }
    ]
  },
  {
    id: 'bucket-list',
    title: 'Life Bucket List 100',
    category: 'Bucket List',
    description: 'Hot air balloon in Cappadocia, seeing the Northern Lights, publishing a memoir.',
    emoji: '🪣',
    gradient: 'linear-gradient(135deg, #E9AFC5 0%, #DCCBFF 50%, #D9ECFF 100%)',
    tags: ['Once in a Lifetime', 'Thrills', 'Memories'],
    previewElements: [
      { type: 'quote', content: '"Live a story worth telling."', x: 40, y: 30, rotation: -3 },
      { type: 'sticker', content: '🌌 Aurora Borealis', x: 170, y: 110, rotation: 2 }
    ]
  }
]

const CATEGORIES = ['All', 'Lifestyle', 'Travel', 'Career', 'Education', 'Health', 'Finance', 'Personal', 'Home', 'Creative', 'Bucket List']

export default function Templates() {
  const [selectedCat, setSelectedCat] = useState('All')
  const [cloningId, setCloningId] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const filtered = selectedCat === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCat)

  const handleUseTemplate = async (template) => {
    setCloningId(template.id)
    const toastId = toast.loading(`Crafting your "${template.title}" board...`)
    try {
      // 1. Create board
      const { data: boardData, error: boardErr } = await boardsService.create(user?.id || 'guest', {
        title: template.title,
        description: template.description,
        background_gradient: template.gradient,
        template_id: template.id
      })
      if (boardErr) throw boardErr

      // 2. Pre-fill with template elements
      const elementsToCreate = template.previewElements.map((el, i) => ({
        id: 'el-' + Date.now() + '-' + i,
        board_id: boardData.id,
        user_id: user?.id || 'guest',
        type: el.type,
        content: el.content,
        x: el.x + 40,
        y: el.y + 40,
        width: el.type === 'sticker' ? 120 : 250,
        height: el.type === 'sticker' ? 60 : 110,
        rotation: el.rotation || 0,
        z_index: i + 1,
        styles: {
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#59436F',
          borderRadius: 20,
          fontFamily: 'Playfair Display'
        }
      }))
      await elementsService.saveAll(boardData.id, elementsToCreate)

      toast.success('Template loaded into canvas! ✨', { id: toastId })
      navigate(`/board/${boardData.id}`)
    } catch (err) {
      toast.error('Failed to clone template', { id: toastId })
    } finally {
      setCloningId(null)
    }
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Header Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lavender/40 text-xs font-semibold text-deep-purple border border-lavender/60">
            <Sparkles size={14} className="text-soft-rose-dark" />
            <span>Curated Aesthetic Canvases</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-deep-purple">
            Vision Board Templates
          </h1>

          <p className="text-sm sm:text-base text-deep-purple/70 leading-relaxed">
            Choose from 10 dream-inspired blueprints crafted for travel, ambition, wellness, wealth, and creative fulfillment.
          </p>
        </section>

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedCat === cat
                  ? 'bg-deep-purple text-white shadow-dreamy'
                  : 'bg-white/80 text-deep-purple/70 hover:bg-white border border-lavender/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tpl) => (
            <motion.div
              key={tpl.id}
              whileHover={{ y: -8 }}
              className="card group overflow-hidden border-white bg-white/90 shadow-dreamy hover:shadow-dreamy-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Template Canvas Preview Header */}
              <div
                className="h-56 p-5 relative overflow-hidden flex flex-col justify-between"
                style={{ background: tpl.gradient }}
              >
                {/* Floating Preview elements inside card */}
                <div className="absolute inset-0 p-4 pointer-events-none">
                  {tpl.previewElements.map((el, idx) => (
                    <div
                      key={idx}
                      className="absolute px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-sm text-[11px] font-semibold text-deep-purple shadow-sm border border-white/60 truncate max-w-[200px]"
                      style={{
                        left: `${el.x}px`,
                        top: `${el.y}px`,
                        transform: `rotate(${el.rotation}deg)`
                      }}
                    >
                      {el.content}
                    </div>
                  ))}
                </div>

                {/* Top Badge */}
                <div className="flex justify-between items-center relative z-10">
                  <span className="badge bg-white/80 backdrop-blur-md text-deep-purple text-[10px] font-bold">
                    {tpl.category}
                  </span>
                  <span className="text-2xl drop-shadow-sm">{tpl.emoji}</span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-display font-bold text-xl text-deep-purple drop-shadow-xs">
                    {tpl.title}
                  </h3>
                </div>
              </div>

              {/* Template Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-deep-purple/75 leading-relaxed">
                    {tpl.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tpl.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-lavender/30 text-deep-purple/80 font-medium px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Use Template CTA */}
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  disabled={cloningId === tpl.id}
                  className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 group-hover:shadow-glow transition-all"
                >
                  {cloningId === tpl.id ? (
                    <span>Opening Canvas...</span>
                  ) : (
                    <>
                      <span>Use This Template</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  )
}

