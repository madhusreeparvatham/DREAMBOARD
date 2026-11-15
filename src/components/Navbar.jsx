import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Palette,
  Target,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Heart
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Templates', path: '/templates', icon: Compass },
  { name: 'Goal Tracker', path: '/goals', icon: Target },
  { name: 'Daily Inspiration', path: '/inspiration', icon: Heart },
  { name: 'Profile', path: '/profile', icon: User },
]

export default function Navbar({ onOpenAI }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out. See you soon! ✨')
      navigate('/')
    } catch (err) {
      toast.error('Error signing out')
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-lavender/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lavender via-pastel-pink to-soft-rose flex items-center justify-center shadow-dreamy"
              >
                <span className="text-xl">✨</span>
              </motion.div>
              <div>
                <span className="font-display font-bold text-xl text-deep-purple tracking-tight block">
                  DreamBoard
                </span>
                <span className="text-[10px] tracking-widest text-deep-purple/60 uppercase block -mt-1 font-semibold">
                  Your Universe
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-deep-purple font-semibold bg-lavender/30 shadow-sm'
                        : 'text-deep-purple/70 hover:text-deep-purple hover:bg-white/60'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-deep-purple' : 'text-deep-purple/60'} />
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-deep-purple rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Side actions: AI assistant trigger & User profile / logout */}
            <div className="hidden md:flex items-center gap-3">
              {onOpenAI && (
                <button
                  onClick={onOpenAI}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-lavender to-pastel-pink text-deep-purple hover:shadow-glow transition-all duration-300 border border-white/60"
                  title="Open AI Dream Assistant"
                >
                  <Sparkles size={14} className="animate-spin-slow text-deep-purple" />
                  <span>AI Spark</span>
                </button>
              )}

              {/* User Avatar */}
              <Link
                to="/profile"
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/60 transition pr-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender to-soft-rose flex items-center justify-center text-xs font-bold text-deep-purple shadow-sm border border-white">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile?.username || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    (profile?.username?.[0] || user?.email?.[0] || 'D').toUpperCase()
                  )}
                </div>
                <span className="text-xs font-medium text-deep-purple max-w-[100px] truncate">
                  {profile?.username || user?.email?.split('@')[0] || 'Dreamer'}
                </span>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl text-deep-purple/60 hover:text-deep-purple hover:bg-white/60 transition"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              {onOpenAI && (
                <button
                  onClick={onOpenAI}
                  className="p-2 rounded-xl bg-lavender/30 text-deep-purple"
                  title="AI Assistant"
                >
                  <Sparkles size={18} />
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-deep-purple hover:bg-white/60 transition"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-lavender/30 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-1 shadow-dreamy"
            >
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-lavender/40 text-deep-purple font-semibold'
                        : 'text-deep-purple/70 hover:bg-lavender/10 text-deep-purple'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-lavender/30 flex items-center justify-between px-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender to-soft-rose flex items-center justify-center text-xs font-bold text-deep-purple">
                    {(profile?.username?.[0] || 'D').toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-deep-purple">
                    {profile?.username || 'My Profile'}
                  </span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-xs font-medium text-deep-purple/70 hover:text-deep-purple py-2 px-3 rounded-xl bg-pastel-pink/40"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer so content is not behind fixed navbar */}
      <div className="h-16" />
    </>
  )
}

