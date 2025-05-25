import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

export interface CartItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  quantity: number
  discount?: {
    percentage: number
    originalPrice: number
  }
}

export function useCartLogic() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    apiFetch("/carrito")
      .then((data) => setCartItems(data as CartItem[]))
      .catch(console.error)
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = cartItems.reduce(
    (total, item) => total + (item.discount ? (item.discount.originalPrice - item.price) * item.quantity : 0),
    0,
  )
  const shipping = 0
  const total = subtotal + shipping

  return {
    cartItems,
    setCartItems,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    shipping,
    total,
  }
}
