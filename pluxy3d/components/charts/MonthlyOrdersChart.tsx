"use client"

import React from "react"
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

type Point = { month: string; ordenes: number }

export default function MonthlyOrdersChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v: number) => new Intl.NumberFormat("es-AR").format(v)} />
        <Tooltip formatter={(v: number) => new Intl.NumberFormat("es-AR").format(v)} />
        <Legend />
        <Bar dataKey="ordenes" name="Órdenes" fill="#c084fc" />
      </BarChart>
    </ResponsiveContainer>
  )
}
