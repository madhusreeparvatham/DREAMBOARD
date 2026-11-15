import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Share2,
  RefreshCw,
  Copy,
  Sparkles,
  Bookmark,
  Trash2,
  Check,
  Sun,
  Moon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { quotesService } from '../lib/db'
import { inspirationalQuotes, getDailyQuote } from '../data/quotes'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const BACKGROUND_GRADIENTS = [
  { name: 'Aurora Rose', value: 'linear-gradient(135deg, #F8D9E8 0%, #DCCBFF 50%, #D9ECFF 100%)' },
  { name: 'Celestial Night', value: 'linear-gradient(135deg, #59436F 0%, #7A6490 50%, #E9AFC5 100%)', isDark: true },
  { name: 'Morning Mist', value: 'linear-gradient(135deg, #D9ECFF 0%, #FFF9F1 50%, #F8D9E8 100%)' },
  { name: 'Golden Hour', value: 'linear-gradient(135deg, #FFF9F1 0%, #F8D9E8 50%, #E9AFC5 100%)' },
  { name: 'Amethyst Sky', value: 'linear-gradient(135deg, #DCCBFF 0%, #9B7EC8 50%, #59436F 100%)', isDark: true },
]

const DAILY_AFFIRMATIONS = [
  "You possess the quiet strength to manifest every vision you write down today.",
  "Your timing is divine. Do not rush the delicate art of becoming.",
  "Abundance flows naturally into spaces that are tended with love and clarity.",
  "You are not behind; you are preparing for horizons greater than you imagine.",
  "Trust the whispers of your intuition and the beauty of your wildest hopes.",
  "Peace is your superpower. Radiate gentleness and move with purpose."
]

export default function DailyInspiration() {
  const { user } = useAuth()
  const [currentQuote, setCurrentQuote] = useState(getDailyQuote())
  const [bgIndex, setBgIndex] = useState(0)
  const [savedQuotes, setSavedQuotes] = useState([])
  const [savedTab, setSavedTab] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Today's affirmation
  const todayAffirmation = DAILY_AFFIRMATIONS[new Date().getDate() % DAILY_AFFIRMATIONS.length]

  useEffect(() => {
    loadSavedQuotes()
  }, [user])

  async function loadSavedQuotes() {
    try {
      const { data } = await quotesService.getAll(user?.id)
      if (data) setSavedQuotes(data)
    } catch (e) {}
  }

  const handleNextQuote = () => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length)
    setCurrentQuote(inspirationalQuotes[randomIndex])
    setBgIndex((prev) => (prev + 1) % BACKGROUND_GRADIENTS.length)
  }

  const handleSaveQuote = async () => {
    try {
      const { data } = await quotesService.save(
        user.id,
        currentQuote.quote,
        currentQuote.author,
        currentQuote.category || 'inspiration'
      )
      if (data) {
        setSavedQuotes([data, ...savedQuotes])
        toast.success('Quote saved to your Sanctuary! 💜')
      }
    } catch (e) {
      toast.error('Could not save quote')
    }
  }

  const handleDeleteSaved = async (id) => {
    try {
      await quotesService.delete(id)
      setSavedQuotes(savedQuotes.filter((q) => q.id !== id))
      toast.success('Quote removed')
    } catch (e) {
      toast.error('Failed to remove')
    }
  }

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.quote}" — ${currentQuote.author}`)
    setIsCopied(true)
    toast.success('Quote copied to clipboard! ✨')
    setTimeout(() => setIsCopied(false), 2000)
  }

  const currentBg = BACKGROUND_GRADIENTS[bgIndex]

  return (
    <div className="min-h-screen bg-cream pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Toggle between Daily Card and Saved Quotes */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-deep-purple">
              Daily Inspiration
            </h1>
            <p className="text-xs sm:text-sm text-deep-purple/60 mt-0.5">
              Daily soul nourishment, mindful affirmations, and guiding wisdom
            </p>
          </div>

          <div className="flex bg-lavender/30 p-1 rounded-2xl border border-lavender/40">
            <button
              onClick={() => setSavedTab(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                !savedTab ? 'bg-white text-deep-purple shadow-sm' : 'text-deep-purple/60 hover:text-deep-purple'
              }`}
            >
              Today's Word
            </button>
            <button
              onClick={() => setSavedTab(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                savedTab ? 'bg-white text-deep-purple shadow-sm' : 'text-deep-purple/60 hover:text-deep-purple'
              }`}
            >
              <Bookmark size={13} />
              <span>Saved ({savedQuotes.length})</span>
            </button>
          </div>
        </div>

        {!savedTab ? (
          <div className="space-y-6">
            {/* The Main Grand Inspiration Card */}
            <motion.section
              key={currentQuote.quote}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-4xl p-8 sm:p-14 shadow-dreamy-lg border border-white overflow-hidden min-h-[380px] flex flex-col justify-between"
              style={{ background: currentBg.value }}
            >
              {/* Background ambient orbs */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/20 blur-2xl pointer-events-none" />

              {/* Card Header Tag */}
              <div className="flex items-center justify-between relative z-10">
                <span className={`badge ${currentBg.isDark ? 'bg-white/20 text-white' : 'bg-white/80 text-deep-purple'} backdrop-blur-md text-xs font-bold`}>
                  {currentQuote.category || 'Universal Truth'}
                </span>
                <span className="text-2xl animate-sparkle">✨</span>
              </div>

              {/* Quote Statement */}
              <div className="py-8 relative z-10 max-w-2xl mx-auto text-center space-y-4">
                <blockquote
                  className={`font-display italic text-2xl sm:text-3xl lg:text-4xl leading-relaxed ${
                    currentBg.isDark ? 'text-white' : 'text-deep-purple'
                  }`}
                >
                  "{currentQuote.quote}"
                </blockquote>
                <cite
                  className={`block font-semibold tracking-wider text-xs sm:text-sm uppercase not-italic ${
                    currentBg.isDark ? 'text-pastel-pink' : 'text-deep-purple/75'
                  }`}
                >
                  — {currentQuote.author}
                </cite>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/20 relative z-10">
                <button
                  onClick={() => setBgIndex((prev) => (prev + 1) % BACKGROUND_GRADIENTS.length)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
                    currentBg.isDark ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/70 text-deep-purple hover:bg-white'
                  } transition`}
                >
                  Theme: {currentBg.name}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyQuote}
                    className={`p-2.5 rounded-xl ${
                      currentBg.isDark ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/80 text-deep-purple hover:bg-white'
                    } shadow-xs transition`}
                    title="Copy Quote"
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={handleSaveQuote}
                    className={`btn-primary text-xs py-2 px-4 flex items-center gap-1.5 ${
                      currentBg.isDark ? 'bg-white text-deep-purple hover:bg-white/90' : ''
                    }`}
                  >
                    <Heart size={14} className="fill-current text-soft-rose" />
                    <span>Save Quote</span>
                  </button>
                  <button
                    onClick={handleNextQuote}
                    className={`p-2.5 rounded-xl ${
                      currentBg.isDark ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/80 text-deep-purple hover:bg-white'
                    } shadow-xs transition`}
                    title="Next Quote"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Daily Positive Affirmation Box */}
            <section className="card p-6 sm:p-8 bg-white/90 border-white shadow-dreamy flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lavender to-soft-rose flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                🌸
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-soft-rose-dark">
                  Today's Positive Affirmation
                </span>
                <p className="font-display italic text-base sm:text-lg text-deep-purple">
                  "{todayAffirmation}"
                </p>
                <p className="text-xs text-deep-purple/60 pt-1">
                  Read this aloud three times. Carry its tranquility throughout your morning.
                </p>
              </div>
            </section>
          </div>
        ) : (
          /* Saved Quotes Collection */
          <div className="space-y-4">
            {savedQuotes.length === 0 ? (
              <div className="card p-12 text-center bg-white/60 border-2 border-dashed border-lavender/50 space-y-3">
                <Heart size={32} className="mx-auto text-soft-rose" />
                <h3 className="font-display font-semibold text-xl text-deep-purple">
                  No saved quotes yet
                </h3>
                <p className="text-xs text-deep-purple/60 max-w-sm mx-auto">
                  When a quote touches your spirit, click "Save Quote" to keep it in your permanent sanctuary.
                </p>
                <button
                  onClick={() => setSavedTab(false)}
                  className="btn-primary text-xs mt-2"
                >
                  Explore Quotes
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedQuotes.map((q) => (
                  <motion.div
                    key={q.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 bg-white/90 border-white/80 shadow-dreamy flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <blockquote className="font-display italic text-base sm:text-lg text-deep-purple leading-relaxed">
                        "{q.quote}"
                      </blockquote>
                      <cite className="block text-xs font-semibold text-soft-rose-dark not-italic">
                        — {q.author}
                      </cite>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`"${q.quote}" — ${q.author}`)
                          toast.success('Copied! 📋')
                        }}
                        className="p-2 rounded-xl bg-lavender/20 hover:bg-lavender/40 text-deep-purple transition"
                        title="Copy"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(q.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition"
                        title="Delete from saved"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}

