# ExpenseTracker Professional Design System

## Overview
The entire frontend application has been redesigned with a modern, professional appearance. This document outlines the design system, color palette, typography, components, and styling conventions used throughout the application.

---

## Color Palette

### Primary Colors
- **Primary Blue**: `#3b82f6` - Main brand color for CTAs and interactive elements
- **Primary Dark**: `#2563eb` - Darker shade for hover states
- **Primary Darker**: `#1d4ed8` - Darkest shade for active states

### Success Colors (Income/Positive)
- **Success**: `#22c55e` - Used for success messages, income, positive values
- **Success Dark**: `#16a34a` - Darker shade for hover states

### Danger Colors (Expense/Negative)
- **Danger**: `#ef4444` - Used for errors, danger actions, expenses, negative values
- **Danger Dark**: `#dc2626` - Darker shade for hover states

### Warning Colors
- **Warning**: `#f59e0b` - Used for warnings and pending states
- **Warning Dark**: `#d97706` - Darker shade for hover states

### Neutral Colors
- **Gray 50**: `#f9fafb` - Lightest background
- **Gray 100**: `#f3f4f6` - Light backgrounds
- **Gray 200**: `#e5e7eb` - Borders light
- **Gray 300**: `#d1d5db` - Borders
- **Gray 400**: `#9ca3af` - Disabled text
- **Gray 500**: `#6b7280` - Secondary text
- **Gray 600**: `#4b5563` - Tertiary text
- **Gray 700**: `#374151` - Primary text (dark)
- **Gray 800**: `#1f2937` - Darker primary text
- **Gray 900**: `#111827` - Darkest text

---

## Typography System

### Font Families
- **Body Font**: Inter (400, 500, 600, 700, 800)
- **Display Font**: Poppins (500, 600, 700) - Used for headings and titles

### Font Sizes
```
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.5rem (24px)
h4: 1.25rem (20px)
h5: 1.125rem (18px)
h6: 1rem (16px)

text-xl: 1.5rem
text-lg: 1.25rem
text-md: 1rem
text-base: 1rem
text-sm: 0.875rem
text-xs: 0.75rem
```

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

---

## Spacing System

### Spacing Scale
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 2.5rem (40px)
3xl: 3rem (48px)
```

All spacing uses CSS variables for consistency:
```css
var(--spacing-xs)
var(--spacing-sm)
var(--spacing-md)
var(--spacing-lg)
var(--spacing-xl)
var(--spacing-2xl)
var(--spacing-3xl)
```

---

## Border Radius System

```
sm: 6px
md: 10px
lg: 14px
xl: 20px
full: 9999px (for pills/circles)
```

---

## Shadow System

### Elevation Shadows
```
shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

---

## Button System

### Button Variants

#### Primary Button
- Used for main CTAs
- Background: Linear gradient blue
- Color: White
- Hover: Lift effect with increased shadow
- Active: No lift, reduced shadow

#### Secondary Button
- Used for secondary actions
- Background: Gray tertiary
- Color: Primary text
- Hover: Gray secondary background

#### Outline Button
- Used for alternative actions
- Background: Transparent
- Border: 2px primary color
- Color: Primary text
- Hover: Light primary background

#### Danger Button
- Used for destructive actions
- Background: Linear gradient red
- Color: White
- Hover: Lift effect with increased shadow

#### Success Button
- Used for positive actions
- Background: Linear gradient green
- Color: White
- Hover: Lift effect with increased shadow

### Button Sizes
- **Small**: 0.375rem vertical, 0.75rem horizontal
- **Medium (Default)**: 0.625rem vertical, 1.25rem horizontal
- **Large**: 0.75rem vertical, 1.75rem horizontal

---

## Component Styling

### Cards
- Background: Primary background
- Border: 1px border color
- Border Radius: lg
- Padding: lg
- Shadow: sm
- Hover: Lift effect (-4px), increased shadow, border color changes to primary-100

### Glass Panels
- Background: White with opacity and blur
- Backdrop Filter: blur(16px)
- Border: 1px semi-transparent white
- Border Radius: lg
- Shadow: md

### Forms

#### Form Labels
- Font Weight: 600
- Font Size: 0.9375rem
- Color: Primary text
- Margin Bottom: sm
- Letter Spacing: 0.3px

#### Form Inputs
- Padding: 0.75rem 1rem
- Border: 1.5px input-border
- Border Radius: md
- Background: input-bg
- Focus: Blue border, light blue shadow box

#### Form Groups
- Margin Bottom: lg

### Modals
- Background: Primary
- Border: 1px border-color
- Border Radius: lg
- Shadow: 2xl
- Animation: slideUp (0.25s)
- Max Width: 500px

#### Modal Header
- Padding: xl
- Border Bottom: 1px border-color
- Background: Gradient primary at 50%
- Close Button: Hover effect with primary background

#### Modal Body
- Padding: xl

### Tables
- Header Background: Secondary
- Header Border Bottom: 2px border-color
- Row Borders: 1px border-color
- Row Hover: Secondary background
- Cell Padding: md

### Navbar
- Position: Sticky
- Z-Index: 100
- Border Bottom: 2px border-color
- Shadow: sm
- Active Link: Primary gradient background with white text

---

## Animations & Transitions

### Transition Speeds
```
--transition-fast: 0.15s ease-in-out
--transition-base: 0.25s ease-in-out
--transition-slow: 0.35s ease-in-out
```

### Keyframe Animations

#### fadeIn
```
0%: opacity 0
100%: opacity 1
Duration: transition-base
```

#### slideUp
```
0%: opacity 0, translateY(10px)
100%: opacity 1, translateY(0)
Duration: transition-base
```

#### slideDown
```
0%: opacity 0, translateY(-10px)
100%: opacity 1, translateY(0)
Duration: transition-base
```

#### scaleIn
```
0%: opacity 0, scale(0.95)
100%: opacity 1, scale(1)
Duration: transition-base
```

---

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: < 768px
- **Small Laptop**: < 1024px
- **Desktop**: >= 1024px

### Responsive Utilities
- `.sm\:hidden` - Hide on mobile
- `.md\:hidden` - Hide on tablet
- `.lg\:hidden` - Hide on small laptop

### Responsive Classes
- `.md\:w-full` - Full width on tablets
- `.md\:grid-cols-1` - Single grid column on tablets
- `.sm\:grid-cols-1` - Single grid column on mobile

---

## Dark Theme Support

All components support dark theme via `[data-theme='dark']` selector:

```css
[data-theme='dark'] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  /* ... more dark theme variables */
}
```

---

## Utility Classes

The application includes comprehensive utility classes:

### Layout
- `.flex-center` - Center flex container
- `.flex-between` - Space between flex items
- `.flex-col` - Flex column direction
- `.flex-gap-*` - Gap utilities (xs, sm, md, lg)

### Spacing
- `.m-*` - Margin (xs, sm, md, lg, xl, 2xl)
- `.p-*` - Padding (xs, sm, md, lg, xl, 2xl)
- `.mb-*`, `.mt-*`, `.ml-*`, `.mr-*` - Directional margins
- `.px-*`, `.py-*` - Directional paddings

### Typography
- `.text-*` - Color utilities (primary, secondary, tertiary, success, danger, warning)
- `.text-sm`, `.text-md`, `.text-lg` - Size utilities
- `.font-bold`, `.font-semibold` - Weight utilities
- `.text-center`, `.text-left`, `.text-right` - Alignment

### Grid
- `.grid-cols-1`, `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4` - Grid columns
- `.grid-auto-fit` - Auto-fit grid with minimum 280px

### Borders & Shadows
- `.border`, `.border-t`, `.border-b` - Border utilities
- `.rounded-*` - Border radius utilities
- `.shadow-*` - Shadow utilities (xs, sm, md, lg, xl, 2xl)

### Visibility
- `.hidden` - Display none
- `.block` - Display block
- `.inline-flex` - Display inline-flex
- `.invisible` - Visibility hidden

---

## CSS Variable Reference

All CSS variables are defined in `index.css` within `:root` selector:

```css
:root {
  --font-family: 'Inter', sans-serif;
  --font-display: 'Poppins', sans-serif;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  /* ... more variables */
}
```

---

## Component Files

- **index.css** - Design system, CSS variables, base components
- **App.css** - Application root styling
- **Login.css** - Login page professional design
- **Register.css** - Register page professional design
- **Navbar.css** - Navigation bar professional design
- **Dashboard.css** - Dashboard and summary cards
- **AdminPanel.css** - Admin panel styling
- **utilities.css** - Comprehensive utility classes

---

## Best Practices

1. **Use CSS Variables**: Always use CSS variables for colors, spacing, and transitions
2. **Maintain Consistency**: Follow the established patterns for new components
3. **Mobile First**: Design for mobile first, then enhance for larger screens
4. **Accessibility**: Ensure sufficient color contrast and proper focus states
5. **Performance**: Use transitions and animations sparingly
6. **Responsive**: Test on multiple device sizes

---

## Future Enhancements

- Enhanced animations for micro-interactions
- Additional color themes
- Animation library integration
- Performance optimizations
- Accessibility improvements
