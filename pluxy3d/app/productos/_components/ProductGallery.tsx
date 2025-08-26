"use client"

import { useState } from "react"
import Image from "next/image"

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const validImages = images && images.length > 0 ? images : ["/placeholder.svg"]
  const [index, setIndex] = useState(0)

  const current = validImages[Math.min(index, validImages.length - 1)]

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted">
        <Image src={current || "/placeholder.svg"} alt={alt} fill className="object-cover" />
      </div>
      {validImages.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {validImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setIndex(i)}
              className={`relative w-full aspect-[4/3] rounded-md overflow-hidden border bg-muted ${i === index ? 'ring-2 ring-purple-500' : ''}`}
            >
              <Image src={src || "/placeholder.svg"} alt={`${alt} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
