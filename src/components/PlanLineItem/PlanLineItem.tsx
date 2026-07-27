import type { ReviewItem } from '../../types'
import styles from './PlanLineItem.module.css'

interface PlanLineItemProps {
  item: ReviewItem
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

/**
 * Recurring plan row: an inline badge icon and two-tone name on the left, the
 * flat monthly price on the right. Unlike a product row it has no stepper and
 * its price is not multiplied by a quantity.
 */
export function PlanLineItem({ item }: PlanLineItemProps) {
  const suffix = item.priceSuffix ?? ''

  return (
    <div className={styles.row}>
      <div className={styles.planInfo}>
        <img className={styles.icon} src={item.image} alt="" aria-hidden="true" />
        <span className={styles.name}>
          {item.name}
          {item.nameAccent && <span className={styles.nameAccent}> {item.nameAccent}</span>}
        </span>
      </div>

      <div className={styles.priceBlock}>
        {item.compareAtPrice !== null && item.compareAtPrice > item.price && (
          <span className={styles.comparePrice}>
            {formatPrice(item.compareAtPrice)}
            {suffix}
          </span>
        )}
        <span className={styles.activePrice}>
          {formatPrice(item.price)}
          {suffix}
        </span>
      </div>
    </div>
  )
}
