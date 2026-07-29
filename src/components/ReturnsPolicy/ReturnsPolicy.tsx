import { useBundleData } from '../../data/bundleContext'
import styles from './ReturnsPolicy.module.css'

/**
 * Tablet-only: the satisfaction badge paired with the returns guarantee copy.
 * The mobile and desktop columns are too narrow for it, so there SummaryBlock
 * renders the badge on its own instead.
 */
export function ReturnsPolicy() {
  const { heading, body, badge } = useBundleData().review.returns

  return (
    <div className={styles.block}>
      <img className={styles.badge} src={badge} alt={heading} />
      <p className={styles.copy}>
        {heading}
        <span className={styles.body}>{body}</span>
      </p>
    </div>
  )
}
