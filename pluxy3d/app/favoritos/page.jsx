"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Creality Ender 3 V2",
      price: 320000,
      image: "/images/products/ender3-v2.jpg",
      rating: 4.8,
      reviews: 234,
    },
  ])

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Mis Favoritos</h1>
        <p className="text-muted-foreground mt-2">Productos que te interesan</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">No tienes favoritos aún</h2>
          <p className="text-muted-foreground mb-8">Agrega productos a tu lista de favoritos para verlos aquí.</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/productos">Explorar Productos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name || "Producto favorito"}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-purple-600">${product.price.toLocaleString("es-AR")}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => removeFavorite(product.id)}>
                  <Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                  Quitar
                </Button>
                <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Link href={`/productos/${product.id}`}>Ver</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
