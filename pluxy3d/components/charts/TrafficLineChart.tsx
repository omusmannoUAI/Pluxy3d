"use client"

import React from "react"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

type Point = { day: string; visitantes: number }

export default function TrafficLineChart({ data }: { data: Point[] }) {
  const numberFmt = (v: number) => new Intl.NumberFormat("es-AR").format(v)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis tickFormatter={numberFmt} />
        <Tooltip formatter={(v: number) => numberFmt(v)} />
        <Legend />
        <Line type="monotone" dataKey="visitantes" name="Visitantes" stroke="#7c3aed" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
