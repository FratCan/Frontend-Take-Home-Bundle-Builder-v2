import { Fragment } from 'react'
import type { CSSProperties } from 'react'
import type { Product } from '../../types'
import { CardStepper } from '../CardStepper/CardStepper'
import { VariantChips } from '../VariantChips/VariantChips'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  activeVariantId: string
  onSelectVariant: (variantId: string) => void
  onAdjustQuantity: (variantId: string, delta: number) => void
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

export function ProductCard({
  product,
  activeVariantId,
  onSelectVariant,
  onAdjustQuantity,
}: ProductCardProps) {
  const activeVariant =
    product.variants.find((variant) => variant.id === activeVariantId) ?? product.variants[0]
  // Selection is per product: any colour in the bundle highlights the card.
  const isSelected = product.variants.some((variant) => variant.quantity > 0)
  const hasVariantSelector = product.variants.length > 1
  // Falls back to the real unit prices unless the design overrides the card.
  const shownPrices = product.cardDisplay ?? product

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      style={
        {
          ...(product.imageGap ? { gap: `${product.imageGap}px` } : null),
          ...(product.cardMediaHeight
            ? { '--card-media-height': `${product.cardMediaHeight}px` }
            : null),
          ...(product.cardPaddingY
            ? { '--card-padding-y': `${product.cardPaddingY}px` }
            : null),
          ...(product.cardDescriptionSize
            ? { '--card-description-size': `${product.cardDescriptionSize}px` }
            : null),
          ...(product.cardContentHeight
            ? { '--card-content-height': `${product.cardContentHeight}px` }
            : null),
          ...(product.cardTitleSize
            ? { '--card-title-size': `${product.cardTitleSize}px` }
            : null),
          ...(product.cardPriceWidth
            ? { '--card-price-width': `${product.cardPriceWidth}px` }
            : null),
        } as CSSProperties
      }
    >
      <div className={styles.media}>
        <picture>
          {/* Only the tablet range stands the card up and needs the portrait crop. */}
          <source
            media="(min-width: 768px) and (max-width: 1279px)"
            srcSet={encodeURI(product.tabletImage)}
          />
          <img className={styles.image} src={product.image} alt={product.name} />
        </picture>
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
      </div>

      <div className={styles.content}>
        <div className={styles.heading}>
          <h3 className={styles.title}>
            {product.name}
            {product.nameAccent && (
              <span className={styles.titleAccent}> {product.nameAccent}</span>
            )}
          </h3>
          {product.description && (
            <p className={styles.description}>
              {product.scriptedDescriptionLines
                ? product.scriptedDescriptionLines.map((line, index) => (
                    <Fragment key={line}>
                      {index > 0 && <br className={styles.scriptedBreak} />}
                      <span className={styles.forcedLine}>{line}</span>
                      {index < product.scriptedDescriptionLines!.length - 1 && ' '}
                    </Fragment>
                  ))
                : product.description}
              {product.learnMoreOnOwnLine ? <br /> : ' '}
              <a className={styles.learnMore} href="#learn-more">
                Learn More
              </a>
            </p>
          )}
        </div>

        {hasVariantSelector && (
          <VariantChips
            variants={product.variants}
            activeVariantId={activeVariant.id}
            onSelect={onSelectVariant}
            productName={product.name}
            swatchRadius={product.swatchRadius}
          />
        )}

        <div
          className={`${styles.footer} ${
            product.selection === 'toggle' ? styles.footerToggle : ''
          }`}
        >
          {product.selection === 'toggle' ? (
            /* A subscription is in the bundle or it isn't — no unit count. */
            <button
              type="button"
              className={`${styles.toggle} ${isSelected ? styles.toggleOn : ''}`}
              onClick={() => onAdjustQuantity(activeVariant.id, isSelected ? -1 : 1)}
              aria-pressed={isSelected}
            >
              {isSelected ? 'Added' : 'Add'}
            </button>
          ) : (
            <CardStepper
              quantity={activeVariant.quantity}
              onDecrease={() => onAdjustQuantity(activeVariant.id, -1)}
              onIncrease={() => onAdjustQuantity(activeVariant.id, 1)}
              disabled={product.locked}
              label={
                activeVariant.label ? `${product.name} ${activeVariant.label}` : product.name
              }
            />
          )}
          <div className={styles.priceBlock}>
            {shownPrices.compareAtPrice !== null && (
              <span className={styles.comparePrice}>
                {formatPrice(shownPrices.compareAtPrice)}
                {product.priceSuffix}
              </span>
            )}
            <span className={styles.activePrice}>
              {product.priceDisplay === 'free' ? 'FREE' : formatPrice(shownPrices.price)}
              {product.priceDisplay === 'free' ? '' : product.priceSuffix}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
