---
name: ANSHU.OS
description: A personal portfolio presented as a functional operating system — dark, monospace-voiced, precise.
colors:
  void: "#050507"
  substrate: "#0a0b10"
  panel: "#10121a"
  panel-up: "#161927"
  hairline: "#232738"
  ink: "#e8eaf2"
  ink-dim: "#98a0b8"
  ink-faint: "#7d83a0"
  signal: "#4d7cff"
  signal-glow: "#4d7cff26"
  pulse: "#b86eff"
  pulse-glow: "#b86eff26"
  trace: "#41e2d8"
  alert: "#ff6e5e"
typography:
  display:
    fontFamily: "Clash Display, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Clash Display, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Clash Display, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.05em"
rounded:
  focus: "2px"
  sm: "4px"
  md: "8px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  section: "clamp(6rem, 12vh, 10rem)"
components:
  button-primary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  card-mission:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  nav-link:
    backgroundColor: "{colors.void}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
    typography: "{typography.label}"
---

# Design System: ANSHU.OS

## 1. Overview

**Creative North Star: "A developer's real home, presented as a working operating system."**

ANSHU.OS is a personal portfolio that takes one metaphor seriously: the site is a system *built by* the engineer, not a brochure *about* him. Each section is a subsystem — boot sequence, kernel changelog, process constellation, deployed missions, AI lab, system logs, command terminal. The metaphor is grounded, never theatrical: it earns its place by being functional (the `⌘K` terminal genuinely navigates) rather than decorative. The reference north is rycerz.es — a dark, near-monochrome developer's home where monospace metadata and content do the work and nothing is flashy for its own sake.

The personality is **precise, engineered, understated-confident** — the voice of well-architected software read by a skimming recruiter who can smell a template instantly. Confidence is shown through restraint and craft, never volume. The palette is a *layered* dark with a faint blue-shift so the dark reads as depth, not a dead void; three accents carry strict semantic roles so color encodes information. Type pairs a geometric display face against a humanist body, with monospace as the persistent "system voice."

This system explicitly rejects the generic AI/SaaS look: no purple-to-blue decorative gradients, no gradient text, no glassmorphism-as-default, no identical icon+heading+text card grids, no neon glow smeared on everything. The single biggest failure mode to police is "black page + one neon accent" — the most common dark-mode AI cliché. Restraint is the flex.

**Key Characteristics:**
- Layered dark surfaces with a subtle blue-shift (depth, not flat black).
- Monospace as the system voice — labels, paths, metrics, terminal, timestamps.
- Strict accent discipline: blue = interactive, purple = AI/lab only, cyan = data only.
- Sharp, minimal radii and hairline borders; color and glow appear on interaction, not at rest.
- At most three "loud" moments (boot, constellation, terminal); everything else stays quiet.

## 2. Colors

A layered dark palette with a faint blue-shift in the neutrals and three strictly-roled accents — restrained by doctrine, not by accident.

### Primary
- **Signal Blue** (`#4d7cff`): The only color allowed on interactive elements site-wide — links, focus rings, primary CTAs, active nav, hover borders. Its consistency is what trains the visitor's eye.

### Secondary
- **Lab Purple** (`#b86eff`): Appears *only* inside the AI Lab and on AI-tagged content. When a visitor sees purple, it means "this is the AI stuff." Never decorative.
- **Trace Cyan** (`#41e2d8`): Appears *only* on data — metrics, terminal stdout, timestamps, status readouts. Never on text or interactive elements.

### Tertiary
- **Alert Coral** (`#ff6e5e`): Errors in the terminal, used sparingly. Never decorative.

### Neutral
- **Void** (`#050507`): Page background — the "off screen."
- **Substrate** (`#0a0b10`): Alternating section backgrounds.
- **Panel** (`#10121a`): Cards, terminal body.
- **Panel-Up** (`#161927`): Hover / raised state.
- **Hairline** (`#232738`): 1px borders and dividers only.
- **Ink** (`#e8eaf2`): Primary text.
- **Ink-Dim** (`#98a0b8`): Secondary text — tuned to pass AA (≥4.5:1) on panel/substrate.
- **Ink-Faint** (`#7d83a0`): Metadata, line numbers, mono labels — the lowest rung; verify AA before using on lighter surfaces.

### Named Rules
**The One Color Per Job Rule.** Each accent owns exactly one meaning. Signal = interactive, Pulse = AI, Trace = data. Using cyan on a link or purple outside the lab breaks the information system and is forbidden.

**The Two-Gradient Rule.** Gradients exist in exactly two places site-wide: the 1px `signal→pulse` border on the active/featured mission card, and the boot-screen scanline. Nowhere else — and never as text fill.

## 3. Typography

**Display Font:** Clash Display (with system-ui, sans-serif fallback)
**Body Font:** General Sans (with system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SF Mono fallback)

**Character:** A deliberately non-default trio. Clash Display is geometric and slightly brutal — chosen specifically because it is *not* Inter or Space Grotesk. General Sans is humanist enough to carry long-form logs and pairs on a real contrast axis with Clash. JetBrains Mono is the persistent OS voice that threads the whole site together.

### Hierarchy
- **Display** (600, `clamp(2.75rem, 6vw, 5.5rem)`, 1.02, `-0.03em`): The hero name only. Tight tracking, balanced wrapping. Ceiling is ~5.5rem — never let it shout past that.
- **Headline** (600, `clamp(2rem, 3.5vw, 3rem)`, 1.1, `-0.02em`): Section titles (h2).
- **Title** (600, `1.5rem`, `-0.02em`): Card and mission titles (h3).
- **Body** (400, `1.0625rem`, 1.6): Paragraphs and prose. Cap measure at 65–75ch (`--prose-max: 680px`).
- **Label** (400, `0.8125rem`, `0.05em`, uppercase): The mono "labeling voice" — section eyebrows, paths (`~/system/about`), metrics, timestamps, status.

### Named Rules
**The System Voice Rule.** Monospace is reserved for system-register text: paths, labels, metrics, terminal, timestamps, code. It is never used for body prose or headings. That separation is what makes the OS metaphor legible.

**The Display-Once Rule.** The full-size display face appears once per page (the hero). Everywhere else steps down to headline or below. Restraint keeps the one big moment loud.

## 4. Elevation

The system is **flat by default with tonal layering**, not shadow-based. Depth is conveyed by stepping through the surface ramp (void → substrate → panel → panel-up) and by 1px hairline borders — the way stacked glass sheets read as elevation. Drop shadows are essentially absent at rest.

### Shadow Vocabulary
- **Interactive glow** (`box-shadow: 0 0 0 1px var(--signal), 0 0 32px var(--signal-glow)`): Appears only on hover/focus of interactive cards and CTAs. It is feedback, not decoration — a momentary halo, never a resting state.
- **Interactive glow (pulse variant)** (`box-shadow: 0 0 0 1px var(--pulse), 0 0 32px var(--pulse-glow)`): The same hover halo in the lab accent. Used **only** on AI/Lab surfaces (e.g. experiment cards), so the hover feedback still encodes context.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat at rest; depth comes from the tonal ramp and hairlines. Glow is a *response* to state (hover, focus), never a default coat. If a glow is visible without interaction, it's wrong.

## 5. Components

The feel across the board: **precise and restrained** — sharp minimal radii, hairline borders, color and glow only on interaction.

### Buttons
- **Shape:** Gently squared (8px radius, `rounded-md`).
- **Primary:** Panel background (`#10121a`), ink text, hairline border, mono label with a leading accent glyph (`>`). Padding ~12px 20px.
- **Hover / Focus:** Border shifts to signal blue and the interactive glow appears (`0 0 0 1px signal, 0 0 32px signal-glow`). Lab CTAs use pulse instead of signal. Transition ~150ms with the project's ease-out.
- **Terminal-style links:** Bracketed mono actions (`[ case study ]`, `[ all missions → ]`) shift from signal to ink (or faint to signal) on hover. No background.

### Cards / Containers
- **Corner Style:** 8px radius (`rounded-md`).
- **Background:** Panel (`#10121a`), lifting to panel-up (`#161927`) on hover.
- **Shadow Strategy:** Flat at rest; interactive glow on hover only (see Elevation).
- **Border:** 1px hairline (`#232738`); shifts to signal on hover.
- **Internal Padding:** 24px. Mission cards lead with a mono status header (`MISSION-01 · DEPLOYED`), a status dot colored by state, title, summary, a mono stack line, cyan metrics, and bracketed footer actions.

### Inputs / Fields (Terminal)
- **Style:** Mono text on panel/void, hairline framing, a blinking caret and prompt glyph rather than a boxed input chrome.
- **Focus:** Signal-blue focus ring (`outline: 2px solid signal, offset 2px`).
- **Error:** Alert coral, terminal-style, sparse.

### Navigation
- **Style:** Fixed top bar, void at 70% with backdrop blur, hairline bottom border. Logo (`anshu.os`) + breadcrumb path in mono; nav items are mono route labels (`/work`, `/lab`, `/log`).
- **States:** Default ink-dim; hover lifts to ink with a panel background chip; active route is signal blue. A bracketed `⌘K` button opens the command palette.
- **Mobile:** Breadcrumb and ⌘K hint hide; nav labels tighten spacing.

### Command Palette / Terminal (Signature)
The defining component. A real, keyboard-driven `⌘K` palette and contact terminal that actually parses commands and navigates (`open work`, `cat resume`, `connect --github`). Mono throughout, cyan stdout, coral errors, signal prompt. It is the soul of the OS metaphor and must always *function*, never mimic.

## 6. Do's and Don'ts

### Do:
- **Do** keep accent discipline absolute: signal = interactive, pulse = AI/lab only, trace = data only. Color carries information.
- **Do** convey depth through the tonal surface ramp (void → substrate → panel → panel-up) and 1px hairlines, not drop shadows.
- **Do** keep glow as a hover/focus *response* only — flat at rest.
- **Do** keep monospace for system-register text (paths, labels, metrics, terminal) and never for body prose.
- **Do** verify ink-dim/ink-faint hit ≥4.5:1 (AA) on whatever surface they sit on; bump toward ink if it's even close.
- **Do** give every animation (boot sequence, particle field, scroll reveals) a `prefers-reduced-motion` crossfade/instant fallback, and never gate content visibility behind a motion-triggered reveal.
- **Do** keep the loud moments to three: boot, constellation, terminal. Everything else stays quiet.

### Don't:
- **Don't** ship the generic AI/SaaS template look. If a viewer could think "AI made this," it has failed.
- **Don't** use purple-to-blue decorative gradients, gradient text (`background-clip: text`), or glassmorphism-as-default.
- **Don't** build identical icon+heading+text card grids or the hero-metric template.
- **Don't** fall into "black page + one neon accent" — the most common dark-mode AI cliché. The layered ramp and accent discipline are the antidote.
- **Don't** use Inter or Space Grotesk; the Clash Display / General Sans / JetBrains Mono trio is deliberately not that.
- **Don't** smear neon glow on resting elements, add side-stripe borders (`border-left` > 1px as accent), or put a tracked uppercase eyebrow / `01 02 03` marker on every section as scaffolding.
- **Don't** let the OS metaphor become a costume — if a flourish is purely decorative and doesn't function, cut it.
