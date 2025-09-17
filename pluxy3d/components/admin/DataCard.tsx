"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataCardProps {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

interface RecentItemProps {
  id: string
  title: string
  subtitle: string
  value: string
  status?: "success" | "warning" | "error" | "info"
  date: string
}

interface TrendItemProps {
  label: string
  value: string
  change: string
  isPositive: boolean
}

export function DataCard({ title, children, action, className }: DataCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {action || (
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}

export function RecentItem({ id, title, subtitle, value, status, date }: RecentItemProps) {
  const statusColors = {
    success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", 
    error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {id.slice(-2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {status && (
          <Badge variant="secondary" className={statusColors[status]}>
            {status === "success" && "Completado"}
            {status === "warning" && "Pendiente"}
            {status === "error" && "Error"}
            {status === "info" && "En proceso"}
          </Badge>
        )}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {date}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TrendItem({ label, value, change, isPositive }: TrendItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {value}
        </span>
        <div className={cn(
          "flex items-center text-xs",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {change}
        </div>
      </div>
    </div>
  )
}