import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load components pesados
const ProductosContent = dynamic(() => import('@/app/components/productos/ProductosContent'), {
  loading: () => <ProductosLoadingSkeleton />
})

// Loading skeleton optimizado
function ProductosLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Products skeleton */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="h-10 bg-gray-200 rounded flex-grow"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>

            <div className="flex gap-2 mb-6">
              <div className="h-10 bg-gray-200 rounded w-16"></div>
              <div className="h-10 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<ProductosLoadingSkeleton />}>
      <ProductosContent />
    </Suspense>
  )
}
