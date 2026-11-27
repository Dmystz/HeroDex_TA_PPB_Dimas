// Database offline sederhana berbasis IndexedDB (tanpa library tambahan).
// Dipakai untuk menyimpan salinan data API (heroes, games) di perangkat.
const DB_NAME = 'herodex'
const STORE = 'kv'
let opened = null

function open() {
  if (!opened) {
    opened = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB tidak tersedia'))
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    }).catch((err) => {
      opened = null // coba lagi di pemanggilan berikutnya
      throw err
    })
  }
  return opened
}

const run = (mode, fn) =>
  open().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const req = fn(tx.objectStore(STORE))
        tx.oncomplete = () => resolve(req.result)
        tx.onerror = tx.onabort = () => reject(tx.error)
      })
  )

/** Ambil nilai; `undefined` jika belum ada atau IndexedDB tidak bisa dipakai. */
export const idbGet = (key) => run('readonly', (s) => s.get(key)).catch(() => undefined)

/** Simpan nilai; kegagalan (storage penuh / diblokir) diabaikan. */
export const idbSet = (key, value) => run('readwrite', (s) => s.put(value, key)).catch(() => {})