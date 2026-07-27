import { useBundleData } from '../../data/bundleContext'
import { DESKTOP_QUERY, useMediaQuery } from '../../hooks/useMediaQuery'
import type { Product } from '../../types'
import { ProductCard } from '../ProductCard/ProductCard'
import { StepSection } from './StepSection'
import styles from './StepAccordion.module.css'

interface StepAccordionProps {
  products: Product[]
  activeVariants: Record<string, string>
  onSelectVariant: (productId: string, variantId: string) => void
  onAdjustQuantity: (productId: string, variantId: string, delta: number) => void
  selectedCountByStep: Record<string, number>
  openStepId: string | null
  onToggleStep: (stepId: string) => void
}

export function StepAccordion({
  products,
  activeVariants,
  onSelectVariant,
  onAdjustQuantity,
  selectedCountByStep,
  openStepId,
  onToggleStep,
}: StepAccordionProps) {
  const bundle = useBundleData()
  const steps = bundle.steps
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  return (
    <div className={styles.accordion}>
      {steps.map((step) => {
        const stepProducts = products.filter((product) => product.stepId === step.id)
        // The button's wording and its target move together per breakpoint.
        const nextLabel = isDesktop ? (step.desktopNextLabel ?? step.nextLabel) : step.nextLabel
        const nextStepId = isDesktop
          ? (step.desktopNextStepId ?? step.nextStepId)
          : step.nextStepId

        return (
          <StepSection
            key={step.id}
            step={step}
            selectedCount={selectedCountByStep[step.id] ?? 0}
            isOpen={openStepId === step.id}
            onToggle={() => onToggleStep(step.id)}
          >
            {stepProducts.length > 0 ? (
              <div className={styles.cardArea}>
                <div className={styles.cardGrid}>
                  {stepProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      activeVariantId={activeVariants[product.id]}
                      onSelectVariant={(variantId) => onSelectVariant(product.id, variantId)}
                      onAdjustQuantity={(variantId, delta) =>
                        onAdjustQuantity(product.id, variantId, delta)
                      }
                    />
                  ))}
                </div>
                {nextLabel && nextStepId && (
                  <button
                    type="button"
                    className={styles.nextButton}
                    onClick={() => onToggleStep(nextStepId)}
                  >
                    {nextLabel}
                  </button>
                )}
              </div>
            ) : (
              /* Steps 2–4 have no card data yet — that scope comes later. */
              <p className={styles.emptyPanel}>{bundle.page.emptyStepLabel}</p>
            )}
          </StepSection>
        )
      })}
    </div>
  )
}
