# TASKS: Portfolio MVP - Implementation Tasks

## Setup

- [x] **T-1: Initialize Astro project with Tailwind** ✅
  - RFs: RNF-1, RNF-4
  - Hecho cuando: `npm create astro@latest` corre sin errores y Tailwind está configurado en `astro.config.mjs`

- [x] **T-2: Create project structure and base files** ✅
  - RFs: RNF-1
  - Hecho cuando: Directorios `src/components/`, `src/layouts/`, `src/pages/`, `src/content/`, `src/i18n/`, `src/utils/` existen

## Layout & Navigation

- [x] **T-3: Create Base layout with head, meta tags, and global styles** ✅
  - RFs: RNF-1, RNF-2
  - Hecho cuando: `Base.astro` incluye `<head>`, fonts, y slot para contenido

- [x] **T-4: Create Navigation component with sidebar (desktop)** ✅
  - RFs: RF-1
  - Hecho cuando: Sidebar visible en desktop (≥768px) con enlaces a todas las secciones

- [x] **T-5: Implement scroll spy with IntersectionObserver** ✅
  - RFs: RF-1
  - Hecho cuando: Sección activa se resalta automáticamente al hacer scroll

- [x] **T-6: Create hamburger menu for mobile** ✅
  - RFs: RF-2
  - Hecho cuando: Menú hamburguesa aparece en móvil (<768px), abre/cierra correctamente

## i18n System

- [x] **T-7: Create i18n utility and translation files (es.json, en.json)** ✅
  - RFs: RF-10, RF-11
  - Hecho cuando: Traducciones para todas las etiquetas de UI existen en ambos idiomas

- [x] **T-8: Implement LanguageSelector component** ✅
  - RFs: RF-10
  - Hecho cuando: Selector cambia URL con `?lang=` y recarga la página

## Sections Content

- [x] **T-9: Create About section with markdown support** ✅
  - RFs: RF-3
  - Hecho cuando: Muestra nombre, bio (markdown renderizado), ubicación

- [x] **T-10: Create Experience section with data files** ✅
  - RFs: RF-4
  - Hecho cuando: Lista 2-4 experiencias con empresa, puesto, fechas, descripción markdown

- [x] **T-11: Create Projects section** ✅
  - RFs: RF-5
  - Hecho cuando: Muestra 3 proyectos con nombre, descripción, tecnologías, enlaces opcionales

- [x] **T-12: Create CV download button** ✅
  - RFs: RF-6
  - Hecho cuando: Botón descarga PDF al hacer clic

- [x] **T-13: Create Contact section with social icons** ✅
  - RFs: RF-7
  - Hecho cuando: Iconos LinkedIn y GitHub visibles y abren en nueva pestaña

## Blog

- [x] **T-14: Setup Content Collections for blog** ✅
  - RFs: RF-8, RF-9
  - Hecho cuando: Schema de blog define título, fecha, excerpt, lang en frontmatter

- [x] **T-15: Create blog index page** ✅
  - RFs: RF-8
  - Hecho cuando: Lista artículos ordenados por fecha, muestra título/fecha/excerpt

- [x] **T-16: Create blog article dynamic route** ✅
  - RFs: RF-8
  - Hecho cuando: `[...slug].astro` renderiza artículo completo desde Markdown

- [x] **T-17: Add sample blog articles (ES and EN)** ✅
  - RFs: RF-8, RF-9, RF-11
  - Hecho cuando: Al menos 2 artículos de ejemplo en cada idioma

## Main Page Assembly

- [x] **T-18: Assemble index page with all sections** ✅
  - RFs: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: Todas las secciones aparecen en orden, navegación funciona

## Testing

- [x] **T-19: Setup Playwright for E2E tests**
  - RFs: RNF-2, Constitution #4
  - Hecho cuando: `npm run test` corre y encuentra archivos spec

- [x] **T-20: Write home.spec.ts**
  - RFs: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: Test verifica sidebar, scroll spy, todas las secciones visibles

- [x] **T-21: Write language-switch.spec.ts**
  - RFs: RF-10, RF-11
  - Hecho cuando: Test verifica cambio de idioma recarga y muestra contenido correcto

- [x] **T-22: Write blog.spec.ts**
  - RFs: RF-8, RF-9
  - Hecho cuando: Test verifica listado y navegación a artículo

## Content & Data

- [x] **T-23: Create experience data files (ES/EN)**
  - RFs: RF-4, RF-11
  - Hecho cuando: JSON con 2-4 experiencias en ambos idiomas

- [x] **T-24: Create projects data files (ES/EN)**
  - RFs: RF-5, RF-11
  - Hecho cuando: JSON con 3 proyectos en ambos idiomas

- [x] **T-25: Create about data files (ES/EN)**
  - RFs: RF-3, RF-11
  - Hecho cuando: JSON con nombre, bio, ubicación en ambos idiomas

## Finalization

- [x] **T-26: Add CV PDF file** ✅
  - RFs: RF-6
  - Hecho cuando: `src/assets/cv/cv.pdf` existe y botón lo descarga

- [x] **T-27: Add social media URLs to config** ✅
  - RFs: RF-7
  - Hecho cuando: URLs de LinkedIn y GitHub configuradas y usadas en ContactIcons

- [x] **T-28: Run final build and verify** ✅
  - RFs: Todos
  - Hecho cuando: `npm run build` genera web sin errores

- [x] **T-29: Run all Playwright tests and fix failures** ✅
  - RFs: Todos
  - Hecho cuando: Todos los tests pasan verde
