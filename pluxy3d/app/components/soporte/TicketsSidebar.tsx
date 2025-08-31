"use client"

import React from 'react'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui'
import { soporteApi } from './client'
import type { TicketSummary } from './types'

export function TicketsSidebar() {
  const [items, setItems] = React.useState<TicketSummary[]>([])
  React.useEffect(() => { soporteApi.misTickets().then(setItems) }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Tickets</CardTitle>
        <CardDescription>Historial reciente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Aún no tienes tickets.</p>
        )}
        {items.map(t => (
          <div key={t.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{t.titulo}</h3>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{t.estado}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.resumen}</p>
            <div className="mt-2 text-[11px] text-muted-foreground">{new Date(t.creadoEl).toLocaleDateString()}</div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Ver todos</Button>
      </CardFooter>
    </Card>
  )
}
