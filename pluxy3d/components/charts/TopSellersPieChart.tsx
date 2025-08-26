"use client"

import React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

type Slice = { name: string; value: number }

const COLORS = ["#60a5fa", "#f97316", "#34d399", "#a78bfa", "#f43f5e"]

export default function TopSellersPieChart({ data }: { data: Slice[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" nameKey="name">
          {data.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => new Intl.NumberFormat("es-AR").format(v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
