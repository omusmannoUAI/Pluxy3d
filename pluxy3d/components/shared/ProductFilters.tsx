"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter } from "lucide-react"
import { formatPriceSimple } from "@/lib/helpers"

interface FilterOption {
  id: string
  label: string
  count?: number
  disabled?: boolean
}

interface CheckboxFilterProps {
  title: string
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  className?: string
}

export function CheckboxFilter({
  title,
  options,
  selectedValues,
  onChange,
  className = ""
}: CheckboxFilterProps) {
  const handleChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, optionId])
    } else {
      onChange(selectedValues.filter(id => id !== optionId))
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-medium">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedValues.includes(option.id)}
              disabled={option.disabled}
              onCheckedChange={(checked) => handleChange(option.id, !!checked)}
            />
            <Label 
              htmlFor={option.id}
              className={option.disabled ? "text-muted-foreground" : "cursor-pointer"}
            >
              {option.label}
              {option.count && (
                <span className="ml-1 text-muted-foreground">({option.count})</span>
              )}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

interface PriceRangeFilterProps {
  min: number
  max: number
  value: [number]
  onChange: (value: [number]) => void
  step?: number
  className?: string
}

export function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
  step = 1000,
  className = ""
}: PriceRangeFilterProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-medium">Rango de Precio</h3>
      <Slider
        value={value}
        onValueChange={onChange}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm">{formatPriceSimple(min)}</span>
        <span className="text-sm font-medium">{formatPriceSimple(value[0])}</span>
        <span className="text-sm">{formatPriceSimple(max)}</span>
      </div>
    </div>
  )
}

interface ProductFiltersProps {
  categories: FilterOption[]
  brands: FilterOption[]
  selectedCategories: string[]
  selectedBrands: string[]
  priceRange: [number]
  maxPrice: number
  onCategoriesChange: (categories: string[]) => void
  onBrandsChange: (brands: string[]) => void
  onPriceRangeChange: (range: [number]) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  className?: string
}

export function ProductFilters({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  maxPrice,
  onCategoriesChange,
  onBrandsChange,
  onPriceRangeChange,
  onApplyFilters,
  onClearFilters,
  className = ""
}: ProductFiltersProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <CheckboxFilter
          title="Categorías"
          options={categories}
          selectedValues={selectedCategories}
          onChange={onCategoriesChange}
        />
        
        <CheckboxFilter
          title="Marcas"
          options={brands}
          selectedValues={selectedBrands}
          onChange={onBrandsChange}
        />
        
        <PriceRangeFilter
          min={0}
          max={maxPrice}
          value={priceRange}
          onChange={onPriceRangeChange}
        />
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button onClick={onApplyFilters} className="flex-1">
          Aplicar Filtros
        </Button>
        <Button variant="outline" onClick={onClearFilters}>
          Limpiar
        </Button>
      </CardFooter>
    </Card>
  )
}
