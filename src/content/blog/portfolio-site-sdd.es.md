---
title: "Cómo creé este portafolio en 1 día con Spec Driven Development y RAG"
date: 2026-07-01
excerpt: Un recorrido práctico por el proceso de construir este site con Spec Driven Development, desde el proceso guiado por spec hasta un chat RAG en la capa gratuita de Cloudflare.
lang: es
author: Diego Betancourt
---

La pregunta que siempre me hacía era: ¿por qué los proyectos se desvían tanto del plan inicial? Después de años iterando sobre procesos, encontré una respuesta parcial en lo que llamo **Spec Driven Development (SDD)**. Luego convertí la teoría en una feature funcional: un chat RAG que responde preguntas sobre mí directamente en el sitio.

Este artículo recorre ambas mitades. Primero, el proceso que mantuvo el build en curso. Después, un ejemplo concreto de extremo a extremo de ese proceso aplicado a una feature — **cómo el chat RAG fue especificado, planeado, dividido en tasks y lanzado con costo de servidor cero**.

## ¿Qué es Spec Driven Development?

SDD no es una metodología nueva. Es simplemente un compromiso: **nada de código sin spec, nada de spec sin validación**. Cada decisión técnica tiene un "por qué" documentado y un criterio de aceptación verificable.

:::note
El principio central: cada capa alimenta a la siguiente. La constitución define los principios innegociables. El spec responde el "qué". El plan responde el "cómo". Las tasks responden el "cuándo".
:::

```
┌─────────────────────────────────────────────────┐
│                  FLUJO SDD                       │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────┐    ┌──────────────┐          │
│   │ Constitución │───▶│     Spec     │          │
│   └──────────────┘    └──────┬───────┘          │
│                               │                  │
│                               ▼                  │
│                        ┌──────────────┐          │
│                        │     Plan     │          │
│                        └──────┬───────┘          │
│                               │                  │
│                               ▼                  │
│                        ┌──────────────┐          │
│                        │    Tasks     │          │
│                        └──────┬───────┘          │
│                               │                  │
│                               ▼                  │
│                        ┌──────────────┐          │
│                        │    Código    │          │
│                        └──────────────┘          │
└─────────────────────────────────────────────────┘
```

## Paso 1: La Constitución

Toda metodología necesita límites. Una constitución define qué **no** vamos a hacer, qué es innegociable. Para este portafolio, definí 6 principios:

:::tip
Una constitución no es una lista de deseos. Es un conjunto de restricciones que fuerzan mejores decisiones. Cuantos menos principios, más fuertes son.
:::

1. **Stack mínimo**: Astro + Tailwind CSS únicamente
2. **Spec primero**: Toda feature requiere spec antes de código
3. **Spec y código sincronizados siempre**
4. **Tests E2E mínimos** (constitución #4)
5. **Código en inglés**
6. **Zero dependencias runtime innecesarias**

## Paso 2: El Spec

Aquí empieza lo interesante. Un spec no es un documento de 40 páginas. Es la respuesta a: **¿qué queremos construir y cómo sabemos que está listo?**

### Requisitos Funcionales (RFs)

Cada requerimiento usa la notación EARS para eliminar ambigüedad:

```text
RF-1: Sidebar de navegación
  CUANDO el usuario está en desktop (≥768px)
  EL sidebar permanece visible en el lado izquierdo
  Y contiene enlaces a todas las secciones
  Y la sección activa se resalta dinámicamente (scroll spy)
```

:::note
La sintaxis EARS fuerza a pensar en:
- **CUANDO**: condición de activación
- **EL**: comportamiento esperado
- **Y**: condiciones adicionales
:::

### El Criterio "Hecho Cuando"

Cada task tiene un criterio verificable:

```text
T-4: Create Navigation component with sidebar (desktop)
  RFs: RF-1
  Hecho cuando: Sidebar visible en desktop (≥768px) 
                con enlaces a todas las secciones
```

:::warning
Sin un criterio "hecho cuando", estás adivinando cuándo una task está completa. Ahí es donde comienza el scope creep.
:::

## Paso 3: El Plan

El plan traduce el spec a estructura de código. Mapea requerimientos a módulos y define el orden de implementación:

```text
src/
├── components/       # Componentes reutilizables
├── content/          # Datos estáticos (JSON/MD)
├── i18n/             # Traducciones
├── layouts/          # Base layout
└── pages/            # Rutas
```

:::tip
El plan nunca debe contener código. Contiene decisiones, estructura y estrategia de validación. El código viene después.
:::

## Paso 4: Las Tasks

Aquí la teoría se convierte en práctica ejecutable. Cada task referencia RFs específicas y tiene un criterio de completitud verificable:

- **Setup** (T-1, T-2) — Fundación y design tokens
- **Layout & Navigation** (T-3 a T-6) — Estructura base
- **Sistema i18n** (T-7, T-8) — Soporte de idiomas
- **Contenido de Secciones** (T-9 a T-13) — Contenido core
- **Blog** (T-14 a T-17) — Artículos y lectura
- **Ensamblaje Página Principal** (T-18) — Integración
- **Testing** (T-19 a T-22) — Verificación

:::prompt
Pregúntate antes de cada task: "¿A qué RF sirve esto?" Si no puedes responder, la task no debería existir.
:::

## El Resultado

En 1 día teníamos:

- Página principal con 5 secciones
- Blog con artículos (ES + EN)
- Navegación con scroll spy
- Selector de idioma funcional
- Un chat RAG respondiendo preguntas sobre Diego
- Build estático verificado

## Caso de estudio: el chat RAG, de extremo a extremo

SDD suena abstracto hasta que lo ves triturar una feature real. El **chat** — un asistente RAG que responde preguntas sobre mí a partir de un único documento fuente — es el mejor ejemplo porque su spec se escribió por separado y toda la feature se lanzó en la **capa gratuita** de Cloudflare.

### Paso 2 aplicado: el Spec

El spec del chat (ver `specs/002-portfolio-IA-deploy/spec.md`) respondió *qué* estábamos construyendo antes de cualquier código:

- El chat se ubica justo después de **Proyectos**, antes de la Hoja de Vida.
- Las preguntas se limitan a **10 por sesión**, rastreadas en **Cloudflare KV** con un TTL de 24 horas.
- La respuesta se transmite en streaming al navegador en el **idioma activo del portfolio** (ES/EN), sin importar el idioma en que esté escrita la pregunta.
- Las preguntas fuera de alcance devuelven un mensaje bilingüe fijo y dirigen a Contacto.

Notablemente, el spec *justificó por qué no sobre-ingenierizar*: con un único documento fuente, una base de datos vectorial gestionada (Vectorize) o AutoRAG agregaban costo y una dependencia sin beneficio real. Esa contención es SDD haciendo su trabajo — infraestructura gratuita, un solo archivo.

### Paso 3 aplicado: el Plan

El plan (ver `specs/002-portfolio-IA-deploy/plan.md`) tomó dos decisiones de arquitectura clave:

1. **Pipeline 100% del lado del servidor en una sola Cloudflare Pages Function.** Sin embeddings ni búsqueda vectorial en el navegador — evita que el visitante descargue modelos pesados.
2. **Indexación en build-time.** Un script Node se ejecuta en cada build, lee el único archivo fuente, lo divide en fragmentos superpuestos, genera los embeddings vía Workers AI y los guarda en un JSON estático.

El modelo de generación quedó pendiente en el plan (el catálogo de Workers AI cambia seguido) y se resolvió en implementación con **`@cf/baai/bge-m3`** para embeddings (multilingüe, 100+ idiomas — sin necesidad de índice por idioma) y **`@cf/zai-org/glm-4.7-flash`** para las respuestas en streaming.

### Paso 4 aplicado: las Tasks

Las tasks convirtieron el plan en pasos concretos y verificables. El workflow que definieron:

- Un **build script** (`scripts/build-rag-index.ts`) lee la fuente, la divide en fragmentos (`300 palabras/fragmento`, `40 de solapamiento`), la embebe y escribe `rag-index.json`.
- Un **endpoint Cloudflare Worker** `POST /api/chat` que limita por tasa, embebe la pregunta, recupera los top-K fragmentos por similitud coseno, construye el prompt y transmite la respuesta en streaming.
- Módulos RAG reutilizables (`src/lib/rag/`): recuperación coseno, construcción de prompt con marcador de fuera de alcance, streaming con detección de marcador y rate limiting basado en KV.

Cada paso llevaba un criterio "hecho cuando", así que "el chat está listo" significaba algo específico y no una suposición.

### El pipeline RAG de un vistazo

```text
┌───────────── BUILD TIME ─────────────┐   ┌────────────── RUNTIME ──────────────┐
│                                      │   │                                      │
│  rag-source.md                       │   │  POST /api/chat                      │
│      │                               │   │      │                              │
│      ▼                               │   │      ▼                              │
│  chunk (300 palabras, 40 overlap)    │   │  revisa rate limit (KV, 10/sesión)  │
│      │                               │   │      │                              │
│      ▼                               │   │      ▼                              │
│  embed @cf/baai/bge-m3               │   │  embebe la pregunta (bge-m3)        │
│      │                               │   │      │                              │
│      ▼                               │   │      ▼                              │
│  rag-index.json (estático) ──────────┼──▶│  similitud coseno, top-K = 3        │
│                                       │      │                                  │
│                                       │      ▼                                  │
│                                       │  construye prompt (contexto + pregunta)│
│                                       │      │                                  │
│                                       │      ▼                                  │
│                                       │  transmite respuesta glm-4.7-flash ──▶ │
└───────────────────────────────────────┘   └─────────────────────────────────────┘
```

Cada paso está diseñado para seguir siendo gratuito: un solo documento hace que la recuperación sea un escaneo coseno trivial, no una búsqueda distribuida; y la cuota diaria estable de Workers AI (en lugar de la facturación beta de AutoRAG) mantiene el costo en cero.

:::note
La recuperación es deliberadamente simple. Como el corpus es un solo archivo, cargamos el índice precomputado en memoria y escaneamos todos los fragmentos — no hay nada que indexar, particionar ni ajustar. Elegir *no* agregar una base de datos vectorial fue la decisión de arquitectura que importó.
:::

Esta feature también importó para mi portfolio porque encarna el mismo principio que SDD: una única fuente de verdad (el documento y el spec) guiando todo lo aguas abajo.

## ¿Por qué funciona?

SDD no elimina la complejidad. La hace **explícita antes de escribir código**.

```text
SIN SDD                          CON SDD
"Implemento algo"                "Implemento RF-3 según spec"
"Creo que está listo"           "Hecho cuando: sección visible"
"¿Esto estaba en el plan?"      "Spec dice X, código hace X"
```

El chat RAG es prueba viva de esto. Su spec documentó *qué*, su plan *cómo* y sus tasks *cuándo* — así que cuando aparecieron edge cases (un mensaje de fuera de alcance definido, un rate limit, un modelo que debe transmitir en streaming), cada uno tenía un requerimiento preescrito y un criterio de aceptación. Nada se diseñó sobre la marcha.

:::note
El objetivo no es seguir el proceso ciegamente. El objetivo es tener un proceso que puedas **inspeccionar y mejorar**. SDD te da los artefactos para hacerlo — y el chat RAG es un artefacto con el que literalmente puedes conversar.
:::

Si tienes curiosidad por alguna pieza — la estrategia de chunking, la recuperación coseno, los trucos del streaming o el mapeo spec-código — pregúntale al chat de la página principal. Conoce este artículo mejor de lo que yo lo resumí.
