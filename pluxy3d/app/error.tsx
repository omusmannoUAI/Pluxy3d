"use client"

import { useEffect } from "react"
import ErrorPage from "@/components/ErrorPage"
import logger from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error("Application error:", error)
  }, [error])

  return <ErrorPage error={error} reset={reset} />
}
