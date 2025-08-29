"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"

export type Estado = "Pendiente" | "Aprobada" | "Rechazada"

export interface Review {
  id: string
  producto: string
  estrellas: number
  autor: string
  email: string
  fecha: string
  texto: string
  util: number
  estado: Estado
}

export function useResenas() {
  const [items, setItems] = useState<Review[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Filters
  const [q, setQ] = useState("")
  const [estado, setEstado] = useState<"Todos" | Estado>("Todos")
  const [minStars, setMinStars] = useState(0)

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Load initial data
  useEffect(() => {
    // In a real app, this would fetch from API
    const seed: Review[] = [
      { id: "1", producto: "Creality Ender 3 V2", estrellas: 5, autor: "Juan Pérez", email: "juan@example.com", fecha: "2024-01-25", texto: "Excelente producto, muy buena calidad y llegó rápido.", util: 12, estado: "Aprobada" },
      { id: "2", producto: "Kit Mejora Ender-3", estrellas: 3, autor: "María García", email: "maria@example.com", fecha: "2024-01-24", texto: "Muy bueno, aunque la instalación fue un poco complicada.", util: 5, estado: "Pendiente" },
      { id: "3", producto: "Hellbot Magna 2", estrellas: 2, autor: "Carlos López", email: "carlos@example.com", fecha: "2024-01-23", texto: "No funcionó como esperaba, tuve varios problemas.", util: 1, estado: "Pendiente" },
    ]
    setItems(seed)
  }, [])

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase()
    return items
      .filter((r) => (estado === "Todos" ? true : r.estado === estado))
      .filter((r) => (minStars > 0 ? r.estrellas >= minStars : true))
      .filter((r) => (lower ? r.producto.toLowerCase().includes(lower) || r.autor.toLowerCase().includes(lower) || r.email.toLowerCase().includes(lower) : true))
      .slice()
      .sort((a, b) => (a.fecha > b.fecha ? -1 : 1))
  }, [items, q, estado, minStars])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageClamped = Math.min(page, totalPages)
  const pageItems = useMemo(() => {
    const start = (pageClamped - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, pageClamped, pageSize])

  // Actions
  const approve = useCallback((id: string) => {
    setItems((arr) => arr.map((r) => (r.id === id ? { ...r, estado: "Aprobada" } : r)))
  }, [])

  const reject = useCallback((id: string) => {
    setItems((arr) => arr.map((r) => (r.id === id ? { ...r, estado: "Rechazada" } : r)))
  }, [])

  const remove = useCallback((id: string) => {
    setItems((arr) => arr.filter((r) => r.id !== id))
  }, [])

  // Selection handlers
  const toggleOne = useCallback((id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const pageIds = useMemo(() => pageItems.map((r) => r.id), [pageItems])
  const selectedOnPageCount = pageIds.filter((id) => selected.has(id)).length
  const allOnPageSelected = selectedOnPageCount === pageIds.length && pageIds.length > 0
  const noneOnPageSelected = selectedOnPageCount === 0
  const masterChecked: boolean | "indeterminate" = allOnPageSelected ? true : noneOnPageSelected ? false : "indeterminate"

  const togglePageAll = useCallback((checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) pageIds.forEach((id) => next.add(id))
      else pageIds.forEach((id) => next.delete(id))
      return next
    })
  }, [pageIds])

  const clearSelection = useCallback(() => setSelected(new Set()), [])

  const approveSelected = useCallback(() => {
    if (selected.size === 0) return
    setItems((arr) => arr.map((r) => (selected.has(r.id) ? { ...r, estado: "Aprobada" } : r)))
    clearSelection()
  }, [selected, clearSelection])

  const rejectSelected = useCallback(() => {
    if (selected.size === 0) return
    setItems((arr) => arr.map((r) => (selected.has(r.id) ? { ...r, estado: "Rechazada" } : r)))
    clearSelection()
  }, [selected, clearSelection])

  const deleteSelected = useCallback(() => {
    if (selected.size === 0) return
    setItems((arr) => arr.filter((r) => !selected.has(r.id)))
    setConfirmOpen(false)
    clearSelection()
  }, [selected, clearSelection])

  // Reset page on filters
  useEffect(() => {
    setPage(1)
    clearSelection()
  }, [q, estado, minStars, clearSelection])

  const pendingCount = useMemo(() => items.filter((r) => r.estado === "Pendiente").length, [items])
  const approvedCount = useMemo(() => items.filter((r) => r.estado === "Aprobada").length, [items])

  return {
    // Data
    items,
    filtered,
    pageItems,
    selected,
    confirmOpen,
    setConfirmOpen,

    // Filters
    q,
    setQ,
    estado,
    setEstado,
    minStars,
    setMinStars,

    // Pagination
    page: pageClamped,
    setPage,
    pageSize,
    setPageSize,
    totalPages,

    // Selection
    selectedOnPageCount,
    masterChecked,
    togglePageAll,
    toggleOne,
    clearSelection,

    // Actions
    approve,
    reject,
    remove,
    approveSelected,
    rejectSelected,
    deleteSelected,

    // Stats
    pendingCount,
    approvedCount,
  }
}
