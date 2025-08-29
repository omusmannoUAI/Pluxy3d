"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = {
  scrollNext: () => void
  scrollPrev: () => void
  scrollTo: (index: number) => void
  canScrollNext: () => boolean
  canScrollPrev: () => boolean
  scrollSnapList: () => { index: number }[]
  selectedScrollSnap: () => number
  on: (event: string, callback: () => void) => void
  off: (event: string, callback: () => void) => void
}

type CarouselProps = {
  opts?: {
    loop?: boolean
  }
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  api: CarouselApi | undefined
  opts?: CarouselProps["opts"]
  orientation: "horizontal" | "vertical"
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
    const itemsRef = React.useRef<HTMLDivElement[]>([])
    const [totalItems, setTotalItems] = React.useState(0)
    const selectCallbacks = React.useRef<Set<() => void>>(new Set())

    const handleScroll = React.useCallback(() => {
      if (!container) return

      const itemWidth = container.clientWidth
      const scrollLeft = container.scrollLeft
      const newIndex = Math.round(scrollLeft / itemWidth)

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalItems) {
        setCurrentIndex(newIndex)
        // Trigger select callbacks
        selectCallbacks.current.forEach(callback => callback())
      }
    }, [container?.clientWidth, container?.scrollLeft, currentIndex, totalItems])

    // Create API with stable references
    const api = React.useMemo(() => {
      const scrollToIndex = (index: number) => {
        if (opts?.loop) {
          if (index < 0) index = totalItems - 1
          if (index >= totalItems) index = 0
        } else {
          index = Math.max(0, Math.min(index, totalItems - 1))
        }

        setCurrentIndex(index)
        if (container) {
          const itemWidth = container.clientWidth
          container.scrollTo({
            left: index * itemWidth,
            behavior: 'smooth'
          })
        }
      }

      const newApi: CarouselApi = {
        scrollNext: () => scrollToIndex(currentIndex + 1),
        scrollPrev: () => scrollToIndex(currentIndex - 1),
        scrollTo: scrollToIndex,
        canScrollNext: () => opts?.loop || currentIndex < totalItems - 1,
        canScrollPrev: () => opts?.loop || currentIndex > 0,
        scrollSnapList: () => Array.from({ length: totalItems }, (_, i) => ({ index: i })),
        selectedScrollSnap: () => currentIndex,
        on: (event: string, callback: () => void) => {
          if (event === "select") {
            selectCallbacks.current.add(callback)
          }
        },
        off: (event: string, callback: () => void) => {
          if (event === "select") {
            selectCallbacks.current.delete(callback)
          }
        }
      }

      return newApi
    }, [container, opts?.loop, totalItems]) // Remove currentIndex from dependencies

    React.useEffect(() => {
      if (container && itemsRef.current.length > 0) {
        setTotalItems(itemsRef.current.length)
      }
    }, [container, children])

    // Only call setApi when the API actually changes or when totalItems is first set
    React.useEffect(() => {
      if (totalItems > 0) {
        setApi?.(api)
      }
    }, [api, setApi, totalItems])

    React.useEffect(() => {
      if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true })
        return () => container.removeEventListener('scroll', handleScroll)
      }
    }, [container, handleScroll])

    return (
      <CarouselContext.Provider value={{ api, opts, orientation }}>
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          <div
            ref={setContainer}
            className="flex overflow-hidden scroll-smooth"
            style={{ scrollSnapType: orientation === "horizontal" ? "x mandatory" : "y mandatory" }}
          >
            {React.Children.map(children, (child, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) itemsRef.current[index] = el
                }}
                className="flex-none w-full"
                style={{ scrollSnapAlign: "start" }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex", className)}
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("flex-none w-full", className)}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { api } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white disabled:opacity-50 z-10",
        className
      )}
      onClick={() => api?.scrollPrev()}
      disabled={!api?.canScrollPrev()}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { api } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white disabled:opacity-50 z-10",
        className
      )}
      onClick={() => api?.scrollNext()}
      disabled={!api?.canScrollNext()}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
