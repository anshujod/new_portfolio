# Product

## Register

brand

## Users

Primary: **tech recruiters and hiring managers** evaluating Anshu Prakash Hindoyar (full-stack engineer / applied AI, Bengaluru) for a role. They arrive from a resume link, LinkedIn, or a job application, usually skimming many candidates back-to-back, often on a laptop between meetings. They have low patience and high pattern-recognition: they have seen a thousand portfolios and can smell a template instantly. Their job-to-be-done in the first 10 seconds: *"Is this person real, does the work check out, and are they sharp enough to talk to?"*

Secondary: engineering leaders and founders who go deeper — they read the lab, the logs, and judge technical taste. The site should reward that deeper read without requiring it.

## Product Purpose

A personal portfolio presented as a fictional operating system — **ANSHU.OS** — where each section is a subsystem (boot sequence → desktop, kernel changelog = about, process constellation = skills, deployed missions = projects, AI lab = experiments in public, system logs = blog, command terminal = contact). The signature element is a real, functional `⌘K` command palette / terminal that actually navigates the site.

It exists to convert a skim into trust: prove with real shipped work (Chatify, AI ThumbnailGen, MERN auth system, Tata Steel YOLOv10 people-counting) that the ambition is earned, not claimed. Success = a recruiter leaves convinced this is a real, sharp engineer worth a conversation, and remembers the site.

## Brand Personality

**Precise · engineered · understated-confident.** The voice of well-architected software, not a marketing site. Three words: *precise, engineered, credible.* It should feel like a developer's actual digital home — unpretentious, technically authentic, a little dry — not portfolio theater. Confidence is shown through restraint and craft, never through volume. The OS metaphor is a quiet operating principle, not a costume; it earns its place by being functional (the terminal really works), not decorative.

## Anti-references

- **The generic AI/SaaS template look** — this is the #1 thing to defeat. If a viewer could think "AI made this," it has failed.
- Purple-to-blue decorative gradients, gradient text, glassmorphism-as-default, identical icon+heading+text card grids, hero-metric templates.
- Inter / Space Grotesk as the type system (overused tells). The existing Clash Display / General Sans / JetBrains Mono trio is deliberately *not* this — keep it.
- Decorative neon glow on everything, "black page + one neon accent" — the most common dark-mode AI cliché. The current site leans too far into glow/flash; pull back.
- Tiny uppercase tracked eyebrows and `01 / 02 / 03` numbered markers used as scaffolding on every section.
- Flashy-for-flashy's-sake. Reference site **rycerz.es** is the north star for restraint: near-monochrome dark, monospace technical metadata, real-time authentic touches, content over decoration.

## Design Principles

1. **Earned, not claimed.** Every ambitious framing is backed by linkable, real evidence (repos, live deploys, datasets, metrics). The site practices the engineering discipline it advertises.
2. **Credibility in ten seconds.** A recruiter skimming gets name, role, proof-of-real-work, and a resume path almost immediately. Depth is available beneath, never blocking.
3. **The metaphor must function.** The OS/terminal concept earns its keep by working (real `⌘K` navigation, real commands), not by looking thematic. If an OS flourish is purely decorative, cut it.
4. **Restraint is the flex.** Three loud moments at most (boot, constellation, terminal); everything else stays quiet and disciplined so those land. Precision and typographic confidence over effects.
5. **Color encodes meaning.** Accent discipline is a feature: blue = interactive, purple = AI/lab only, cyan = data/metrics only. Color carries information, never decoration.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. Body text ≥4.5:1 and large text ≥3:1 against every surface it sits on (audit the dim/faint ink ramp against the layered dark surfaces — the muted-gray-on-dark trap is the likely failure). Full `prefers-reduced-motion: reduce` support is mandatory given the boot sequence, Three.js particle field, and scroll reveals — each needs a crossfade/instant fallback, and content must never be gated behind a motion-triggered reveal. Keyboard-navigable command palette and visible focus states throughout.
