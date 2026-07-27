import styles from './CardStepper.module.css'

interface CardStepperProps {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  label: string
  /** Required items show the control but cannot be changed. */
  disabled?: boolean
}

export function CardStepper({
  quantity,
  onDecrease,
  onIncrease,
  label,
  disabled = false,
}: CardStepperProps) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.button}
        onClick={onDecrease}
        disabled={disabled || quantity === 0}
        aria-label={`Decrease quantity of ${label}`}
      >
        <svg viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <span className={styles.quantity}>{quantity}</span>
      <button
        type="button"
        className={styles.button}
        onClick={onIncrease}
        disabled={disabled}
        aria-label={`Increase quantity of ${label}`}
      >
        <svg viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0V8M0 4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
