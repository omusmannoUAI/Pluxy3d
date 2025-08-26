"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

const topSellers = [
  { name: "Impresoras", value: 45 },
  { name: "Componentes", value: 35 },
  { name: "Filamentos", value: 20 },
]

const COLORS = ["#7c3aed", "#c084fc", "#a78bfa"]

export default function AdminAnaliticasPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topSellers} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={90} dataKey="value">
                    {topSellers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Métricas Clave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Tasa de Conversión</span><span className="font-medium">3.2%</span></div>
              <div className="flex justify-between"><span>Valor Promedio de Pedido</span><span className="font-medium">$156,000</span></div>
              <div className="flex justify-between"><span>Clientes Recurrentes</span><span className="font-medium">68%</span></div>
              <div className="flex justify-between"><span>Tiempo Promedio en Sitio</span><span className="font-medium">4m 32s</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análisis de Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">45%</div>
              <div className="text-sm">Impresoras</div>
              <div className="text-xs text-muted-foreground">de las ventas</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">35%</div>
              <div className="text-sm">Componentes</div>
              <div className="text-xs text-muted-foreground">de las ventas</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">20%</div>
              <div className="text-sm">Filamentos</div>
              <div className="text-xs text-muted-foreground">de las ventas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
