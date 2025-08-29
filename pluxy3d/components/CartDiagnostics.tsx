"use client"

import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

export function CartDiagnostics() {
  const renderCount = useRef(0)
  const { items, loading, error } = useCart()
  const [isClient, setIsClient] = useState(false)

  renderCount.current += 1

  useEffect(() => {
    setIsClient(true)
    if (renderCount.current > 10) {
      console.warn('CartDiagnostics: Alto número de renders detectado', renderCount.current)
    }
  }, [renderCount.current])

  // Solo mostrar en desarrollo y después de la hidratación
  const isDev = isClient && typeof window !== 'undefined' && window.location.hostname === 'localhost'
  if (!isDev) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>Renders: {renderCount.current}</div>
      <div>Items: {items.length}</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Error: {error ? 'Yes' : 'No'}</div>
    </div>
  )
}
