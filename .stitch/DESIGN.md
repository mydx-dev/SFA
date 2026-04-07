# SFA Design System - The Digital Curator

## Overview

This design system is derived from Stitch Project ID: **11576318200795443616**.  
Theme: **The Digital Curator** - A high-end, executive style that balances data density with breathing room, using tonal layering instead of heavy shadows.

---

## 🎨 Color Palette

### Primary Colors
- **Primary**: `#002045` - Deep navy blue (executive authority)
- **Secondary**: `#555f71` - Muted slate (professional restraint)
- **Tertiary**: `#002715` - Dark forest green (growth symbolism)
- **Surface**: `#f7fafc` - Light grey (breathable background)

### Semantic Colors
- **on_background**: `#181c1e` - Almost black text (never use pure #000000)
- **outline-variant**: `rgba(85, 95, 113, 0.15)` - Ghost borders for accessibility

### Status Colors
- **Success**: `#10b981` - Emerald green
- **Warning**: `#f59e0b` - Amber
- **Error**: `#ef4444` - Red
- **Info**: `#3b82f6` - Blue

---

## 📐 Typography

### Font Families
- **Display & Headlines**: `'Manrope', sans-serif` - Geometric modernism
- **Body & UI**: `'Inter', sans-serif` - Superior readability in data grids

### Font Scales
- **Display Large**: 48px / 1.2 line-height, weight 700
- **Headline 1**: 32px / 1.3, weight 600
- **Headline 2**: 24px / 1.4, weight 600
- **Body Large**: 16px / 1.6, weight 400
- **Body**: 14px / 1.5, weight 400
- **Caption**: 12px / 1.4, weight 400

### Letter Spacing
- Headlines: `-0.02em` (tighter)
- Subheadings: `0.04em` (wider for contrast)
- Body: `normal`

---

## 🧱 Elevation & Layering

### Tonal Layering (No Heavy Shadows)
Instead of drop shadows, use background color shifts to create depth:

- **Level 0 (Base)**: `#f7fafc`
- **Level 1 (Cards)**: `#ffffff`
- **Level 2 (Elevated)**: `#fefefe` with subtle border
- **Level 3 (Floating)**: Glassmorphism - `rgba(255, 255, 255, 0.8)` + `backdrop-filter: blur(20px)`

### Ambient Shadow (When Necessary)
Only for floating elements (modals, popovers):
```css
box-shadow: 0 8px 32px rgba(0, 32, 69, 0.08);
```

### Ghost Borders
For accessibility and subtle separation:
```css
border: 1px solid rgba(85, 95, 113, 0.15);
```
**Never use 100% opaque 1px borders.**

---

## 🎯 Component Patterns

### KPI Cards
- **Background**: White (`#ffffff`)
- **Border**: Ghost border (`rgba(85, 95, 113, 0.15)`)
- **Padding**: 24px
- **Border Radius**: 12px
- **Title**: Body Large, `#555f71`
- **Value**: Headline 1, `#002045`

### Buttons
- **Primary CTA**: Gradient from `#002045` to `#003066` at 135°
  - Text: White, weight 600
  - Border Radius: 8px
  - Padding: 12px 24px
  - Hover: Scale 1.02 + subtle glow

- **Secondary**: 
  - Background: `rgba(0, 32, 69, 0.08)`
  - Text: `#002045`
  - Border: None
  - Same sizing as Primary

### Tables
- **Header Background**: `#f7fafc`
- **Row Hover**: `rgba(0, 32, 69, 0.04)`
- **Cell Padding**: 16px
- **Border**: Ghost border between rows
- **Font**: Inter, 14px

### Forms
- **Input Background**: `#ffffff`
- **Border**: `rgba(85, 95, 113, 0.2)`
- **Focus Border**: `#002045`
- **Border Radius**: 6px
- **Padding**: 12px 16px
- **Font**: Inter, 14px

---

## 📱 Layout Principles

### Spacing Scale
Use a consistent 8px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Asymmetric Layouts
Embrace intentional asymmetry for visual interest:
- Dashboard: 2:1 ratio for chart vs. sidebar
- Two-column: 40% tree / 60% detail

### Breathing Room
Data should "breathe" - never pack content edge-to-edge:
- Minimum card padding: 24px
- Minimum section gap: 32px
- Content max-width: 1440px

---

## 🎨 Design Rules (Critical)

### ❌ Don't
1. **Never use 100% black** (`#000000`) - always use `#181c1e`
2. **No 1px solid borders** in primary color - use ghost borders or tonal shifts
3. **No heavy drop shadows** - prefer tonal layering
4. **No pure white on white** - use subtle background shifts

### ✅ Do
1. **Use glassmorphism** for floating elements (modals, dropdowns)
2. **Apply gradient to CTAs** for a silk finish
3. **Leverage letter-spacing** on subheadings for typographic contrast
4. **Maintain 4.5:1 contrast ratio** minimum for WCAG AA

---

## 🖥️ Screen Specifications

### Dashboard (cf6069f2387c4682890bb192493efe34)
- **Device**: Desktop (2560x2310)
- **Layout**: Grid with KPI cards + chart + activity timeline
- **Key Elements**:
  - 4 KPI cards in a row
  - Sales trend chart (8-column width)
  - Pipeline view (4-column width)
  - Recent activities + Upcoming tasks (6 columns each)

### Activity History (a182f5cb133b42598e1e4aa80395200a)
- **Device**: Desktop (2560x2658)
- **Layout**: Full-width table with filters
- **Key Elements**:
  - Search & filter panel (sticky top)
  - Activity table with sorting
  - Pagination controls

### Customer Management (10aa04f556964545adcf7948ffaac967)
- **Device**: Desktop (2560x2048)
- **Layout**: Two-column (40/60 split)
- **Key Elements**:
  - Hierarchical tree on left
  - Customer detail panel on right
  - Related deals section

### Deal Kanban (9255adabd1e34f739130f85ebd0b03c1)
- **Device**: Desktop (2560x2048)
- **Layout**: Horizontal kanban columns
- **Key Elements**:
  - Search/filter bar
  - Draggable deal cards
  - Phase columns with counts

### Mobile Deal List (9c8c0862cd294a129d17500c0df385f6)
- **Device**: Mobile (780x2272)
- **Layout**: Vertical card stack
- **Key Elements**:
  - Mobile search bar
  - Swipeable cards
  - Filter drawer

### Phase Management (9d19aa0e0e6f444784c26ee69027d537)
- **Device**: Desktop (2560x2360)
- **Layout**: Table with drag-to-reorder
- **Key Elements**:
  - Phase table with probability
  - Add/Edit form
  - Drag handles

---

## 🚀 Implementation Notes

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-primary: #002045;
  --color-secondary: #555f71;
  --color-tertiary: #002715;
  --color-surface: #f7fafc;
  --color-on-background: #181c1e;
  
  /* Typography */
  --font-display: 'Manrope', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Elevation */
  --shadow-ambient: 0 8px 32px rgba(0, 32, 69, 0.08);
  --border-ghost: 1px solid rgba(85, 95, 113, 0.15);
}
```

### React/Tailwind Integration
If using Tailwind CSS, extend the theme in `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#002045',
        secondary: '#555f71',
        tertiary: '#002715',
        surface: '#f7fafc',
        'on-bg': '#181c1e',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
    },
  },
}
```

---

## 📚 References
- Stitch Project: https://stitch.google.com/projects/11576318200795443616
- Design Philosophy: The Digital Curator - Executive Minimalism
- Accessibility: WCAG 2.1 AA compliance required
