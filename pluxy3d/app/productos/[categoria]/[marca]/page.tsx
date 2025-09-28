"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { ProductCard } from "@/components/shared/ProductCard"
import { ProductFilters } from "@/components/shared/ProductFilters"
import { ProductGridLoading, ErrorState } from "@/components/shared/LoadingStates"
import { Product } from "@/lib/types"
import { slugify } from "@/lib/helpers"
import { useParams, useRouter } from "next/navigation"

export default function ProductosPorMarcaPage() {
	const params = useParams();
	const categoria = params.categoria as string;
	const marca = params.marca as string;
	const router = useRouter();

	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filter states (for UI only; filtering happens below)
	const [selectedCategories, setSelectedCategories] = useState<string[]>([categoria]);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([marca]);
	const [priceRange, setPriceRange] = useState<[number]>([500000]);

		// If this route is actually the product detail alias (/productos/id/[id]), redirect to the detail page
	useEffect(() => {
		if (categoria === 'id' && /^\d+$/.test(marca)) {
				router.replace(`/producto/${marca}`)
		}
	}, [categoria, marca, router])

	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await apiFetch("/productos");
				
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
					name: item.nombre || item.Nombre || item.name,
					description: item.descripcion || item.Descripcion || item.description,
					price: Number((item.precio || item.Precio || item.price) || 0),
					image: item.imagen || item.Image || item.image || "/placeholder.svg",
					category: item.categoria || item.Categoria || item.category,
					brand: item.marca || item.Marca || item.brand,
					rating: Number(item.rating || item.calificacion || item.Calificacion || 0),
					stock: item.stock || item.Stock || (item.cantidad > 0 ? "in_stock" : "out_of_stock")
				})) as Product[]

				console.log('Marca page loaded products:', mappedProducts.length, mappedProducts);
				setProducts(mappedProducts);
				setLoading(false);
			} catch (err) {
				console.error('Error loading products:', err);
				setError("Error al cargar los productos");
				setLoading(false);
			}
		}
		
		loadProducts();
	}, []);

		// Category matching tolerant to plural/"3d" variants (e.g., impresora/impresoras/impresoras-3d)
		const inferBrand = (p: Product): string | undefined => {
			const text = `${p.name ?? ''} ${p.description ?? ''}`.toLowerCase();
			const brands = [
				'creality',
				'hellbot',
				'prusa',
				'anycubic',
				'artillery',
				'elegoo',
				'bambu lab',
				'flashforge',
			];
			return brands.find((b) => text.includes(b)) || undefined;
		};

		// Subcategory detection for componentes
		const subcatKeywords: Record<string, string[]> = {
			extrusores: ['extrusor', 'extrusores', 'extruder', 'bowden', 'bmg', 'doble tracción', 'doble traccion'],
			hotend: ['hotend', 'hot end', 'v6', 'all metal'],
			placas: ['placa', 'pei', 'build plate', 'cama', 'bed', 'vidrio', 'glass', 'superficie'],
			resortes: ['resorte', 'resortes', 'spring', 'springs'],
		};

		const isKnownSubcategory = (value: string) => Object.keys(subcatKeywords).includes(slugify(value));

		const inferSubcategory = (p: Product): string | undefined => {
			const text = `${p.name ?? ''} ${p.description ?? ''}`.toLowerCase();
			for (const [sub, keywords] of Object.entries(subcatKeywords)) {
				if (keywords.some(k => text.includes(k))) return sub;
			}
			return undefined;
		};

		const filteredProducts = products.filter((p) => {
			const catSlug = slugify(p.category || "");
			const isPrinterSection = categoria.includes("impresor");
			const isComponentsSection = categoria.includes("component");
			const byCategory = isPrinterSection
				? catSlug.includes("impresor")
				: isComponentsSection
					? catSlug.includes("component")
					: catSlug === categoria;
			if (!byCategory) return false;

			if (isComponentsSection && isKnownSubcategory(marca)) {
				const inferred = inferSubcategory(p);
				return inferred ? slugify(inferred) === slugify(marca) : false;
			}

			if (isPrinterSection) {
				// On brand pages for printers, require brand match
				const detectedBrand = p.brand || inferBrand(p);
				if (!detectedBrand) return false;
				const brandSlug = slugify(detectedBrand);
				return brandSlug === slugify(marca);
			}

			// For other categories just return the category match
			return true;
		});

	// Get unique categories and brands for the sidebar
	const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map((cat) => ({
		id: slugify(cat as string),
		label: cat as string,
	}));

	const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).map((b) => ({
		id: slugify(b as string),
		label: b as string,
	}));

	if (error) {
		return <ErrorState message={error} onRetry={() => window.location.reload()} />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8 capitalize">Productos / {categoria} / {marca}</h1>

			<div className="flex flex-col md:flex-row gap-6 mb-8">
				<ProductFilters
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
						setSelectedBrands([marca]);
						setPriceRange([500000]);
					}}
				/>

				<div className="w-full md:w-3/4">
					{loading ? (
						<ProductGridLoading />
					) : filteredProducts.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground mb-4">No hay productos para esta selección.</p>
							<Button variant="outline" asChild>
								<a href="/productos">Ver todos los productos</a>
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredProducts.map((product) => (
								<ProductCard key={product.id} product={product} showBrand={false} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
