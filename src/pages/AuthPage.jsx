import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowLeft, Heart, Stars } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  const [tab, setTab] = useState(initialTab)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', username: '' })
  
  const { signIn, signUp, resetPassword, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in your email and password')
    }
    setLoading(true)
    try {
      const { error } = await signIn(formData.email, formData.password)
      if (error) {
        toast.error(error.message || 'Failed to log in')
      } else {
        toast.success('Welcome back to your Universe! ✨')
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error('Login error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password || !formData.username) {
      return toast.error('Please fill in all fields')
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    setLoading(true)
    try {
      const { error } = await signUp(formData.email, formData.password, formData.username)
      if (error) {
        toast.error(error.message || 'Failed to sign up')
      } else {
        toast.success('Account created! Welcome to DreamBoard ✨')
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error('Signup error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!formData.email) {
      return toast.error('Please enter your email address')
    }
    setLoading(true)
    try {
      const { error } = await resetPassword(formData.email)
      if (error) {
        toast.error(error.message || 'Failed to send reset link')
      } else {
        toast.success('Password reset link sent to your email 💌')
        setTab('login')
      }
    } catch (err) {
      toast.error('Error sending reset link')
    } finally {
      setLoading(false)
    }
  }

  // Quick Demo Guest Access for immediate preview
  const handleGuestDemo = () => {
    // If Supabase is offline or demoing, AuthContext provides fallback
    toast.success('Entering DreamBoard as Guest ✨')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen gradient-hero flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Floating Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-lavender/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-pastel-pink/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-60 h-60 rounded-full bg-baby-blue/30 blur-2xl pointer-events-none" />

      {/* Floating Sparkles */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 right-1/4 text-2xl pointer-events-none"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-24 left-1/4 text-2xl pointer-events-none"
      >
        🌸
      </motion.div>

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-deep-purple/70 hover:text-deep-purple transition z-20"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-4xl p-8 sm:p-10 shadow-dreamy-lg border border-white relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lavender via-pastel-pink to-soft-rose flex items-center justify-center shadow-dreamy">
              <span className="text-2xl">✨</span>
            </div>
          </Link>
          <h1 className="font-display font-bold text-3xl text-deep-purple">
            DreamBoard
          </h1>
          <p className="text-xs uppercase tracking-widest text-deep-purple/60 font-semibold mt-1">
            Your Dreams, Your Universe
          </p>
        </div>

        {/* Tab Switcher */}
        {tab !== 'forgot' && (
          <div className="flex bg-lavender/30 p-1 rounded-2xl mb-6 border border-lavender/40">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-white text-deep-purple shadow-sm'
                  : 'text-deep-purple/60 hover:text-deep-purple'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                tab === 'signup'
                  ? 'bg-white text-deep-purple shadow-sm'
                  : 'text-deep-purple/60 hover:text-deep-purple'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {tab === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-purple/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="label mb-0">Password</label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-xs font-medium text-soft-rose-dark hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-purple/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-purple/40 hover:text-deep-purple transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading ? 'Opening your universe...' : 'Sign In to DreamBoard'}
              </button>
            </motion.form>
          )}

          {tab === 'signup' && (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              onSubmit={handleSignup}
              className="space-y-4"
            >
              <div>
                <label className="label">Username</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-purple/40" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. LunaDreamer"
                    className="input pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-purple/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-purple/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="input pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-purple/40 hover:text-deep-purple transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading ? 'Creating your space...' : 'Create My Free DreamBoard'}
              </button>
            </motion.form>
          )}

          {tab === 'forgot' && (
            <motion.form
              key="forgot"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="font-display font-semibold text-lg text-deep-purple">
                  Reset Password
                </h3>
                <p className="text-xs text-deep-purple/60 mt-1">
                  Enter your email and we'll send a recovery link.
                </p>
              </div>

              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-purple/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input pl-11"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => setTab('login')}
                className="w-full text-center text-xs font-semibold text-deep-purple/70 hover:text-deep-purple mt-2 block"
              >
                ← Back to Log In
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Demo Mode / Guest Access */}
        <div className="mt-8 pt-6 border-t border-lavender/30 text-center">
          <p className="text-xs text-deep-purple/60 mb-3">
            Want to explore instantly without credentials?
          </p>
          <button
            type="button"
            onClick={handleGuestDemo}
            className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold bg-pastel-pink/40 hover:bg-pastel-pink/70 text-deep-purple border border-pastel-pink transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-soft-rose-dark" />
            <span>Instant Guest Preview Access</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

