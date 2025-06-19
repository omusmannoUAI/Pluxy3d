"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { use } from "react"
import { useCart } from "@/contexts/CartContext"
import { formatPriceSimple } from "@/lib/helpers"

interface PurchaseSummary {
  productos: Array<{
    nombre: string
    cantidad: number
    precio: number
  }>
  subtotal: number
  descuento: number
  envio: number
  total: number
}

export default function CheckoutSuccessPage({ params }: { params: Promise<{ metodo: string }> }) {
  const { metodo } = use(params)
  const { items, getTotalPrice, clearCart } = useCart()
  const [purchaseSummary, setPurchaseSummary] = useState<PurchaseSummary | null>(null)
  const [hasCleared, setHasCleared] = useState(false)
  
  useEffect(() => {
    // Solo ejecutar una vez cuando el componente se monta
    if (hasCleared) return
    
    // Primero intentar cargar desde localStorage
    const savedSummary = localStorage.getItem('lastPurchaseSummary')
    
    if (items.length > 0) {
      // Hay items en el carrito, crear el resumen y guardarlo
      const productos = items.map(item => ({
        nombre: item.name,
        cantidad: item.quantity,
        precio: item.price
      }))
      
      const subtotal = getTotalPrice()
      const descuento = 0
      const envio = 0
      const total = subtotal - descuento + envio
      
      const summary = {
        productos,
        subtotal,
        descuento,
        envio,
        total
      }
      
      // Guardar en localStorage antes de limpiar
      localStorage.setItem('lastPurchaseSummary', JSON.stringify(summary))
      setPurchaseSummary(summary)
      
      // Limpiar el carrito después de guardar el resumen
      clearCart().finally(() => setHasCleared(true))
    } else if (savedSummary) {
      // No hay items pero hay resumen guardado, usarlo
      try {
        const summary = JSON.parse(savedSummary)
        setPurchaseSummary(summary)
        setHasCleared(true)
      } catch (error) {
        console.error('Error parsing saved summary:', error)        // Fallback a datos de ejemplo
        setPurchaseSummary({
          productos: [
            { nombre: "Ender 3 V2", cantidad: 1, precio: 295500 },
            { nombre: "Kit de Mejora Extrusor", cantidad: 1, precio: 59100 },
          ],
          subtotal: 354600,
          descuento: 0,
          envio: 0,
          total: 354600,
        })
        setHasCleared(true)
      }
    } else {
      // No hay items ni resumen guardado
      setPurchaseSummary({
        productos: [
          { nombre: "Sin productos", cantidad: 0, precio: 0 },
        ],
        subtotal: 0,
        descuento: 0,
        envio: 0,
        total: 0,
      })
      setHasCleared(true)    }
  }, []) // Dependencias vacías para que solo se ejecute una vez
  // Limpiar localStorage después de un tiempo
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem('lastPurchaseSummary')
    }, 60000) // 1 minuto
    
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-green-600 text-2xl">¡Compra realizada con éxito!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-100 text-green-800 rounded p-4 text-center font-semibold">
            Tu pago con {metodo === "tarjeta" ? "tarjeta" : "Mercado Pago"} fue procesado correctamente.
          </div>
          
          {purchaseSummary && (
            <div>
              <h2 className="font-bold mb-2">Resumen de la compra</h2>
              <ul className="mb-2">
                {purchaseSummary.productos.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.nombre} x{p.cantidad}</span>
                    <span>{formatPriceSimple(p.precio * p.cantidad)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPriceSimple(purchaseSummary.subtotal)}</span>
              </div>
              {purchaseSummary.descuento > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPriceSimple(purchaseSummary.descuento)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{purchaseSummary.envio === 0 ? "Gratis" : formatPriceSimple(purchaseSummary.envio)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>{formatPriceSimple(purchaseSummary.total)}</span>
              </div>
            </div>
          )}
          
          <Link href="/productos">
            <Button variant="purple" className="w-full mt-4">Seguir comprando</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
