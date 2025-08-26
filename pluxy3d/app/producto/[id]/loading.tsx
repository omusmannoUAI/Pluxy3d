export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full aspect-square bg-muted rounded-lg animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          <div className="h-24 w-full bg-muted rounded animate-pulse" />
          <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
