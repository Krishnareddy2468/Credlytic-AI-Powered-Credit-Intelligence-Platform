# Credlytic Design System

Status: Approved and locked

The current Credlytic landing page is the visual reference implementation. Future product interfaces must inherit this system rather than reinterpret it. A screen should feel recognizably Credlytic even when the logo is absent.

## Vision And Mission

**Vision:** Become India's most trusted credit intelligence layer -- the platform every Indian consults before making a credit decision.

**Mission:** Eliminate blind credit card applications in India by giving every consumer access to AI-powered eligibility prediction, real-time bank policy intelligence, and personalized financial guidance.

## Brand Hierarchy

- Brand: `Credlytic`
- Category: `Credit intelligence`
- Corporate tagline: `Credit analytics, powered by AI.`
- Consumer promise: `Know your odds before you apply.`
- Primary CTA: `Check my eligibility`
- Secondary CTA: `Explore cards`
- Trust phrase: `No hard inquiry · No credit-score impact`

Do not display every line of the hierarchy at once. The consumer promise leads marketing experiences. Product interfaces prioritize the user's current decision and next action.

## Brand Character

Credlytic is calm, analytical, premium, trustworthy, privacy-conscious, modern, and financially credible. It must not resemble an affiliate marketplace, crypto dashboard, generic admin template, student project, or CRED clone.

Every visual must help the user:

- Understand
- Compare
- Decide
- Improve

## Permanent Signatures

### Midnight Intelligence Surfaces

Near-black and deep navy establish the primary product environment. Elevated surfaces are separated by one-pixel architectural borders, not heavy shadows or broad gradients.

### Cool Editorial Surfaces

Light storytelling sections use cool blue-gray paper. Never use pure white as a large page band and never introduce cream, beige, sand, or warm editorial backgrounds.

### Intelligence Orbit

Concentric or orbital geometry represents profile -> card -> intelligence. Use it selectively for major decision moments, profile context, and relationship visualization. Do not place an orbit on every screen.

### Credlytic Signal Line

A one-pixel blue-to-cyan line represents intelligence moving through the product. Use it for Intelligence Index labels, eligibility paths, policy context, selected states, and transitions. It may draw once, then remain still.

### Intelligence Index

Editorial section labels follow `01 / THE PROBLEM`: uppercase, compact, sans-serif, and paired with the Signal Line. They establish structure without competing with the headline.

## Color Tokens

### Fixed Palette

| Token | CSS variable | Tailwind | Value | Use |
| --- | --- | --- | --- | --- |
| Night | `--cl-night` | `credlytic-night` | `#03070D` | Deepest landing canvas |
| Midnight | `--cl-midnight` | `credlytic-midnight` | `#050910` | Primary dark environment |
| Sidebar | `--cl-sidebar` | `credlytic-sidebar` | `#050C16` | Persistent navigation |
| Navy 950 | `--cl-navy-950` | `credlytic-navy-950` | `#07101D` | Product canvas / dark panel |
| Navy 900 | `--cl-navy-900` | `credlytic-navy-900` | `#0B1524` | Elevated dark surface |
| Navy 850 | `--cl-navy-850` | `credlytic-navy-850` | `#101C2E` | Inputs / raised surface |
| Navy 800 | `--cl-navy-800` | `credlytic-navy-800` | `#16243A` | Strong separation |
| Cool paper | `--cl-paper` | `credlytic-paper` | `#EEF3F8` | Light editorial band |
| Raised paper | `--cl-paper-raised` | `credlytic-paper-raised` | `#F7F9FC` | Light elevated surface |
| Credlytic Blue | `--cl-blue` | `credlytic-blue` | `#287CFF` | Primary actions only |
| Blue hover | `--cl-blue-hover` | `credlytic-blue-hover` | `#3989FF` | Primary-action hover |
| Bright blue | `--cl-blue-bright` | `credlytic-blue-bright` | `#4DA3FF` | Focus and interactive emphasis |
| Intelligence cyan | `--cl-cyan` | `credlytic-cyan` | `#32C6D4` | Data, analysis, policy context |
| Positive emerald | `--cl-emerald` | `credlytic-emerald` | `#38D996` | Strong/healthy states |
| Caution amber | `--cl-amber` | `credlytic-amber` | `#F0B85A` | Limiting factors and caution |
| Risk red | `--cl-red` | `credlytic-red` | `#EF6A75` | Genuine risk or error only |

Semantic Tailwind colors are `canvas`, `surface`, `surface-raised`, `content`, `content-secondary`, and `content-muted`. They respond to the theme context.

### Semantic Rules

- Blue = primary action.
- Cyan = intelligence, analytical context, policy context, and data.
- Emerald = positive or strong state.
- Amber = caution, limiting factor, or improve-first state.
- Red = genuine error, risk, destructive action, or failed state.
- Never use color as the only carrier of meaning.
- Do not add decorative neon or multicolor gradients.

## Surface Hierarchy

### Dark Product Environment

1. Canvas: `#07101D`
2. Navigation: `#050C16`
3. Standard panel: `rgb(12 23 39 / 90%)`
4. Raised/input panel: `#101C2E`
5. Strong separator surface: `#16243A`

### Light Editorial Environment

1. Canvas band: `#EEF3F8`
2. Raised panel: `#F7F9FC`
3. Light product panel: `#FFFFFF` only for individual elevated content, never a full page band
4. Primary ink: `#102033`

Do not nest visual cards. A panel may contain grouped rows, controls, or unframed data regions, but not another decorative panel.

## Typography

### Families

- Display: `Georgia, "Times New Roman", serif`
- Product: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Editorial serif is reserved for flagship storytelling: the main marketing promise, major narrative statements, and final brand moments. Product interfaces, metrics, controls, tables, charts, explanations, and operational headings use sans-serif.

Marketing balance: approximately 40% serif / 60% sans-serif. Product screens: overwhelmingly sans-serif.

### Type Scale

| Role | Tailwind | Size | Line height | Weight |
| --- | --- | --- | --- | --- |
| Display XL | `text-display-xl` | `7.8rem` | `0.92` | `400` |
| Display LG | `text-display-lg` | `5.1rem` | `1` | `400` |
| Display MD | `text-display-md` | `4rem` | `1.04` | `400` |
| Product XL | `text-product-xl` | `2.75rem` | `1.1` | `640` |
| Product LG | `text-product-lg` | `1.55rem` | `1.2` | `620` |
| Product MD | `text-product-md` | `1.125rem` | `1.35` | `620` |
| Body LG | `text-body-lg` | `1.2rem` | `1.64` | `400` |
| Body MD | `text-body-md` | `0.95rem` | `1.7` | `400` |
| Body SM | `text-body-sm` | `0.82rem` | `1.6` | `400` |
| Caption | `text-caption` | `0.68rem` | `1.5` | `600` |
| Micro | `text-micro` | `0.58rem` | `1.45` | `600` |

- Display and body letter spacing is `0`.
- Intelligence Index labels use `0.12em` positive tracking.
- Never use negative letter spacing.
- Financial values use sans-serif and always include a clear label and unit/context.
- Format currency for India: `₹85,000`, `₹1.2L`.

## Spacing

Use the 4px base scale exposed as `--space-*` and standard Tailwind spacing:

| Step | Value | Typical use |
| --- | --- | --- |
| 1 | `4px` | Tight icon/text adjustment |
| 2 | `8px` | Compact control gap |
| 3 | `12px` | Related item gap |
| 4 | `16px` | Standard internal gap |
| 5 | `20px` | Panel padding, dense |
| 6 | `24px` | Panel padding, standard |
| 8 | `32px` | Major content group |
| 10 | `40px` | Large layout gap |
| 12 | `48px` | Section intro separation |
| 16 | `64px` | Major responsive separation |
| 20 | `80px` | Large editorial rhythm |
| 24 | `96px` | Hero / major section spacing |
| 28 | `112px` | Desktop storytelling section |

Avoid arbitrary spacing unless required to align a fixed-format visualization.

## Layout

- Marketing content maximum: `1180px` (`max-w-brand-content`)
- Navigation maximum: `1380px` (`max-w-brand-navigation`)
- Product application maximum: `1420px` (`max-w-brand-application`)
- Desktop editorial section padding: `112px` (`py-section`)
- Mobile editorial section padding: `78px` (`py-section-mobile`)
- Product pages should use denser spacing than marketing pages.
- Use explicit grid tracks, aspect ratios, and min/max constraints for charts, card visuals, and comparison layouts.

## Borders, Radius, And Shadows

### Borders

- Dark subtle: `rgba(182, 204, 232, 0.13)` (`border-subtle`)
- Dark strong: `rgba(182, 204, 232, 0.22)` (`border-strong`)
- On paper: `rgba(31, 52, 78, 0.11)` (`border-paper-divider`)
- Width: `1px`

### Radius

- Label/tag: `4px` (`rounded-label`)
- Small element: `6px`
- Control/button/input: `8px` (`rounded-control`)
- Panel/major product visual: `12px` (`rounded-panel`)
- Pill only for statuses and true circular controls: `9999px` (`rounded-round`)

### Shadows

- Standard panel: `0 20px 60px rgba(0, 0, 0, 0.25)`
- Floating product visual: `0 32px 80px rgba(11, 23, 40, 0.25)`
- Primary action: `0 12px 34px rgba(40, 124, 255, 0.23)`

Shadows remain soft and secondary to border/surface hierarchy. Avoid glowing every card.

## Component Primitives

Implementation: `components/brand-primitives.tsx`.

### Buttons

- Primary: Credlytic Blue background, white text, 48px default height.
- Secondary: transparent/subtle surface with strong border.
- Danger: restrained red border/text; use only for destructive actions.
- Product size: 40px height.
- Small size: 40px height with tighter horizontal padding.
- Standard radius: 8px.
- Use icon + text for primary workflow actions; icon-only for familiar tools.

### Surfaces And Cards

- Use `BrandSurface` with semantic, midnight, raised, paper, or transparent tone.
- Product cards represent one real object or repeated item.
- Page sections remain unframed bands or constrained layouts.
- Never place decorative cards inside cards.
- Standard padding: 20-24px.

### Inputs

- Height: `43px`.
- Radius: `8px`.
- Default border: subtle.
- Focus: Bright blue border plus 3px / 9% blue focus halo.
- Error: red border and explicit text; never red alone.
- Labels are always visible. Placeholder text is not a label.
- Hint/error copy uses the micro scale.

### Badges And Status

- Height: minimum `24px`.
- Badge text: micro scale with `650` weight.
- Intelligence = blue/cyan context.
- Positive = emerald and explicit positive label.
- Caution = amber with action-oriented label.
- Risk = red only for genuine risk/error.
- Muted = neutral metadata, not a decision status.

### Icons

- Library: Lucide.
- Stroke width: `1.8` globally.
- Inline/micro: `12-14px`.
- Control: `16-17px`.
- Brand mark: `19px`.
- Feature/context: `20-24px`.
- Icon button target: at least `38px`; primary touch actions should reach `44px` on mobile.
- Icons support meaning; they do not replace essential labels unless universally familiar.

## Data Visualization

Typed values are exported from `lib/brand-tokens.ts` as `dataVisualizationTokens`.

| Meaning | Color |
| --- | --- |
| Primary series | Bright blue `#4DA3FF` |
| Intelligence/context | Cyan `#32C6D4` |
| Healthy/positive | Emerald `#38D996` |
| Caution/limiting factor | Amber `#F0B85A` |
| Risk/error | Red `#EF6A75` |
| Dark chart grid | `rgba(148, 163, 184, 0.13)` |
| Light chart grid | `rgba(46, 67, 94, 0.13)` |

- Use direct labels where possible.
- Do not rely on color alone; pair with text, icon, pattern, or position.
- Prefer one primary and one contextual series. Avoid rainbow charts.
- Progress bars are 5px high and animate once from the left.
- Large values use sans-serif and remain stable when content changes.

## Interaction States

### Hover

- Primary button: background `#3989FF`, translate up `1px`, slightly stronger blue shadow.
- Secondary button: 45% bright-blue border, 7% blue surface, translate up `1px`.
- Cards/surfaces: stronger border and at most `2px` vertical lift.
- Text action: trailing icon moves right `3px`.
- Do not scale cards or create dramatic depth changes.

### Focus

- Focus ring: `2px solid #4DA3FF`.
- Focus offset: `3px`.
- Focus must remain visible in light and dark environments.

### Disabled

- Opacity: `0.55`.
- Cursor: `not-allowed`.
- Disabled links must also prevent pointer interaction.

## Motion

| Token | Value | Use |
| --- | --- | --- |
| Fast | `120ms` | Tiny state response |
| Control | `180ms` | Buttons, borders, icon movement |
| Standard | `240ms` | Surface and theme transitions |
| Reveal | `900ms` | Progress and subtle content reveal |
| Signal | `1800ms` | Hero/data signal drawing |
| Orbit | `32-40s` | Intelligence Orbit |
| Easing | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Branded reveal/elevation |

- Floating cards move no more than `5px` over approximately `10s`.
- Scroll reveals move no more than `16px` and run once.
- No bouncing, constant pulsing, excessive parallax, spinning icons, gaming motion, or broad animated glow.
- All motion must respect `prefers-reduced-motion`.

## Responsive Breakpoints

Named Tailwind additions preserve default breakpoints while exposing the Credlytic layout thresholds:

| Name | Minimum width | Intent |
| --- | --- | --- |
| `compact` | `480px` | Larger phone refinements |
| `tablet` | `768px` | Tablet / stacked product layouts |
| `product` | `1024px` | Persistent navigation and product grids |
| `wide` | `1181px` | Full marketing/product composition |
| `canvas` | `1440px` | Maximum application canvas behavior |

- Design mobile intentionally; do not simply shrink desktop.
- Maintain large touch targets and prioritize decision-critical information.
- Collapse secondary metadata before reducing readable type.
- Comparisons become stacked summaries or horizontally controlled regions.
- Orbits and fixed-format visuals require explicit scaled bounds so they never overlap content.

## Light And Dark Behavior

- Dark is the primary product environment.
- Light mode uses cool gray-blue canvas `#EDF2F7`, white individual panels, raised paper `#F6F8FB`, and ink `#102033`.
- Marketing uses alternating midnight and cool-paper bands to create narrative rhythm.
- Do not convert light sections into cream editorial layouts.
- Semantic classes (`bg-canvas`, `bg-surface`, `text-content`) inherit theme channels automatically.
- Fixed brand colors retain their meaning in both themes.

## Accessibility

- Maintain WCAG AA contrast for body text and controls.
- Every interactive element must be keyboard reachable.
- Every icon-only button requires an accessible name and tooltip/title where useful.
- Forms require persistent labels, errors, and descriptions.
- Status must never be communicated by color alone.
- Reduced-motion users receive static, fully understandable layouts.

## Implementation Map

- CSS variables and legacy-compatible aliases: `app/globals.css`
- Tailwind colors, type, spacing, motion, breakpoints: `tailwind.config.ts`
- Typed tokens for charts and application logic: `lib/brand-tokens.ts`
- Reusable surfaces, actions, index, signal, status, and input primitives: `components/brand-primitives.tsx`
- Approved visual reference: `app/page.tsx`

## Governance

- The landing page is locked. Do not redesign it while implementing product interfaces.
- New visual values must be added to the token system before use.
- Do not introduce a second blue, alternate success green, warm paper color, arbitrary radius, or unrelated animation style.
- Product screens must use the same Midnight surfaces, Signal Line, semantic state colors, typography hierarchy, architectural dividers, and restrained motion.
- Use the Intelligence Orbit only where relationships or profile context need explanation.
- When in doubt, favor clarity, traceable reasoning, and calm financial credibility over decoration.
