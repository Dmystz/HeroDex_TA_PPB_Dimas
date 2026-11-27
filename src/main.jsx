import React from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import { syncOffline } from './api.js'
import './styles.css'

if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    // Saat development, buang Service Worker & cache lama (sisa build/preview)
    // supaya tidak menyajikan file basi dan perlu Ctrl+Shift+R.
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()))
    caches?.keys().then((ks) => ks.forEach((k) => caches.delete(k)))
  } else {
    // Produksi: begitu versi baru aktif, muat ulang otomatis sekali.
    const hadController = !!navigator.serviceWorker.controller
    let reloaded = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloaded) {
        reloaded = true
        location.reload()
      }
    })
    registerSW({
      immediate: true,
      // Cek versi baru tiap 30 menit selama app terbuka.
      onRegisteredSW: (_, reg) => reg && setInterval(() => reg.update(), 30 * 60 * 1000)
    })
  }
}

// Unduh data ke IndexedDB saat app dibuka dan setiap kali koneksi kembali,
// supaya semua halaman tetap bisa dibuka saat offline.
syncOffline()
window.addEventListener('online', syncOffline)

createRoot(document.getElementById('root')).render(<App />)