import { createContext, useContext } from 'react'
import type { BundleData } from '../types'

/**
 * Kept apart from the provider component so that file only exports components
 * and React Fast Refresh keeps working.
 */
export const BundleContext = createContext<BundleData | null>(null)

/** The catalogue, copy and seeded quantities, as served by the bundle API. */
export function useBundleData(): BundleData {
  const data = useContext(BundleContext)
  if (!data) throw new Error('useBundleData must be used inside <BundleProvider>')
  return data
}
