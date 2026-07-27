import { useCallback, useMemo, useState } from 'react'
import { useBundleData } from '../data/bundleContext'
import type { BundleData, Product, ReviewItem } from '../types'

const STORAGE_KEY = 'bundle-builder:saved-system'

interface SavedSystem {
  /** `${productId}:${variantId}` -> quantity */
  variants?: Record<string, number>
  /** `${itemId}` -> quantity */
  extras?: Record<string, number>
  /** Which variant each product card currently has selected. */
  activeVariants?: Record<string, string>
}

function readSaved(): SavedSystem | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedSystem) : null
  } catch {
    return null
  }
}

function buildInitialProducts(bundle: BundleData, saved: SavedSystem | null): Product[] {
  const products = bundle.products
  if (!saved?.variants) return products
  return products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => {
      const key = `${product.id}:${variant.id}`
      return key in saved.variants! ? { ...variant, quantity: saved.variants![key] } : variant
    }),
  }))
}

function buildInitialExtras(bundle: BundleData, saved: SavedSystem | null): ReviewItem[] {
  const extras = bundle.extras
  if (!saved?.extras) return extras
  return extras.map((item) =>
    item.id in saved.extras! ? { ...item, quantity: saved.extras![item.id] } : item,
  )
}

function buildInitialActiveVariants(products: Product[], saved: SavedSystem | null) {
  const active: Record<string, string> = {}
  for (const product of products) {
    const savedId = saved?.activeVariants?.[product.id]
    const isValid = savedId && product.variants.some((v) => v.id === savedId)
    // Default to the first variant that already has a quantity, so the card
    // opens showing the colour the shopper actually has in their bundle.
    const seeded = product.variants.find((v) => v.quantity > 0)
    active[product.id] = isValid ? savedId : (seeded?.id ?? product.variants[0].id)
  }
  return active
}

export function useBundle() {
  const bundle = useBundleData()
  const [saved] = useState(readSaved)
  const [products, setProducts] = useState<Product[]>(() => buildInitialProducts(bundle, saved))
  const [extras, setExtras] = useState<ReviewItem[]>(() => buildInitialExtras(bundle, saved))
  const [activeVariants, setActiveVariants] = useState<Record<string, string>>(() =>
    buildInitialActiveVariants(buildInitialProducts(bundle, saved), saved),
  )
  // The bundle opens on the first step listed in the data.
  const [openStepId, setOpenStepId] = useState<string | null>(bundle.steps[0]?.id ?? null)
  const [justSaved, setJustSaved] = useState(false)

  const selectVariant = useCallback((productId: string, variantId: string) => {
    setActiveVariants((current) => ({ ...current, [productId]: variantId }))
  }, [])

  const adjustVariantQuantity = useCallback(
    (productId: string, variantId: string, delta: number) => {
      setProducts((current) =>
        current.map((product) =>
          // Required items keep their seeded quantity, mirroring adjustExtraQuantity.
          product.id === productId && !product.locked
            ? {
                ...product,
                variants: product.variants.map((variant) =>
                  variant.id === variantId
                    ? { ...variant, quantity: Math.max(0, variant.quantity + delta) }
                    : variant,
                ),
              }
            : product,
        ),
      )
    },
    [],
  )

  const adjustExtraQuantity = useCallback((id: string, delta: number) => {
    setExtras((current) =>
      current.map((item) =>
        item.id === id && !item.locked
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item,
      ),
    )
  }, [])

  const toggleStep = useCallback((stepId: string) => {
    setOpenStepId((current) => (current === stepId ? null : stepId))
  }, [])

  /**
   * Review lines for products: one line per variant with a quantity above zero.
   * The variant name is only appended when more than one colour of the same
   * product is active, so a single-colour bundle reads as the design does.
   */
  const productReviewItems = useMemo<ReviewItem[]>(() => {
    const lines: ReviewItem[] = []
    for (const product of products) {
      const active = product.variants.filter((variant) => variant.quantity > 0)
      const showVariantName = active.length > 1
      for (const variant of active) {
        lines.push({
          id: `${product.id}:${variant.id}`,
          category: product.category,
          layout: product.reviewLayout ?? 'product',
          name:
            showVariantName && variant.label
              ? `${product.name} (${variant.label})`
              : product.name,
          nameAccent: product.nameAccent,
          // Show the colour the shopper actually picked, not the default one.
          image: variant.reviewThumbnail ?? variant.swatch ?? product.reviewThumbnail,
          quantity: variant.quantity,
          compareAtPrice: product.compareAtPrice,
          price: product.price,
          priceDisplay:
            product.priceDisplay ?? (product.compareAtPrice === null ? 'flat' : 'discounted'),
          locked: product.locked ?? false,
          priceSuffix: product.priceSuffix,
        })
      }
    }
    return lines
  }, [products])

  const reviewItems = useMemo(
    () => [...productReviewItems, ...extras],
    [productReviewItems, extras],
  )

  const adjustReviewQuantity = useCallback(
    (id: string, delta: number) => {
      // Product lines carry a composite `productId:variantId` id.
      const separator = id.indexOf(':')
      if (separator !== -1) {
        adjustVariantQuantity(id.slice(0, separator), id.slice(separator + 1), delta)
        return
      }
      adjustExtraQuantity(id, delta)
    },
    [adjustVariantQuantity, adjustExtraQuantity],
  )

  /** Distinct products with at least one variant selected, per step. */
  const selectedCountByStep = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const product of products) {
      const hasSelection = product.variants.some((variant) => variant.quantity > 0)
      if (!hasSelection) continue
      counts[product.stepId] = (counts[product.stepId] ?? 0) + 1
    }
    return counts
  }, [products])

  const totals = useMemo(() => {
    let compareTotal = 0
    let priceTotal = 0
    for (const item of reviewItems) {
      compareTotal += (item.compareAtPrice ?? item.price) * item.quantity
      priceTotal += item.price * item.quantity
    }
    return { compareTotal, priceTotal, savings: Math.max(0, compareTotal - priceTotal) }
  }, [reviewItems])

  const saveForLater = useCallback(() => {
    const payload: SavedSystem = {
      variants: Object.fromEntries(
        products.flatMap((product) =>
          product.variants.map(
            (variant) => [`${product.id}:${variant.id}`, variant.quantity] as const,
          ),
        ),
      ),
      extras: Object.fromEntries(extras.map((item) => [item.id, item.quantity])),
      activeVariants,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 2000)
  }, [products, extras, activeVariants])

  return {
    products,
    activeVariants,
    selectVariant,
    adjustVariantQuantity,
    reviewItems,
    adjustReviewQuantity,
    selectedCountByStep,
    openStepId,
    toggleStep,
    totals,
    saveForLater,
    justSaved,
  }
}
