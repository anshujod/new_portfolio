# ANSHU.OS — Portfolio Design & Build Blueprint

**A complete design system, architecture, and development roadmap for a portfolio that feels like booting into a personal AI operating system.**

Stack: SvelteKit · Tailwind CSS · GSAP · Threlte/Three.js · MDsveX · Shiki · Cloudflare Pages

---

## 0. Strategic Reality Check (read this first)

Your brief frames you as "an obsessed AI engineer building LLM agents and football intelligence models." Your resume tells a slightly different — but genuinely strong — story: a full-stack engineer shipping production software (Azilora, 200+ users), with one serious applied-ML project (YOLOv10 people-counting at Tata Steel) and three well-engineered MERN products.

A recruiter who lands on a site claiming "Multi-Agent Research Assistant" and "World Cup Prediction Engine," then opens your GitHub and finds neither, loses trust instantly — and the entire premium aesthetic backfires. So the content strategy is:

1. **Ship the site with your real work, framed ambitiously but honestly.** Chatify, AI ThumbnailGen, the MERN Auth system, and the Tata Steel CV system are the four "missions." The CV project is your strongest AI credential — it leads.
2. **The AI Lab section becomes your forcing function.** It has two states: *deployed experiments* (the "Ask About Me" RAG chatbot — which you should actually build, because it's itself a portfolio piece) and *active research* (the football prediction engine, agents) shown as in-progress lab entries with real commit activity. "In progress, here's the repo" is credible. "Done" without evidence is not.
3. **The narrative arc the About section tells:** electronics student → full-stack shipper → computer vision in industry → now going deep on LLMs and agents. That's a true story, and it's a better story than a fabricated one, because it shows trajectory.

Everything below is designed around this honest version. When the football engine ships, it slots into a pre-built mission card — the architecture anticipates it.

---

## 1. The Concept: ANSHU.OS

The site is not a portfolio *about* an engineer; it is presented as a system *built by* one. Every section is a subsystem of a fictional operating system. This single metaphor drives every design decision and is what makes the site cohesive rather than a pile of effects:

| Portfolio section | OS metaphor | Route |
|---|---|---|
| Hero | Boot sequence → desktop | `/` |
| About | `system --history` (kernel changelog) | `/#about` |
| Skills | Process constellation (running modules) | `/#skills` |
| Projects | Deployed missions | `/work`, `/work/[slug]` |
| AI Lab | Live experiments / sandbox | `/lab` |
| Blog | System logs | `/log`, `/log/[slug]` |
| Timeline | Version history (v2022.0 → v2026.x) | `/#timeline` |
| Contact | Command terminal | `/#connect` |

**The signature element** (the one thing visitors remember): a persistent, functional **command palette / terminal** summoned with `⌘K` or `` ` `` from anywhere on the site. It's not decoration — it actually navigates (`open work`, `cat resume`, `connect --github`, `theme --light`), and it's the same component that powers the Contact section. One bold idea, executed deeply, instead of ten shallow ones.

Restraint rule: the boot sequence, the constellation, and the terminal are the three "loud" moments. Everything else — typography, spacing, cards, blog — stays quiet and disciplined so those three land.

---

## 2. Design System

### 2.1 Color tokens

Dark-mode-first, per the brief. The trap to avoid is "black page + one neon accent" — the most common AI-generated look. The fix: a *layered* dark palette with perceptible depth steps (so panels feel like glass sheets at different elevations), a restrained two-accent system with strict usage rules, and a phosphor tint in the neutrals so the dark isn't dead.

```css
:root {
  /* Surfaces — note the subtle blue-shift, not pure neutral */
  --void:        #050507;  /* page background, the "off screen" */
  --substrate:   #0A0B10;  /* section backgrounds */
  --panel:       #10121A;  /* cards, terminal body */
  --panel-up:    #161927;  /* hover / raised state */
  --hairline:    #232738;  /* 1px borders, dividers */

  /* Ink */
  --ink:         #E8EAF2;  /* primary text */
  --ink-dim:     #8A90A6;  /* secondary text */
  --ink-faint:   #4A4F63;  /* metadata, line numbers */

  /* Accents — strict roles, never decorative gradients */
  --signal:      #4D7CFF;  /* electric blue: interactive, links, focus */
  --signal-glow: #4D7CFF26;/* 15% alpha for glows/halos */
  --pulse:       #B86EFF;  /* neon purple: AI/Lab contexts ONLY */
  --trace:       #41E2D8;  /* cyan: data, metrics, terminal output ONLY */
  --alert:       #FF6E5E;  /* errors in terminal, sparingly */
}
```

**Accent discipline (this is what makes it feel premium):**
- `--signal` is the only color allowed on interactive elements site-wide.
- `--pulse` appears *only* inside the AI Lab and on AI-tagged blog posts — so when visitors see purple, it means "this is the AI stuff." Color encodes information.
- `--trace` appears *only* on data: metrics, terminal stdout, chart lines, timestamps.
- Gradients exist in exactly two places: a 1px `signal→pulse` border on the active mission card, and the boot-screen scanline. Nowhere else.

### 2.2 Typography

Three faces, three jobs:

| Role | Face | Why | Usage |
|---|---|---|---|
| Display | **Clash Display** (Fontshare, free) | Geometric, slightly brutal, not Inter/Space Grotesk (overused) | H1–H2 only, tight tracking `-0.03em`, weights 500/600 |
| Body | **General Sans** (Fontshare) | Humanist enough to read long blog posts, pairs with Clash | Paragraphs, UI, weights 400/500 |
| System | **Berkeley Mono** → fallback **JetBrains Mono** | The "OS voice" | Terminal, code, labels, metrics, timestamps, eyebrows |

Type scale (1.25 ratio, fluid with `clamp`):

```css
--text-hero: clamp(2.75rem, 6vw, 5.5rem);   /* boot title, H1 */
--text-h2:   clamp(2rem, 3.5vw, 3rem);
--text-h3:   1.5rem;
--text-body: 1.0625rem;  /* 17px — blog body, line-height 1.75 */
--text-ui:   0.9375rem;
--text-mono: 0.8125rem;  /* labels, terminal — letter-spacing 0.05em, often uppercase */
```

Rule: monospace is the *labeling* voice. Every section eyebrow is mono, uppercase, `--ink-faint`, prefixed like a path: `~/system/about`, `~/work/deployed`, `~/lab/experiments`. This one convention does more for the OS feeling than any animation.

### 2.3 Space, radius, elevation

- 8px base grid; section vertical rhythm `clamp(6rem, 12vh, 10rem)` — the site breathes.
- Max content width 1200px; blog prose 680px.
- Radius: 8px cards, 12px terminal/modals, 4px chips. Never pill-shaped buttons (too SaaS).
- Elevation = background step + hairline border + *glow*, never drop shadows: raised cards get `border-color: var(--hairline)` → on hover `box-shadow: 0 0 0 1px var(--signal), 0 0 32px var(--signal-glow)`. Light emits from elements; nothing casts shadows in the void.

### 2.4 Motion tokens

```css
--ease-out:   cubic-bezier(0.22, 1, 0.36, 1);   /* entrances */
--ease-inout: cubic-bezier(0.65, 0, 0.35, 1);   /* transitions */
--dur-fast:   160ms;  /* hovers */
--dur-base:   400ms;  /* reveals */
--dur-slow:   900ms;  /* hero, section choreography */
```

Global rule: `@media (prefers-reduced-motion: reduce)` collapses everything to opacity fades ≤200ms and kills the particle field. Non-negotiable for accessibility and Lighthouse.

---

## 3. Section-by-Section Design Spec

### 3.1 Hero — The Boot Sequence

**Beat 1 (0–2.2s, skippable):** Black screen. A mono-type boot log types itself, honest to your resume:

```
ANSHU.OS v2026.6  —  bengaluru, IN
> mounting /systems/fullstack ............ OK
> loading vision module (YOLOv10) ........ OK
> warming llm runtime .................... OK
> indexing 500+ solved problems .......... OK
> status: ONLINE
```

A thin cyan scanline sweeps once. Critically: **a "skip" hint appears immediately** (`press any key`), the sequence runs only on first visit per session (sessionStorage flag), and total time is under 2.5s. Boot sequences become hostile on second viewing.

**Beat 2:** The log collapses upward, the Threlte particle field fades in behind, and the identity resolves with a per-line stagger:

```
ANSHU PRAKASH HINDOYAR
Full-Stack Engineer / Applied AI
~ ships production software · trains vision models · building toward autonomous systems
```

Below: two commands styled as terminal input — `> view work` and `> open lab` — plus the `⌘K` hint. A rotating mono ticker under the fold shows live-ish stats: `leetcode: 1657 · users served: 200+ · dataset curated: 15,000 imgs`.

**Background:** one shared Threlte `<Canvas>` (fixed, full-viewport, behind everything) rendering ~1,200 GPU-instanced points connected by proximity lines — a neural graph that subtly parallaxes with pointer movement and reacts (nodes brighten) near the cursor. It persists across all routes at 6–8% opacity so the whole site shares one living background, dimming further when the blog reader is open. Mobile: static pre-rendered PNG of the field — no WebGL cost.

### 3.2 About — Kernel Changelog

Not paragraphs of passion. A vertical changelog, mono-labeled, scroll-revealed line by line:

```
v2022.0   flashed first kernel        — B.E. ECE, Ramaiah Institute of Technology
v2023.x   learned to ship             — MERN stack, DSA grind begins
v2025.3   vision module online        — Tata Steel: YOLOv10, ByteTrack, 15k-image dataset
v2025.x   products in the wild        — Chatify, ThumbnailGen, auth systems
v2026.1   production mode             — Azilora: 200+ users, 20+ shipped features
v2026.x   current branch              — LLMs, agents, retrieval — see /lab
```

Each entry expands on click to a sentence or two of real story. The honest arc *is* the storytelling.

### 3.3 Skills — Process Constellation

A 2D canvas (not 3D — keep WebGL budget for the hero) force-directed graph. Nodes = skills, clustered by domain (Languages / Web / ML & Vision / Data / Cloud), sized by depth, connected where they co-occur in projects. Hover a node → a side panel (terminal-style `inspect` output) shows: tools, years, and *which missions use it* — each linking to the project. The graph is data-driven from `src/lib/data/skills.json`, where each skill lists `projects: [slugs]`, so the constellation and mission cards can never drift out of sync.

Keyboard/screen-reader fallback: the same JSON renders as a structured list below the canvas (visually hidden until `prefers-reduced-motion` or no-JS, when it replaces the canvas).

### 3.4 Projects — Deployed Missions

Four mission cards in an asymmetric grid (featured card spans 2 columns). Each card:

```
┌─────────────────────────────────────────────┐
│ MISSION-03 · DEPLOYED          ● live        │
│ Chatify                                      │
│ Real-time messaging, secured & scaled        │
│ ── socket.io · jwt · zustand · mongodb ──    │
│ ▸ latency: websockets, no polling            │
│ ▸ rate-limited via arcjet                    │
│           [ case study ]  [ github ]  [ ↗ ]  │
└─────────────────────────────────────────────┘
```

Status chips carry real meaning: `DEPLOYED` (live demo exists), `FIELD-TESTED` (Tata Steel — ran in a real facility), `IN DEVELOPMENT` (future football engine). Hover: card lifts one elevation step, the signal glow ignites, and a muted 2–3s screen-capture loop crossfades in behind the content (lazy-loaded `<video>`, ~300KB webm).

**Case study pages** (`/work/[slug]`, MDsveX): problem → architecture diagram (hand-built SVG with animated data-flow dashes, not a screenshot of Excalidraw) → decisions & tradeoffs → metrics → what broke and what you'd change. That last section is what makes engineers respect it.

### 3.5 AI Lab

Purple-accent zone. Two halves:

**Ask About Me — the live experiment.** A chat interface trained on your resume, case studies, and blog posts. Build it for real (architecture in §7) — it's simultaneously a feature, a demo of RAG skills, and a case study subject. Seed it with suggested prompts: "What did he build at Tata Steel?", "Strongest backend work?", "Is he actually good at football analytics yet?" (let it answer that one honestly — disarming and memorable).

**Experiments log.** Cards for in-flight work (football prediction engine, agent experiments) showing: hypothesis, current status, repo link, last-commit timestamp pulled from the GitHub API at build time. Live commit dates make "in progress" credible.

### 3.6 Blog — System Logs (`/log`)

Index: dense, fast, sortable list (Linear-style), each row `date · title · category chip · read time`. Categories: AI, Engineering, Projects, Career — each with its accent mapping (AI posts get `--pulse` chips).

Reader page is where you go quiet and disciplined — the Stripe/Vercel feeling comes from typography, not effects: 680px measure, 17px/1.75 body, generous headings, Shiki `vesper`-tweaked theme matching the palette, copy buttons, sticky ToC (desktop, built from rendered headings via a `rehype` pass), top progress bar (1.5px, `--signal`), reading time, prev/next, and related posts by shared category. Particle background dims to 3% here.

### 3.7 Timeline — Version History

Merged into About's changelog (§3.2) — two timeline sections on one site is redundancy, and the brief's Timeline content (year/milestone/achievements) is exactly what the changelog shows. Achievements (LeetCode 1657, CTF 3rd, AAVISHKAAR 1st, IEEE/E-Cell roles) appear as `[badge unlocked]` entries inline.

### 3.8 Contact — The Terminal, For Real

The same command palette component, embedded full-width. A blinking prompt with autocomplete:

```
anshu@os:~$ help
  connect --linkedin | --github | --leetcode
  send "your message"        → opens prefilled mailto / form POST
  cat resume                 → downloads PDF
  whoami                     → easter egg
anshu@os:~$ _
```

Tab-completion, arrow-key history, and a few easter eggs (`sudo hire-me`, `vim` → "no exit. ever."). Below it, plain accessible links to the same destinations — the terminal is the experience, the links are the guarantee.

---

## 4. Site Architecture & Routes

```
/                     Landing: boot → hero → about → skills → missions preview → lab preview → connect
/work                 All missions (filterable by status/stack)
/work/[slug]          Case study (MDsveX)
/lab                  AI Lab: Ask-About-Me chat + experiments log
/log                  Blog index (filterable by category)
/log/[slug]           Article reader
/log/rss.xml          RSS (server endpoint)
/sitemap.xml          Sitemap (server endpoint)
/api/ask              POST → RAG chatbot (server route → Workers AI / external LLM)
/api/github           Cached repo metadata for Lab cards
/resume.pdf           Static
```

Rendering strategy: **everything prerendered** (`export const prerender = true`) except the two `/api` routes, which run on Cloudflare Pages Functions via `@sveltejs/adapter-cloudflare`. Static HTML + edge functions = the Lighthouse-95+ path.

## 5. Component Hierarchy

```
src/lib/components/
├── system/                     # the OS chrome — shared everywhere
│   ├── BootSequence.svelte     # session-gated, skippable
│   ├── ParticleField.svelte    # Threlte canvas, persists across routes
│   ├── CommandPalette.svelte   # ⌘K — THE signature component
│   ├── Terminal.svelte         # parser/IO core, reused by palette + contact
│   ├── NavBar.svelte           # mono breadcrumb: anshu.os ▸ /work
│   ├── Footer.svelte
│   └── CursorGlow.svelte       # desktop-only radial pointer glow
├── ui/                         # primitives
│   ├── Button.svelte  Chip.svelte  GlowCard.svelte
│   ├── SectionHeader.svelte    # mono eyebrow path + display title
│   ├── Reveal.svelte           # GSAP scroll-reveal action wrapper
│   └── MagneticLink.svelte
├── home/
│   ├── Hero.svelte  Changelog.svelte  SkillConstellation.svelte
│   ├── MissionGrid.svelte  LabTeaser.svelte  ConnectTerminal.svelte
├── work/
│   ├── MissionCard.svelte  ArchDiagram.svelte  MetricRow.svelte
├── lab/
│   ├── AskAnshu.svelte  ChatMessage.svelte  ExperimentCard.svelte
└── log/
    ├── PostRow.svelte  Toc.svelte  ProgressBar.svelte
    ├── CodeBlock.svelte (Shiki + copy)  RelatedPosts.svelte  ShareRow.svelte
```

`Terminal.svelte` deserves emphasis: one command parser (a simple registry of `{ name, args, run }` objects in `src/lib/terminal/commands.ts`) powers the ⌘K palette, the contact section, and boot-screen key handling. Single source of truth for the site's defining interaction.

## 6. Folder Structure

```
anshu-os/
├── src/
│   ├── lib/
│   │   ├── components/        # as above
│   │   ├── data/              # skills.json, missions/*.md frontmatter source, site.ts
│   │   ├── terminal/          # commands.ts, parser.ts, history.ts
│   │   ├── three/             # particle field scene, instancing utils
│   │   ├── motion/            # gsap context helpers, reveal presets, reducedMotion store
│   │   └── server/            # rag/ (chunks.json, embed.ts, retrieve.ts), github.ts
│   ├── content/
│   │   ├── work/*.svx         # case studies
│   │   └── log/*.svx          # blog posts
│   ├── routes/                # as in §4 (+layout.svelte hosts ParticleField + palette)
│   ├── styles/                # tokens.css, base.css, prose.css
│   └── app.html
├── scripts/
│   ├── build-rag-index.ts     # embeds content → static chunks.json at build
│   └── og-images.ts           # satori → per-post OG images at build
├── static/                    # fonts (woff2, self-hosted), resume.pdf, fallback-field.png
├── svelte.config.js           # MDsveX + Shiki + adapter-cloudflare
├── tailwind.config.js         # maps Tailwind theme to the CSS variables in §2
└── wrangler.toml
```

---

## 7. Key Implementation Decisions (the hard 20%)

**MDsveX + Shiki** — highlight at build time, zero client JS for code:

```js
// svelte.config.js (essentials)
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({ themes: ['vesper'], langs: ['ts','svelte','py','bash'] });

export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [mdsvex({
    extensions: ['.svx'],
    highlight: { highlighter: (code, lang) =>
      `{@html \`${highlighter.codeToHtml(code, { lang, theme: 'vesper' }).replaceAll('`','\\`')}\` }` },
    rehypePlugins: [rehypeSlug, rehypeToc]   // slugs feed the ToC component
  })]
};
```

Posts load via `import.meta.glob('/src/content/log/*.svx')` in `+page.server.ts` for the index (frontmatter only) and dynamic import in `[slug]/+page.ts` for the reader. Reading time computed at build from raw markdown word count.

**Persistent Threlte field** — mount `<ParticleField/>` once in `+layout.svelte` so route changes never re-init WebGL. Use `InstancedMesh` (or `Points` with a custom shader) for the nodes and a single `LineSegments` buffer recomputed at low frequency (every 4th frame) for proximity links. Cap `devicePixelRatio` at 1.5. Pause the RAF loop via `IntersectionObserver`/`visibilitychange`. Bail to the static PNG when `matchMedia('(pointer: coarse)')` or reduced-motion.

**The RAG chatbot, cheaply and honestly:**
1. *Build time:* `scripts/build-rag-index.ts` chunks resume + case studies + posts (~150–300 token chunks), embeds them (Workers AI `bge-base-en-v1.5` or OpenAI `text-embedding-3-small`), writes `chunks.json` (vectors + text). At your content size this is a few hundred KB — no vector DB needed.
2. *Runtime:* `/api/ask` (Pages Function) embeds the query, cosine-sims over the static index, stuffs top-4 chunks into a system prompt ("Answer only from context; if unknown, say so"), calls a small fast model (Workers AI Llama-3.1-8B keeps it $0 on the free tier), streams the response.
3. *Guardrails:* rate-limit by IP (you've done this with Arcjet — reuse the pattern), 4-message context window, hard token caps, canned refusal for off-topic prompts. Then write the blog post "I built the chatbot on my portfolio" — content begets content.

**GSAP in Svelte, leak-free:** wrap everything in `gsap.context()` inside `onMount`, revert on destroy; register `ScrollTrigger` once in a shared module. Expose a `use:reveal={{ y: 24, stagger: 0.06 }}` Svelte action so sections opt in declaratively. Page transitions: a 250ms scanline wipe via `onNavigate` + View Transitions API, with GSAP fallback.

---

## 8. Animation Strategy

Choreography over quantity — three orchestrated moments, then ambient quiet:

1. **Boot → hero resolve** (the opener, §3.1) — GSAP timeline, ~2.2s, skippable, once per session.
2. **Scroll reveals** — one shared preset (opacity 0→1, y 24→0, `--ease-out`, 60ms stagger) applied via the `reveal` action. Changelog entries draw their connecting line with `stroke-dashoffset` as they enter. Mission cards stagger in per row. Nothing animates more than once.
3. **Micro-interactions** — magnetic pull (≤6px) on primary buttons; card glow ignition at 160ms; terminal caret blink; cursor glow. All ≤200ms, all GPU-composited (transform/opacity only — never animate layout properties).

Reduced-motion collapses 1→instant, 2→fade-only, 3→off (except focus styles, which are never animated away).

## 9. Content & Data Architecture

- **Missions:** one `.svx` per project; frontmatter = `{ title, slug, status, stack[], metrics[], repo, demo, order, featured }`. Cards render from frontmatter; case study body is the page.
- **Skills:** `skills.json` — `{ id, label, domain, depth, tools[], projects[] }` — single source for constellation + accessible list + card chips.
- **Blog:** `.svx` with `{ title, date, category, summary, draft }`; drafts excluded from prerender, RSS, sitemap.
- **GitHub data:** fetched at build (and revalidated by `/api/github` with 1h cache) — last commit per Lab repo.
- **No CMS, no database.** Content is code; deploys are publishes. The only stateful pieces are the two edge functions.

## 10. SEO Plan

- Per-route `<svelte:head>` via a `Seo.svelte` component: title template `{page} · anshu.os`, description, canonical (`https://anshu.dev` + path).
- OpenGraph/Twitter cards with **build-time generated OG images** (satori + resvg: dark panel, mono path label, post title in Clash Display) — every shared link looks designed.
- JSON-LD: `Person` (sitewide, with `sameAs` → GitHub/LinkedIn/LeetCode), `BlogPosting` per post, `SoftwareSourceCode` per case study.
- `sitemap.xml` + `rss.xml` as prerendered server endpoints; `robots.txt`; trailing-slash policy set once in `svelte.config`.
- Prerendered HTML means full content for crawlers with zero hydration dependency.

## 11. Performance Budget

| Budget | Target |
|---|---|
| JS on `/` (gzip, excl. three) | < 90 KB |
| Three.js chunk | lazy, dynamic-imported after first paint, desktop only |
| Fonts | 3 families × 2 weights, woff2 subset, self-hosted, `font-display: swap` |
| LCP | < 1.8s (hero text is HTML, not canvas) |
| CLS | 0 (boot sequence reserves full viewport) |
| Lighthouse | ≥ 95 all categories |

The single most important call: the hero headline is real text painted immediately; WebGL and GSAP enhance *after* LCP.

## 12. Development Roadmap

**Phase 1 — Skeleton (wk 1):** SvelteKit + Tailwind + adapter-cloudflare; tokens.css; fonts; layout, nav, footer; deploy pipeline to Cloudflare Pages on day one (deploy early, optimize against real Lighthouse numbers).

**Phase 2 — Content spine (wk 2):** MDsveX + Shiki; write all four case studies and two launch blog posts; missions grid + reader page with ToC/progress/copy-code; SEO component, sitemap, RSS, OG image script. *The site is already shippable here — plain but complete.*

**Phase 3 — The OS layer (wk 3):** Terminal core + command palette + contact terminal; boot sequence; changelog/About; GSAP reveal action across sections; page transitions.

**Phase 4 — Ambient & constellation (wk 4):** Threlte particle field (with mobile/reduced-motion fallbacks); skill constellation + accessible fallback; cursor glow, magnetic buttons; performance pass against budgets.

**Phase 5 — AI Lab (wk 5):** RAG index script; `/api/ask` function with rate limiting; chat UI with streaming; experiments log + GitHub freshness; write the "how I built it" post.

**Phase 6 — Polish (ongoing):** cross-device QA, keyboard-only audit, axe pass, real-user Lighthouse, easter eggs, then start the football engine in public — its lab entry is already waiting.

---

## Final note on taste

The brief lists ten effects; the sites it admires (Linear, Vercel, Stripe) are admired for *restraint*. This blueprint deliberately spends its boldness in three places — the boot, the constellation, the terminal — and keeps everything else typographic and quiet. If you ever feel a section is underwhelming, the fix is almost always better copy and better case-study substance, not another particle system. Recruiters remember "the guy whose site I could *talk to*, whose case studies explained tradeoffs" far longer than they remember a glow.
