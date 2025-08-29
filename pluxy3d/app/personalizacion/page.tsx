import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load components pesados
const PersonalizacionContent = dynamic(() => import('@/components/personalizacion/PersonalizacionContent'), {
  loading: () => <PersonalizacionLoadingSkeleton />
})

// Loading skeleton optimizado
function PersonalizacionLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs skeleton */}
            <div className="flex space-x-1 mb-6">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="border rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary skeleton */}
          <div className="border rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PersonalizacionPage() {
  return (
    <Suspense fallback={<PersonalizacionLoadingSkeleton />}>
      <PersonalizacionContent />
    </Suspense>
  )
}
