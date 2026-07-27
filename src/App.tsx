import styles from './App.module.css'
import { useBundleData } from './data/bundleContext'
import { useBundle } from './hooks/useBundle'
import { StepAccordion } from './components/StepAccordion/StepAccordion'
import { ReviewPanel } from './components/ReviewPanel/ReviewPanel'

function App() {
  const bundle = useBundleData()
  const {
    products,
    activeVariants,
    selectVariant,
    adjustVariantQuantity,
    reviewItems,
    adjustReviewQuantity,
    selectedCountByStep,
    openStepId,
    toggleStep,
    totals,
    saveForLater,
    justSaved,
  } = useBundle()

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{bundle.page.mobileHeading}</h1>
      <div className={styles.body}>
        <StepAccordion
          products={products}
          activeVariants={activeVariants}
          onSelectVariant={selectVariant}
          onAdjustQuantity={adjustVariantQuantity}
          selectedCountByStep={selectedCountByStep}
          openStepId={openStepId}
          onToggleStep={toggleStep}
        />
        <ReviewPanel
          items={reviewItems}
          onAdjustQuantity={adjustReviewQuantity}
          totals={totals}
          onSaveForLater={saveForLater}
          justSaved={justSaved}
        />
      </div>
    </div>
  )
}

export default App
