---
name: Monolith Architectural Framework
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-2xl:
    fontFamily: Hanken Grotesk
    fontSize: 120px
    fontWeight: '800'
    lineHeight: 110px
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.8'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 160px
---

## Brand & Style

This design system is built on the principles of **Brutalist-Minimalism** and **International Typographic Style (Swiss Design)**. It prioritizes clarity, objective layout, and a structured architectural hierarchy. The target audience includes high-end creative agencies, architectural firms, and premium lifestyle brands that value structural integrity over decorative flourish.

The UI should evoke a sense of permanence and sophistication. It achieves this through:
- **Architectural Layouts:** Using a rigorous grid to create a sense of built space.
- **Generous Whitespace:** Utilizing negative space as a functional element to frame content.
- **High-Contrast Typography:** Creating a dramatic visual pace between massive headlines and precise body text.
- **Minimalist Restraint:** Removing all non-essential elements to focus entirely on imagery and information.

## Colors

The palette is strictly monochromatic to emphasize form and light. 
- **Primary (#000000):** Used for typography, primary borders, and structural lines. It represents the "ink" of the system.
- **Background (#F9F9F9):** A slightly off-white that reduces glare while maintaining a clean, gallery-like atmosphere.
- **Accents (#E5E5E5 / #1A1A1A):** These are used for subtle depth. #E5E5E5 is reserved for secondary borders, dividers, and disabled states. #1A1A1A is used for hover states on dark elements or secondary text layers.

## Typography

The typographic system relies on a high-contrast scale. **Hanken Grotesk** provides the sharp, geometric authority required for headings, while **Inter** ensures maximum readability for long-form content.

- **Headlines:** Set with tight tracking and leading to create a "blocky" visual impact. Large display sizes should almost touch the edges of their containers.
- **Body:** Set with a generous 1.6 to 1.8 line height to create a breathable, relaxed reading experience that contrasts with the intense headlines.
- **Labels:** We introduce a monospaced font for metadata, captions, and technical details to reinforce the "architectural blueprint" aesthetic.

## Layout & Spacing

This design system utilizes a **Rigid 12-Column Grid** for desktop and a **4-Column Grid** for mobile. 

- **The Baseline:** All spacing is derived from an 8px base unit.
- **Section Gaps:** Vertical rhythm is defined by large "voids" (160px+) between sections to allow content to exist independently.
- **Architectural Alignment:** Elements should be aligned to the grid with hard edges. Avoid centering content; favor left-aligned or justified-to-grid compositions. 
- **The "Full-Bleed" Rule:** Images should either occupy 100% of the viewport width or align strictly to grid columns—never arbitrary widths.

## Elevation & Depth

In line with the Brutalist-Minimalist philosophy, depth is achieved through **Tonal Layers** and **Hard Borders** rather than shadows.

- **Flat Stack:** Elements are stacked like physical sheets of paper. No ambient shadows are permitted.
- **Borders:** Use 1px solid strokes (#000000) to define boundaries. In high-density areas, use #E5E5E5 for a more subtle separation.
- **Hover States:** Instead of elevation, use color inversion (e.g., background turns Black, text turns White) to indicate interactivity.
- **Overlays:** Use 100% opaque backgrounds for menus and modals to maintain the architectural solidity.

## Shapes

The design system uses a **Sharp (0px)** roundedness profile. All buttons, cards, images, and input fields must have hard 90-degree corners. This reinforces the architectural and structural nature of the design. Circles are only permitted for specific functional icons or status indicators, never for containers.

## Components

### Buttons
- **Primary:** Black background, White text, 1px Black border. Sharp corners. Large padding (16px 32px).
- **Secondary:** White background, Black text, 1px Black border.
- **Interaction:** On hover, primary buttons invert to White background/Black text.

### Project Grids
- Use a 2-column or 3-column layout. 
- Images are the hero. Aspect ratios should be consistent (e.g., 4:5 or 16:9).
- Text labels appear in **label-mono** either directly below the image or as a subtle overlay on hover.

### Navigation
- **Desktop:** Sticky top bar with 1px bottom border. Links are uppercase **label-mono**.
- **Mobile:** A "Drawer" menu that slides in from the right, taking up 100% of the screen with large-scale navigation links.

### Input Fields
- Underline style only (1px bottom border) or full 1px border boxes.
- Focus state is indicated by a thicker 2px border.

### Cards
- No shadows. Use 1px borders to define the container.
- Ensure internal padding is consistent with the global spacing unit (at least 24px).

### Motion
- **Kinetic Scroll:** Elements should fade in and move slightly upward as they enter the viewport.
- **Page Transitions:** Use "curtain" transitions or hard cuts to maintain the professional, unembellished feel.