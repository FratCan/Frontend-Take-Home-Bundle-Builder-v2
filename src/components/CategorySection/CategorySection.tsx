import type { ReviewItem } from '../../types'
import { PlanLineItem } from '../PlanLineItem/PlanLineItem'
import { ReviewLineItem } from '../ReviewLineItem/ReviewLineItem'
import styles from './CategorySection.module.css'

interface CategorySectionProps {
  label: string
  /** Shorter wording used from the tablet breakpoint up, where the design differs. */
  wideLabel?: string
  items: ReviewItem[]
  onAdjustQuantity: (id: string, delta: number) => void
}

export function CategorySection({
  label,
  wideLabel,
  items,
  onAdjustQuantity,
}: CategorySectionProps) {
  if (items.length === 0) return null

  return (
    <div className={styles.section}>
      <span className={styles.label}>
        <span className={wideLabel ? styles.narrowOnly : undefined}>{label}</span>
        {wideLabel && <span className={styles.wideOnly}>{wideLabel}</span>}
      </span>
      <div className={styles.list}>
        {items.map((item) =>
          item.layout === 'plan' ? (
            <PlanLineItem key={item.id} item={item} />
          ) : (
            <ReviewLineItem
              key={item.id}
              item={item}
              onDecrease={() => onAdjustQuantity(item.id, -1)}
              onIncrease={() => onAdjustQuantity(item.id, 1)}
            />
          ),
        )}
      </div>
    </div>
  )
}
