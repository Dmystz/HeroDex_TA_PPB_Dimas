import { useEffect, useState } from 'react'

let deferred = null
const listeners = new Set()
const notify = () => listeners.forEach((f) => f())

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferred = e
  notify()
})
window.addEventListener('appinstalled', () => {
  deferred = null
  notify()
})

export function useInstall() {
  const [, tick] = useState(0)
  useEffect(() => {
    const f = () => tick((n) => n + 1)
    listeners.add(f)
    return () => listeners.delete(f)
  }, [])

  const installed = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    deferred = null
    notify()
  }

  return { canInstall: !!deferred, installed, ios, install }
}