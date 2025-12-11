"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Bell,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  Package
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getAnalytics, getOrders, getUsers } from "@/services/api"
import Link from "next/link"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: { value: "0", change: "0%", trend: "neutral" },
    orders: { value: "0", change: "0%", trend: "neutral" },
    revenue: { value: "$0", change: "0%", trend: "neutral" },
    progress: { value: "0%", change: "Meta mensual", trend: "neutral" }
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState({
    productsSold: 0,
    avgResponseTime: "0 min",
    conversionRate: "0%",
    customerSatisfaction: "0/5"
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, ordersData, usersData] = await Promise.all([
          getAnalytics(),
          getOrders(),
          getUsers()
        ])

        const trendFromValue = (value: number) => value > 0 ? "up" : value < 0 ? "down" : "neutral"

        const ordersArray = Array.isArray(ordersData) ? ordersData : []
        const usersArray = Array.isArray(usersData) ? usersData : []

        const fallbackOrdersCount = ordersArray.length
        const fallbackRevenue = ordersArray.reduce((sum, o: any) => sum + Number(o.total ?? o.Total ?? 0), 0)
        const fallbackSalesProgress = ordersArray.reduce((map: Record<string, { amount: number; orders: number }>, o: any) => {
          const rawDate = o.fechaVenta || o.FechaVenta
          const date = rawDate ? new Date(rawDate) : null
          if (!date || Number.isNaN(date.getTime())) return map
          // Group by day for better granularity
          const key = date.toISOString().split('T')[0] // YYYY-MM-DD
          if (!map[key]) map[key] = { amount: 0, orders: 0 }
          map[key].amount += Number(o.total ?? o.Total ?? 0)
          map[key].orders += 1
          return map
        }, {})

        const apiRevenue = Number(analyticsData.totalRevenue ?? analyticsData.TotalRevenue ?? 0)
        const apiOrders = Number(analyticsData.totalOrders ?? analyticsData.TotalOrders ?? 0)
        const apiCustomers = Number(analyticsData.totalCustomers ?? analyticsData.TotalCustomers ?? 0)

        const revenue = apiRevenue > 0 ? apiRevenue : fallbackRevenue
        const ordersCount = apiOrders > 0 ? apiOrders : fallbackOrdersCount
        const customers = apiCustomers > 0 ? apiCustomers : usersArray.length
        
        const apiConversion = Number(analyticsData.conversionRate ?? analyticsData.ConversionRate ?? 0)
        const calculatedConversion = customers > 0 ? (ordersCount / customers) * 100 : 0
        const conversion = apiConversion > 0 ? apiConversion : calculatedConversion

        const revenueGrowth = Number.isFinite(analyticsData.revenueGrowth ?? analyticsData.RevenueGrowth) ? (analyticsData.revenueGrowth ?? analyticsData.RevenueGrowth) : null
        const ordersGrowth = Number.isFinite(analyticsData.ordersGrowth ?? analyticsData.OrdersGrowth) ? (analyticsData.ordersGrowth ?? analyticsData.OrdersGrowth) : null
        const customersGrowth = Number.isFinite(analyticsData.customersGrowth ?? analyticsData.CustomersGrowth) ? (analyticsData.customersGrowth ?? analyticsData.CustomersGrowth) : null

        const effectiveRevenueGrowth = (revenueGrowth === 0 && revenue > 0 && fallbackRevenue > 0) ? null : revenueGrowth
        const effectiveOrdersGrowth = (ordersGrowth === 0 && ordersCount > 0 && fallbackOrdersCount > 0) ? null : ordersGrowth
        const effectiveCustomersGrowth = (customersGrowth === 0 && customers > 0 && usersArray.length > 0) ? null : customersGrowth

        setStats({
          users: {
            value: customers.toLocaleString(),
            change: effectiveCustomersGrowth !== null ? `${effectiveCustomersGrowth}%` : null,
            trend: trendFromValue(effectiveCustomersGrowth ?? 0)
          },
          orders: {
            value: ordersCount.toLocaleString(),
            change: effectiveOrdersGrowth !== null ? `${effectiveOrdersGrowth}%` : null,
            trend: trendFromValue(effectiveOrdersGrowth ?? 0)
          },
          revenue: {
            value: `$${revenue.toLocaleString()}`,
            change: effectiveRevenueGrowth !== null ? `${effectiveRevenueGrowth.toFixed(1)}%` : null,
            trend: trendFromValue(effectiveRevenueGrowth ?? 0)
          },
          progress: {
            value: `${conversion.toFixed(1)}%`,
            change: "Tasa de conversión",
            trend: trendFromValue(conversion)
          }
        })

        const salesProgress = analyticsData.salesProgress || analyticsData.SalesProgress || []
        // Prefer fallback (daily) if API returns monthly and we have few data points, or if API data is empty
        const useFallback = !salesProgress.length || (salesProgress.length < 3 && Object.keys(fallbackSalesProgress).length > salesProgress.length);
        
        const chartSource = !useFallback
          ? salesProgress
          : Object.entries(fallbackSalesProgress)
              .map(([dateStr, values]: [string, any]) => ({ month: dateStr, amount: values.amount }))
              .sort((a, b) => a.month.localeCompare(b.month))

        setChartData(chartSource
          ? chartSource.map((item: any) => ({
              month: item.month || "",
              sales: Number(item.amount ?? item.Amount ?? 0)
            }))
          : [])

        // Process Recent Orders
        const sortedOrders = Array.isArray(ordersData) ? ordersData.slice(0, 5) : []
        setRecentOrders(sortedOrders.map((order: any) => {
          // Map directly from API response (OrderSummaryDto)
          const status = order.estado || order.Estado || 'Pendiente';
          const normalizedStatus = String(status).toLowerCase();
          const rawDate = order.fechaVenta || order.FechaVenta
          const orderDate = rawDate ? new Date(rawDate) : null
          const amountValue = order.total ?? order.Total ?? 0
          
          return {
            id: order.id ?? order.Id,
            user: order.nombreUsuario || order.NombreUsuario || 'Usuario',
            date: orderDate ? orderDate.toLocaleDateString() : '',
            amount: `$${amountValue.toLocaleString()}`,
            status: normalizedStatus,
            statusLabel: normalizedStatus === 'completed' || normalizedStatus === 'completado' ? 'Completado' : 
                         normalizedStatus === 'processing' || normalizedStatus === 'en proceso' ? 'En proceso' : 
                         normalizedStatus === 'shipped' || normalizedStatus === 'enviado' ? 'Enviado' : 'Pendiente'
          };
        }))

        // Process Performance Metrics
        setPerformanceMetrics({
          productsSold: (analyticsData.topProducts || analyticsData.TopProducts || []).reduce((sum: number, product: any) => sum + Number(product.totalVendido ?? product.TotalVendido ?? product.total ?? 0), 0) || ordersCount,
          avgResponseTime: "2h 14m", 
          conversionRate: `${conversion.toFixed(1)}%`,
          customerSatisfaction: "4.8/5" 
        })

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const chartConfig = {
    sales: {
      label: "Ventas",
      color: "#8b5cf6",
    },
  }

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full">Cargando dashboard...</div>
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-8" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
              <h3 className="text-2xl font-bold mt-2">{stats.users.value}</h3>
              {stats.users.change && (
                <p className="text-xs text-green-500 flex items-center mt-1">
                  {stats.users.change} este mes
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pedidos Totales</p>
              <h3 className="text-2xl font-bold mt-2">{stats.orders.value}</h3>
              {stats.orders.change && (
                <p className="text-xs text-green-500 flex items-center mt-1">
                  {stats.orders.change} este mes
                </p>
              )}
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
              <h3 className="text-2xl font-bold mt-2">{stats.revenue.value}</h3>
              {stats.revenue.change && (
                <p className="text-xs text-green-500 flex items-center mt-1">
                  {stats.revenue.change} este mes
                </p>
              )}
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progreso</p>
              <h3 className="text-2xl font-bold mt-2">{stats.progress.value}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.progress.change}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Progreso de Ventas</CardTitle>
            <Button variant="outline" size="sm">Ver detalles</Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={10} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="var(--color-sales)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No hay datos de ventas disponibles
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recientes</CardTitle>
            <Link href="/admin/pedidos">
              <Button variant="ghost" size="sm" className="text-xs">Ver todos</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                        {order.id}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.user}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{order.amount}</p>
                      <Badge 
                        variant="secondary" 
                        className={`mt-1 text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                          'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        }`}
                      >
                        {order.statusLabel}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No hay pedidos recientes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Métricas de Rendimiento</CardTitle>
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Productos Vendidos</p>
                <p className="text-2xl font-bold">{performanceMetrics.productsSold}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio de Respuesta</p>
                <p className="text-2xl font-bold">{performanceMetrics.avgResponseTime}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Tasa de Conversión</p>
                <p className="text-2xl font-bold">{performanceMetrics.conversionRate}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Satisfacción del Cliente</p>
                <p className="text-2xl font-bold">{performanceMetrics.customerSatisfaction}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
