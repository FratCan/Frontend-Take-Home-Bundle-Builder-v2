import { useBundleData } from '../../data/bundleContext'
import styles from './ReturnsPolicy.module.css'

/**
 * Desktop-only: the satisfaction badge paired with the returns guarantee copy.
 * Below 1280px the badge is rendered by SummaryBlock instead.
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
