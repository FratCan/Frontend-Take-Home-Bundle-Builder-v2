import type { ProductVariant } from '../../types'
import styles from './VariantChips.module.css'

interface VariantChipsProps {
  variants: ProductVariant[]
  activeVariantId: string
  onSelect: (variantId: string) => void
  productName: string
  swatchRadius?: number
}

export function VariantChips({
  variants,
  activeVariantId,
  onSelect,
  productName,
  swatchRadius,
}: VariantChipsProps) {
  return (
    <div className={styles.chips} role="group" aria-label={`${productName} colour`}>
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId
        return (
          <button
            key={variant.id}
            type="button"
            className={`${styles.chip} ${isActive ? styles.active : ''}`}
            onClick={() => onSelect(variant.id)}
            aria-pressed={isActive}
            style={variant.chipWidth ? { width: `${variant.chipWidth}px` } : undefined}
          >
            {variant.swatch && (
              <img
                className={styles.swatch}
                src={variant.swatch}
                alt=""
                aria-hidden="true"
                style={{
                  borderRadius: swatchRadius ? `${swatchRadius}px` : undefined,
                  width: variant.swatchWidth ? `${variant.swatchWidth}px` : undefined,
                  height: variant.swatchHeight ? `${variant.swatchHeight}px` : undefined,
                  objectFit: variant.swatchWidth ? 'contain' : undefined,
                }}
              />
            )}
            <span
              className={styles.label}
              style={variant.labelWidth ? { width: `${variant.labelWidth}px` } : undefined}
            >
              {variant.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
