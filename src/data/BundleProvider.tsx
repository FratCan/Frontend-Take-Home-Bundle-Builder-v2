import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { BundleData } from '../types'
import { BundleContext } from './bundleContext'
import styles from './BundleProvider.module.css'

/**
 * Loads the bundle from `GET /api/bundle` and holds the app back until it
 * arrives, so nothing downstream has to reason about a half-loaded catalogue.
 */
export function BundleProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BundleData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/bundle', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Bundle API responded ${response.status}`)
        return response.json() as Promise<BundleData>
      })
      .then(setData)
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return
        setError(cause instanceof Error ? cause.message : String(cause))
      })

    return () => controller.abort()
  }, [])

  if (error) {
    return (
      <div className={styles.status} role="alert">
        <p className={styles.title}>Couldn&rsquo;t load your bundle</p>
        <p className={styles.detail}>{error}</p>
        <p className={styles.detail}>Start the API with `npm run dev:api`, then reload.</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={styles.status}>
        <p className={styles.detail}>Loading your bundle&hellip;</p>
      </div>
    )
  }

  return <BundleContext.Provider value={data}>{children}</BundleContext.Provider>
}
