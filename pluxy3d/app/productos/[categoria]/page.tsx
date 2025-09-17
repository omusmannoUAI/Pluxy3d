"use client"

import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { useEffect, useState } from "react"
import { ProductCard } from "@/components/shared/ProductCard"
import { ProductFilters } from "@/components/shared/ProductFilters"
import { ProductGridLoading, ErrorState } from "@/components/shared/LoadingStates"
import { Product } from "@/lib/types"

// Simple slugify function to normalize text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

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
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use direct fetch instead of apiFetch to avoid fallbacks
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299/api';
        const directResponse = await fetch(`${API_URL}/productos`);
        
        if (!directResponse.ok) {
          throw new Error(`HTTP ${directResponse.status}: ${directResponse.statusText}`);
        }
        
        const response = await directResponse.json();
        
        // Handle paginated response from API
        let productItems = []
        if (response && response.items && Array.isArray(response.items)) {
          productItems = response.items
        } else if (Array.isArray(response)) {
          productItems = response
        }

        // Map API response to frontend Product interface
        const mappedProducts = productItems.map((item: any) => ({
          id: item.id,
          name: item.nombre || item.name,
          description: item.descripcion || item.description,
          price: Number((item.precio || item.price) ?? 0),
          image: item.imagen || item.image || "/placeholder.svg",
          category: item.categoria || item.category,
          brand: item.marca || item.brand,
          rating: Number(item.rating || item.calificacion || 0),
          stock: item.stock || (item.cantidad > 0 ? "in_stock" : "out_of_stock")
        })) as Product[]

        setProducts(mappedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        console.error('Error details:', err instanceof Error ? err.message : String(err));
        setError("Error al cargar los productos");
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  // Be tolerant with category variants (impresoras, componentes, etc.)
  const filteredProducts = products.filter((p) => {
    if (!p.category) return false;
    
    const categoryLower = p.category.toLowerCase();
    const categoriaLower = categoria.toLowerCase();
    
    // Direct match
    if (categoryLower === categoriaLower) {
      return true;
    }
    
    // Flexible matching - if URL contains "impresor" and category contains "impresor"
    if (categoriaLower.includes("impresor") && categoryLower.includes("impresor")) {
      return true;
    }
    if (categoriaLower.includes("component") && categoryLower.includes("component")) {
      return true;
    }
    if (categoriaLower.includes("filament") && categoryLower.includes("filament")) {
      return true;
    }
    if (categoriaLower.includes("herramienta") && categoryLower.includes("herramienta")) {
      return true;
    }
    
    return false;
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
