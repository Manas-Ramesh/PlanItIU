# Figma Landing Page — Structured Extraction

**Source:** [planitiuMCP](https://www.figma.com/design/9cdUgL3T0rUmFTtaeMsKa8/planitiuMCP?node-id=3-366) · Node: `3:366` (landingpage)  
**Page:** landing

---

## 1. Tokens (from Figma design)

### Colors (semantic)
| Token | Usage |
|-------|--------|
| `bg-background` | Page, NavBar, Footer |
| `bg-surface` | Feature cards, dropdown list |
| `bg-elevated` | (Optional) listbox / elevated surfaces |
| `text-text-primary` | Headlines, card titles, brand |
| `text-text-secondary` | Subtitle, nav links, descriptions |
| `text-text-muted` | Footer, placeholder |
| `text-brand` | Hero highlight, CTA button, card icons |
| `border-border-subtle` | NavBar bottom, Footer top, cards, inputs |
| `shadow-card` | Feature cards |

### Spacing
- Section vertical: `py-24`
- Section horizontal: `px-6` (hero), `px-8` (feature grid)
- NavBar: `px-8 py-4`
- Footer: `py-8`
- Inline gaps: `gap-2` (brand), `gap-6` (nav), `gap-8` (grid)
- Stack: `space-y-6` (hero), `mt-6` (CTA), `mt-12` (grid below title), `mb-4` (icon below)

### Typography
- Hero headline: `text-5xl font-bold tracking-tight`
- Section title (h2): large, bold, centered
- Card title (h3): bold
- Subtitle/body: `text-lg` + secondary color
- Footer: `text-sm` + muted
- Brand: `font-semibold text-lg`

### Radius & shadows
- Buttons / inputs: `rounded-md`
- Cards: `rounded-lg`
- Cards: `shadow-card`

---

## 2. Layout grid

- **Global:** Content centered; max-width containers.
- **Hero:** `max-w-4xl mx-auto`, `text-center`, `py-24 px-6`.
- **Feature grid:** `max-w-7xl mx-auto`, `py-24 px-8`, `text-center`.
- **Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`.

---

## 3. Component hierarchy

```
Page
├── NavBar (header)
│   ├── Brand (left): tag (optional) + label
│   └── nav
│       ├── ul (links)
│       └── CTA (link or button)
├── main
│   ├── HeroSection
│   │   ├── h1 (headline + highlight)
│   │   ├── p (subtitle)
│   │   └── CTA slot (e.g. Select)
│   └── FeatureGrid
│       ├── h2
│       ├── p (optional subtitle)
│       └── ul (role="list")
│           └── FeatureCard[] (article)
│               ├── Icon wrapper
│               ├── h3
│               └── p
└── Footer
    └── children (muted text)
```

---

## 4. Variants (prop-driven)

- **NavBar CTA:** `ctaHref` → `<a>`, else `onCtaClick` → `<button>`. Same visual style (e.g. `bg-brand`, `hover:bg-brand-strong`).
- **Hero:** `highlight` → optional span with `text-brand`.
- **FeatureCard:** Single component; icon, title, description (and optional icon variant) via props.
- **Select:** States: closed, open, focus, disabled; all via state, not separate components.

---

## 5. State-based differences

- **NavBar CTA:** Default + hover (`hover:bg-brand-strong`).
- **Select:** Closed / open (chevron rotate), focus ring, disabled opacity.
- **Links:** Focus visible (e.g. focus ring).

---

## 6. Reusable primitives

- **Layout:** Section wrappers with max-width + centering.
- **Typography:** h1, h2, h3, p with token-based classes.
- **Interactive:** Button (or CTA link/button with same classes), Select (combobox).
- **Surfaces:** Card (default / feature variant).
- **Icon:** Icon wrapper with `text-brand` (or variant) and `mb-4`.

---

## 7. Content (from Figma)

- **Brand:** "Planituni" with optional tag "DEV SKIP".
- **Nav:** "Overview"; CTA "Get started".
- **Hero:** "Plan Your" + highlight "Academic Success".
- **Hero subtitle:** "Your AI-powered companion for course planning, degree tracking, assignment grading, and career opportunities. Built for college students who want to maximize their GPA and career prospects."
- **Hero CTA:** "Select your university to get started" (label + placeholder).
- **Feature section title:** "Your All-in-One Academic Platform".
- **Feature section subtitle:** "Everything you need to succeed in college, all in one place."
- **Footer:** "PlanitUni is an independent entity and is not affiliated with any university."
