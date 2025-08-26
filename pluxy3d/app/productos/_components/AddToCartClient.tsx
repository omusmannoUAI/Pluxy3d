"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"

export default function AddToCartClient({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    try {
      setIsAdding(true)
      await addToCart(product)
      toast({ title: "Agregado al carrito", description: `${product.name} fue agregado.` })
    } catch (err: any) {
      toast({ title: "No se pudo agregar", description: err?.message || "Intenta nuevamente.", variant: "destructive" })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="purple" onClick={handleAdd} disabled={isAdding}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isAdding ? "Agregando..." : "Agregar al carrito"}
      </Button>
    </div>
  )
}
