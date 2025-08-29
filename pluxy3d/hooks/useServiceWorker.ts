"use client"

import { useEffect } from 'react'

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Registrar service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration.scope)

          // Limpiar cache cada 24 horas
          setInterval(() => {
            registration.active?.postMessage({ type: 'CLEAN_CACHE' })
          }, 24 * 60 * 60 * 1000) // 24 horas
        })
        .catch((error) => {
          console.log('Error registrando Service Worker:', error)
        })

      // Escuchar mensajes del service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache actualizado para:', event.data.url)
        }
      })
    }
  }, [])
}
