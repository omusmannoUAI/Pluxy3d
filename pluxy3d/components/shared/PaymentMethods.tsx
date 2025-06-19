import Image from "next/image"
import { cn } from "@/lib/utils"

interface PaymentMethod {
  id: string
  name: string
  logo: string
  width?: number
  height?: number
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "visa",
    name: "Visa",
    logo: "/visa.png",
    width: 48,
    height: 32
  },
  {
    id: "mastercard",
    name: "MasterCard",
    logo: "/mastercard.png",
    width: 48,
    height: 32
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    logo: "/mercadopago.png",
    width: 60,
    height: 32
  }
]

interface PaymentMethodsDisplayProps {
  methods?: PaymentMethod[]
  showText?: boolean
  className?: string
  title?: string
}

export function PaymentMethodsDisplay({
  methods = DEFAULT_PAYMENT_METHODS,
  showText = true,
  className = "",
  title = "Aceptamos múltiples métodos de pago"
}: PaymentMethodsDisplayProps) {
  return (
    <div className={cn("text-center", className)}>
      {showText && (
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
      )}
      <div className="flex justify-center gap-4 items-center">
        {methods.map((method) => (
          <Image
            key={method.id}
            src={method.logo}
            alt={method.name}
            width={method.width || 48}
            height={method.height || 32}
            style={{ objectFit: "contain" }}
            className="rounded"
          />
        ))}
      </div>
    </div>
  )
}

interface PaymentMethodsBadgeProps {
  count?: number
  className?: string
}

export function PaymentMethodsBadge({ 
  count = DEFAULT_PAYMENT_METHODS.length, 
  className = "" 
}: PaymentMethodsBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="flex -space-x-1">
        {DEFAULT_PAYMENT_METHODS.slice(0, 3).map((method) => (
          <div
            key={method.id}
            className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
          >
            <Image
              src={method.logo}
              alt={method.name}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        +{count} métodos de pago
      </span>
    </div>
  )
}
