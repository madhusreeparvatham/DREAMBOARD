import { motion, useScroll, useTransform } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Star, Heart, Zap, ArrowRight, Menu, X, Check } from 'lucide-react'
import { useRef, useState } from 'react'

const floatVariants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
  }
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  viewport: { once: true, margin: '-50px' }
}

const features = [
  { icon: '🎨', title: 'Vision Board Editor', desc: 'Drag, drop, and arrange your dreams on a beautiful canvas. Add images, quotes, stickers and more.', color: '#DCCBFF' },
  { icon: '🎯', title: 'Goal Tracker', desc: 'Set meaningful goals with deadlines and progress tracking. Watch your dreams become reality.', color: '#F8D9E8' },
  { icon: '✨', title: 'AI-Powered Inspiration', desc: 'Let AI suggest board themes, generate quotes, and help you break down big goals into steps.', color: '#D9ECFF' },
  { icon: '📥', title: 'Download & Share', desc: 'Export your vision board as a beautiful PNG. Share boards via private links or set as wallpaper.', color: '#E9AFC5' },
  { icon: '🌙', title: 'Daily Inspiration', desc: 'Start every day with a beautiful motivational quote and positive affirmation just for you.', color: '#DCCBFF' },
  { icon: '📚', title: 'Templates Gallery', desc: '10+ ready-made templates for every life area. Start creating in seconds, not hours.', color: '#F8D9E8' },
]

const templates = [
  { emoji: '🌟', title: 'Dream Life', gradient: 'linear-gradient(135deg,#DCCBFF,#F8D9E8)' },
  { emoji: '✈️', title: 'Travel Goals', gradient: 'linear-gradient(135deg,#D9ECFF,#DCCBFF)' },
  { emoji: '💼', title: 'Career Goals', gradient: 'linear-gradient(135deg,#59436F,#9B7EC8)' },
  { emoji: '💪', title: 'Fitness Goals', gradient: 'linear-gradient(135deg,#E9AFC5,#F8D9E8)' },
  { emoji: '🌱', title: 'Self Growth', gradient: 'linear-gradient(135deg,#DCCBFF,#D9ECFF)' },
  { emoji: '🎨', title: 'Creative Life', gradient: 'linear-gradient(135deg,#F8D9E8,#DCCBFF)' },
]

const floatingCards = [
  { emoji: '🌴', text: 'Bali Trip 2025', x: '-10%', y: '20%', delay: 0 },
  { emoji: '💼', text: 'Dream Career', x: '90%', y: '15%', delay: 0.5 },
  { emoji: '🏡', text: 'Dream Home', x: '-8%', y: '65%', delay: 1 },
  { emoji: '💪', text: 'Fitness Goals', x: '88%', y: '60%', delay: 1.5 },
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ minHeight: '100vh', background: '#FFF9F1', overflowX: 'hidden' }}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(220,203,255,0.3)',
          padding: '0 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span style={{ fontSize: 24 }}>✨</span>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: '#59436F' }}>DreamBoard</span>
          </Link>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 24, display: window.innerWidth < 768 ? 'none' : 'flex' }}>
              {['Features', 'Templates', 'About'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#59436F', textDecoration: 'none', fontSize: 14, fontWeight: 500, opacity: 0.8, transition: 'opacity 0.2s' }}
                  onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.8}>{item}</a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link to="/auth" className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>Log In</Link>
              <Link to="/auth?tab=signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Get Started</Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}
        className="gradient-hero"
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: 80, left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(220,203,255,0.4)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 100, right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(248,217,232,0.4)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'rgba(217,236,255,0.3)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        {/* Floating sparkles */}
        {['⭐','✨','💫','🌸','⭐','✨'].map((s, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -15, 0], rotate: [0, 180, 360], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            style={{
              position: 'absolute', fontSize: 16 + i * 4,
              left: `${10 + i * 15}%`, top: `${15 + (i % 3) * 25}%`,
              pointerEvents: 'none', zIndex: 1,
            }}
          >{s}</motion.span>
        ))}

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(220,203,255,0.4)', border: '1px solid rgba(220,203,255,0.6)', borderRadius: 999, padding: '6px 16px', marginBottom: 24 }}
          >
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#59436F' }}>Your personal vision board, reimagined</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, color: '#59436F', marginBottom: 24, maxWidth: 800 }}
          >
            Your Dreams Deserve a{' '}
            <span style={{ background: 'linear-gradient(135deg,#E9AFC5,#DCCBFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Place to Grow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ fontSize: 18, color: 'rgba(89,67,111,0.75)', maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}
          >
            Turn your dreams into beautiful visual boards. Collect inspiration, organize your goals and create the future you imagine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 60 }}
          >
            <Link to="/auth?tab=signup" className="btn-primary" style={{ fontSize: 15, padding: '14px 32px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span>✨</span> Create My DreamBoard
            </Link>
            <Link to="/templates" className="btn-secondary" style={{ fontSize: 15, padding: '14px 32px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Explore Templates <span>→</span>
            </Link>
          </motion.div>

          {/* Vision Board Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ position: 'relative', width: '100%', maxWidth: 800 }}
          >
            {/* Floating mini-cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
                style={{
                  position: 'absolute', left: card.x, top: card.y,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  borderRadius: 16,
                  padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 8px 24px rgba(89,67,111,0.12)',
                  fontSize: 13, fontWeight: 600, color: '#59436F',
                  whiteSpace: 'nowrap', zIndex: 10,
                }}
              >
                <span>{card.emoji}</span> {card.text}
              </motion.div>
            ))}

            {/* Main board card */}
            <div style={{
              background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: 32,
              padding: 24,
              boxShadow: '0 24px 80px rgba(89,67,111,0.15), 0 4px 16px rgba(220,203,255,0.3)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { bg: 'linear-gradient(135deg,#DCCBFF,#F8D9E8)', text: '🌟 Dream Life', h: 160 },
                  { bg: 'linear-gradient(135deg,#D9ECFF,#DCCBFF)', text: '✈️ Wanderlust', h: 160 },
                  { bg: 'linear-gradient(135deg,#F8D9E8,#E9AFC5)', text: '💪 Health First', h: 160 },
                  { bg: 'linear-gradient(135deg,#FFF9F1,#D9ECFF)', text: '"Dream Big, Start Small"', h: 120, fontSize: 13, fontStyle: 'italic' },
                  { bg: 'linear-gradient(135deg,#E9AFC5,#DCCBFF)', text: '💼 Career Goals', h: 120 },
                  { bg: 'linear-gradient(135deg,#DCCBFF,#D9ECFF)', text: '🏡 Dream Home', h: 120 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? 1 : -1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: item.bg, borderRadius: 20, height: item.h,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: item.fontSize || 15, fontWeight: 600, color: '#59436F',
                      fontStyle: item.fontStyle || 'normal',
                      boxShadow: '0 4px 12px rgba(89,67,111,0.1)',
                      cursor: 'default',
                    }}
                  >
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 24px', background: '#FFF9F1' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div {...fadeUp} whileInView="animate" initial="initial" viewport={fadeUp.viewport} style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#E9AFC5', letterSpacing: 2, textTransform: 'uppercase' }}>Everything You Need</span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#59436F', marginTop: 12 }}>Built for Dreamers</h2>
            <p style={{ color: 'rgba(89,67,111,0.7)', fontSize: 16, maxWidth: 500, margin: '12px auto 0' }}>Every tool you need to visualize your goals and make them real.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: 'rgba(255,255,255,0.8)', borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 4px 24px rgba(89,67,111,0.08)',
                  padding: 28, cursor: 'default',
                  transition: 'box-shadow 0.3s',
                }}
                onHoverStart={e => e.target.style && (e.target.style.boxShadow = '0 16px 48px rgba(89,67,111,0.15)')}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: f.color + '55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, color: '#59436F', marginBottom: 10, fontWeight: 600 }}>{f.title}</h3>
                <p style={{ color: 'rgba(89,67,111,0.7)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" style={{ padding: '80px 24px', background: 'linear-gradient(180deg,#FFF9F1 0%,#EDE0FF22 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div {...fadeUp} whileInView="animate" initial="initial" viewport={fadeUp.viewport} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#E9AFC5', letterSpacing: 2, textTransform: 'uppercase' }}>Ready to Use</span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#59436F', marginTop: 12 }}>Beautiful Templates</h2>
            <p style={{ color: 'rgba(89,67,111,0.7)', fontSize: 15, maxWidth: 460, margin: '12px auto 0' }}>Start with a professionally designed template and make it yours.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
            {templates.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                style={{ background: t.gradient, borderRadius: 24, padding: 32, textAlign: 'center', boxShadow: '0 8px 24px rgba(89,67,111,0.1)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>{t.emoji}</div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 15, fontWeight: 600, color: i === 2 ? 'white' : '#59436F' }}>{t.title}</div>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/auth?tab=signup" className="btn-primary" style={{ fontSize: 15, padding: '14px 36px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Browse All Templates <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(135deg,#59436F,#7A6490)',
              borderRadius: 36, padding: '64px 48px',
              boxShadow: '0 24px 80px rgba(89,67,111,0.3)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(220,203,255,0.15)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 150, height: 150, borderRadius: '50%', background: 'rgba(248,217,232,0.1)', pointerEvents: 'none' }} />
            <div style={{ fontSize: 48, marginBottom: 20 }}>✨</div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', marginBottom: 16 }}>Start Your Dream Journey Today</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>Join thousands of dreamers turning their visions into reality. Free to start, beautiful forever.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth?tab=signup" style={{
                background: 'white', color: '#59436F',
                padding: '14px 36px', borderRadius: 20,
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)', transition: 'all 0.3s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)' }}
              >
                <span>🌟</span> Create Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(220,203,255,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>✨</span>
          <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: '#59436F' }}>DreamBoard</span>
        </div>
        <p style={{ color: 'rgba(89,67,111,0.5)', fontSize: 13 }}>© 2025 DreamBoard. Made with 💜 for dreamers everywhere.</p>
      </footer>
    </div>
  )
}
