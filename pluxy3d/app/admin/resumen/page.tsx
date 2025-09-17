"use client"

import { useState, useEffect } from "react"
import { MetricCard } from "@/components/admin/MetricCard"
import { DataCard, RecentItem, TrendItem } from "@/components/admin/DataCard"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  TrendingUp,
  Eye
} from "lucide-react"

export default function AdminResumenPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Main metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Usuarios"
          value="1,247"
          change="+12% este mes"
          changeType="positive"
          icon={<Users />}
          color="blue"
          loading={isLoading}
        />
        <MetricCard
          title="Pedidos Totales" 
          value="3,891"
          change="+8% este mes"
          changeType="positive"
          icon={<ShoppingCart />}
          color="red"
          loading={isLoading}
        />
        <MetricCard
          title="Ingresos Totales"
          value="$15.4M"
          change="+23% este mes"
          changeType="positive"
          icon={<DollarSign />}
          color="green"
          loading={isLoading}
        />
        <MetricCard
          title="Progreso"
          value="87%"
          change="Meta mensual"
          changeType="neutral"
          icon={<TrendingUp />}
          color="purple"
          loading={isLoading}
        />
      </div>

      {/* Charts and data section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales progress chart placeholder */}
        <div className="lg:col-span-2">
          <DataCard 
            title="Progreso de Ventas"
            action={
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Ver detalles
              </Button>
            }
          >
            <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Gráfico de ventas semanales</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">En pesos argentinos</p>
              </div>
            </div>
          </DataCard>
        </div>

        {/* Recent orders */}
        <DataCard 
          title="Pedidos Recientes"
          action={
            <Button variant="ghost" size="sm">
              Ver todos los pedidos
            </Button>
          }
        >
          <div className="space-y-1">
            <RecentItem
              id="ORD-001"
              title="Juan Pérez"
              subtitle="2024-01-25"
              value="$389,099"
              status="warning"
              date="Procesando"
            />
            <RecentItem
              id="ORD-002"  
              title="María García"
              subtitle="2024-01-24"
              value="$45,000"
              status="info"
              date="Enviado"
            />
            <RecentItem
              id="ORD-003"
              title="Carlos López"
              subtitle="2024-01-23"
              value="$125,000"
              status="success"
              date="Entregado"
            />
          </div>
        </DataCard>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <DataCard title="Recomendaciones Inteligentes">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Optimizar inventario de impresoras
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Las impresoras Creality tienen alta demanda. Considera aumentar el stock.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Ver detalles
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Performance metrics */}
        <DataCard title="Métricas de Rendimiento">
          <div className="space-y-3">
            <TrendItem
              label="Productos Vendidos"
              value="892"
              change="+12.5%"
              isPositive={true}
            />
            <TrendItem
              label="Tiempo Promedio de Respuesta"
              value="2.3 min"
              change="-8.2%"
              isPositive={true}
            />
            <TrendItem
              label="Tasa de Conversión"
              value="3.2%"
              change="+0.8%"
              isPositive={true}
            />
            <TrendItem
              label="Satisfacción del Cliente"
              value="4.8/5"
              change="+0.2"
              isPositive={true}
            />
          </div>
        </DataCard>
      </div>
    </div>
  )
}
