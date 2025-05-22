"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckoutSuccessPage({ params }: { params: { metodo: string } }) {
  // En un caso real, podrías obtener el resumen de la compra desde el backend o el localStorage
  // Aquí se usa un mockup
  const resumen = {
    productos: [
      { nombre: "Producto 1", cantidad: 1, precio: 100 },
      { nombre: "Producto 2", cantidad: 2, precio: 200 },
    ],
    subtotal: 500,
    descuento: 50,
    envio: 0,
    total: 450,
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-green-600 text-2xl">¡Compra realizada con éxito!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-100 text-green-800 rounded p-4 text-center font-semibold">
            Tu pago con {params.metodo === "tarjeta" ? "tarjeta" : "Mercado Pago"} fue procesado correctamente.
          </div>
          <div>
            <h2 className="font-bold mb-2">Resumen de la compra</h2>
            <ul className="mb-2">
              {resumen.productos.map((p, i) => (
                <li key={i} className="flex justify-between">
                  <span>{p.nombre} x{p.cantidad}</span>
                  <span>${p.precio * p.cantidad}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${resumen.subtotal}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Descuento</span>
              <span>-${resumen.descuento}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>{resumen.envio === 0 ? "Gratis" : `$${resumen.envio}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>${resumen.total}</span>
            </div>
          </div>
          <Link href="/productos">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-4">Seguir comprando</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
