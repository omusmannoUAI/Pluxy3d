"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { isValidEmail, isValidPhone } from "@/lib/helpers"
import { useState } from "react"

interface FormFieldProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  error?: string
  className?: string
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value = "",
  onChange,
  required = false,
  error,
  className = ""
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

interface FormTextareaProps {
  id: string
  label: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  error?: string
  rows?: number
  className?: string
}

export function FormTextarea({
  id,
  label,
  placeholder,
  value = "",
  onChange,
  required = false,
  error,
  rows = 3,
  className = ""
}: FormTextareaProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        rows={rows}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

interface EmailFieldProps extends Omit<FormFieldProps, 'type'> {
  onValidationChange?: (isValid: boolean) => void
}

export function EmailField({ onValidationChange, ...props }: EmailFieldProps) {
  const [internalError, setInternalError] = useState<string>("")

  const handleChange = (value: string) => {
    props.onChange?.(value)
    
    if (value && !isValidEmail(value)) {
      setInternalError("Formato de email inválido")
      onValidationChange?.(false)
    } else {
      setInternalError("")
      onValidationChange?.(true)
    }
  }

  return (
    <FormField
      {...props}
      type="email"
      onChange={handleChange}
      error={props.error || internalError}
    />
  )
}

interface PhoneFieldProps extends Omit<FormFieldProps, 'type'> {
  onValidationChange?: (isValid: boolean) => void
}

export function PhoneField({ onValidationChange, ...props }: PhoneFieldProps) {
  const [internalError, setInternalError] = useState<string>("")

  const handleChange = (value: string) => {
    props.onChange?.(value)
    
    if (value && !isValidPhone(value)) {
      setInternalError("Formato de teléfono inválido")
      onValidationChange?.(false)
    } else {
      setInternalError("")
      onValidationChange?.(true)
    }
  }

  return (
    <FormField
      {...props}
      type="tel"
      onChange={handleChange}
      error={props.error || internalError}
      placeholder={props.placeholder || "+56 9 1234 5678"}
    />
  )
}
