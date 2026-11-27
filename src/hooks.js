import { useCallback, useEffect, useState } from 'react'

const KEY = 'favs'

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favs, setFavs] = useState(read)

  // Sinkron antar tab/jendela.
  useEffect(() => {
    const onStorage = (e) => (e.key === KEY || e.key === null) && setFavs(read())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleFav = useCallback((id) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* storage penuh / diblokir */ }
      return next
    })
  }, [])

  return { favs, toggleFav }
}

/** true saat ada koneksi; ikut berubah ketika online/offline. */
export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · HeroDex` : 'HeroDex'
  }, [title])
}

const PROFILE_KEY = 'profile'
const DEFAULT_PROFILE = { name: 'Dimas', game: '' }

const readProfile = () => {
  try {
    const v = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')
    return v && typeof v === 'object' ? { ...DEFAULT_PROFILE, ...v } : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(readProfile)
  const save = useCallback((next) => {
    const clean = {
      name: next.name.trim().slice(0, 40) || DEFAULT_PROFILE.name,
      game: next.game.trim().slice(0, 40)
    }
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(clean)) } catch { /* diabaikan */ }
    setProfile(clean)
  }, [])
  return [profile, save]
}