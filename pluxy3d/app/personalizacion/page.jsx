"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function PersonalizacionPage() {
  const [selectedPrinter, setSelectedPrinter] = useState("ender3-v2")
  const [selectedFilament, setSelectedFilament] = useState("pla")
  const [color, setColor] = useState("rojo")
  const [quantity, setQuantity] = useState(1)
  const [accessories, setAccessories] = useState({
    nozzle: false,
    bed: false,
    cooling: false,
  })

  const printers = [
    { id: "ender3-v2", name: "Creality Ender 3 V2", price: 299, image: "/images/products/ender3-v2.jpg" },
    { id: "hellbot", name: "Hellbot Magna 2", price: 799, image: "/images/products/hellbot-magna2.jpg" },
  ]

  const filaments = [
    { id: "pla", name: "PLA Standard", price: 20 },
    { id: "petg", name: "PETG Resistente", price: 30 },
    { id: "abs", name: "ABS Profesional", price: 35 },
  ]

  const colors = [
    { id: "rojo", name: "Rojo", value: "#ef4444" },
    { id: "azul", name: "Azul", value: "#3b82f6" },
    { id: "negro", name: "Negro", value: "#000000" },
    { id: "blanco", name: "Blanco", value: "#ffffff" },
  ]

  const accessoriesOptions = [
    { id: "nozzle", name: "Nozzle de Cerámica", price: 15 },
    { id: "bed", name: "Cama Magnética", price: 45 },
    { id: "cooling", name: "Sistema de Enfriamiento", price: 35 },
  ]

  const selectedPrinterData = printers.find((p) => p.id === selectedPrinter)
  const selectedFilamentData = filaments.find((f) => f.id === selectedFilament)
  const selectedColorData = colors.find((c) => c.id === color)

  const accessoriesPrice = Object.entries(accessories)
    .filter(([_, selected]) => selected)
    .reduce((sum, [key]) => {
      const accessory = accessoriesOptions.find((a) => a.id === key)
      return sum + (accessory ? accessory.price : 0)
    }, 0)

  const totalPrice = (selectedPrinterData?.price || 0) + (selectedFilamentData?.price || 0) + accessoriesPrice

  const handleAddToCart = () => {
    const cartItem = {
      id: `${selectedPrinter}-${selectedFilament}-${color}`,
      printer: selectedPrinterData?.name,
      filament: selectedFilamentData?.name,
      color: selectedColorData?.name,
      quantity,
      unitPrice: totalPrice,
      totalPrice: totalPrice * quantity,
      accessories: Object.entries(accessories)
        .filter(([_, selected]) => selected)
        .map(([key]) => accessoriesOptions.find((a) => a.id === key)?.name),
    }

    const cart = JSON.parse(localStorage.getItem("carrito") || "[]")
    cart.push(cartItem)
    localStorage.setItem("carrito", JSON.stringify(cart))
    window.location.href = "/carrito"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personaliza tu Impresora 3D</h1>
          <p className="text-gray-600">Elige los componentes y colores que deseas para tu setup perfecto</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customization Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Printer Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Selecciona tu Impresora</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {printers.map((printer) => (
                  <div
                    key={printer.id}
                    onClick={() => setSelectedPrinter(printer.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedPrinter === printer.id
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="relative h-40 mb-3 bg-gray-100 rounded">
                      <Image
                        src={printer.image || "/placeholder.svg"}
                        alt={printer.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900">{printer.name}</h3>
                    <p className="text-purple-600 font-bold text-lg">${printer.price}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filament Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Selecciona Filamento</h2>
              <div className="space-y-3">
                {filaments.map((filament) => (
                  <label
                    key={filament.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="filament"
                      value={filament.id}
                      checked={selectedFilament === filament.id}
                      onChange={(e) => setSelectedFilament(e.target.value)}
                      className="mr-3"
                    />
                    <span className="flex-1">
                      <span className="font-medium text-gray-900">{filament.name}</span>
                    </span>
                    <span className="text-purple-600 font-bold">+${filament.price}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Color Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Elige Color</h2>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      color === c.id ? "border-purple-600 scale-105" : "border-gray-200"
                    }`}
                  >
                    <div
                      className="h-12 rounded mb-2"
                      style={{
                        backgroundColor: c.value,
                        border: c.value === "#ffffff" ? "1px solid #ccc" : "none",
                      }}
                    />
                    <p className="text-center text-sm font-medium text-gray-900">{c.name}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Accessories */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Accesorios Opcionales</h2>
              <div className="space-y-3">
                {accessoriesOptions.map((acc) => (
                  <label
                    key={acc.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={accessories[acc.id] || false}
                      onChange={(e) => setAccessories({ ...accessories, [acc.id]: e.target.checked })}
                      className="mr-3"
                    />
                    <span className="flex-1">
                      <span className="font-medium text-gray-900">{acc.name}</span>
                    </span>
                    <span className="text-purple-600 font-bold">+${acc.price}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Resumen del Pedido</h2>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Impresora:</span>
                  <span className="font-semibold text-gray-900">${selectedPrinterData?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Filamento:</span>
                  <span className="font-semibold text-gray-900">+${selectedFilamentData?.price}</span>
                </div>
                {accessoriesPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accesorios:</span>
                    <span className="font-semibold text-gray-900">+${accessoriesPrice}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-bold text-gray-900">Precio Unitario:</span>
                  <span className="text-2xl font-bold text-purple-600">${totalPrice}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cantidad:</label>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="flex-1 text-center border-0 py-2"
                  />
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-purple-600">${totalPrice * quantity}</span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar al Carrito
              </Button>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/productos">Seguir Comprando</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
