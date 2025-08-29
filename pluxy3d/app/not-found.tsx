"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileQuestion className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Página no encontrada</CardTitle>
            <CardDescription>
              La página que buscas no existe o ha sido movida.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Ir al inicio
                </Link>
              </Button>

              <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver atrás
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
