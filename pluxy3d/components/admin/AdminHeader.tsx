"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Menu, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function AdminHeader({ 
  title, 
  subtitle, 
  onMenuClick, 
  onRefresh, 
  isRefreshing = false 
}: AdminHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar..."
                className="pl-10 w-64"
              />
            </div>
          </div>

          {/* Refresh button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn(
                "w-4 h-4",
                isRefreshing && "animate-spin"
              )} />
              <span className="ml-2 hidden sm:inline">Actualizar</span>
            </Button>
          )}

          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User avatar */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </div>
  )
}