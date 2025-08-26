"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const monthlyData = [
  { month: "Ene", ventas: 15420000, ordenes: 320 },
  { month: "Feb", ventas: 13250000, ordenes: 295 },
  { month: "Mar", ventas: 17890000, ordenes: 362 },
  { month: "Abr", ventas: 16230000, ordenes: 340 },
  { month: "May", ventas: 20150000, ordenes: 410 },
  { month: "Jun", ventas: 18990000, ordenes: 387 },
  { month: "Jul", ventas: 21400000, ordenes: 435 },
  { month: "Ago", ventas: 19980000, ordenes: 402 },
  { month: "Sep", ventas: 22170000, ordenes: 448 },
  { month: "Oct", ventas: 23750000, ordenes: 471 },
  { month: "Nov", ventas: 24990000, ordenes: 488 },
  { month: "Dic", ventas: 27500000, ordenes: 515 },
]

const moneyFmt = (v: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(v)

const compactFmt = (v: number) =>
  new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(v)

function Stat({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  )
}

export default function AdminResumenPage() {
  const MonthlySalesChart = dynamic(() => import("@/components/charts/MonthlySalesChart"), {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded bg-muted" />,
  })
  const MonthlyOrdersChart = dynamic(() => import("@/components/charts/MonthlyOrdersChart"), {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded bg-muted" />,
  })
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat title="Total Usuarios" value="1,247" subtitle="+12% desde el mes pasado" />
        <Stat title="Total Pedidos" value="3,891" subtitle="+8% desde el mes pasado" />
        <Stat title="Ingresos Totales" value="$15,420,000" subtitle="+23% desde el mes pasado" />
        <Stat title="Productos" value="156" subtitle="12 con stock bajo" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat title="Categorías" value="8" subtitle="Categorías activas" />
        <Stat title="Cupones" value="25" subtitle="5 activos" />
        <Stat title="Reseñas" value="892" subtitle="15 pendientes" />
        <Stat title="Newsletter" value="2341" subtitle="Suscriptores activos" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <MonthlySalesChart data={monthlyData} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Órdenes por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <MonthlyOrdersChart data={monthlyData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Creality Ender 3 V2</span><span className="font-semibold">$74,880,000</span></div>
              <div className="flex justify-between"><span>Kit Mejora Ender-3</span><span className="font-semibold">$4,299,750</span></div>
              <div className="flex justify-between"><span>Hellbot Magna 2</span><span className="font-semibold">$30,150,000</span></div>
              <div className="flex justify-between"><span>Filamento PLA</span><span className="font-semibold">$6,840,000</span></div>
              <div className="flex justify-between"><span>Kit Doble Tracción</span><span className="font-semibold">$2,337,000</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Órdenes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>ORD-001</span><span className="font-semibold text-amber-600">Procesando</span><span className="font-semibold">$389,099</span></div>
              <div className="flex justify-between"><span>ORD-002</span><span className="font-semibold text-blue-600">Enviado</span><span className="font-semibold">$45,000</span></div>
              <div className="flex justify-between"><span>ORD-003</span><span className="font-semibold text-emerald-600">Entregado</span><span className="font-semibold">$125,000</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
