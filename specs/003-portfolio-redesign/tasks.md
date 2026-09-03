# TASKS: Portfolio Redesign — Diego Betancourt

**Target Directory:** `specs/003-portfolio-redesign/tasks.md`  
**Core Objective:** Execute visual redesign based on `plan.md` using Editorial Minimalism, strict monochrome visual hierarchy, and high technical precision without altering existing content, architecture, or Cloudflare deployment.

---

## Technical Specifications & Architecture Decisions

* **Font Strategy:** Local NPM bundling via `@fontsource/geist` and `@fontsource/geist-mono` for zero external runtime latency.
* **Typography:** Modern, clean sans-serif (`Geist`) paired with monospace (`Geist Mono`) for technical metadata and structural labeling.
* **Palette:** Strict 100% monochrome spectrum (`zinc-950`, `zinc-900`, `zinc-800`, `zinc-400`, `zinc-100`, `white`). Zero accent colors.
* **Layout Pattern:** Open editorial dividers (`border-b border-zinc-800/60`) instead of boxed card grids.
* **RAG Chat Interface:** Clean, document-style Q&A answer box integrated seamlessly into the editorial grid.
* **CV Download Path:** Dynamic path sourced from centralized config for easy future updates.

---

## Phase 1: Setup, Fonts & Design System

- [x] **T-1: Install Fontsource dependencies and configure font tokens**
  - **Decisions/RFs:** D1, D3, P1
  - **Details:** Add `@fontsource/geist` and `@fontsource/geist-mono` to `package.json`. Import fonts in global CSS or `Base.astro`. Configure Tailwind/CSS variables for font families: `font-sans` and `font-mono`.
  - **Hecho cuando:** Fontsource packages are installed, fonts render locally from bundled assets without external Google Fonts network calls, and `font-sans` / `font-mono` utilities work across pages.

- [x] **T-2: Define monochrome design tokens and global CSS baseline**
  - **Decisions/RFs:** D1, D2, D3, D4, P4
  - **Details:** Configure CSS variables / Tailwind tokens in `src/styles/` or `astro.config.mjs`:
    - **Typography Scale:** `display` (`text-4xl` to `text-6xl`, `tracking-tight`), `h1`, `h2`, `h3`, `body`, `body-small`, `metadata` (`font-mono text-xs tracking-wider uppercase`).
    - **Monochrome Color Palette:** Background (`zinc-950` / `white`), text primary (`zinc-100` / `zinc-900`), text secondary (`zinc-400` / `zinc-600`), borders (`zinc-800/60` / `zinc-200/80`).
    - **Spacing Scale:** `xs` (0.25rem), `sm` (0.5rem), `md` (1rem), `lg` (1.5rem), `xl` (2rem), `2xl` (3rem), `3xl` (4rem), `section` (6rem to 8rem).
  - **Hecho cuando:** Global design tokens are defined, raw color hex codes are replaced with zinc variables, and global selection/focus styles match the strict monochrome design.

- [x] **T-3: Refactor base layout framework (`Base.astro`)**
  - **Decisions/RFs:** D1, D3, D9, RNF-2
  - **Details:** Update `Base.astro` body container to use an editorial canvas structure (`max-w-5xl` or `max-w-6xl` centered grid). Establish crisp default line heights (`leading-relaxed` for reading, `leading-none` or `leading-tight` for headings) and smooth scroll behavior.
  - **Hecho cuando:** `Base.astro` provides a consistent full-viewport layout shell with monochrome background rendering and anti-aliased font setup.

---

## Phase 2: Navigation & Structural Shell

- [x] **T-4: Redesign desktop navigation and sidebar**
  - **Decisions/RFs:** D1, D4, RF-1
  - **Details:** Update `src/components/navigation/` using clean inline text triggers and monospace section numbers (e.g., `01 // ABOUT`, `02 // EXPERIENCE`). Preserve i18n URL queries (`?lang=es`, `?lang=en`) and section anchor logic.
  - **Hecho cuando:** Navigation displays cleanly at $\ge 768	ext{px}$, uses horizontal border accents, and highlights the active section in crisp monochrome without heavy background pills.

- [x] **T-5: Redesign mobile navigation drawer**
  - **Decisions/RFs:** D1, D9, RF-2
  - **Details:** Refactor mobile menu overlay (<768px). Implement a full-screen or slide-down minimalist container featuring high-contrast monospace section triggers and border dividers (`border-b border-zinc-800`).
  - **Hecho cuando:** Mobile menu opens smoothly, locks background scroll, closes on section selection, and respects safe area insets on mobile viewports.

- [x] **T-6: Adjust scroll spy visual feedback**
  - **Decisions/RFs:** D8, RF-1
  - **Details:** Refine `IntersectionObserver` thresholds in navigation scripts to trigger subtle text state shifts (e.g., `text-zinc-400` to `text-zinc-100`) as sections enter viewport center.
  - **Hecho cuando:** Active section state updates in real-time during scroll without causing layout jitter or re-renders.

---

## Phase 3: Core Section Redesigns

- [x] **T-7: Redesign Hero / Home section**
  - **Decisions/RFs:** D7, P2, P4, RF-4
  - **Details:** Rebuild `Home` section to present senior positioning. Feature high-contrast display typography for Diego's role and focus, concise supporting text, and clean metadata indicators (location, architecture specialty). Remove card wrappers or badge clouds.
  - **Hecho cuando:** Hero communicates executive senior engineering depth using large typography scale, generous negative space, and aligned primary text links.

- [x] **T-8: Redesign About section**
  - **Decisions/RFs:** D1, D3, P2, RF-3
  - **Details:** Format `About` content into an editorial grid. Keep English and Spanish text exact and untouched. Style location data and summary points using precise metadata headers (`LABEL // VALUE`).
  - **Hecho cuando:** Section reads as an editorial profile with strict column alignment, optimal measure/character line lengths, and thin border dividers.

- [x] **T-9: Transform Experience section into an Editorial Timeline**
  - **Decisions/RFs:** D5, P1, P4, RF-4
  - **Details:** Eliminate card grid wrappers in `Experience`. Structure entries sequentially along an open timeline:
    - **Header:** Role, Company, Dates (`Present` / `Presente` handling), Location.
    - **Body:** Clear narrative/bullet points covering high-impact decisions and technical responsibilities.
    - **Metadata:** Monospace technical environment tags positioned as secondary inline metadata.
  - **Hecho cuando:** Career progression is rendered as a clean, open vertical timeline separated by `border-b border-zinc-800/60` lines rather than enclosed card containers.

- [x] **T-10: Restructure Projects section into Technical Case Studies**
  - **Decisions/RFs:** D6, P2, RF-5
  - **Details:** Convert project listings from media grid cards into structured open case study rows. Organize content logically:
    ```text
    Project Title & External Links (↗)
      ↓
    Problem / Context
      ↓
    Architecture & Technical Decisions
      ↓
    Outcome & Impact
      ↓
    Tech Stack (Geist Mono inline labels)
    ```
  - **Hecho cuando:** Projects prioritize engineering decisions, problem statements, and outcomes over tech stack icons, separated by horizontal divider lines.

- [x] **T-11: Style RAG Chat Section (`ChatSection.astro`) as a Minimalist Q&A Box**
  - **Decisions/RFs:** D1, D2, P1, RF-12, RF-13
  - **Details:** Refactor `src/components/ChatSection.astro` visually to look like an editorial Q&A document answer box:
    - Clean input field with subtle border state (`border-zinc-800` focusing to `border-zinc-400`).
    - Output rendering area styled in clear reading prose with `Geist Mono` metadata labels for source/confidence states.
    - Keep backend Cloudflare Function (`api/chat.ts`), client logic (`chat-client.ts`), and vector index (`rag-index.json`) untouched.
  - **Hecho cuando:** Chat widget matches the monochrome editorial aesthetic, retains full RAG functionality, and renders response streams in a clean Q&A document block.

- [x] **T-12: Redesign Blog index and article templates**
  - **Decisions/RFs:** D10, D1, RF-8, RF-9
  - **Details:** Refactor blog listing page and `[...slug].astro` layout. Apply minimal date/reading time headers, monospace category indicators, and single-column editorial reading layouts (`prose-invert` styled with monochrome design tokens).
  - **Hecho cuando:** Blog index lists posts cleanly with date metadata, individual articles render Markdown with clear typography hierarchy, and syntax highlighting conforms to the monochrome palette.

- [x] **T-13: Redesign Contact section and centralized CV trigger**
  - **Decisions/RFs:** D10, RF-6, RF-7
  - **Details:** Refactor `Contact` section. Present social links (LinkedIn, GitHub) as minimalist text links with arrow icons (`↗`). Implement the CV download button as a clean text trigger referencing a centralized config constant for the path (e.g., `PUBLIC_CV_PATH`).
  - **Hecho cuando:** External links open safely (`target="_blank" rel="noopener noreferrer"`), CV download functions properly via configurable path, and section maintains strict monochrome styling.

---

## Phase 4: Micro-interactions, Reduced Motion & Viewport Polish

- [x] **T-14: Implement subtle micro-interactions & accessibility motion rules**
  - **Decisions/RFs:** D8, P3, RNF-3
  - **Details:** Apply subtle hover transitions (`transition-opacity duration-200 ease-out`). Enforce strict motion controls: wrap transitions in `@media (prefers-reduced-motion: reduce)` to disable non-essential animations for sensitive users.
  - **Hecho cuando:** Hover effects feel quiet and precise, scroll Hijacking or particle effects are completely absent, and `prefers-reduced-motion` suppresses all transitions.

- [x] **T-15: Responsive layout audit across viewports**
  - **Decisions/RFs:** D9, RNF-3
  - **Details:** Verify responsive presentation at key viewports: 375px, 390px, 430px (mobile) and 1280px, 1440px, 1920px (desktop). Ensure zero horizontal scroll (`overflow-x-hidden`) and appropriate text scaling.
  - **Hecho cuando:** Layout flows naturally across all devices without text clipping, awkward word wraps, or horizontal layout breaking.

---

## Phase 5: Automated Testing & Production Verification

- [x] **T-16: Update and execute Playwright E2E test suite**
  - **Decisions/RFs:** Section 6, RNF-2
  - **Details:** Execute existing tests (`tests/e2e/homepage.spec.ts`, `tests/e2e/chat.spec.ts`, `tests/e2e/language-switch.spec.ts`, `tests/e2e/blog.spec.ts`). Update selectors if DOM structure changed, keeping functional assertions intact.
  - **Hecho cuando:** `npm run test` executes completely with 100% passing tests across all spec files.

- [x] **T-17: Validate production build & checklist audit**
  - **Decisions/RFs:** Section 8, Section 9
  - **Details:** Run `npm run build` to verify Cloudflare static and worker bundle generation. Conduct manual check against Section 8 criteria:
    - Monochrome palette intact.
    - Zero content altered or removed.
    - Experience timeline uses open layout (no card grids).
    - Projects formatted as technical case studies.
    - Chat, blog, language switching, and CV download working seamlessly.
  - **Hecho cuando:** `npm run build` succeeds without warnings or errors, and all items in the redesign checklist are satisfied.