"use client"

import { useEffect } from 'react'

export function CacheManager() {
  useEffect(() => {
    // Limpiar localStorage de datos antiguos
    const cleanLocalStorage = () => {
      const keys = Object.keys(localStorage)
      const oldKeys = keys.filter(key =>
        key.startsWith('temp_') ||
        key.startsWith('cache_') ||
        (key.includes('timestamp') && Date.now() - parseInt(localStorage.getItem(key) || '0') > 7 * 24 * 60 * 60 * 1000) // 7 días
      )

      oldKeys.forEach(key => localStorage.removeItem(key))
    }

    // Limpiar sessionStorage
    const cleanSessionStorage = () => {
      const keys = Object.keys(sessionStorage)
      const oldKeys = keys.filter(key =>
        key.startsWith('temp_') ||
        key.startsWith('draft_')
      )

      oldKeys.forEach(key => sessionStorage.removeItem(key))
    }

    // Ejecutar limpieza inicial
    cleanLocalStorage()
    cleanSessionStorage()

    // Limpiar cada hora
    const interval = setInterval(() => {
      cleanLocalStorage()
      cleanSessionStorage()
    }, 60 * 60 * 1000) // 1 hora

    return () => clearInterval(interval)
  }, [])

  return null
}
