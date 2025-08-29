"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorPageProps {
  error?: Error
  reset?: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Algo salió mal</CardTitle>
            <CardDescription>
              Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Error:</strong> {error.message}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {reset && (
                <Button onClick={reset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Intentar nuevamente
                </Button>
              )}

              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Ir al inicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
