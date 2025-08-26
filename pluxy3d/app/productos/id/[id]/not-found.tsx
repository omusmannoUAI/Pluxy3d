import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
        <p className="text-muted-foreground mb-6">No pudimos encontrar el producto solicitado. Es posible que haya sido removido o que el enlace ya no sea válido.</p>
        <Link href="/productos" className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Ver todos los productos</Link>
      </div>
    </div>
  )
}