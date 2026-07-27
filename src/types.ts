export type ReviewCategory = 'Cameras' | 'Sensors' | 'Accessories' | 'Home monitoring plan'

export type PriceDisplay = 'discounted' | 'flat' | 'free'

/**
 * `product` — thumbnail + name + stepper + line price.
 * `plan` — inline badge icon + two-tone name + flat recurring price, no stepper.
 */
export type ReviewItemLayout = 'product' | 'plan'

export interface ReviewItem {
  id: string
  category: ReviewCategory
  layout: ReviewItemLayout
  name: string
  /** Trailing part of the name rendered in brand purple (plan layout only). */
  nameAccent?: string
  image: string
  quantity: number
  /** Per-unit prices — line total is `price * quantity` (recalculated live). */
  compareAtPrice: number | null
  price: number
  priceDisplay: PriceDisplay
  /** Required/bundled items whose quantity the shopper cannot change. */
  locked: boolean
  priceSuffix?: string
}

/**
 * A selectable colour of a product. Every product has at least one; products
 * without a colour selector carry a single variant whose `label` is null.
 * Quantity always lives here so each colour is counted separately.
 */
export interface ProductVariant {
  id: string
  label: string | null
  /**
   * Width of the label's text box in px, taken from the design. Pinning it
   * keeps each chip at its intended size regardless of the rendering font, so
   * the colour row never reflows.
   */
  labelWidth: number | null
  /**
   * Fixed chip width in px, from the design. Pinning it keeps the colour row
   * at exactly the width the design gives it (65 + 63 + 65 + 2x6 gap = 205)
   * regardless of the rendering font. Tablet and desktop use the same values.
   */
  chipWidth?: number
  swatch: string | null
  /**
   * Explicit swatch box in px. Normally omitted — each swatch SVG already
   * declares the size the design gives it. Set it only when the asset's own
   * dimensions differ from the chip box it has to sit in.
   */
  swatchWidth?: number
  swatchHeight?: number
  /**
   * Image for this colour's line in the review panel. Falls back to the swatch,
   * which already pictures the product in that colour — its embedded bitmap is
   * larger than the 41px thumbnail box, so it scales up cleanly.
   */
  reviewThumbnail?: string
  quantity: number
}

/** A product card shown inside an expanded accordion step. */
export interface Product {
  id: string
  stepId: string
  category: ReviewCategory
  name: string
  /** Trailing part of the name shown in brand purple, e.g. "Cam **Unlimited**". */
  nameAccent?: string
  /** Optional — the plan card has no supporting copy in the design. */
  description?: string
  /**
   * `stepper` (default) counts units. `toggle` is for a subscription, which is
   * either in the bundle or not.
   */
  selection?: 'stepper' | 'toggle'
  /** Review-row treatment; defaults to the standard product row. */
  reviewLayout?: ReviewItemLayout
  /** Bundled item the shopper cannot add or remove, e.g. a required hub. */
  locked?: boolean
  /** Overrides the price treatment derived from `compareAtPrice`. */
  priceDisplay?: PriceDisplay
  /** Appended to prices, e.g. "/mo". */
  priceSuffix?: string
  /** Large card image used up to the desktop breakpoint. */
  image: string
  /**
   * Card image for >=1280px. The desktop design crops these differently — the
   * tablet art is portrait, the desktop art landscape — so it is a separate
   * file rather than the same asset at another size.
   */
  desktopImage: string
  /** Small square image used for the review panel line. */
  reviewThumbnail: string
  /** Discount pill copy, e.g. "Save 22%". Absent when the product has none. */
  badge?: string
  /** Unit prices — drive every review line and the bundle totals. */
  compareAtPrice: number | null
  price: number
  /**
   * Display-only override for the card's price block. The Figma file lists a
   * different price on the card than the one its review line implies for the
   * same product; where the two disagree the card shows this pair while the
   * maths keeps using `price`/`compareAtPrice`.
   */
  cardDisplay?: {
    compareAtPrice: number | null
    price: number
  }
  /**
   * Corner radius for this product's variant swatches, in px. Only some
   * products round them in the design; omit for square-cornered swatches.
   */
  swatchRadius?: number
  /** Space between the card image and its text column, in px. Defaults to 13. */
  imageGap?: number
  /**
   * Desktop-only card metrics, straight from `Frame 1736.txt`. `mediaHeight` is
   * the image box the design gives this card; `paddingY` is its vertical card
   * padding (the two bordered cards are roomier than the rest).
   */
  desktopMediaHeight?: number
  desktopPaddingY?: number
  /** Desktop text-column height in px, from the design. */
  desktopContentHeight?: number
  /**
   * Desktop price-block width in px (Frame 577). The footer is 202.6px wide
   * with an 80px stepper, so this width is what produces the export's footer
   * gap — 10px on the two bordered cards, 46px on the rest — rather than the
   * gap being set directly.
   */
  desktopPriceWidth?: number
  /** Desktop title size in px. Defaults to 18; the floodlight card uses 16. */
  desktopTitleSize?: number
  /** Desktop description size in px. Defaults to 14; one card uses 12. */
  desktopDescriptionSize?: number
  /** Desktop description weight. Defaults to 500 (Gilroy-Medium's look). */
  desktopDescriptionWeight?: number
  /**
   * Explicit desktop line breaks for the description. The design's wrap points
   * come from Gilroy's metrics; with a substitute font they land elsewhere, so
   * the cards that must match are spelled out line by line. Below the desktop
   * breakpoint the breaks are suppressed and the text flows normally.
   */
  desktopDescriptionLines?: string[]
  /**
   * Forces "Learn More" onto its own line. In the design this is just where
   * the description happens to wrap in Gilroy; with a substitute font the
   * break lands elsewhere, so the cards that need it say so explicitly.
   */
  learnMoreOnOwnLine?: boolean
  variants: ProductVariant[]
}

/**
 * Everything the app renders comes from `src/data/bundle.json`, including the
 * quantities the bundle opens with — those live on each variant, so the seeded
 * selection is data, not code.
 */
export interface BundleData {
  page: {
    mobileHeading: string
    emptyStepLabel: string
    stepLabelTemplate: string
    selectedCountTemplate: string
  }
  steps: Step[]
  products: Product[]
  /** Review lines with no card of their own yet. */
  extras: ReviewItem[]
  shipping: {
    label: string
    icon: string
    compareAtPrice: number
    price: number
    freeLabel: string
  }
  review: {
    stepLabel: string
    heading: string
    subheading: string
    categoryOrder: ReviewCategory[]
    /** Wording that changes above the tablet breakpoint. */
    categoryLabels: Partial<Record<ReviewCategory, { wide: string }>>
    returns: { heading: string; body: string; badge: string; mobileBadge: string }
    financing: { months: number; template: string }
    savingsTemplate: string
    checkout: { label: string; confirmedLabel: string }
    save: { label: string; savedLabel: string }
  }
}

export interface Step {
  id: string
  stepNumber: number
  title: string
  icon: string
  /** Icon box at the desktop breakpoint — each step has its own in the design. */
  desktopIconWidth?: number
  desktopIconHeight?: number
  /** Copy for the button that advances to the following step. */
  nextLabel?: string
  /** Step the button opens. */
  nextStepId?: string
  /**
   * Desktop wording and target for the same button. The two Figma files
   * disagree — the tablet frame says "Next: Choose your plan", the desktop one
   * "Next: Choose your sensors" — so each breakpoint keeps its own intent, and
   * the button opens whichever step its label names.
   */
  desktopNextLabel?: string
  desktopNextStepId?: string
}
