"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  color: "blue" | "red" | "green" | "purple" | "orange" | "teal"
  loading?: boolean
}

const colorClasses = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "bg-blue-50",
    darkBg: "bg-blue-600"
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-600", 
    lightBg: "bg-red-50",
    darkBg: "bg-red-600"
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-600",
    lightBg: "bg-green-50", 
    darkBg: "bg-green-600"
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    lightBg: "bg-purple-50",
    darkBg: "bg-purple-600"
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "bg-orange-50",
    darkBg: "bg-orange-600"
  },
  teal: {
    bg: "bg-teal-500", 
    text: "text-teal-600",
    lightBg: "bg-teal-50",
    darkBg: "bg-teal-600"
  }
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  color,
  loading = false 
}: MetricCardProps) {
  const colors = colorClasses[color]
  
  if (loading) {
    return (
      <Card className="h-32">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-32 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
            </p>
            {change && (
              <p className={cn(
                "text-xs font-medium",
                changeType === "positive" && "text-green-600",
                changeType === "negative" && "text-red-600", 
                changeType === "neutral" && "text-gray-500"
              )}>
                {change}
              </p>
            )}
          </div>
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg",
            colors.lightBg
          )}>
            <div className={cn("w-6 h-6", colors.text)}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}