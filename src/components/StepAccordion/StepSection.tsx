import type { CSSProperties, ReactNode } from 'react'
import { useBundleData } from '../../data/bundleContext'
import type { Step } from '../../types'
import styles from './StepSection.module.css'

interface StepSectionProps {
  step: Step
  selectedCount: number
  isOpen: boolean
  onToggle: () => void
  children?: ReactNode
}

export function StepSection({
  step,
  selectedCount,
  isOpen,
  onToggle,
  children,
}: StepSectionProps) {
  const bundle = useBundleData()
  const panelId = `step-panel-${step.id}`

  return (
    <section
      className={`${styles.section} ${isOpen ? styles.open : ''}`}
      style={
        {
          '--step-icon-width': step.desktopIconWidth
            ? `${step.desktopIconWidth}px`
            : undefined,
          '--step-icon-height': step.desktopIconHeight
            ? `${step.desktopIconHeight}px`
            : undefined,
        } as CSSProperties
      }
    >
      <div className={styles.stepLabelRow}>
        <span className={styles.stepLabel}>{bundle.page.stepLabelTemplate.replace('{n}', String(step.stepNumber)).replace('{total}', String(bundle.steps.length))}</span>
      </div>

      <button
        type="button"
        className={styles.header}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className={styles.titleGroup}>
          <img className={styles.icon} src={step.icon} alt="" aria-hidden="true" />
          <span className={styles.title}>{step.title}</span>
        </span>
        <span className={styles.counterGroup}>
          <span className={styles.selectedCount}>{bundle.page.selectedCountTemplate.replace('{n}', String(selectedCount))}</span>
          <svg
            className={`${styles.chevron} ${isOpen ? '' : styles.collapsed}`}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/*
              A 10x7 triangle inside the 12x12 icon box, seated at (1, 2) as the
              design has it. Rotating the box 180° for the collapsed state lands
              it at (1, 3), which is exactly where the down-chevron sits.
            */}
            <path d="M6 2L11 9H1L6 2Z" fill="currentColor" />
          </svg>
        </span>
      </button>

      {isOpen && children && (
        <div className={styles.panel} id={panelId}>
          {children}
        </div>
      )}
    </section>
  )
}
