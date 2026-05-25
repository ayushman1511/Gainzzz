---
name: Crimson Monolith
colors:
  surface: '#fff8f3'
  surface-dim: '#e1d9d1'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ea'
  surface-container: '#f5ece4'
  surface-container-high: '#f0e7df'
  surface-container-highest: '#eae1d9'
  on-surface: '#1f1b16'
  on-surface-variant: '#5b403c'
  inverse-surface: '#34302a'
  inverse-on-surface: '#f8efe7'
  outline: '#8f706b'
  outline-variant: '#e4beb8'
  surface-tint: '#b81f15'
  primary: '#6f0001'
  on-primary: '#ffffff'
  primary-container: '#9a0002'
  on-primary-container: '#ffa294'
  inverse-primary: '#ffb4a9'
  secondary: '#4f6359'
  on-secondary: '#ffffff'
  secondary-container: '#d1e8db'
  on-secondary-container: '#54695e'
  tertiary: '#0016a7'
  on-tertiary: '#ffffff'
  tertiary-container: '#0022e6'
  on-tertiary-container: '#adb5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4a9'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930002'
  secondary-fixed: '#d1e8db'
  secondary-fixed-dim: '#b5ccbf'
  on-secondary-fixed: '#0c1f17'
  on-secondary-fixed-variant: '#374b41'
  tertiary-fixed: '#dfe0ff'
  tertiary-fixed-dim: '#bdc2ff'
  on-tertiary-fixed: '#000965'
  on-tertiary-fixed-variant: '#0020dc'
  background: '#fff8f3'
  on-background: '#1f1b16'
  surface-variant: '#eae1d9'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 80px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.1'
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  stack-sm: 12px
  stack-md: 32px
  stack-lg: 64px
---

## Brand & Style
This design system embodies a **Tech-Noir Minimalism**—a high-tension aesthetic that balances the warmth of a classic editorial palette with the cold, calculated precision of futuristic technology. It is designed for high-impact interfaces that require "main character" energy while maintaining a disciplined, sophisticated posture.

The style is defined by extreme contrast and a "reductive-maximalist" philosophy: use very few elements, but make each element exceptionally bold. It utilizes a refined take on **Glassmorphism**, where translucent layers don't just provide depth, but act as high-contrast lenses that sharpen the hierarchy against the creamy base.

## Colors
The palette is built on a tripartite tension:
- **Base (Creamy Vanilla):** Provides a warm, organic foundation that prevents the UI from feeling sterile.
- **Action (Cherry Cola):** Used for primary brand moments, critical calls to action, and structural highlights. This is the "pulse" of the design system.
- **Grounding (Night Black):** Used for typography and deep contrast accents to ensure legibility and a sense of gravity.

Avoid gradients. Use solid fills or calculated transparencies to create depth.

## Typography
Typography is the primary driver of the tech-noir atmosphere. 
- **Anton** is reserved for high-impact displays and headers. It should almost always be uppercase with tight line heights to create a "wall of text" effect that feels architectural.
- **Geist** provides the technical, monospaced-adjacent clarity needed for body copy and data. Its neutrality acts as a foil to the aggressive nature of Anton.

Maintain generous tracking on small labels to emphasize the "technical" feel, but keep display headers tight and imposing.

## Layout & Spacing
The layout follows a **Fixed Grid** model with an emphasis on brutalist alignment. 
- **Grid:** A 12-column grid for desktop, 4-column for mobile.
- **Rhythm:** Elements should feel "locked" into place. Use significant vertical white space (Stack LG) between major sections to allow the high-contrast elements to breathe.
- **Alignment:** Prefer left-aligned typography to reinforce the technical, structured look. Avoid center alignment for body text.

## Elevation & Depth
Depth is created through **Glassmorphism and Sharp Borders**, rather than traditional soft shadows.
- **The Lens Effect:** Use surfaces with a background-blur (20px-40px) and a subtle 1px border in Night Black at 10% opacity. 
- **Shadows:** When shadows are necessary, use "Hard Ambient" shadows—minimal blur (4px), 2px offset, and low opacity Night Black. They should feel like a physical object resting just above the paper-like background.
- **Hierarchy:** Higher elevation levels are indicated by increasing the saturation of the "Cherry Cola" border or increasing the opacity of the glass surface.

## Shapes
Shape language is disciplined and geometric. Use **Soft (0.25rem)** roundedness for interactive components like buttons and inputs to provide a hint of modernity without losing the aggressive edge of the design system. Larger containers and cards should remain perfectly sharp (0px) to maintain a structural, monolith-like appearance.

## Components
- **Buttons:** Primary buttons use a solid Cherry Cola fill with Night Black text. No rounded corners (0px) for maximum intensity. Hover states should invert the colors or shift to a slightly brighter red.
- **Input Fields:** Use a 1px Night Black bottom border only (minimalist style). When focused, the border transitions to Cherry Cola with a subtle glass-tinted background.
- **Chips/Badges:** Small, uppercase Geist text inside a Night Black frame with high letter-spacing.
- **Cards:** Utilize the "Lens Effect"—semi-transparent glass surfaces with sharp 1px borders. No heavy drop shadows.
- **Lists:** Separated by thin, 0.5px Night Black rules. Hovering over a list item should trigger a Cherry Cola vertical "indicator" bar on the far left.
- **Checkboxes:** Square and sharp. When checked, they fill with Cherry Cola and a Night Black "X" instead of a checkmark for a more aggressive noir feel.