"use client"

import dynamic from "next/dynamic"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type KPI = { visitors: number; conversionRate: number; avgOrderValue: number; timeOnSiteSec: number }
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

export default function AdminAnaliticasPage() {
  const TopSellersPieChart = dynamic(() => import("@/components/charts/TopSellersPieChart"), {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded bg-muted" />,
  })
  const TrafficLineChart = dynamic(() => import("@/components/charts/TrafficLineChart"), {
    ssr: false,
    loading: () => <div className="h-80 animate-pulse rounded bg-muted" />,
  })
  const ConversionFunnelDonut = dynamic(() => import("@/components/charts/ConversionFunnelDonut"), {
    ssr: false,
    loading: () => <div className="h-80 animate-pulse rounded bg-muted" />,
  })

  const [range, setRange] = React.useState("30d")
  const [data, setData] = React.useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let disposed = false
    setLoading(true)
    fetch(`/api/analytics?range=${encodeURIComponent(range)}`)
      .then((r) => r.json())
      .then((json: AnalyticsResponse) => {
        if (!disposed) setData(json)
      })
      .catch(() => {
        if (!disposed) setData(null)
      })
      .finally(() => {
        if (!disposed) setLoading(false)
      })
    return () => {
      disposed = true
    }
  }, [range])

  const moneyFmt = (v: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(v)
  const timeFmt = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}m ${s}s`
  }

  return (
    <div className="space-y-6">
      {/* Header KPIs and range */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Analíticas Avanzadas</h2>
        <div>
          <select className="h-9 rounded-md border px-2 text-sm" value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="30d">Últimos 30 días</option>
            <option value="7d">Últimos 7 días</option>
            <option value="this-month">Este mes</option>
            <option value="last-month">Mes anterior</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Visitantes Únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading || !data ? "—" : new Intl.NumberFormat("es-AR").format(data.kpis.visitors)}</div>
            <div className="text-xs text-muted-foreground">+12.5% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Tasa de Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading || !data ? "—" : `${(data.kpis.conversionRate * 100).toFixed(1)}%`}</div>
            <div className="text-xs text-muted-foreground">+0.3% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Valor Promedio Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading || !data ? "—" : moneyFmt(data.kpis.avgOrderValue)}</div>
            <div className="text-xs text-muted-foreground">+8.2% vs mes anterior</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Tiempo en Sitio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading || !data ? "—" : timeFmt(data.kpis.timeOnSiteSec)}</div>
            <div className="text-xs text-muted-foreground">+15s vs mes anterior</div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic and Funnel */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tráfico del Sitio Web</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {loading || !data ? (
                <div className="h-full w-full animate-pulse rounded bg-muted" />
              ) : (
                <TrafficLineChart data={data.trafficByDay} />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Embudo de Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {loading || !data ? (
                <div className="h-full w-full animate-pulse rounded bg-muted" />
              ) : (
                <ConversionFunnelDonut data={data.funnel} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Sellers and Traffic Sources */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              {loading || !data ? (
                <div className="h-full w-full animate-pulse rounded bg-muted" />
              ) : (
                <TopSellersPieChart data={data.topSellers} />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fuentes de Tráfico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {(loading || !data ? [] : data.trafficSources).map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.name}</span>
                  </div>
                  <span className="font-medium">{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category performance */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(loading || !data ? [] : data.categoryPerformance).map((c) => (
              <div key={c.name} className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{c.percent}%</div>
                <div className="text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">{moneyFmt(c.revenue)} en ingresos</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes y Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <a
              className="rounded border px-3 py-2 text-sm"
              href={`/api/analytics/export?range=${encodeURIComponent(range)}`}
            >
              ⬇ Exportar Analíticas (CSV)
            </a>
            <button className="rounded border px-3 py-2 text-sm opacity-60" disabled>
              ⬇ Reporte de Usuarios (próximamente)
            </button>
            <button className="rounded border px-3 py-2 text-sm opacity-60" disabled>
              ⬇ Reporte de Inventario (próximamente)
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
