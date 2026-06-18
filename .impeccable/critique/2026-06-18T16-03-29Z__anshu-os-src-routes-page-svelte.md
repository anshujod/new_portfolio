---
target: the home page
total_score: 31
p0_count: 0
p1_count: 0
timestamp: 2026-06-18T16-03-29Z
slug: anshu-os-src-routes-page-svelte
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Boot log, live clock, active nav, terminal feedback; home largely static |
| 2 | Match System / Real World | 3 | Plain-word eyebrows (~/about, ~/skills, ~/projects, ~/logs, ~/contact) now label each themed title, so the decode layer is largely gone; themed titles still sit above the plain word |
| 3 | User Control and Freedom | 3 | Boot skippable, reduced-motion honored, nav persistent, ⌘K everywhere |
| 4 | Consistency and Standards | 4 | Consistent token system, mono voice, accent discipline; the `live` prompt is a principled variant, not a one-off |
| 5 | Error Prevention | 3 | Minimal destructive surface; terminal tolerates bad input |
| 6 | Recognition Rather Than Recall | 3 | Résumé + GitHub now visible in the hero (no longer recall-only via terminal); plain eyebrows aid recognition; advanced terminal commands still rely on recall |
| 7 | Flexibility and Efficiency | 4 | ⌘K palette, terminal accelerators, full keyboard path |
| 8 | Aesthetic and Minimalist Design | 3 | Clear CTA hierarchy now (primary vs ghost); hero density crept up slightly with the tertiary link row |
| 9 | Error Recovery | 3 | Terminal errors in alert color; limited home surface |
| 10 | Help and Documentation | 2 | Still no plain "what is ANSHU.OS?" orientation for a visitor who doesn't grok the metaphor; only the terminal `help` command |
| **Total** | | **31/40** | **Good — up from 29; remaining drag is concept orientation (Help)** |

## Anti-Patterns Verdict — Does this look AI-generated? **No.**

**LLM assessment:** Unchanged-strong. The concept is committed and functional, the system disciplined. The previous structural risk (uniform eyebrow reflex) is now mitigated by the two-tier cadence — interactive sections carry a blinking prompt, static ones don't — which reads as intentional rather than reflexive.

**Deterministic scan:** `detect.mjs` across the home page and all components returned **zero findings** (exit 0), same as the first run. No regressions introduced by the fixes.

**Visual overlays:** Not available (no browser-automation tool this session); findings are source review + deterministic scan.

## Overall Impression

The home page improved meaningfully where it counts for the stated audience. A recruiter skimming now gets the plain meaning of every section without decoding, a clear primary action, and the two links they reach for (résumé, GitHub) right under the hero. The concept is fully intact. The remaining gap is smaller and softer: there's still no lightweight orientation to *what ANSHU.OS is* for the visitor who doesn't immediately read the metaphor.

## What's Working

1. **The metaphor now has a plain-language floor.** Themed titles keep the personality; the eyebrow guarantees the plain read. Best-of-both, exactly the chosen direction.
2. **Recruiter path is shorter.** "view work" dominates, résumé/GitHub are one glance away, proof signals are scannable. The primary audience is served in the first viewport.
3. **Intentional cadence.** The `live` prompt differentiates the two interactive "loud" sections from the quiet ones, so the section rhythm no longer feels like one repeated stamp.

## Priority Issues

- **[P2] No lightweight orientation to the concept (Help, heuristic 10).** A first-timer who doesn't immediately grasp "ANSHU.OS" has no "about this site" affordance beyond the one-time boot log. **Why it matters:** the metaphor is load-bearing; a small orientation cue protects the visitors who don't decode it instantly. **Fix:** a single quiet line or a discoverable `help`/`about` hint that frames the site in one sentence. **Suggested command:** /impeccable onboard

- **[P2] The plain-eyebrow convention hasn't propagated to inner pages.** `/work`, `/lab`, `/log` headers should adopt the same plain-word eyebrow treatment or the home page will read as inconsistent once a recruiter clicks through. **Why it matters:** Consistency is currently a strength (4/10); divergence on inner pages would erode it. **Fix:** apply the same SectionHeader convention site-wide. **Suggested command:** /impeccable layout

- **[P3] Hero density crept up.** Eyebrow, H1, role, tagline, two CTAs, tertiary links, ⌘K hint, and the signals readout now stack in the hero. Still hierarchical, but watch for overload. **Fix:** if it feels heavy at smaller breakpoints, fold the ⌘K hint or tighten spacing. **Suggested command:** /impeccable layout

## Persona Red Flags

**Jordan (non-technical recruiter):** Now reads `~/skills`, `~/projects`, `~/about` above each themed title — the decode problem is largely resolved. Residual: no one-sentence "what is this site" cue.

**Alex (technical recruiter / eng lead):** Résumé and GitHub are now in the hero — the main prior red flag is fixed. Well served end to end.

**Sam (accessibility):** Still strong. New blinking prompt is `aria-hidden` and disabled under reduced-motion; CTA color/weight change keeps AA; tertiary links are real anchors with focus states.

## Minor Observations

- The `live` blinking prompt is a nice touch of life; confirm it never distracts from reading the section title (it sits in the small eyebrow, so low risk).
- Tertiary line uses `cat resume.pdf` phrasing — on-brand, and still an obvious link.

## Questions to Consider

- Would a single quiet sentence ("a portfolio that boots like an OS — press ⌘K") remove the last orientation gap without diluting the concept?
- Should clicking through to `/work` and `/log` feel identical in header treatment to the home sections? (It should, for consistency.)
