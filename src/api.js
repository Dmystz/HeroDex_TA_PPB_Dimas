import { useCallback, useEffect, useState } from 'react'
import { idbGet, idbSet } from './db.js'

// Base URL API buatan sendiri (Express), mis. http://localhost:3000/api
const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')
const TTL = 60_000
const cache = new Map() // cache memori 60 detik (hanya selama app terbuka)

const toMessage = (err) => {
  if (err.offline) return 'Kamu sedang offline dan data ini belum tersimpan. Buka sekali saat online.'
  if (err.name === 'TypeError') return 'Tidak ada koneksi internet.'
  if (err.status === 404) return 'Data tidak ditemukan.'
  if (err.status >= 500) return 'Server sedang bermasalah. Coba lagi nanti.'
  return 'Data gagal dimuat.'
}

/**
 * Baca salinan offline dari IndexedDB.
 * Detail (/heroes/3) yang belum pernah dibuka diambil dari daftar (/heroes) yang tersimpan.
 */
async function fromStore(path) {
  const direct = await idbGet(path)
  if (direct !== undefined) return direct
  const m = path.match(/^\/(heroes|games)\/(.+)$/)
  if (m) {
    const list = await idbGet(`/${m[1]}`)
    const id = decodeURIComponent(m[2])
    return Array.isArray(list) ? list.find((x) => String(x.id) === id) : undefined
  }
  return undefined
}

async function get(path, { signal } = {}) {
  const hit = cache.get(path)
  if (hit && Date.now() - hit.t < TTL) return hit.data

  // Offline: langsung pakai salinan di perangkat, tidak perlu menunggu timeout.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    const saved = await fromStore(path)
    if (saved !== undefined) return saved
    const e = new Error(toMessage({ offline: true }))
    e.offline = true
    throw e
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    // Jaringan gagal walau browser mengaku online (sinyal buruk): coba salinan offline.
    const saved = await fromStore(path)
    if (saved !== undefined) return saved
    const e = new Error(toMessage(err))
    e.cause = err
    throw e
  }

  if (!res.ok) {
    // Server error: lebih baik tampilkan data tersimpan daripada layar error.
    if (res.status >= 500) {
      const saved = await fromStore(path)
      if (saved !== undefined) return saved
    }
    const e = new Error(toMessage({ status: res.status }))
    e.status = res.status
    throw e
  }

  const data = await res.json()
  cache.set(path, { t: Date.now(), data })
  idbSet(path, data) // simpan salinan untuk dipakai saat offline
  return data
}

export const getHeroes = (signal) => get('/heroes', { signal })
export const getHero = (id, signal) => get(`/heroes/${encodeURIComponent(id)}`, { signal })
export const getGames = (signal) => get('/games', { signal })
export const getGame = (id, signal) => get(`/games/${encodeURIComponent(id)}`, { signal })

/**
 * Unduh seluruh data ke perangkat supaya semua halaman (termasuk detail dan Favorites)
 * bisa dibuka offline walau pengguna belum pernah mengunjunginya.
 * Dipanggil saat app dibuka dan setiap kali koneksi kembali.
 */
export function syncOffline() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return Promise.resolve()
  cache.clear()
  return Promise.allSettled([getHeroes(), getGames()])
}

/** fn menerima AbortSignal. `reload` mengulang request (tombol "Coba lagi"). */
export function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [nonce, setNonce] = useState(0)
  const reload = useCallback(() => {
    cache.clear()
    setNonce((n) => n + 1)
  }, [])

  // Saat koneksi kembali, muat ulang agar data terbaru menggantikan salinan offline.
  useEffect(() => {
    window.addEventListener('online', reload)
    return () => window.removeEventListener('online', reload)
  }, [reload])

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