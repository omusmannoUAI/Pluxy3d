"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"

const slides = [
  {
    title: "Servicio Técnico Especializado",
    subtitle: "Diagnóstico, reparación y mantenimiento con repuestos originales.",
    img: "/hellbot.png",
    primary: { label: "Abrir Ticket", href: "/soporte" },
    secondary: { label: "Conocer servicio", href: "/soporte" },
  },
  {
    title: "Componentes y Repuestos",
    subtitle: "Mejorá tu impresora con extrusores, hotends, placas y más.",
    img: "/kitmejora.webp",
    primary: { label: "Ver Componentes", href: "/productos/componentes" },
    secondary: { label: "Soporte Técnico", href: "/soporte" },
  },
  {
    title: "Impresoras 3D de Alta Calidad",
    subtitle: "Desde tu primera Ender hasta equipos listos para producción.",
    img: "/ender3v2.webp",
    primary: { label: "Ver Impresoras", href: "/productos/impresoras" },
    secondary: { label: "Soporte Técnico", href: "/soporte" },
  },
]

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [hover, setHover] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api) return
    const id = setInterval(() => {
      if (!hover) api.scrollNext()
    }, 5000)
    return () => clearInterval(id)
  }, [api, hover])

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }))
  }

  return (
    <section className="relative w-full" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
    <CarouselContent>
          {slides.map((s, idx) => (
      <CarouselItem key={idx} className="h-[52vh] md:h-[64vh]">
              <div className="relative h-full w-full rounded-none">
                {/* Loading skeleton */}
                {!imagesLoaded[idx] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-400 text-lg">Cargando...</div>
                  </div>
                )}
                <Image 
                  src={s.img} 
                  alt={s.title} 
                  width={1600} 
                  height={900} 
                  priority={idx === 0} 
                  className={`object-cover w-full h-full transition-opacity duration-300 ${
                    imagesLoaded[idx] ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  onLoad={() => handleImageLoad(idx)}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">{s.title}</h1>
            <p className="text-white/90 text-base md:text-xl mb-6 md:mb-8">{s.subtitle}</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg" variant="purple">
                          <Link href={s.primary.href}>{s.primary.label}</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                          <Link href={s.secondary.href}>{s.secondary.label}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            aria-label={`Ir al slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={`h-2.5 w-2.5 rounded-full ${current === i ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  )
}
