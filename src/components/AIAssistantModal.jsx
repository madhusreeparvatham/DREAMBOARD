import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  X,
  Quote,
  Layout,
  ListChecks,
  Eye,
  Image as ImageIcon,
  Copy,
  Check,
  Send,
  Download
} from 'lucide-react'
import { aiService } from '../lib/ai'
import toast from 'react-hot-toast'

export default function AIAssistantModal({ isOpen, onClose, onApplyToBoard }) {
  const [activeTab, setActiveTab] = useState('image') // image, quote, ideas, goal, visual
  const [loading, setLoading] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [result, setResult] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [generatedImgUrl, setGeneratedImgUrl] = useState('')

  if (!isOpen) return null

  const handleGenerate = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      if (activeTab === 'image') {
        const query = inputVal.trim() || 'Aesthetic luxury Parisian balcony with flowers and coffee at sunrise'
        const url = aiService.generateAIImage(query)
        setGeneratedImgUrl(url)
        setResult({ data: { url, prompt: query }, isDemo: false })
      } else if (activeTab === 'quote') {
        const res = await aiService.generateQuote(inputVal || 'Personal Growth & Freedom')
        setResult(res)
      } else if (activeTab === 'ideas') {
        const res = await aiService.suggestBoardIdeas(inputVal || 'Travel, Wellness, Creativity')
        setResult(res)
      } else if (activeTab === 'goal') {
        const res = await aiService.breakdownGoal(inputVal || 'Run a marathon')
        setResult(res)
      } else if (activeTab === 'visual') {
        const res = await aiService.generateVisualIdeas(inputVal || 'Dream Life')
        setResult(res)
      }
    } catch (err) {
      toast.error('AI generation failed')
    } finally {
      setLoading(false)
    }
  }

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    toast.success('Copied to clipboard! 📋')
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-purple/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-cream rounded-3xl shadow-dreamy-lg border border-white/80 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-lavender/40 via-pastel-pink/40 to-baby-blue/40 border-b border-lavender/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-deep-purple text-white flex items-center justify-center shadow-md">
              <Sparkles size={20} className="text-pastel-pink" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-deep-purple">
                  DreamBoard AI Studio
                </h2>
                <span className="badge bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold">
                  Free Live AI Active
                </span>
              </div>
              <p className="text-xs text-deep-purple/70">
                Generate aesthetic AI images, bespoke quotes, themes, and goal roadmaps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/50 text-deep-purple/60 hover:text-deep-purple transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-lavender/30 bg-white/40 p-1.5 gap-1.5 overflow-x-auto">
          {[
            { id: 'image', label: 'AI Image Generator', icon: ImageIcon },
            { id: 'quote', label: 'AI Quote Generator', icon: Quote },
            { id: 'ideas', label: 'Vision Themes', icon: Layout },
            { id: 'goal', label: 'Goal Assistant', icon: ListChecks },
            { id: 'visual', label: 'Visual Prompts', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon
            const isSel = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setResult(null)
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-deep-purple text-white shadow-sm'
                    : 'text-deep-purple/70 hover:bg-lavender/20'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content & Input Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-3">
            <label className="label">
              {activeTab === 'image' && 'Describe the aesthetic image you want the AI to create:'}
              {activeTab === 'quote' && 'What is your current dream or focus?'}
              {activeTab === 'ideas' && 'What are your passions or desired lifestyle?'}
              {activeTab === 'goal' && 'What large goal do you want to break into steps?'}
              {activeTab === 'visual' && 'What board vibe or category are you designing?'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  activeTab === 'image' ? 'e.g. Sunset in Positano, cozy book café with cat, luxury glass penthouse...' :
                  activeTab === 'quote' ? 'e.g. Launching my design studio, marathon training, inner peace...' :
                  activeTab === 'ideas' ? 'e.g. European summer, cozy cottagecore, tech founder...' :
                  activeTab === 'goal' ? 'e.g. Save $10,000 for a down payment, learn Spanish...' :
                  'e.g. Soft pastel romantic, moody luxury, minimal modern...'
                }
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-2.5 px-5 flex items-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin text-sm">✨</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-deep-purple/50 italic flex items-center gap-1">
              ✨ 100% Free AI: No API keys or accounts required. Unlimited generations.
            </p>
          </form>

          {/* Results Area */}
          <div className="min-h-[160px] flex flex-col justify-center">
            {loading && (
              <div className="text-center py-8 space-y-3">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 mx-auto rounded-full border-2 border-deep-purple border-t-transparent"
                />
                <p className="text-xs text-deep-purple/70 font-medium">
                  {activeTab === 'image' ? 'Dreaming up your high-res artwork...' : 'Weaving your vision into words...'}
                </p>
              </div>
            )}

            {!loading && !result && (
              <div className="text-center py-8 text-deep-purple/40 border-2 border-dashed border-lavender/50 rounded-2xl p-6">
                <Sparkles size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Type your vision above and click Generate to see the magic!</p>
              </div>
            )}

            {!loading && result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* 1. AI Image Result */}
                {activeTab === 'image' && result.data && (
                  <div className="card p-4 bg-white/95 border-lavender/40 space-y-3">
                    <div className="rounded-2xl overflow-hidden relative group max-h-[340px] flex items-center justify-center bg-lavender/10">
                      <img
                        src={result.data.url}
                        alt={result.data.prompt}
                        className="w-full h-auto object-cover rounded-xl shadow-md max-h-[320px]"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-lavender/20">
                      <p className="text-xs text-deep-purple/70 truncate max-w-[320px] font-medium">
                        "{result.data.prompt}"
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={result.data.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary py-1.5 px-3 text-xs"
                        >
                          View Full
                        </a>
                        {onApplyToBoard && (
                          <button
                            onClick={() => {
                              onApplyToBoard({
                                type: 'image',
                                image_url: result.data.url,
                                content: result.data.prompt
                              })
                              onClose()
                              toast.success('AI Artwork pinned to board! 🎨')
                            }}
                            className="btn-primary py-1.5 px-3 text-xs"
                          >
                            Pin to Board ✨
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Quote Result */}
                {activeTab === 'quote' && result.data && (
                  <div className="card p-6 bg-white/90 border-lavender/40 relative group">
                    <p className="font-display italic text-lg text-deep-purple leading-relaxed">
                      "{result.data.quote}"
                    </p>
                    <p className="text-xs font-semibold text-soft-rose-dark mt-3 text-right">
                      — {result.data.author}
                    </p>
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-lavender/30">
                      <button
                        onClick={() => copyText(`"${result.data.quote}" — ${result.data.author}`, 'quote')}
                        className="btn-secondary py-1.5 px-3 text-xs"
                      >
                        {copiedIndex === 'quote' ? <Check size={14} /> : <Copy size={14} />}
                        <span>Copy Quote</span>
                      </button>
                      {onApplyToBoard && (
                        <button
                          onClick={() => {
                            onApplyToBoard({
                              type: 'quote',
                              content: `"${result.data.quote}"\n— ${result.data.author}`,
                            })
                            onClose()
                          }}
                          className="btn-primary py-1.5 px-3 text-xs"
                        >
                          Pin to Board ✨
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Board Ideas Result */}
                {activeTab === 'ideas' && Array.isArray(result.data) && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.data.map((idea, idx) => (
                      <div key={idx} className="card p-4 bg-white/80 border-lavender/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-semibold text-sm text-deep-purple">
                            {idea.theme}
                          </h4>
                          <div className="flex gap-1">
                            {idea.palette?.map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-deep-purple/70 leading-relaxed">
                          {idea.description}
                        </p>
                        <div className="pt-2 border-t border-lavender/20 flex flex-wrap gap-1">
                          {idea.elements?.map((el, i) => (
                            <span key={i} className="text-[10px] bg-lavender/30 text-deep-purple px-2 py-0.5 rounded-md">
                              {el}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Goal Assistant Result */}
                {activeTab === 'goal' && Array.isArray(result.data) && (
                  <div className="space-y-2.5">
                    {result.data.map((step, idx) => (
                      <div key={idx} className="card p-3.5 bg-white/80 border-lavender/30 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-pastel-pink text-deep-purple font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-deep-purple">{step.step}</span>
                            <span className="text-[10px] badge bg-lavender/40 text-deep-purple font-semibold">{step.milestone}</span>
                          </div>
                          <p className="text-xs text-deep-purple/60 mt-1 italic">{step.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. Visual Prompts Result */}
                {activeTab === 'visual' && Array.isArray(result.data) && (
                  <div className="space-y-2">
                    {result.data.map((item, idx) => (
                      <div key={idx} className="card p-3.5 bg-white/80 border-lavender/30 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-soft-rose-dark block">
                            {item.type}
                          </span>
                          <span className="text-xs text-deep-purple font-medium">
                            {item.suggestion}
                          </span>
                        </div>
                        <button
                          onClick={() => copyText(item.suggestion, idx)}
                          className="p-1.5 rounded-lg hover:bg-lavender/20 text-deep-purple/60 transition"
                        >
                          {copiedIndex === idx ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
