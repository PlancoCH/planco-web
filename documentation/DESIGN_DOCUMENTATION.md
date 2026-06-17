# Planco Design Guidelines

> Complete design specification for Planco — a student research project website about IoT plant monitoring.
> Use this document to build new UI components and pages that match the existing design exactly.

---

## 1. Design Philosophy & Brand Identity

Planco presents as a warm, academic-meets-organic brand. The aesthetic combines scientific rigor (structured layouts, data-driven language) with natural warmth (beige paper tones, botanical greens). The site never feels cold or corporate — it feels like a research lab in a greenhouse.

- **Tone**: knowledgeable but approachable, precise but warm, academic but not dry
- **Visual metaphor**: paper + plants — beige backgrounds evoke lab notebooks; forest greens evoke living plants
- **Density**: moderately spaced — never cramped, never wasted
- **Rounding**: consistently rounded — nothing sharp-edged; everything has at minimum `rounded-2xl`

---

## 2. Color Palette

### 2.1 Primary: Beige (backgrounds, surfaces)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 50 | `#FDFAF5` | `bg-beige-50` | Page hero backgrounds, feature cards, lightest sections |
| 100 | `#F9F4EA` | `bg-beige-100` | **Default body background**, main content sections |
| 200 | `#F2EAD8` | `bg-beige-200` | Alternating section background, darker contrast areas |
| 300 | `#E8DCC4` | `border-beige-300` | **Default border color** for cards and containers |
| 400 | `#D9C9A8` | `text-beige-400` | Muted text on dark backgrounds (footer) |
| 500 | `#C9B48C` | `text-beige-500` | Very muted text (footer copyright) |
| DEFAULT | `#F2EAD8` | `beige-DEFAULT` | Alias for 200 |

### 2.2 Primary: Forest (text, accents, interactive elements)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 50 | `#EAF2EC` | `bg-forest-50` | Tech stack cards |
| 100 | `#C5DEC9` | — | — |
| 200 | `#8FC09A` | — | — |
| 300 | `#5A9E6A` | `border-forest-300` | Card hover borders, secondary button borders |
| 400 | `#2E7D47` | `bg-forest-400` | Primary button background (actual rendered color) |
| 500 | `#1A5C32` | `text-forest-500` | Body text on light backgrounds, muted descriptions |
| 600 | `#164E2A` | `text-forest-600` | Slightly darker body text, nav links default |
| 700 | `#113F22` | `text-forest-700` | **Default body text color**, headings |
| 800 | `#0C2F19` | `text-forest-800` | **Headings (h1, h2, h3)**, dark emphasis |
| 900 | `#071F10` | `bg-forest-900/60` | Image overlays (at 60% opacity) |
| DEFAULT | `#1A5C32` | `text-forest-DEFAULT`, `bg-forest-DEFAULT` | **Primary interactive color**: buttons, active nav, labels, icon containers, tag backgrounds |

### 2.3 Accent: Sage (decorative, subtle highlights)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 100 | `#E8EFE5` | `bg-sage-100` | Decorative background patches, architecture flow cards |
| 200 | `#C8D9C2` | `bg-sage-200`, `border-sage-200` | Blurred decorative blobs, architecture card borders |
| 300 | `#A8C3A0` | `group-hover:bg-sage-300` | Logo icon hover (dark variant) |
| 400 | `#7FA87A` | `bg-sage-400` | Logo icon background (both variants), footer link hover border |
| DEFAULT | `#7FA87A` | — | Alias for 400 |

### 2.4 Color Usage Rules

- **Text on beige backgrounds**: always `text-forest-700` (default) or `text-forest-800` (headings), `text-forest-500` (muted)
- **Text on dark/forest backgrounds**: always `text-beige-100` (primary), `text-beige-200` (body), `text-beige-400`/`text-beige-500` (muted)
- **Borders**: default `border-beige-300`; hover → `border-forest-300`
- **Icons in containers**: icon container always `bg-forest-DEFAULT/10` (10% opacity) with the icon itself `text-forest-DEFAULT`
- **Never use pure black or pure white** — always use the palette

---

## 3. Typography

### 3.1 Font Families

| Role | Family | Tailwind | CSS Import |
|------|--------|----------|------------|
| Body, UI, nav, buttons, descriptions | Inter (weights 300, 400, 500, 600, 700) | `font-sans` | `Inter:wght@300;400;500;600;700` |
| Headings (h1, h2, h3) | Playfair Display (weights 400, 600, 700 + italics) | `font-serif` | `Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600` |

### 3.2 Type Scale

| Element | Tag | Classes | Size |
|---------|-----|---------|------|
| Hero heading | h1 | `font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-forest-800` | 3rem → 3.75rem → 4.5rem |
| Page title | h1 | `font-serif text-5xl md:text-6xl text-forest-800 leading-tight` | 3rem → 3.75rem |
| Section heading | h2 | `font-serif text-4xl md:text-5xl text-forest-800` | 2.25rem → 3rem |
| Card heading | h3 | `font-serif text-xl text-forest-800` | 1.25rem |
| Card heading (horizontal) | h3 | `font-serif text-2xl text-forest-800` | 1.5rem |
| Body text | p | `text-forest-500 text-sm leading-relaxed` | 0.875rem |
| Body text (hero/feature) | p | `text-forest-500 text-lg leading-relaxed` | 1.125rem |
| Subtitle | p | `text-forest-500 max-w-md mx-auto` | 1rem |
| Label badge | span | `text-xs font-semibold uppercase tracking-widest text-forest-DEFAULT` | 0.75rem |
| Nav links | button | `text-sm font-medium` | 0.875rem |
| Footer nav items | button/li | `text-sm` | 0.875rem |
| Footer copyright | p | `text-xs` | 0.75rem |
| Tags | span | `text-xs font-medium` | 0.75rem |
| Quote | p | `font-serif text-2xl md:text-3xl italic text-beige-100` | 1.5rem → 1.875rem |
| Footer column heading | h4 | `text-sm font-semibold uppercase tracking-widest` | 0.875rem |

### 3.3 Typography Rules

- **Every heading** (h1, h2, h3 in any component) must use `font-serif` (Playfair Display)
- **Headings never use italic** except inside `<em>` which uses `not-italic` with `text-forest-DEFAULT` for emphasis
- **Body text** always uses `font-sans` (Inter) with `leading-relaxed`
- **Uppercase labels** always have `tracking-widest` (letter-spacing: 0.1em)
- **`text-balance` utility** used on large headings to prevent orphans
- **Font smoothing**: `antialiased` applied globally via body in `index.css`
- **Smooth scrolling**: `scroll-behavior: smooth` on `<html>`

---

## 4. Spacing & Layout

### 4.1 Container Widths

| Context | Class |
|---------|-------|
| Standard content container | `max-w-6xl mx-auto px-6` |
| Full-bleed section | no max-width, but content inside gets standard container |
| Navbar | `max-w-6xl mx-auto px-6` (inside fixed header) |
| Footer | `max-w-6xl mx-auto px-6` (inside dark footer) |
| Text-only centered content | `max-w-lg mx-auto px-6` or `max-w-xl mx-auto` |
| Wide hero text | `max-w-2xl` or `max-w-3xl` |

### 4.2 Section Padding

| Section type | Vertical padding | Horizontal |
|-------------|-----------------|------------|
| Full page sections (default) | `py-24` (6rem) | container-based |
| Hero sections | `py-24` or full viewport via `min-h-screen` | container-based |
| Final CTA sections | `py-20` or `py-24` | container-based |
| Quote section | `h-80` (fixed 20rem height), no vertical padding | full-width |
| Image gallery section | `py-24` | container-based |
| Footer | `py-16` | container-based |

### 4.3 Grid & Flex Gaps

| Context | Gap |
|---------|-----|
| 3-column feature grid | `gap-8` |
| 2-column grid (AI features, tools) | `gap-8` |
| Stacked cards (team, phases) | `space-y-6` or `space-y-8` |
| Tech stack 3-col | `gap-8` |
| Footer columns | `gap-10` |
| Button groups (side by side) | `gap-4` |
| Nav links (desktop) | `gap-8` |
| Footer link lists | `space-y-3` |
| Tag groups | `gap-2` |
| Image gallery grid | `gap-4` (tight image grid) |

### 4.4 Section Margin Between Content Blocks

| Context | Margin |
|---------|--------|
| After label badge before heading | `mb-8` |
| After heading before body | `mb-6` |
| After body before button | `mb-10` |
| SectionTitle bottom margin | `mb-16` |
| Section bottom CTA wrapper | `mt-8` |
| Footer bottom section gap | `mb-12` |

---

## 5. Components — Exact Specifications

### 5.1 Navbar (`src/components/Navbar.tsx`)

```
┌────────────────────────────────────────────────────────────┐
│ [Logo]              [Home] [System] [Team] [Story] [CTA]  │
└────────────────────────────────────────────────────────────┘
```

- **Position**: `fixed top-0 left-0 right-0 z-50`
- **Height**: `h-16` (4rem)
- **Scrolled state** (scrollY > 20px): `bg-beige-100/95 backdrop-blur-md shadow-sm border-b border-beige-300`
- **Default state**: `bg-transparent`
- **Transition**: `transition-all duration-500`
- **Logo**: Left-aligned, `variant="light"`, `clickable`
- **Desktop nav links**: `hidden md:flex items-center gap-8`
  - Font: `text-sm font-medium`
  - Default color: `text-forest-600`
  - Hover color: `text-forest-DEFAULT`
  - Active color: `text-forest-DEFAULT`
  - Active indicator: absolute `h-0.5 bg-forest-DEFAULT` underline, width animated `w-0 group-hover:w-full` (default) or `w-full` (active)
  - Transition: `transition-colors` on text, `transition-all duration-300` on underline
- **CTA button**: `hidden md:inline-flex text-sm px-5 py-2.5`
- **Mobile toggle**: `md:hidden`, icon is `Menu` (closed) or `X` (open), `w-5 h-5`, `text-forest-700`
- **Mobile dropdown**: `bg-beige-100/98 backdrop-blur-md border-b border-beige-300`, max-height animated `max-h-0` ↔ `max-h-80` with `transition-all duration-300 overflow-hidden`
- **Mobile nav links**: vertical stack, `px-6 py-4 gap-4`, same font/color as desktop
- **Mobile CTA**: inside dropdown list, `w-full`

### 5.2 Footer (`src/components/Footer.tsx`)

```
┌────────────────────────────────────────────────────────────┐
│ [Logo]                     [Navigate]     [Technology]     │
│ Description text           Home           IoT Sensors      │
│ [GitHub] [Mail] icons      The System     AI Analysis      │
│                            Our Team       Laravel Backend  │
│                            The Story      React App        │
│                                           GitHub           │
├────────────────────────────────────────────────────────────┤
│ © 2026 Planco. A student research project...  "Don't..."   │
└────────────────────────────────────────────────────────────┘
```

- **Background**: `bg-forest-800 text-beige-200`
- **Padding**: `py-16`
- **Grid**: `grid grid-cols-1 md:grid-cols-4 gap-10`
- **Brand column**: `md:col-span-2`
  - Logo: `variant="dark"`, `className="mb-4"`
  - Description: `text-beige-400 text-sm leading-relaxed max-w-xs`
  - Social icons container: `flex gap-4 mt-6`
    - Each icon link: `w-8 h-8 rounded-full border border-forest-600 flex items-center justify-center text-beige-400`
    - Hover: `hover:text-beige-100 hover:border-sage-400 transition-colors`
    - Icons: `w-3.5 h-3.5`
- **Column headings**: `text-beige-100 text-sm font-semibold uppercase tracking-widest mb-5`
- **Link lists**: `space-y-3 text-beige-400 text-sm hover:text-beige-100 transition-colors`
- **Bottom bar**: `border-t border-forest-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4`
  - Copyright: `text-beige-500 text-xs`
  - Tagline: `text-beige-500 text-xs italic`
- **Navigation is internal** via `useNavigate()` + `window.scrollTo({ top: 0, behavior: 'smooth' })`

### 5.3 Button (`src/components/ui/Button.tsx`)

Three variants, all rendered as `<button type="button">`:

#### Primary (`variant="primary"`)
```
┌──────────────────────────┐
│  Explore the Hardware  → │
└──────────────────────────┘
```
- `group inline-flex items-center gap-3 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-4 rounded-full`
- **Actual background**: `bg-forest-400` overrides via `bg-forest-DEFAULT` then overridden — final class list: `bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-4 rounded-full bg-forest-400`
- Hover: `hover:shadow-xl hover:shadow-forest-DEFAULT/25`
- Active: `active:scale-95`
- Transition: `transition-all duration-300`
- Arrow: `ArrowRight w-4 h-4`, hover moves right: `group-hover:translate-x-1 transition-transform`

#### Secondary (`variant="secondary"`)
```
┌──────────────────────────┐
│    Project Journey       │
└──────────────────────────┘
```
- `inline-flex items-center gap-2 text-forest-600 font-medium px-7 py-4 rounded-full border border-forest-300`
- Hover: `hover:border-forest-DEFAULT hover:text-forest-DEFAULT`
- Transition: `transition-all duration-300`
- **No arrow icon**

#### Ghost (`variant="ghost"`)
```
Explore more about the system  →
```
- `group inline-flex items-center gap-2 text-forest-DEFAULT font-semibold`
- Hover: `hover:gap-3` (gap expands slightly)
- Transition: `transition-all`
- Arrow: same as primary
- No background, no border, no padding (relies on external className)

#### Button behaviors
- Supports `to` prop for internal navigation (react-router) or external (`external` flag → `window.location.href`)
- Internal navigation calls `window.scrollTo({ top: 0, behavior: 'smooth' })` after navigate
- Accepts arbitrary `className` overlay
- Accepts `onClick`

### 5.4 Logo (`src/components/ui/Logo.tsx`)

```
┌─────────────────────┐
│ (🍃) Planco         │
└─────────────────────┘
```

- Layout: `flex items-center gap-2`
- Icon container: `w-8 h-8 rounded-full flex items-center justify-center`
  - Contains `Leaf` icon from lucide-react, `w-4 h-4`
  - Background: `bg-sage-400` (both variants)
  - Icon color: `text-forest-800` (both variants)
- Text: `font-serif text-xl font-semibold tracking-tight`
- Two color variants:
  - **Light** (for beige backgrounds): `text-forest-700`, icon hover → `group-hover:bg-forest-400`
  - **Dark** (for forest backgrounds, e.g. footer): `text-beige-100`, icon hover → `group-hover:bg-sage-300`
- When `clickable`: wraps in `<button>`, navigates to `/` with scroll-to-top

### 5.5 FeatureCard (`src/components/ui/FeatureCard.tsx`)

```
┌─────────────────────────────┐
│ ┌──────┐                    │
│ │ Icon │                    │
│ └──────┘                    │
│                             │
│ Card Title                  │
│ Descriptive text explaining │
│ the feature in detail.      │
└─────────────────────────────┘
```

- Container: `bg-beige-50 rounded-2xl border border-beige-300 p-8`
- Hover: `hover:border-forest-300 hover:shadow-lg hover:shadow-forest-DEFAULT/10`
- Transition: `transition-all duration-300`
- Icon container: `w-12 h-12 bg-forest-DEFAULT/10 rounded-xl flex items-center justify-center mb-5`
- Icon inside: `w-6 h-6 text-forest-DEFAULT`
- Title: `font-serif text-xl text-forest-800 mb-3`
- Description: `text-forest-500 text-sm leading-relaxed`

### 5.6 ImageCard (`src/components/ui/ImageCard.tsx`)

The most complex component. Two variants: `vertical` and `horizontal`.

#### Vertical Variant
```
┌─────────────────────┐
│                     │
│    ┌───────────┐    │
│    │   Image   │    │
│    │  (h-48)   │    │
│    │  overlay  │    │
│    └───────────┘    │
│                     │
│  [Icon]             │
│  Title              │
│  Description text   │
│  [tag] [tag] [tag]  │
│                     │
└─────────────────────┘
```

- Container: `rounded-2xl border border-beige-300 bg-beige-50`
- Image area: `h-48 relative overflow-hidden`
  - Image: `w-full h-full object-cover`, hover → `group-hover:scale-105 transition-transform duration-500`
  - Overlay: `absolute inset-0 bg-forest-900/30`
- Content: `p-6`
- Icon (if provided): `w-10 h-10 bg-forest-DEFAULT/10 rounded-xl mb-4`, icon `w-5 h-5 text-forest-DEFAULT`
- Title: `font-serif text-xl text-forest-800 mb-2`
- Description: `text-forest-500 text-sm leading-relaxed`
- Tags container: `flex flex-wrap gap-2 mb-6` (above description when present)
- Tag chip: `text-xs font-medium text-forest-600 bg-forest-DEFAULT/10 px-3 py-1 rounded-full border border-forest-DEFAULT/20`

#### Horizontal Variant
```
┌───────────────────────────────────────────────────────────────┐
│ ┌────────────┐                                                │
│ │            │  [Icon] Title                                  │
│ │   Image    │  Description text spanning multiple lines      │
│ │  (h-full)  │  about the feature or person.                  │
│ │            │  [tag] [tag] [tag]                             │
│ └────────────┘                                                │
└───────────────────────────────────────────────────────────────┘
```

- Container: `rounded-3xl border border-beige-300 bg-beige-50`, grid `grid md:grid-cols-5`
- Hover: adds `hover:shadow-xl` (stronger than vertical)
- Image area: `md:col-span-2`, full height on desktop, `h-52` on mobile
- Content: `md:col-span-3 p-8 md:p-10 flex flex-col justify-center`
- **Reverse** mode (`reverse` prop): image column gets `md:order-2`, content gets `md:order-1`
- Icon (if provided): inline with title in `flex items-center gap-3 mb-4`
  - Container: `w-10 h-10 bg-forest-DEFAULT/10 rounded-xl`
  - Icon: `w-5 h-5 text-forest-DEFAULT`
- Title: `font-serif text-2xl text-forest-800`
- Body: `text-forest-600 leading-relaxed`
- Tags: same style as vertical
- Hover (both variants): `hover:border-forest-300 hover:shadow-lg hover:shadow-forest-DEFAULT/10 transition-all duration-300`

### 5.7 ImageGallery (`src/components/ui/ImageGallery.tsx`)

```
┌──────────────────────────────────────┐
│ ┌──────────────┐ ┌──────────────┐    │
│ │              │ │              │    │
│ │    Image     │ │    Image     │    │
│ │   (h-72)     │ │   (h-72)     │    │
│ │              │ │              │    │
│ │  [caption]   │ │  [caption]   │    │
│ └──────────────┘ └──────────────┘    │
└──────────────────────────────────────┘
```

- Section wrapper: `py-24 bg-beige-50`
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Each image card: `group relative overflow-hidden rounded-2xl border border-beige-300`
- Hover: `hover:border-forest-300 hover:shadow-xl hover:shadow-forest-DEFAULT/10 transition-all duration-500`
- Image: `w-full h-72 object-cover`, hover → `group-hover:scale-105 transition-transform duration-700`
- Gradient overlay (appears on hover): `absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`
- Caption: `absolute bottom-0 left-0 right-0 p-5`, slides up on hover: `translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`
- Caption text: `text-beige-100 text-sm font-medium leading-snug`

### 5.8 PageTitle (`src/components/sections/PageTitle.tsx`)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                      ┌──────────────┐                            │
│                      │    LABEL     │                            │
│                      └──────────────┘                            │
│                                                                  │
│              Page Title — Large Serif Heading                    │
│                                                                  │
│                 Subtitle text explaining the page                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- Section: `relative py-24 bg-beige-50 overflow-hidden`
- Content: `max-w-6xl mx-auto px-6 text-center`
- Label badge: `text-xs font-semibold uppercase tracking-widest text-forest-DEFAULT bg-forest-DEFAULT/10 px-4 py-1.5 rounded-full inline-block mb-8`
- Title: `font-serif text-5xl md:text-6xl text-forest-800 leading-tight mb-6 max-w-3xl mx-auto text-balance`
- Subtitle: `text-forest-500 text-lg max-w-xl mx-auto leading-relaxed`

### 5.9 SectionTitle (`src/components/sections/SectionTitle.tsx`)

```
                      ┌──────────────┐
                      │    LABEL     │
                      └──────────────┘

                 Section Title — Serif H2

                    Optional subtitle text
```

- Container: `text-center mb-16`
- Label badge: identical to PageTitle label — `text-xs font-semibold uppercase tracking-widest text-forest-DEFAULT bg-forest-DEFAULT/10 px-4 py-1.5 rounded-full inline-block mb-8`
- Title: `font-serif text-4xl md:text-5xl text-forest-800 mb-4`
- Subtitle (optional): `text-forest-500 max-w-md mx-auto`

### 5.10 Quote (`src/components/sections/Quote.tsx`)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│              "The quote text in italic serif"                    │
│                                                                  │
│                   (full-width background image)                  │
└──────────────────────────────────────────────────────────────────┘
```

- Section: `relative h-80 overflow-hidden`
- Background image: `w-full h-full object-cover`
- Dark overlay: `absolute inset-0 bg-forest-900/60`
- Content: `absolute inset-0 flex items-center justify-center px-6`
- Text: `font-serif text-2xl md:text-3xl italic text-beige-100 text-center max-w-2xl`
- Wrapped in `<figure>` / `<blockquote>` semantic elements
- Text always surrounded by literal `"` quote marks

---

## 6. Animations & Transitions

### 6.1 Custom Keyframe Animations (defined in `tailwind.config.js`)

| Name | Class | Description |
|------|-------|-------------|
| `fade-in` | `animate-fade-in` | `opacity: 0 → 1` over 0.8s, ease-out, forwards |
| `slide-up` | `animate-slide-up` | `opacity: 0 → 1`, `translateY(30px → 0)` over 0.7s, ease-out, forwards |
| `float` | `animate-float` | `translateY(0 → -12px → 0)` over 6s, ease-in-out, infinite |

### 6.2 Transition Patterns (consistent across all interactive elements)

| Element | Transition |
|---------|------------|
| Cards (all types) | `transition-all duration-300` |
| Card hover scale (image) | `transition-transform duration-500` |
| Image gallery hover scale | `transition-transform duration-700` |
| Image gallery overlay fade | `transition-opacity duration-500` |
| Image gallery caption slide | `transition-all duration-500` |
| Button | `transition-all duration-300` |
| Navbar background | `transition-all duration-500` |
| Nav links text | `transition-colors` |
| Nav active underline | `transition-all duration-300` |
| Mobile menu expand | `transition-all duration-300` |
| Footer links | `transition-colors` |
| Button arrow | `transition-transform` |

### 6.3 Hover Effect Patterns

1. **Cards**: border changes from `beige-300` → `forest-300`, shadow appears: `shadow-lg shadow-forest-DEFAULT/10` (ImageCards add `hover:shadow-xl`)
2. **Images inside cards**: scale up 5% (`group-hover:scale-105`)
3. **Buttons (primary)**: shadow appears: `shadow-xl shadow-forest-DEFAULT/25`, slight press: `active:scale-95`
4. **Buttons (secondary)**: border and text darken to `forest-DEFAULT`
5. **Buttons (ghost)**: gap between text and arrow widens (`hover:gap-3`)
6. **Nav underline**: width animates from 0 to full
7. **Tags**: no hover effect (static)
8. **Footer social icons**: text changes to `beige-100`, border changes to `sage-400`
9. **FeatureCard icon container**: no hover change on the icon area itself

---

## 7. Section Patterns (Recurring Layouts)

### 7.1 Standard Content Section
```jsx
<section className="py-24 bg-beige-100">       {/* or bg-beige-200, bg-beige-50 */}
  <div className="max-w-6xl mx-auto px-6">
    <SectionTitle label="..." title="..." subtitle="..." />
    {/* Content grid or cards */}
  </div>
</section>
```

### 7.2 Image-Heavy Section
```jsx
<section className="py-24 bg-beige-50">
  <div className="max-w-6xl mx-auto px-6">
    <ImageGallery images={[...]} />
  </div>
</section>
```

### 7.3 Alternating Card Stack (e.g., Problem/Solution, Team members, Phases)
```jsx
<section className="py-24 bg-beige-100">
  <div className="max-w-6xl mx-auto px-6">
    <SectionTitle label="..." title="..." />
    <div className="space-y-6">     {/* or space-y-8 */}
      {items.map((item, i) => (
        <ImageCard variant="horizontal" reverse={i % 2 !== 0} {...item} />
      ))}
    </div>
  </div>
</section>
```

### 7.4 Call-to-Action Teaser
```jsx
<section className="py-20 bg-beige-50 text-center">
  <div className="max-w-lg mx-auto px-6">
    <SectionTitle label="..." title="..." subtitle="..." />
    <Button to="/somewhere">Action Text</Button>
  </div>
</section>
```

### 7.5 Grid of Feature Cards
```jsx
<section className="py-24 bg-beige-100">
  <div className="max-w-6xl mx-auto px-6">
    <SectionTitle label="..." title="..." subtitle="..." />
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">  {/* or gap-8 */}
      {features.map(f => <FeatureCard key={f.title} {...f} />)}
    </div>
  </div>
</section>
```

### 7.6 Split Layout (Text + Visual)
```jsx
<section className="py-24 bg-beige-200">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div>{/* text content */}</div>
      <div>{/* visual / diagram */}</div>
    </div>
  </div>
</section>
```

### 7.7 Hero Section (Home only, full viewport)
```jsx
<section className="relative min-h-screen flex items-center overflow-hidden bg-beige-50">
  {/* Background image with opacity and gradient overlay */}
  <div className="absolute inset-0 z-0">
    <img ... className="w-full h-full object-cover opacity-40" />
    <div className="absolute inset-0 bg-gradient-to-r from-beige-200/70 via-beige-200/40 to-transparent" />
  </div>
  {/* Decorative blur blob */}
  <div className="absolute top-32 -right-16 w-80 h-80 rounded-full bg-sage-200 opacity-40 blur-3xl pointer-events-none" />
  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
    {/* Label badge, h1, p, button group */}
  </div>
  {/* Scroll indicator */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-forest-400 animate-bounce">
    <span className="text-xs uppercase tracking-widest">Scroll</span>
    <ChevronDown className="w-4 h-4" />
  </div>
</section>
```

### 7.8 Page Background Alternation
Sections alternate backgrounds in this order to create visual rhythm (example from Product page):
1. PageTitle → `bg-beige-50`
2. ImageGallery → (self-contained `bg-beige-50`)
3. Content section → `bg-beige-100`
4. Architecture section → `bg-beige-200`
5. Content section → `bg-beige-100`
6. Quote → dark overlay section
7. CTA section → `bg-beige-50`
8. Final CTA → `bg-beige-100`

The general pattern is: beige-50 → beige-100 → beige-200 → beige-100 → beige-50 → beige-100.

---

## 8. Iconography

### 8.1 Icon Library
**lucide-react** v0.344 — all icons come from this package.

### 8.2 Icon Sizing Convention

| Context | Size |
|---------|------|
| Inside FeatureCard icon container (12×12 container) | `w-6 h-6` |
| Inside ImageCard icon container (10×10 container) | `w-5 h-5` |
| ImageCard icon in horizontal title row | `w-5 h-5` |
| Button arrow (ArrowRight) | `w-4 h-4` |
| Logo leaf icon | `w-4 h-4` |
| Navbar mobile toggle | `w-5 h-5` |
| Footer social icons | `w-3.5 h-3.5` |
| CheckCircle2 in lists | `w-4 h-4` |
| Architecture flow card icons | `w-5 h-5` |
| 404 page leaf icon | `w-10 h-10` |

### 8.3 Icon Color Rules
- Icons inside colored containers use `text-forest-DEFAULT` (on light) or `text-white` (on dark)
- Standalone icons use the text color of their parent context
- Never use pure black icons

---

## 9. Decorative Elements

### 9.1 Label Badges (The "Chip")
```html
<span className="text-xs font-semibold uppercase tracking-widest text-forest-DEFAULT bg-forest-DEFAULT/10 px-4 py-1.5 rounded-full inline-block">
  LABEL TEXT
</span>
```
Used at the top of every PageTitle and SectionTitle. Also used standalone in hero with an animated pulse dot:
```html
<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-forest-DEFAULT bg-forest-DEFAULT/10 px-4 py-1.5 rounded-full">
  <span className="w-1.5 h-1.5 rounded-full bg-forest-DEFAULT animate-pulse" />
  Student Research Project
</span>
```

### 9.2 Tag Chips (on ImageCards)
```html
<span className="text-xs font-medium text-forest-600 bg-forest-DEFAULT/10 px-3 py-1 rounded-full border border-forest-DEFAULT/20">
  Tag Name
</span>
```

### 9.3 Blurred Decorative Blobs
```html
<div className="absolute top-32 -right-16 w-80 h-80 rounded-full bg-sage-200 opacity-40 blur-3xl pointer-events-none" />
```

### 9.4 Gradient Overlays on Images
- Card image overlay: `absolute inset-0 bg-forest-900/30` (constant, 30% opacity)
- Quote overlay: `absolute inset-0 bg-forest-900/60` (constant, 60% opacity)
- Gallery hover overlay: `absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-transparent` (appears on hover)

### 9.5 Section Dividers
- Only one divider style exists: `border-t border-forest-700` used in the footer bottom bar. No other horizontal rules or dividers appear anywhere in the site.

---

## 10. Responsive Breakpoints

The site uses Tailwind's default breakpoints. Key responsive behaviors:

| Breakpoint | Behavior |
|------------|----------|
| `md:` (768px) | Grid switches from 1 column to multi-column; nav switches to desktop; horizontal ImageCards split into side-by-side; footer becomes 4 columns |
| `lg:` (1024px) | Hero heading reaches max size (`lg:text-7xl`); 3-column grids appear (`lg:grid-cols-3`) |
| Below `md:` | Nav is hamburger menu; all grids stack vertically; ImageCards switch to stacked layout; buttons stack vertically (`flex-col sm:flex-row`) |

### Mobile-specific patterns:
- Nav: hamburger `md:hidden`, dropdown with animated max-height
- Grids: `grid-cols-1` is default, multi-column at `md:`
- Text sizes: smaller on mobile (e.g., `text-5xl md:text-6xl`)
- Stacked buttons: `flex-col sm:flex-row gap-4`
- ImageCard horizontal: image `h-52` on mobile, `md:h-full` on desktop

---

## 11. Global Base Styles

From `src/index.css`:
- `html`: `scroll-behavior: smooth`
- `body`: `bg-beige-100 text-forest-700 font-sans` with `-webkit-font-smoothing: antialiased`
- `h1, h2, h3`: `font-serif`
- Custom utility `.text-balance`: `text-wrap: balance`

---

## 12. Routing & Page Structure

| Route | Component | Title |
|-------|-----------|-------|
| `/` | Home.tsx | (hero page, no PageTitle) |
| `/product` | Product.tsx | The System |
| `/team` | Team.tsx | The Team |
| `/project` | Project.tsx | The Story |
| `*` | NotFound.tsx | Error 404 |

All pages share: `<Navbar />` at top, `<Footer />` at bottom, wrapped in `<div className="min-h-screen flex flex-col">` with `<div className="flex-1">` for the routed content.

Page components (except Home) have `className="pt-16"` on the `<main>` to offset the fixed navbar height.

---

## 13. Component Props Quick Reference

### Button
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string?` | — | Navigation target (path or URL) |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Visual style |
| `external` | `boolean?` | `false` | Uses `window.location.href` instead of router |
| `className` | `string?` | `''` | Additional classes |
| `children` | `ReactNode` | — | Button label |
| `onClick` | `function?` | — | Click handler |

### Logo
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'light' \| 'dark'` | `'light'` | Color scheme |
| `clickable` | `boolean?` | `false` | Navigates to `/` on click |
| `className` | `string?` | — | Additional classes |

### FeatureCard
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ComponentType<{className?: string}>` | required | Lucide icon component |
| `title` | `string` | required | Card heading |
| `description` | `string` | required | Card body text |
| `className` | `string?` | `''` | Additional classes |

### ImageCard
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'vertical' \| 'horizontal'` | required | Layout mode |
| `icon` | `ComponentType?` | — | Optional lucide icon |
| `image` | `string` | required | Image URL |
| `imageAlt` | `string` | required | Alt text |
| `title` | `string` | required | Card heading |
| `paragraph` | `string` | required | Body text |
| `tags` | `string[]?` | — | Optional tag chips |
| `reverse` | `boolean?` | `false` | Swap image/content order (horizontal only) |

### ImageGallery
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `{src: string, alt: string}[]` | required | Array of image objects |

### PageTitle
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Badge text (e.g. "The System") |
| `title` | `string` | required | h1 heading |
| `subtitle` | `string` | required | Subtitle paragraph |

### SectionTitle
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Badge text |
| `title` | `string` | required | h2 heading |
| `subtitle` | `string?` | — | Optional subtitle |

### Quote
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Quote text (displayed with surrounding quotes) |
| `image` | `string` | required | Background image URL |
| `imageAlt` | `string` | required | Alt text for background image |

---

## 14. Architecture Flow Cards (Product Page Specific)

Used only in the Product page system architecture diagram. These are hardcoded, not a shared component, but documented here for reference:

```jsx
<div className="w-full rounded-xl border px-6 py-4 flex items-center gap-4 [bg-color] [text-color]">
  <div className="w-10 h-10 rounded-lg flex items-center justify-center [icon-bg]">
    <Icon className="w-5 h-5 [icon-color]" />
  </div>
  <div>
    <div className="font-semibold text-sm [label-color]">Label</div>
    <div className="text-xs [sub-color]">Sub label</div>
  </div>
</div>
```

With a connector line between cards: `<div className="w-px h-6 bg-forest-300 mb-1" />`

Variants used:
- Light: `bg-sage-100 border-sage-200 text-forest-700`, icon bg `bg-white/60`, icon color `text-forest-DEFAULT`
- Dark: `bg-forest-500 border-forest-400 text-white`, icon bg `bg-white/20`, icon color `text-white`
- Beige: `bg-beige-100 border-beige-300 text-forest-700`

---

## 15. Tech Stack Cards (Project Page Specific)

Used in the Project page tech stack section. Also hardcoded but documented:

```jsx
<div className="rounded-2xl border p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 [color-classes]">
  <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center mb-5">
    <Icon className="w-6 h-6" />
  </div>
  <h3 className="font-serif text-xl mb-3">Tech Name</h3>
  <p className="text-sm leading-relaxed opacity-80">Description</p>
</div>
```

Color variants:
- React: `text-cyan-600 bg-cyan-50 border-cyan-100`
- GitHub: `text-forest-700 bg-forest-50 border-forest-200`
- Laravel: `text-red-700 bg-red-50 border-red-100`

---

## 16. Content & Copy Conventions

- **Labels** (badges): short, uppercase, 1-3 words, e.g. "The System", "Sensor Array", "The Team"
- **Titles**: descriptive, 4-8 words, Playfair Display, e.g. "Five sensors, one compact device"
- **Subtitles**: 1 sentence, max ~120 chars, muted forest-500
- **Body/Card descriptions**: 2-4 sentences, factual and precise, no marketing fluff
- **Tag labels**: 1-3 words, Pascal Case or normal case, e.g. "Soil Moisture", "IoT Sensor"
- **Button labels**: 2-4 words, action-oriented, e.g. "Explore the Hardware", "Meet the Team"
- **Quotes**: wrapped in literal `"` characters in the JSX, italic serif

---

## 17. File Structure Convention

```
src/
├── components/
│   ├── ui/           ← Reusable primitives (Button, Logo, FeatureCard, ImageCard, ImageGallery)
│   ├── sections/     ← Page section wrappers (PageTitle, SectionTitle, Quote)
│   ├── Navbar.tsx    ← Layout: top navigation
│   └── Footer.tsx    ← Layout: bottom footer
├── pages/            ← Route-level page components
├── App.tsx           ← Router + layout shell
├── main.tsx          ← Entry point
└── index.css         ← Tailwind directives + global styles
```

**Rules for new components:**
- Reusable UI primitives → `src/components/ui/`
- Section layout wrappers → `src/components/sections/`
- One-off page sections → inline in the page component or extract to `src/components/sections/` if reused
- Never create CSS/SCSS modules — all styling via Tailwind classes inline in JSX

---

## 18. Quick Checklist for New UI

When building any new UI element, verify:
- [ ] Background uses a beige variant (50, 100, or 200)
- [ ] Text uses forest palette (700 for body, 800 for headings, 500 for muted)
- [ ] Borders use `border-beige-300` (default) or `border-forest-300` (on hover)
- [ ] Any heading uses `font-serif`
- [ ] Any label/badge uses `text-xs font-semibold uppercase tracking-widest`
- [ ] Cards use `rounded-2xl` or `rounded-3xl` (horizontal ImageCards)
- [ ] Buttons use `rounded-full`
- [ ] Icon containers use `rounded-xl` with `bg-forest-DEFAULT/10`
- [ ] Hover states include border color change and shadow
- [ ] Transitions use `duration-300` (standard) or `duration-500` (images/larger elements)
- [ ] Content is contained in `max-w-6xl mx-auto px-6`
- [ ] Sections have consistent `py-24` padding (or `py-20` for compact CTAs)
- [ ] No pure black (`#000`) or pure white (`#fff`) anywhere
- [ ] Font imports include Inter (300-700) and Playfair Display (400,600,700 + italics)
- [ ] lucide-react is used for all icons (no other icon library)
- [ ] Mobile responsive (stacks vertically, smaller text, hamburger nav)