"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Ocurrió un error</h1>
        <p className="text-muted-foreground mb-6">No pudimos cargar el producto. Intenta nuevamente.</p>
        <button onClick={() => reset()} className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Reintentar</button>
      </div>
    </div>
  )
}
