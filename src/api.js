import { useCallback, useEffect, useState } from 'react'

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const KEY = import.meta.env.VITE_SUPABASE_KEY
const TTL = 60_000
const cache = new Map()

const toMessage = (err) => {
  if (err.name === 'TypeError') return 'Tidak ada koneksi internet.'
  if (err.status === 406 || err.status === 404) return 'Data tidak ditemukan.'
  if (err.status >= 500) return 'Server sedang bermasalah. Coba lagi nanti.'
  return 'Data gagal dimuat.'
}

async function get(path, { single = false, signal } = {}) {
  const hit = cache.get(path)
  if (hit && Date.now() - hit.t < TTL) return hit.data

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      signal,
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        ...(single && { Accept: 'application/vnd.pgrst.object+json' })
      }
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    const e = new Error(toMessage(err))
    e.cause = err
    throw e
  }
  if (!res.ok) {
    const e = new Error(toMessage({ status: res.status }))
    e.status = res.status
    throw e
  }
  const data = await res.json()
  cache.set(path, { t: Date.now(), data })
  return data
}

export const getHeroes = (signal) => get('/heroes_view?select=*&order=id', { signal })
export const getHero = (id, signal) => get(`/heroes_view?id=eq.${encodeURIComponent(id)}`, { single: true, signal })
export const getGames = (signal) => get('/games?select=*&order=id', { signal })
export const getGame = (id, signal) => get(`/games?id=eq.${encodeURIComponent(id)}`, { single: true, signal })

/** fn menerima AbortSignal. `reload` mengulang request (tombol "Coba lagi"). */
export function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [nonce, setNonce] = useState(0)
  const reload = useCallback(() => {
    cache.clear()
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    setState({ data: null, loading: true, error: null })
    fn(ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error })
      })
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  return { ...state, reload }
}
