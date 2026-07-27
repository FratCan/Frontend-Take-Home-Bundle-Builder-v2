import type { ReviewItem } from '../../types'
import { QuantityStepper } from '../QuantityStepper/QuantityStepper'
import styles from './ReviewLineItem.module.css'

interface ReviewLineItemProps {
  item: ReviewItem
  onDecrease: () => void
  onIncrease: () => void
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

export function ReviewLineItem({ item, onDecrease, onIncrease }: ReviewLineItemProps) {
  const lineTotal = item.price * item.quantity
  const lineCompareAt =
    item.compareAtPrice !== null ? item.compareAtPrice * item.quantity : null

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <img className={styles.thumbnail} src={item.image} alt={item.name} />
        <span className={styles.name}>{item.name}</span>
      </div>

      <QuantityStepper
        quantity={item.quantity}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
        disabled={item.locked}
        label={item.name}
      />

      <div className={styles.priceBlock}>
        {lineCompareAt !== null && lineCompareAt > lineTotal && (
          <span className={styles.comparePrice}>{formatPrice(lineCompareAt)}</span>
        )}
        <span className={styles.activePrice}>
          {item.priceDisplay === 'free' ? 'FREE' : formatPrice(lineTotal)}
        </span>
      </div>
    </div>
  )
}
