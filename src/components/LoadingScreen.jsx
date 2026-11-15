import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center gradient-dreamboard z-50 overflow-hidden"
    >
      {/* Floating Sparkles & Stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
          className="absolute text-lavender-dark pointer-events-none"
          style={{
            top: `${15 + (i * 10)}%`,
            left: `${10 + ((i * 12) % 80)}%`,
          }}
        >
          {i % 2 === 0 ? <Sparkles size={20 + i * 2} /> : '✨'}
        </motion.div>
      ))}

      <div className="text-center relative z-10 glass p-10 rounded-3xl shadow-dreamy max-w-sm mx-4 border border-white/60">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-lavender via-pastel-pink to-soft-rose flex items-center justify-center shadow-glow"
        >
          <span className="text-3xl">✨</span>
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl font-bold text-deep-purple tracking-wide"
        >
          DreamBoard
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs uppercase tracking-widest text-deep-purple/70 font-semibold mt-1 mb-4"
        >
          Your Dreams, Your Universe
        </motion.p>

        {/* Animated Progress Bar */}
        <div className="w-48 h-2 mx-auto bg-white/50 rounded-full overflow-hidden p-0.5 border border-lavender/40">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-deep-purple via-soft-rose to-lavender rounded-full"
          />
        </div>

        <p className="text-xs text-deep-purple/60 mt-3 italic">
          Manifesting your space...
        </p>
      </div>
    </motion.div>
  )
}

