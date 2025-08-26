"use client"

import React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

type Step = { name: string; value: number }

const COLORS = ["#7c3aed", "#c4b5fd", "#e9d5ff", "#ddd6fe", "#a78bfa"]

export default function ConversionFunnelDonut({ data }: { data: Step[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" nameKey="name">
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
