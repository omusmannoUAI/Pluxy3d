import { NextRequest, NextResponse } from "next/server"

type KPI = {
  visitors: number
  conversionRate: number // 0..1
  avgOrderValue: number // currency
  timeOnSiteSec: number
}

type TrafficPoint = { day: string; visitantes: number }

type FunnelStep = { name: string; value: number }

type PieSlice = { name: string; value: number }

type SourceSlice = { name: string; value: number; color: string }

type CategoryPerf = { name: string; percent: number; revenue: number }

type AnalyticsResponse = {
  kpis: KPI
  trafficByDay: TrafficPoint[]
  funnel: FunnelStep[]
  topSellers: PieSlice[]
  trafficSources: SourceSlice[]
  categoryPerformance: CategoryPerf[]
}

export function gen(range: string): AnalyticsResponse {
  // Simple deterministic variations by range key
  const seed = range === "7d" ? 0.8 : range === "this-month" ? 1.0 : range === "last-month" ? 0.9 : 1.2

  const kpis: KPI = {
    visitors: Math.round(20000 * seed + 4500),
    conversionRate: +(0.028 * seed + 0.004).toFixed(4),
    avgOrderValue: Math.round(120000 * seed + 36000),
    timeOnSiteSec: Math.round(220 * seed + 40),
  }

  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
  const base = [1000, 1800, 2600, 4800, 1900, 3000, 4200]
  const trafficByDay = days.map((d, i) => ({ day: d, visitantes: Math.round(base[i] * seed + i * 100) }))

  const funnel: FunnelStep[] = [
    { name: "Visitantes", value: Math.round(5000 * seed) },
    { name: "Agregaron al Carrito", value: Math.round(1200 * seed) },
    { name: "Iniciaron Checkout", value: Math.round(650 * seed) },
    { name: "Compraron", value: Math.round(320 * seed) },
  ]

  const topSellers: PieSlice[] = [
    { name: "Creality Ender 3 V2", value: Math.round(120 * seed) },
    { name: "Kit Mejora Ender-3", value: Math.round(95 * seed) },
    { name: "Hellbot Magna 2", value: Math.round(80 * seed) },
    { name: "Filamento PLA", value: Math.round(50 * seed) },
    { name: "Kit Doble Tracción", value: Math.round(30 * seed) },
  ]

  const trafficSources: SourceSlice[] = [
    { name: "Búsqueda Orgánica", value: +(45.2 * seed).toFixed(1), color: "#6366f1" },
    { name: "Directo", value: +(28.7 * (2 - seed)).toFixed(1), color: "#3b82f6" },
    { name: "Redes Sociales", value: +(15.3 * seed).toFixed(1) as unknown as number, color: "#10b981" },
    { name: "Email Marketing", value: +(10.8 * seed).toFixed(1) as unknown as number, color: "#f59e0b" },
  ]

  const categoryPerformance: CategoryPerf[] = [
    { name: "Impresoras", percent: Math.round(45 * seed), revenue: Math.round(6890000 * seed) },
    { name: "Componentes", percent: Math.round(35 * seed), revenue: Math.round(5397000 * seed) },
    { name: "Filamentos", percent: Math.round(20 * seed), revenue: Math.round(3084000 * seed) },
  ]

  return { kpis, trafficByDay, funnel, topSellers, trafficSources, categoryPerformance }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "30d"
  const allowed = new Set(["7d", "30d", "this-month", "last-month"]) 
  const safeRange = allowed.has(range) ? range : "30d"
  const data = gen(safeRange)
  return NextResponse.json(data, { status: 200 })
}
