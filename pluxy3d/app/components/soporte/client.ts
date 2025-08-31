"use client"

export function useIsClient() {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => setReady(true), [])
  return ready
}

import React from 'react'
import type { TicketFormData, TicketSummary } from './types'

// Minimal fake client API (swap with real endpoints later)
export const soporteApi = {
  async crearTicket(data: TicketFormData): Promise<{ id: string }> {
    await new Promise(r => setTimeout(r, 400))
    const id = `TKT-${Math.floor(100 + Math.random() * 900)}`
    if (typeof window !== 'undefined') {
      const prev = JSON.parse(localStorage.getItem('tickets') || '[]') as TicketSummary[]
      const nuevo: TicketSummary = {
        id,
        titulo: data.asunto,
        resumen: data.descripcion.slice(0, 120),
        creadoEl: new Date().toISOString(),
        prioridad: data.prioridad,
        estado: 'Abierto'
      }
      localStorage.setItem('tickets', JSON.stringify([nuevo, ...prev].slice(0, 10)))
    }
    return { id }
  },
  async misTickets(): Promise<TicketSummary[]> {
    await new Promise(r => setTimeout(r, 150))
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('tickets') || '[]') as TicketSummary[]
    }
    return []
  }
}
