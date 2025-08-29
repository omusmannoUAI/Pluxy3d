import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load components pesados
const SoporteContent = dynamic(() => import('@/app/components/soporte/SoporteContent'), {
  loading: () => <SoporteLoadingSkeleton />
})

// Loading skeleton optimizado
function SoporteLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>

        {/* Tabs skeleton */}
        <div className="flex flex-col md:flex-row gap-1 mb-6">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="border rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SoportePage() {
  return (
    <Suspense fallback={<SoporteLoadingSkeleton />}>
      <SoporteContent />
    </Suspense>
  )
}
