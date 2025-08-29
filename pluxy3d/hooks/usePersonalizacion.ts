"use client"

import { useState, useMemo, useCallback } from "react"

export type PrinterType = "ender3-v2" | "ender3-v1"
export type ExtruderType = "kit-mejora" | "kit-doble"
export type BuildPlateType = "pei" | "glass"
export type ColorType = "black" | "blue" | "red" | "purple"
export type LedType = "white" | "rgb"

export interface AppearanceState {
  color: ColorType
  led: boolean
  ledType: LedType
  logo: boolean
  accessories: {
    toolkit: boolean
    nozzles: boolean
    filamentSample: boolean
  }
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity?: number
}

const PRINTER_PRICES: Record<PrinterType, number> = {
  "ender3-v2": 320000,
  "ender3-v1": 280000,
}

const EXTRUDER_PRICES: Record<ExtruderType, number> = {
  "kit-mejora": 22750,
  "kit-doble": 19000,
}

const BUILD_PLATE_PRICES: Record<BuildPlateType, number> = {
  "pei": 8500,
  "glass": 6000,
}

const EXTRAS_CATALOG = {
  color: 5000,
  led: 3500,
  ledRgbExtra: 1500,
  logo: 2000,
  toolkit: 4500,
  nozzles: 3000,
  filamentSample: 5000,
}

export function usePersonalizacion() {
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterType | null>(null)
  const [selectedExtruder, setSelectedExtruder] = useState<ExtruderType | null>(null)
  const [selectedBuildPlate, setSelectedBuildPlate] = useState<BuildPlateType | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [activeTab, setActiveTab] = useState<"printer" | "components" | "appearance">("printer")

  const [appearance, setAppearance] = useState<AppearanceState>({
    color: "black",
    led: false,
    ledType: "white",
    logo: false,
    accessories: {
      toolkit: false,
      nozzles: false,
      filamentSample: false,
    },
  })

  const computeExtrasPrice = useCallback(() => {
    let sum = 0
    if (appearance.color !== "black") sum += EXTRAS_CATALOG.color
    if (appearance.led) sum += EXTRAS_CATALOG.led + (appearance.ledType === "rgb" ? EXTRAS_CATALOG.ledRgbExtra : 0)
    if (appearance.logo) sum += EXTRAS_CATALOG.logo
    if (appearance.accessories.toolkit) sum += EXTRAS_CATALOG.toolkit
    if (appearance.accessories.nozzles) sum += EXTRAS_CATALOG.nozzles
    if (appearance.accessories.filamentSample) sum += EXTRAS_CATALOG.filamentSample
    return sum
  }, [appearance])

  const handlePrinterSelect = useCallback((printer: PrinterType) => {
    setSelectedPrinter(printer)
    // Reset components when changing printer
    setSelectedExtruder(null)
    setSelectedBuildPlate(null)
    // Update base price
    setTotalPrice(PRINTER_PRICES[printer])
  }, [])

  const handleExtruderSelect = useCallback((extruder: ExtruderType) => {
    setTotalPrice(prev => {
      // If same extruder is selected, deselect it
      if (selectedExtruder === extruder) {
        setSelectedExtruder(null)
        return prev - EXTRUDER_PRICES[extruder]
      } else {
        // If different extruder is selected, update selection and price
        // First remove previous extruder price if any
        let newPrice = prev
        if (selectedExtruder) {
          newPrice -= EXTRUDER_PRICES[selectedExtruder]
        }
        // Add new extruder price
        newPrice += EXTRUDER_PRICES[extruder]
        setSelectedExtruder(extruder)
        return newPrice
      }
    })
  }, [selectedExtruder])

  const handleBuildPlateSelect = useCallback((plate: BuildPlateType) => {
    setTotalPrice(prev => {
      // If same plate is selected, deselect it
      if (selectedBuildPlate === plate) {
        setSelectedBuildPlate(null)
        return prev - BUILD_PLATE_PRICES[plate]
      } else {
        // If different plate is selected, update selection and price
        // First remove previous plate price if any
        let newPrice = prev
        if (selectedBuildPlate) {
          newPrice -= BUILD_PLATE_PRICES[selectedBuildPlate]
        }
        // Add new plate price
        newPrice += BUILD_PLATE_PRICES[plate]
        setSelectedBuildPlate(plate)
        return newPrice
      }
    })
  }, [selectedBuildPlate])

  // Prepare order items for OrderSummary
  const orderItems = useMemo((): OrderItem[] => {
    const items: OrderItem[] = []

    if (selectedPrinter) {
      const printerName = selectedPrinter === "ender3-v2" ? "Creality Ender 3 V2" : "Creality Ender 3"
      const printerPrice = PRINTER_PRICES[selectedPrinter]
      items.push({ id: selectedPrinter, name: printerName, price: printerPrice, quantity: 1 })
    }

    if (selectedExtruder) {
      const extruderName = selectedExtruder === "kit-mejora" ? "Kit Mejora Ender-3" : "Kit Doble Tracción"
      const extruderPrice = EXTRUDER_PRICES[selectedExtruder]
      items.push({ id: selectedExtruder, name: extruderName, price: extruderPrice, quantity: 1 })
    }

    if (selectedBuildPlate) {
      const plateName = selectedBuildPlate === "pei" ? "Placa PEI Magnética" : "Placa de Vidrio Templado"
      const platePrice = BUILD_PLATE_PRICES[selectedBuildPlate]
      items.push({ id: selectedBuildPlate, name: plateName, price: platePrice, quantity: 1 })
    }

    // Add extras to order summary
    if (appearance.color !== "black") {
      items.push({ id: "color", name: `Color ${appearance.color.toUpperCase()}`, price: EXTRAS_CATALOG.color })
    }
    if (appearance.led) {
      items.push({
        id: "led",
        name: `Iluminación LED (${appearance.ledType === 'rgb' ? 'RGB' : 'Blanco'})`,
        price: EXTRAS_CATALOG.led + (appearance.ledType === 'rgb' ? EXTRAS_CATALOG.ledRgbExtra : 0)
      })
    }
    if (appearance.logo) {
      items.push({ id: "logo", name: "Logo Personalizado", price: EXTRAS_CATALOG.logo })
    }
    if (appearance.accessories.toolkit) {
      items.push({ id: "toolkit", name: "Kit de Herramientas", price: EXTRAS_CATALOG.toolkit })
    }
    if (appearance.accessories.nozzles) {
      items.push({ id: "nozzles", name: "Set de Boquillas de Repuesto", price: EXTRAS_CATALOG.nozzles })
    }
    if (appearance.accessories.filamentSample) {
      items.push({ id: "filament", name: "Muestras de Filamento PLA", price: EXTRAS_CATALOG.filamentSample })
    }

    return items
  }, [selectedPrinter, selectedExtruder, selectedBuildPlate, appearance])

  const orderTotal = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0)
  }, [orderItems])

  const updateAppearance = useCallback((updates: Partial<AppearanceState>) => {
    setAppearance(prev => ({ ...prev, ...updates }))
  }, [])

  const updateAccessories = useCallback((accessory: keyof AppearanceState['accessories'], value: boolean) => {
    setAppearance(prev => ({
      ...prev,
      accessories: { ...prev.accessories, [accessory]: value }
    }))
  }, [])

  return {
    // State
    selectedPrinter,
    selectedExtruder,
    selectedBuildPlate,
    totalPrice,
    activeTab,
    appearance,

    // Setters
    setActiveTab,

    // Handlers
    handlePrinterSelect,
    handleExtruderSelect,
    handleBuildPlateSelect,
    updateAppearance,
    updateAccessories,

    // Computed
    orderItems,
    orderTotal,
    computeExtrasPrice,

    // Constants
    PRINTER_PRICES,
    EXTRUDER_PRICES,
    BUILD_PLATE_PRICES,
    EXTRAS_CATALOG,
  }
}
