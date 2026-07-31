# Bundle Builder

A multi-step security-system bundle builder: a four-step accordion, and a live
review panel that reflects the configured system. The two sit side by side on a
desktop screen and stack on narrower ones — see [Responsive](#responsive).

React · TypeScript · Vite · CSS Modules, with a small Express API serving the
catalogue.

## Running it

```bash
npm install
npm run dev
```

`npm run dev` starts **two processes** at once:

| Script | Port | What it does |
| --- | --- | --- |
| `npm run dev:api` | 5181 | Express API — serves the bundle data |
| `npm run dev:web` | Vite picks one | The React app |

Vite proxies `/api/*` to the API, so everything runs on one origin. Open the URL
Vite prints (usually `http://localhost:5173`).

If the app shows *"Couldn't load your bundle"*, the API isn't running — start it
with `npm run dev:api`.

### API

| Endpoint | Response |
| --- | --- |
| `GET /api/bundle` | The full catalogue, copy and seeded quantities |
| `GET /api/health` | `{ "ok": true }` |

## Data

**Everything the app renders comes from `src/data/bundle.json`** — products,
steps, copy, prices and the quantities the bundle opens with. Nothing about the
catalogue is hardcoded in components.

```
page      page-level copy and templates
steps     the four accordion steps: title, icon, next-button wording and target
products  cards, with per-colour variants and their quantities
extras    review lines with no card of their own (currently empty)
shipping  the shipping row
review    panel headings, category order, returns copy, CTA labels, financing
```

The **initial selection is data too**: each variant carries a `quantity`, and any
variant above zero is in the bundle on first load. Edit the file and refresh —
the server reads it from disk on every request, so there's no need to restart.

### Adding a product

Append to `products` with a `stepId` matching a step. Give it a `variants` array
(one entry with `"label": null` if the product has no colour options). Cards,
review rows, step counters and totals all follow automatically.

## How it behaves

- **Per-variant quantities.** Each colour is counted separately. Adding 2 of one
  colour and switching the card to another shows `0` for the new colour while the
  first keeps its 2, and both appear as their own review lines.
- **One source of truth.** The card stepper and the review-row stepper edit the
  same state, so they can't drift apart.
- **Persistence.** *Save my system for later* writes the configuration to
  `localStorage`; reloading or returning later restores it.
- **Required items.** Products marked `locked` (the Sense Hub) render their
  stepper disabled and can't be changed.

## Responsive

| Breakpoint | Layout |
| --- | --- |
| `< 768px` | Single column, accordion above the review panel; cards lie horizontal |
| `768–1279px` | Single 1213px column — builder above, review panel below with its own two-column split; five stood-up cards per row. The page scales proportionally so an iPad shows the design's own proportions |
| `≥ 1280px` | Two columns — builder left (768px), review panel right (399px); cards lie horizontal, two per row |

Layouts were built against Figma CSS exports; the exports and the working notes
derived from them are kept out of the repository.

## Fonts

Gilroy (Regular/Medium/SemiBold/Bold/RegularItalic) and TT Norms Pro Bold are
served from `public/fonts/` and registered in `src/styles/fonts.css`. Each weight
is its own family, mirroring how the design file names them.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | API + web together |
| `npm run dev:api` | API only |
| `npm run dev:web` | Web only |
| `npm run build` | Type-check and build the frontend |
| `npm run lint` | ESLint |

## Decisions and trade-offs

**Where the design contradicted itself, the screenshot won.** The Figma CSS
exports and the reference renders disagree in a few places. The exports put the
"Next" button at `align-items: flex-end` while the render centres it; the plan
category is labelled *Home monitoring plan* on mobile but *plan* on the other two
frames. In each case the layout was built to match what the design actually looks
like, and the discrepancy noted in code.

**Two prices for the same product.** The Pan v3 card is priced $39.98 → $34.98,
but its review line reads $57.98 → $47.98 for two units, implying $23.99 each.
Both can't be true. The maths uses the review figures, because the bundle total
and savings ($238.81 → $187.89, saving $50.92) only come out right that way; the
card still displays the price the design prints on it, via a display-only
`cardDisplay` override. The visible consequence: changing that product's quantity
moves the total by $23.99, not by the $34.98 shown on the card.

**Font weights come from family names, not the exported `font-weight`.** Figma
bakes the weight into the family and exports every face as `400`. Each Gilroy
face is therefore registered as its own `@font-face` family carrying weight 400,
so the CSS reads exactly as the export does — `font-family: 'Gilroy-SemiBold';
font-weight: 400` — instead of collapsing the faces and re-deriving a weight.

**Tablet scales rather than reflows.** The tablet design is a fixed 1213px page.
Below that width the whole page is scaled down in ~5% steps instead of being
re-laid-out, so an iPad shows the design's own proportions — five cards across, a
202.6px card column. The cost is that everything is proportionally smaller on a
narrow tablet: at 768px the scale is about 63%.

**A few lines of copy are scripted.** Measured against the real Gilroy metrics,
the second line of the floodlight and doorbell descriptions comes to ~203.8px
against a 202.6px column — roughly 1.2px too wide, enough to wrap and turn two
lines into three. Those two descriptions carry their line breaks in the data and
are held together with `nowrap`, so the sliver sits inside the card's own 11px
padding and the type spec stays untouched.

**Design dimensions are floors, not fixed sizes.** Card, column and panel heights
use `min-height` rather than `height`. A fixed height looks identical when the
text fits and clips content when it doesn't; this way an unexpected extra line
grows the box instead of spilling out of it.

**The subscription card is invented.** No design exists for the plan step, so it
reuses the product card with two departures: an Add/Added toggle instead of a
stepper, because a subscription is either in the bundle or not, and no
description, because the design supplies none.

**The financing line is derived.** The design prints *as low as $19.19/mo*, which
doesn't divide out of the total by any obvious term. It is implemented as the
current total over 12 months so it responds to the bundle, which means it reads
differently from the static figure in the design.

## Not done

- **Steps 2, 3 and 4 are inferred.** Only step 1 is expanded in the Figma files,
  so the cards for the plan, the sensors and the MicroSD card were built from the
  review-panel data rather than from a design. They reuse the step-1 card with no
  description, because none is supplied for them.
- **Grey and black variant thumbnails are softer than the rest.** The only art
  supplied for those colours embeds a 48×48 bitmap; beside the 1100×1100 white
  thumbnail the difference shows on a high-DPI screen.
- **No automated tests.** Verification was manual, against the exports and the
  reference renders.
- **`npm run build` covers the frontend only.** The API is a development-time
  process; deploying it was out of scope.
