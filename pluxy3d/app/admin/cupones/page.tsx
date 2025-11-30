"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Download, 
  RefreshCw, 
  Ticket, 
  CheckCircle2, 
  Activity, 
  DollarSign,
  Edit,
  Eye,
  Copy,
  Trash2,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCoupons } from "@/services/api"

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const data = await getCoupons()
      setCoupons(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setCoupons([])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Cupones",
      value: coupons.length,
      icon: Ticket,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Activos",
      value: coupons.filter(c => c.status === "Active").length,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Usos Totales",
      value: coupons.reduce((acc, curr) => acc + (curr.uses || 0), 0),
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Descuento Total",
      value: "$2.1M", // Mocked
      icon: DollarSign,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cupones</h1>
          <p className="text-muted-foreground">Gestiona cupones</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={loadCoupons}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Administra cupones de descuento y promociones</h2>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cupón
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar cupones..." className="pl-8" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <span className="text-purple-600 font-bold text-lg">%</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{coupon.code}</h3>
                    <p className="text-sm text-muted-foreground">{coupon.description}</p>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-sm font-medium text-purple-600">{coupon.discount} de descuento</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">Válido: {coupon.validUntil}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <Badge variant={coupon.status === "Active" ? "secondary" : "destructive"} className={`mb-1 ${coupon.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}`}>
                      {coupon.status === "Active" ? "Activo" : "Expirado"}
                    </Badge>
                    <p className="text-sm font-medium">{coupon.uses}/{coupon.maxUses} usos</p>
                    <p className="text-xs text-muted-foreground">Min: ${coupon.minPurchase?.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
