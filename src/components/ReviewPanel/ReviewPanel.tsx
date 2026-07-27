import { useBundleData } from '../../data/bundleContext'
import type { ReviewItem } from '../../types'
import { CategorySection } from '../CategorySection/CategorySection'
import { ShippingRow } from '../ShippingRow/ShippingRow'
import { SummaryBlock } from '../SummaryBlock/SummaryBlock'
import styles from './ReviewPanel.module.css'

interface ReviewPanelProps {
  items: ReviewItem[]
  onAdjustQuantity: (id: string, delta: number) => void
  totals: { compareTotal: number; priceTotal: number; savings: number }
  onSaveForLater: () => void
  justSaved: boolean
}

export function ReviewPanel({
  items,
  onAdjustQuantity,
  totals,
  onSaveForLater,
  justSaved,
}: ReviewPanelProps) {
  const review = useBundleData().review

  return (
    <section className={styles.section}>
      <div className={styles.stepLabelRow}>
        <span className={styles.stepLabel}>{review.stepLabel}</span>
      </div>

      <div className={styles.card}>
        {/* Frame 4499 (L3941): one column below desktop, two columns at >=1280px. */}
        <div className={styles.columns}>
          <div className={styles.itemsColumn}>
            <div className={styles.headerBlock}>
              <h2 className={styles.heading}>{review.heading}</h2>
              <p className={styles.subheading}>{review.subheading}</p>
            </div>

            <div className={styles.lineItemsGroup}>
              {review.categoryOrder.map((category) => (
                <CategorySection
                  key={category}
                  label={category}
                  wideLabel={review.categoryLabels[category]?.wide}
                  items={items.filter((item) => item.category === category)}
                  onAdjustQuantity={onAdjustQuantity}
                />
              ))}
              <ShippingRow />
            </div>
          </div>

          <SummaryBlock
            compareTotal={totals.compareTotal}
            priceTotal={totals.priceTotal}
            savings={totals.savings}
            onSaveForLater={onSaveForLater}
            justSaved={justSaved}
          />
        </div>
      </div>
    </section>
  )
}
