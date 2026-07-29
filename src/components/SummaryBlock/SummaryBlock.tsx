import { useState } from 'react'
import { useBundleData } from '../../data/bundleContext'
import { ReturnsPolicy } from '../ReturnsPolicy/ReturnsPolicy'
import styles from './SummaryBlock.module.css'

interface SummaryBlockProps {
  compareTotal: number
  priceTotal: number
  savings: number
  onSaveForLater: () => void
  justSaved: boolean
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

/** Fills `{amount}` in a copy template from the data file. */
function fillAmount(template: string, value: number) {
  return template.replace('{amount}', formatPrice(value))
}

export function SummaryBlock({
  compareTotal,
  priceTotal,
  savings,
  onSaveForLater,
  justSaved,
}: SummaryBlockProps) {
  const [checkoutConfirmed, setCheckoutConfirmed] = useState(false)
  const { returns, financing, savingsTemplate, checkout, save } = useBundleData().review
  // Illustrative instalment estimate: the current total split over N months.
  const financingPerMonth = priceTotal / financing.months

  return (
    <div className={styles.summary}>
      <div className={styles.pricingArea}>
        {/* display:contents elsewhere, so it only groups on the tablet frame. */}
        <div className={styles.topArea}>
          <ReturnsPolicy />
          <div className={styles.satisfactionRow}>
            <img className={styles.badge} src={returns.mobileBadge} alt={returns.heading} />
            <div className={styles.pricingSummary}>
              <span className={styles.financingPill}>
                {fillAmount(financing.template, financingPerMonth)}
              </span>
              <div className={styles.totalRow}>
                {compareTotal > priceTotal && (
                  <span className={styles.totalCompare}>{formatPrice(compareTotal)}</span>
                )}
                <span className={styles.totalActive}>{formatPrice(priceTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.checkoutArea}>
          {savings > 0 && (
            <p className={styles.savingsCallout}>{fillAmount(savingsTemplate, savings)}</p>
          )}

          <button
            type="button"
            className={styles.checkoutButton}
            onClick={() => {
              setCheckoutConfirmed(true)
              window.setTimeout(() => setCheckoutConfirmed(false), 2000)
            }}
          >
            {checkoutConfirmed ? checkout.confirmedLabel : checkout.label}
          </button>
        </div>
      </div>

      <button type="button" className={styles.saveLink} onClick={onSaveForLater}>
        {justSaved ? save.savedLabel : save.label}
      </button>
    </div>
  )
}
