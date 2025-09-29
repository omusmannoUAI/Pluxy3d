"use client"

import { useEffect } from 'react'
import logger from '../lib/logger'

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    // Solo registrar en producción o cuando esté explícitamente habilitado
    const enableSw =
      process.env.NEXT_PUBLIC_ENABLE_SW === 'true' || process.env.NODE_ENV === 'production'

    if (!enableSw) {
      // En desarrollo, asegúrate de desregistrar SWs previos para evitar interferencias
      navigator.serviceWorker.getRegistrations?.().then((regs) => {
        regs.forEach((r) => r.unregister())
      })
      return
    }

    // Registrar service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        logger.info('Service Worker registrado:', registration.scope)

        // Limpiar cache cada 24 horas
        setInterval(() => {
          registration.active?.postMessage({ type: 'CLEAN_CACHE' })
        }, 24 * 60 * 60 * 1000) // 24 horas
      })
      .catch((error) => {
        logger.warn('Error registrando Service Worker:', error)
      })

    // Escuchar mensajes del service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        logger.info('Cache actualizado para:', event.data.url)
      }
    })
  }, [])
}
