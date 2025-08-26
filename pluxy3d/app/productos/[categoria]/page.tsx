"use client"

import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { useEffect, useState } from "react"
import { ProductCard } from "@/components/shared/ProductCard"
import { ProductFilters } from "@/components/shared/ProductFilters"
import { ProductGridLoading, ErrorState } from "@/components/shared/LoadingStates"
import { Product } from "@/lib/types"
import { slugify } from "@/lib/helpers"

export default function ProductosCategoriaPage() {
  const params = useParams();
  const router = useRouter();
  const categoria = params.categoria as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([categoria]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number]>([500000]);

  // If this dynamic segment is actually a numeric ID, redirect to product detail
  useEffect(() => {
    if (/^\d+$/.test(categoria)) {
      router.replace(`/producto/${categoria}`)
    }
  }, [categoria, router])

  useEffect(() => {
    apiFetch("/productos")
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar los productos");
        setLoading(false);
      });
  }, []);

  // Be tolerant with category variants (impresoras, componentes, etc.)
  const filteredProducts = products.filter((p) => {
    const catSlug = slugify(p.category || "");
    const isPrinterSection = categoria.includes("impresor");
    const isComponentsSection = categoria.includes("component");
    if (isPrinterSection) return catSlug.includes("impresor");
    if (isComponentsSection) return catSlug.includes("component");
    return catSlug === categoria;
  });
  // Get unique categories and brands
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    .map(cat => ({ id: slugify(cat as string), label: cat as string }));
  
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)))
    .map(brand => ({ id: brand, label: brand }));

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        Productos / {categoria}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">        <ProductFilters
          categories={categories}
          brands={brands}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          maxPrice={500000}
          onCategoriesChange={setSelectedCategories}
          onBrandsChange={setSelectedBrands}
          onPriceRangeChange={setPriceRange}
          onApplyFilters={() => {}}
          onClearFilters={() => {
            setSelectedCategories([categoria]);
            setSelectedBrands([]);
            setPriceRange([500000]);
          }}
        />
        
        <div className="w-full md:w-3/4">
          {loading ? (
            <ProductGridLoading />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No hay productos para esta categoría.</p>
              <Button variant="outline" asChild>
                <a href="/productos">Ver todos los productos</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showBrand={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
