import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { formatPriceSimple, slugify } from "@/lib/helpers"
import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/shared/ProductCard"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Star, ArrowLeft } from "lucide-react"
import ProductGallery from "../../_components/ProductGallery"
import AddToCartRow from "../../_components/AddToCartRow"

async function fetchProduct(id: string): Promise<Product | null> {
  const res = await apiFetch(`/productos/${id}`)
  let p: any = res
  if (!p || Array.isArray(p)) {
    const list = await apiFetch('/productos')
    if (Array.isArray(list)) {
      p = list.find((it: any) => String(it.id) === id)
    }
  }
  if (!p) return null
  const mapped: Product = {
    id: Number(p.id),
    name: String(p.name ?? p.titulo ?? "Producto"),
    description: String(p.description ?? p.descripcion ?? ""),
    price: Number(p.price ?? p.precio ?? 0),
    image: String(p.image ?? p.imagen ?? "/placeholder.svg"),
    images: Array.isArray(p.images) ? p.images.map((x: any) => String(x)) : undefined,
    category: String(p.category ?? p.categoria ?? ""),
    brand: String(p.brand ?? p.marca ?? ""),
    rating: typeof p.rating === 'number' ? p.rating : undefined,
    reviewsCount: typeof p.reviewsCount === 'number' ? p.reviewsCount : undefined,
    stock: typeof p.stock === 'string' ? p.stock : undefined,
    discount: p.discount && typeof p.discount === 'object' &&
      typeof p.discount.percentage === 'number' && typeof p.discount.originalPrice === 'number'
      ? { percentage: p.discount.percentage, originalPrice: p.discount.originalPrice }
      : undefined,
  }
  return mapped
}

async function fetchRelatedProducts(base: Product, limit = 6): Promise<Product[]> {
  const list = await apiFetch('/productos')
  if (!Array.isArray(list)) return []
  const normalized = list.map((p: any) => ({
    id: Number(p.id),
    name: String(p.name ?? p.titulo ?? "Producto"),
    description: String(p.description ?? p.descripcion ?? ""),
    price: Number(p.price ?? p.precio ?? 0),
    image: String(p.image ?? p.imagen ?? "/placeholder.svg"),
    category: String(p.category ?? p.categoria ?? ""),
    brand: String(p.brand ?? p.marca ?? ""),
  })) as Product[]

  const baseBrand = slugify(base.brand || '')
  const baseCat = slugify(base.category || '')
  const sameBrand = normalized.filter(p => p.id !== base.id && slugify(p.brand || '') === baseBrand)
  const sameCategory = normalized.filter(p => p.id !== base.id && slugify(p.category || '') === baseCat && !sameBrand.some(b => b.id === p.id))
  return [...sameBrand, ...sameCategory].slice(0, limit)
}

// Note: Avoid param destructuring in signature to satisfy Next.js 15 sync dynamic API checks
export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params
  const product = await fetchProduct(id)
  const title = product ? `${product.name} | Pluxy 3D` : `Producto | Pluxy 3D`
  const description = product?.description?.slice(0, 160) || "Detalles del producto en Pluxy 3D"
  const images = product?.image ? [product.image] : undefined
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  }
}

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const product = await fetchProduct(id)
  if (!product) notFound()
  const related = await fetchRelatedProducts(product)

  return (
    <>
    {/* JSON-LD Product schema for SEO */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: product.images && product.images.length > 0 ? product.images : [product.image],
          description: product.description,
          brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'CLP',
            price: product.price,
            availability: product.stock === 'out_of_stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          },
          aggregateRating: product.rating ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewsCount ?? 0,
          } : undefined,
        })
      }}
    />
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/productos" className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver a Productos
        </Link>
      </div>
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/">Inicio</Link> <span className="mx-1">/</span>
        <Link href="/productos">Productos</Link>
        {product.category && (
          <>
            <span className="mx-1">/</span>
            <Link href={`/productos/${slugify(product.category)}`}>{product.category}</Link>
          </>
        )}
        {product.category && product.brand && (
          <>
            <span className="mx-1">/</span>
            <Link href={`/productos/${slugify(product.category)}/${slugify(product.brand)}`}>{product.brand}</Link>
          </>
        )}
        <span className="mx-1">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductGallery
          images={(product.images && product.images.length > 0 ? product.images : [product.image]).filter(Boolean) as string[]}
          alt={product.name}
        />

        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.category && (
              <Badge variant="secondary">{product.category}</Badge>
            )}
            {product.brand && (
              <Badge variant="outline">{product.brand}</Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating ?? 4.3}</span>
            <span>({product.reviewsCount ?? 45} reseñas)</span>
          </div>

          <div className="mb-3">
            {product.discount ? (
              <div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="line-through">{formatPriceSimple(product.discount.originalPrice)}</span>
                  <span className="text-xs bg-purple-100 text-purple-700 rounded px-1.5 py-0.5">-{product.discount.percentage}%</span>
                </div>
                <div className="text-3xl font-bold">{formatPriceSimple(product.price)}</div>
              </div>
            ) : (
              <div className="text-3xl font-bold">{formatPriceSimple(product.price)}</div>
            )}
          </div>

          <div className="mb-4">
            {product.stock === 'out_of_stock' ? (
              <Badge className="bg-rose-100 text-rose-700" variant="secondary">Sin stock</Badge>
            ) : (
              <Badge className="bg-emerald-100 text-emerald-700" variant="secondary">En stock</Badge>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground mb-6 whitespace-pre-line">{product.description}</p>
          )}

          {/* Quantity + actions */}
          <div className="mb-6">
            <AddToCartRow product={product} />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Características principales</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Doble engranaje de tracción</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Mejor agarre del filamento</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Reduce atascos</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Compatible con múltiples impresoras</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instalación sencilla</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Tabs with description/specs/reviews */}
    <div className="container mx-auto px-4 pb-12">
      <Tabs defaultValue="descripcion">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="descripcion">Descripción</TabsTrigger>
          <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
          <TabsTrigger value="resenas">Reseñas</TabsTrigger>
        </TabsList>
        <TabsContent value="descripcion">
          <div className="rounded-md border p-4 text-sm text-muted-foreground whitespace-pre-line">
            {product.description || 'Sin descripción'}
          </div>
        </TabsContent>
        <TabsContent value="especificaciones">
          <div className="rounded-md border p-4 text-sm text-muted-foreground">Pronto agregaremos las especificaciones.</div>
        </TabsContent>
        <TabsContent value="resenas">
          <div className="rounded-md border p-4 text-sm text-muted-foreground">Aún no hay reseñas.</div>
        </TabsContent>
      </Tabs>
    </div>

    {related.length > 0 && (
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold mt-12 mb-6">También te puede interesar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((rp) => (
            <ProductCard key={rp.id} product={rp} showBrand={false} />
          ))}
        </div>
      </div>
    )}
    </>
  )
}
