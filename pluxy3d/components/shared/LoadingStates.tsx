"use client"

import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  )
}

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ 
  message = "Cargando...", 
  className = "" 
}: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Error",
  message = "Ha ocurrido un error inesperado",
  onRetry,
  className = ""
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {message && (
        <p className="text-muted-foreground text-center mb-4 max-w-md">{message}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="purple">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

interface ProductLoadingCardProps {
  className?: string
}

export function ProductLoadingCard({ className = "" }: ProductLoadingCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-48 bg-muted animate-pulse" />
      <CardHeader>
        <div className="h-4 bg-muted rounded animate-pulse mb-2" />
        <div className="h-6 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-6 bg-muted rounded animate-pulse w-1/2 mt-4" />
        </div>
      </CardContent>
    </Card>
  )
}

interface ProductGridLoadingProps {
  count?: number
  className?: string
}

export function ProductGridLoading({ count = 6, className = "" }: ProductGridLoadingProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductLoadingCard key={index} />
      ))}
    </div>
  )
}
