import { useBundleData } from '../../data/bundleContext'
import styles from './ShippingRow.module.css'

/** Frame 1424 — the last block inside the line-items group. */
export function ShippingRow() {
  const { label, icon, compareAtPrice, price, freeLabel } = useBundleData().shipping

  return (
    <div className={styles.block}>
      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.iconBox}>
            <img src={icon} alt="" aria-hidden="true" />
          </div>
          <span className={styles.label}>{label}</span>
        </div>
        <div className={styles.priceBlock}>
          {compareAtPrice > price && (
            <span className={styles.comparePrice}>${compareAtPrice.toFixed(2)}</span>
          )}
          <span className={styles.freePrice}>
            {price === 0 ? freeLabel : `$${price.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  )
}
