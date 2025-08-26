"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"

export default function AddToCartRow({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const dec = () => setQty(q => Math.max(1, q - 1))
  const inc = () => setQty(q => q + 1)

  const onAdd = async () => {
    try {
      setIsAdding(true)
      await addToCart(product, qty)
      toast({ title: "Agregado al carrito", description: `${product.name} x${qty}` })
    } catch (e: any) {
      toast({ title: "No se pudo agregar", description: e?.message || "Intenta nuevamente", variant: "destructive" })
    } finally {
      setIsAdding(false)
    }
  }

  const onFav = () => {
    toast({ title: "Favoritos", description: "Pronto agregaremos favoritos." })
  }

  return (
    <div className="flex items-end gap-4">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">Cantidad</label>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={dec} aria-label="Disminuir">
            <Minus className="h-4 w-4" />
          </Button>
          <Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} className="w-20 text-center" />
          <Button type="button" variant="outline" size="icon" onClick={inc} aria-label="Aumentar">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button variant="purple" onClick={onAdd} disabled={isAdding}>
        <ShoppingCart className="mr-2 h-4 w-4" /> {isAdding ? "Agregando..." : "Agregar al Carrito"}
      </Button>
      <Button variant="outline" onClick={onFav}><Heart className="mr-2 h-4 w-4" />Agregar a Favoritos</Button>
    </div>
  )
}
