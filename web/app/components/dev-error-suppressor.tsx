'use client'

import { useEffect } from 'react'

/**
 * Suppress unhandled rejection errors from Response objects in dev mode.
 * Dify's base fetch rejects with raw Response objects on 401/etc,
 * which triggers Next.js dev overlay. This is harmless — suppress it.
 */
export default function DevErrorSuppressor() {
  useEffect(() => {
    const handler = (e: PromiseRejectionEvent) => {
      if (e.reason && typeof e.reason === 'object' && typeof e.reason.status === 'number') {
        e.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', handler)
    return () => window.removeEventListener('unhandledrejection', handler)
  }, [])

  return null
}
