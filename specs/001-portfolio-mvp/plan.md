# PLAN: Portfolio MVP - Implementation

## Module Structure

```
src/
├── components/
│   ├── Navigation.astro        # Sidebar (desktop) + Hamburger (mobile)
│   ├── NavLink.astro          # Single nav link with scroll-spy support
│   ├── Section.astro          # Reusable section wrapper
│   ├── LanguageSelector.astro # i18n switcher
│   ├── ContactIcons.astro     # LinkedIn/GitHub icons
│   ├── ProjectCard.astro      # Single project display
│   ├── ExperienceItem.astro   # Single experience entry
│   ├── BlogCard.astro         # Blog listing card
│   └── SeoHead.astro          # Meta tags, favicon
├── layouts/
│   └── Base.astro             # Main layout with <head>, sidebar slot
├── pages/
│   ├── index.astro            # Main portfolio page (all sections)
│   └── blog/
│       ├── index.astro         # Blog listing
│       └── [...slug].astro     # Single article
├── content/
│   ├── config.ts              # Content collections schema
│   ├── experience/
│   │   ├── experience.json     # ES: array of experiences
│   │   └── experience.en.json  # EN: array of experiences
│   ├── projects/
│   │   ├── projects.json
│   │   └── projects.en.json
│   ├── about/
│   │   ├── about.json
│   │   └── about.en.json
│   └── blog/
│       ├── article-1.md
│       └── article-2.md
├── data/
│   ├── config.ts              # Site config (name, urls, etc.)
│   └── navigation.ts          # Nav items structure
├── i18n/
│   ├── i18n.ts                # Translation utilities
│   ├── es.json                # Spanish translations
│   └── en.json                # English translations
├── utils/
│   ├── scroll-spy.ts          # IntersectionObserver for active section
│   └── markdown.ts            # Markdown processing utilities
├── styles/
│   └── global.css             # Tailwind imports, custom properties
└── assets/
    └── cv/
        └── cv.pdf             # CV file for download
```

---

## Technical Decisions

### TD-1: i18n Strategy (RF-10, RF-11)
**Decisión**: URL parameter approach (`?lang=es|en`) con regeneración estática de ambas versiones.

**Justificación**: 
- Spec requiere reload en cambio de idioma
- Astro SSG genera versiones estáticas por locale
- Sin estado JavaScript, SEO-friendly
- Content Collections filtran por `lang` en frontmatter

**Alternativa descartada**: Librería i18n runtime (react-i18next). Añade bundle JS innecesario, viola RNF-3 y constitución.

---

### TD-2: Scroll Spy (RF-1)
**Decisión**: IntersectionObserver API + Tailwind scroll classes.

**Justificación**:
- ~15 líneas de vanilla TS, ninguna dependencia
- IntersectionObserver es nativo en navegadores modernos
- Tailwind `scroll-smooth` + `scroll-mt-20` para offset del sidebar fijo

**Alternativa descartada**: Scrollama.js o GSAP ScrollTrigger. Overkill para un portfolio minimalista.

---

### TD-3: Mobile Menu (RF-2)
**Decisión**: Tailwind `peer-checked` pattern con checkbox hack.

**Justificación**:
- CSS-only toggle sin JavaScript
- Accesible con `:focus-visible`
- Transición suave con Tailwind

**Alternativa descartada**: React/Vue component. Viola constitución (stack mínimo).

---

### TD-4: Blog Content (RF-8, RF-9)
**Decisión**: Astro Content Collections con Markdown.

**Justificación**:
- Integración nativa de Astro, cero config extra
- Frontmatter valida schema automáticamente
- Filtro por `lang` en frontmatter para contenido bilingüe

**Alternativa descartada**: MDX. Overkill cuando no se necesita importar componentes en Markdown.

---

### TD-5: Data Structure for Static Content
**Decisión**: Archivos JSON por idioma en `src/content/`.

**Justificación**:
- Separación clara ES/EN
- Fácil de editar sin tocar código
- Content Collections validan schema en build time

**Alternativa descartada**: Hardcoded en componentes Astro. Difícil mantener, no reutilizable.

---

### TD-6: Scroll Smooth
**Decisión**: CSS `scroll-behavior: smooth` + `scroll-margin-top`.

**Justificación**:
- Navegadores modernos soportan `scroll-behavior: smooth`
- `scroll-margin-top` evita que el header fijo tape el contenido
- Sin JavaScript necesario

---

## Test Strategy (RNF-2, Constitution #4)

### E2E Tests (Playwright)

| Test | RFs Cubiertos | Descripción |
|------|--------------|-------------|
| `home.spec.ts` | RF-1,2,3,4,5,6,7 | Verifica secciones home, sidebar, scroll spy |
| `mobile-nav.spec.ts` | RF-2 | Menú hamburguesa abre/cierra, navegación |
| `language-switch.spec.ts` | RF-10, RF-11 | Cambio de idioma recarga y muestra contenido |
| `blog.spec.ts` | RF-8, RF-9 | Lista artículos, navegación a artículo |
| `cv-download.spec.ts` | RF-6 | Botón descarga archivo PDF |

**Criterios de cada test**:
1. Page renders without console errors
2. All navigation links are clickable
3. Content is visible (no empty sections)
4. Responsive behavior (mobile/desktop)

---

## File Inventory

| Archivo | RFs | Tipo |
|---------|-----|------|
| `Navigation.astro` | RF-1, RF-2 | Componente |
| `Section.astro` | RF-3,4,5,6,7 | Componente |
| `LanguageSelector.astro` | RF-10 | Componente |
| `index.astro` | Todos (home) | Página |
| `blog/index.astro` | RF-8 | Página |
| `blog/[...slug].astro` | RF-8 | Página |
| `experience.json` | RF-4 | Datos |
| `projects.json` | RF-5 | Datos |
| `es.json / en.json` | RF-10, RF-11 | i18n |
| `scroll-spy.ts` | RF-1 | Utilidad |
| `*.spec.ts` | Todos | Tests |

---

## Dependencias Adicionales

Solo se añade **Playwright** para E2E:
- Justificación: Constitución #4 requiere "al menos un test E2E por página"
- No añade runtime bundle
- Alternativas (Cypress, Vitest) descartadas por complejidad

---

## Build Commands

```bash
npm run dev      # Development server
npm run build    # Static build (ES + EN)
npm run preview  # Preview production build
npm run test     # Playwright E2E tests
```
