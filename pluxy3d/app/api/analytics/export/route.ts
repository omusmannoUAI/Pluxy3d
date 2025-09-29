import { NextRequest, NextResponse } from "next/server"
import { gen, AnalyticsResponse } from "../gen"

function toCSV(range: string) {
  const data: AnalyticsResponse = gen(range)
  const rows: string[] = []
  const esc = (s: string) => '"' + s.replaceAll('"', '""') + '"'

  // KPIs
  rows.push("Section,Metric,Value")
  rows.push(["KPIs", "Visitors", String(data.kpis.visitors)].join(","))
  rows.push(["KPIs", "ConversionRate", String(data.kpis.conversionRate)].join(","))
  rows.push(["KPIs", "AvgOrderValue", String(data.kpis.avgOrderValue)].join(","))
  rows.push(["KPIs", "TimeOnSiteSec", String(data.kpis.timeOnSiteSec)].join(","))

  // Traffic
  rows.push("\nTraffic,Day,Visitors")
  data.trafficByDay.forEach((p: { day: string; visitantes: number }) => rows.push(["Traffic", esc(p.day), String(p.visitantes)].join(",")))

  // Funnel
  rows.push("\nFunnel,Step,Value")
  data.funnel.forEach((f: { name: string; value: number }) => rows.push(["Funnel", esc(f.name), String(f.value)].join(",")))

  // Top Sellers
  rows.push("\nTopSellers,Name,Value")
  data.topSellers.forEach((t: { name: string; value: number }) => rows.push(["TopSellers", esc(t.name), String(t.value)].join(",")))

  // Traffic Sources
  rows.push("\nTrafficSources,Name,Percent")
  data.trafficSources.forEach((s: { name: string; value: number }) => rows.push(["TrafficSources", esc(s.name), String(s.value)].join(",")))

  // Category Performance
  rows.push("\nCategoryPerformance,Name,Percent,Revenue")
  data.categoryPerformance.forEach((c: { name: string; percent: number; revenue: number }) => rows.push(["CategoryPerformance", esc(c.name), String(c.percent), String(c.revenue)].join(",")))

  return rows.join("\n")
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "30d"
  const csv = toCSV(range)
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="analytics-${range}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
