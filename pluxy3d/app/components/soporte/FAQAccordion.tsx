"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

type QA = { q: string; a: React.ReactNode }

const data: Record<string, QA[]> = {
  'Impresoras': [
    { q: '¿Cómo calibro la cama de mi impresora 3D?', a: (
      <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-sm">
        <li>Precalienta cama y hotend.</li>
        <li>Desactiva motores y mueve el cabezal a cada esquina.</li>
        <li>Usa una hoja para ajustar hasta sentir leve fricción.</li>
        <li>Repite 2-3 rondas.</li>
      </ol>
    ) },
    { q: 'La primera capa no pega', a: (
      <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
        <li>Nivela la cama y baja Z-offset.</li>
        <li>Limpia con IPA 99%.</li>
        <li>Sube 5-10°C la cama en la primera capa.</li>
      </ul>
    ) }
  ],
  'Filamento': [
    { q: 'El filamento se atasca', a: 'Revisa humedad, boquilla obstruida y tensión del extrusor.' }
  ]
}

export function FAQAccordion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preguntas Frecuentes</CardTitle>
        <CardDescription>Respuestas rápidas a problemas comunes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(data).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="font-semibold mb-2">{cat}</h3>
            <div className="divide-y rounded-md border">
              {items.map((qa, i) => (
                <details key={i} className="px-4 py-3">
                  <summary className="cursor-pointer font-medium list-none">{qa.q}</summary>
                  <div className="mt-2">{qa.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
