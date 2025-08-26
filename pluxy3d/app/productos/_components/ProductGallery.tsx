"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ZoomIn, ZoomOut } from "lucide-react"

type Props = {
  images: string[]
  alt: string
  className?: string
}

export default function ProductGallery({ images, alt, className }: Props) {
  const validImages = useMemo(
    () => (images && images.length > 0 ? images : ["/placeholder.svg"]),
    [images]
  )
  const [index, setIndex] = useState(0)
  const safeIndex = Math.min(Math.max(index, 0), validImages.length - 1)
  const current = validImages[safeIndex] || "/placeholder.svg"

  // Fullscreen dialog state
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1) // 1 = fit, 2 = zoomed
  const dragRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const originRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setIndex((i) => (i - 1 + validImages.length) % validImages.length)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setIndex((i) => (i + 1) % validImages.length)
      }
    },
    [validImages.length]
  )

  const startDrag = (clientX: number, clientY: number) => {
    if (zoom === 1) return
    isDraggingRef.current = true
    originRef.current = { x: clientX - posRef.current.x, y: clientY - posRef.current.y }
  }
  const onDrag = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return
    posRef.current = { x: clientX - originRef.current.x, y: clientY - originRef.current.y }
    if (dragRef.current) {
      dragRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) scale(${zoom})`
    }
  }
  const endDrag = () => {
    isDraggingRef.current = false
  }

  const toggleZoom = () => {
    const next = zoom === 1 ? 2 : 1
    setZoom(next)
    // reset pan when returning to fit
    if (next === 1) {
      posRef.current = { x: 0, y: 0 }
      if (dragRef.current) dragRef.current.style.transform = `translate(0px, 0px) scale(1)`
    }
  }

  return (
    <div
      className={cn("w-full", className)}
      role="group"
      aria-label="Galería de producto"
      onKeyDown={onKeyDown}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted">
        <Dialog open={open} onOpenChange={(o) => {
          setOpen(o)
          if (!o) {
            setZoom(1)
            posRef.current = { x: 0, y: 0 }
            if (dragRef.current) dragRef.current.style.transform = `translate(0px, 0px) scale(1)`
          }
        }}>
          <DialogTrigger asChild>
            <button
              className="group relative w-full h-full"
              aria-label="Abrir imagen en pantalla completa"
            >
              <Image
                src={current}
                alt={alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-xs text-white">
                <ZoomIn className="h-3.5 w-3.5" />
                Ampliar
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-2 sm:p-3">
            <div className="flex items-center justify-between px-1 pb-2 text-sm text-muted-foreground">
              <span>{safeIndex + 1} / {validImages.length}</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-accent"
                onClick={toggleZoom}
              >
                {zoom === 1 ? <ZoomIn className="h-4 w-4" /> : <ZoomOut className="h-4 w-4" />}
                {zoom === 1 ? "Zoom" : "Ajustar"}
              </button>
            </div>
            <div
              className={cn(
                "relative h-[70vh] w-full overflow-hidden rounded-md bg-black/80",
                "touch-none select-none"
              )}
              onDoubleClick={toggleZoom}
              onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
              onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onTouchStart={(e) => startDrag(e.touches[0]?.clientX ?? 0, e.touches[0]?.clientY ?? 0)}
              onTouchMove={(e) => onDrag(e.touches[0]?.clientX ?? 0, e.touches[0]?.clientY ?? 0)}
              onTouchEnd={endDrag}
            >
              <div
                ref={dragRef}
                className="relative mx-auto h-full w-full will-change-transform"
                style={{ transform: `translate(0px, 0px) scale(${zoom})`, transition: isDraggingRef.current ? undefined : "transform 150ms ease" }}
              >
                <Image
                  src={current}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
            </div>

            {validImages.length > 1 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto">
                {validImages.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "relative h-16 w-24 shrink-0 overflow-hidden rounded border",
                      i === safeIndex ? "ring-2 ring-purple-500" : "opacity-90 hover:opacity-100"
                    )}
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-current={i === safeIndex}
                  >
                    <Image src={src || "/placeholder.svg"} alt={`${alt} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {validImages.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {validImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setIndex(i)}
              className={cn(
                "relative w-full aspect-[4/3] rounded-md overflow-hidden border bg-muted",
                i === safeIndex ? "ring-2 ring-purple-500" : "hover:opacity-95"
              )}
              aria-label={`Seleccionar imagen ${i + 1}`}
              aria-current={i === safeIndex}
            >
              <Image src={src || "/placeholder.svg"} alt={`${alt} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
