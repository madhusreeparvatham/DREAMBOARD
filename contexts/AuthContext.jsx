import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

const LOCAL_USER_KEY = 'dreamboard_local_user'
const LOCAL_PROFILE_KEY = 'dreamboard_local_profile'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // If Supabase is configured with a real URL
    if (isSupabaseConfigured) {
      try {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setUser(session.user)
            fetchProfile(session.user.id)
          } else {
            checkLocalSession()
          }
        }).catch(() => {
          checkLocalSession()
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            setUser(session.user)
            await fetchProfile(session.user.id)
          } else {
            checkLocalSession()
          }
        })
        return () => subscription.unsubscribe()
      } catch (err) {
        checkLocalSession()
      }
    } else {
      checkLocalSession()
    }
  }, [])

  function checkLocalSession() {
    try {
      const storedUser = localStorage.getItem(LOCAL_USER_KEY)
      const storedProfile = localStorage.getItem(LOCAL_PROFILE_KEY)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
        setProfile(storedProfile ? JSON.parse(storedProfile) : {
          id: JSON.parse(storedUser).id,
          username: 'Dreamer',
          bio: 'Manifesting a vibrant, intentional life ✨',
          theme: 'lavender'
        })
      } else {
        // Auto-provision a welcoming guest session so user can immediately experience the app
        const guestUser = {
          id: 'guest-dreamer-01',
          email: 'dreamer@dreamboard.universe',
          isGuest: true
        }
        const guestProfile = {
          id: 'guest-dreamer-01',
          username: 'CelestialDreamer',
          email: 'dreamer@dreamboard.universe',
          bio: 'Collecting inspirations, designing my universe 🌟',
          theme: 'lavender',
          avatar_url: null
        }
        setUser(guestUser)
        setProfile(guestProfile)
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guestUser))
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(guestProfile))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchProfile(userId) {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
        if (!error && data) {
          setProfile(data)
          return
        }
      }
      const stored = localStorage.getItem(LOCAL_PROFILE_KEY)
      if (stored) setProfile(JSON.parse(stored))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function signUp(email, password, username) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (!error && data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            username,
            email,
            avatar_url: null,
            bio: '',
            theme: 'lavender'
          })
          return { data, error }
        }
      } catch (e) {}
    }

    // Local / Demo signup
    const newUser = { id: 'user-' + Date.now(), email, isGuest: false }
    const newProfile = { id: newUser.id, username, email, bio: '', theme: 'lavender', avatar_url: null }
    setUser(newUser)
    setProfile(newProfile)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser))
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile))
    return { data: { user: newUser }, error: null }
  }

  async function signIn(email, password) {
    if (isSupabaseConfigured) {
      try {
        const res = await supabase.auth.signInWithPassword({ email, password })
        if (!res.error) return res
      } catch (e) {}
    }

    // Local demo sign in
    const existing = localStorage.getItem(LOCAL_USER_KEY)
    let userObj = existing ? JSON.parse(existing) : { id: 'user-' + Date.now(), email }
    userObj.email = email
    setUser(userObj)
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj))
    return { data: { user: userObj }, error: null }
  }

  async function signOut() {
    if (isSupabaseConfigured) {
      try { await supabase.auth.signOut() } catch (e) {}
    }
    localStorage.removeItem(LOCAL_USER_KEY)
    setUser(null)
    setProfile(null)
  }

  async function resetPassword(email) {
    if (isSupabaseConfigured) {
      try {
        return await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/auth?tab=reset' })
      } catch (e) {}
    }
    return { data: {}, error: null }
  }

  async function updateProfile(updates) {
    const updated = { ...(profile || {}), ...updates }
    setProfile(updated)
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated))

    if (isSupabaseConfigured && user?.id) {
      try {
        await supabase.from('profiles').update(updates).eq('id', user.id)
      } catch (e) {}
    }
    return { error: null }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        refetchProfile: () => fetchProfile(user?.id)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
