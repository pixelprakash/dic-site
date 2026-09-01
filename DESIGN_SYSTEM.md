# DIC · IITH Design System

This is the canonical reference for typography, color, spacing, and other
design tokens on this site. All tokens live in
[`src/styles/variables.css`](src/styles/variables.css) as CSS custom
properties — this document explains what each one is *for*, not just what
value it holds. When in doubt about which token to reach for, check here
before adding a one-off value.

The short version: **reach for a token, not a raw number.** If nothing here
fits, that's a sign to add a new named token rather than hardcode a value —
keeps the system growing intentionally instead of drifting.

## Typography

### Fonts

| Token | Value | Use |
|---|---|---|
| `--font-heading` | Erode | All headings (h1–h6), section titles, display text |
| `--font-body` | DM Sans | Everything else — body copy, UI, labels |

Root font-size is `106.25%` (≈17px), so every `rem`-based size below reads
about 1px larger than its literal value at normal laptop viewing distance.

### Type scale

| Token | Size | Use |
|---|---|---|
| `--text-2xs` | 13px | Micro metadata only — patent IDs, tiny uppercase tags. Never for anything read continuously. |
| `--text-xs` | 14px | Short labels & chips: breadcrumbs, form field labels, badges, uppercase eyebrows. Not for sentences or list content. |
| `--text-sm` | 15px | Secondary/supporting text that's still real content: tag chips, dense publication-list lines, timeline metadata (dates, org names). |
| `--text-base` | 16px | The page-wide default — applied to `<body>`; anything with no explicit `font-size` inherits this. The readability floor. |
| `--text-md` | 17px | **The deliberate floor for body copy you're styling explicitly** — paragraphs, list items, descriptions, timeline entries, card copy. |
| `--text-lg` | 19px | Lead paragraphs / bios, card & list titles, prominent buttons and CTAs. |
| `--text-xl` | 22px | Small subheadings. |
| `--text-2xl` | 28px | Standalone headings that aren't an actual `h1`–`h6` (e.g. the footer form title). |

**The rule that matters most:** real running text — anything a visitor is
expected to read start to end, not just scan as a label — should never
render below `--text-md` (17px). `--text-sm` and `--text-xs` exist for
short, scannable strings (a tag, a date, a breadcrumb crumb), not for
sentences or paragraphs. This was the recurring readability complaint
across the Project/Research detail pages, the footer, and the person
profile pages — text sitting at `sm`/`xs` reads fine for a two-word label
but becomes genuinely hard to read once it's a full sentence.

`--text-base` and `--text-md` are only 1px apart by design — `base` is
what unstyled text inherits automatically, `md` is what you reach for when
explicitly setting a component's body-copy size. Treat them as the same
readability tier; the distinction is "implicit default" vs. "intentional
choice," not a visual difference worth designing around.

### Headings

`h1`–`h6` don't use the type scale above — they're sized individually with
`clamp()` in `global.css` so they scale fluidly with viewport width instead
of jumping between fixed breakpoints:

| Element | Size (clamp) |
|---|---|
| `h1` | `clamp(3rem, 8vw, 7rem)` |
| `h2` | `clamp(2rem, 4.5vw, 3.5rem)` |
| `h3` | `clamp(1.5rem, 3vw, 2rem)` |
| `h4` | `clamp(1.1rem, 2vw, 1.4rem)` |

All headings: `font-family: var(--font-heading)`, `font-weight: 600`,
`font-style: normal`, `line-height: 1.15`, `color: var(--color-ink)`.

A page's own hero title (e.g. "Research", "Projects") is a real `h1` and
gets this scale automatically. A titled *section* inside a page (e.g. a
person profile's "Publications" heading) typically isn't a plain heading
tag with default sizing — it gets its own `clamp()` tuned smaller than a
page h1/h2, still in the heading font, often paired with a visual accent
(see `.profile__section-title`'s red left-border treatment) so it reads as
a clear heading without competing with the actual page title.

### Line-height

| Token | Value | Use |
|---|---|---|
| `--lh-tight` | 1.2 | Headings |
| `--lh-snug` | 1.4 | Compact UI text |
| `--lh-normal` | 1.6 | Default paragraph text |
| `--lh-relaxed` | 1.75 | Long-form body copy, bios |

## Color

Warm, earthy, academic palette. Every text color paired with a background
below has been checked against WCAG AA (4.5:1 for normal text, 3:1 for
large/bold text) — don't reintroduce a pre-audit value from git history
without rechecking contrast.

| Token | Value | Use |
|---|---|---|
| `--color-cream` | `#FFF9F3` | Primary page background |
| `--color-sand` | `#F0E6D6` | Secondary/alternate section background, tag chip fill |
| `--color-warm-gray` | `#C4B8A8` | Borders, dividers on light backgrounds |
| `--color-stone` | `#6B5D4C` | Secondary text on light backgrounds (body copy default color) |
| `--color-charcoal` | `#2A2520` | Primary text on light backgrounds |
| `--color-ink` | `#1A1714` | Headings, highest-emphasis text |
| `--color-terracotta` | `#954E30` | Accent text/links on light backgrounds |
| `--color-terracotta-light` | `#D4906B` | Accent text on *dark* backgrounds only — fails AA on light ones |
| `--color-sage` | `#7A9178` | Status/success accents (e.g. "Ongoing" badge) |
| `--color-teal-dark` | `#1B4B5A` | Footer background |
| `--color-navy` | `#101B42` | Dark UI surfaces, primary buttons, dark logo chips |
| `--color-white` | `#FFFFFF` | Text/icons on dark or colored backgrounds, card fills |
| `--color-overlay` | `rgba(26,23,20,.65)` | Image/photo darkening overlays |

Brand marks (sampled from the DIC logo — use for brand moments, not
general UI color):

| Token | Value |
|---|---|
| `--color-dic-red` | `#F0301B` |
| `--color-dic-orange` | `#EF7621` |
| `--color-dic-blue` | `#2F3192` |

`--color-stone` and `--color-terracotta` were both deliberately darkened
from their original design values after failing AA contrast — see the
comment in `variables.css` for the before/after ratios. Don't lighten them
back without rechecking.

## Layout

| Token | Value | Use |
|---|---|---|
| `--margin-x` | 60px (responsive, see below) | Horizontal page padding |
| `--section-gap` | 140px (responsive, see below) | Vertical spacing between major page sections |
| `--border-radius` | 16px | Cards, photos, large containers |
| `--border-radius-sm` | 8px | Buttons, tags, form fields, small chips |

### Breakpoints

The whole site scales down through the same three breakpoints — use these,
not one-off values, when a component needs its own responsive behavior:

| Breakpoint | `--margin-x` | `--section-gap` |
|---|---|---|
| `max-width: 1024px` | 48px | 100px |
| `max-width: 768px` | 24px | 72px |
| `max-width: 480px` | 16px | 56px |

There's no fixed max-width container anywhere on the site — every section
is full-bleed with `--margin-x` side padding, scaling with viewport width
rather than capping at a fixed pixel width on large monitors. That's an
intentional, consistent choice across every page; don't introduce a
max-width wrapper on just one page without applying it everywhere.

## Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, hover lifts |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Color/opacity transitions |
| `--duration` | 0.6s | Default transition length |

Scroll-reveal animations (the `.reveal` class + `useReveal()` hook) use
`threshold: 0` with a small negative `rootMargin`, not a percentage
threshold — a percentage-of-the-element's-own-height threshold breaks down
for a tall wrapper (e.g. a whole card list), which can need a long scroll
before enough of *itself* is on screen to cross a percentage threshold,
even though it's already visible. See `src/hooks/useReveal.js`.

## Accessibility checklist

Carried over from the site-wide contrast/readability passes — apply these
whenever adding or editing a component:

- Body copy a visitor reads continuously: `--text-md` or larger, never
  `--text-sm`/`--text-xs`.
- New text/background color pairing: check contrast (4.5:1 normal text,
  3:1 for ≥18.66px bold or ≥24px text) before shipping, especially for any
  translucent (`rgba(...)`) text color — the same value can pass or fail
  depending on what's actually behind it.
- Interactive elements rely on the global `:focus-visible` style in
  `global.css` — don't suppress it with `outline: none` on a one-off
  component.
- An element that expands/opens (a modal, an accordion, an expanding
  card) should not reflow or overlap unrelated content at any viewport
  width — prefer a true overlay (`position: fixed` + backdrop) over an
  in-place expansion if the surrounding space can't be guaranteed at every
  breakpoint. See `ViewOnMap.jsx`'s history for why.
