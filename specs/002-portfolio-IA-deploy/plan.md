# PLAN: Chat RAG — Portfolio Diego Betancourt

Basado en `specs/002-portfolio-IA-deploy/spec.md`. No contiene código — solo estructura, decisiones y estrategia de tests para que `tasks.md` las ejecute.

---

## 0. Resolución de dudas abiertas (entrada para este plan)

| Duda del spec | Respuesta |
|---|---|
| ¿Entrada navegable en sidebar? | Sí, título **"Chatea con Diego"** |
| Formato del documento fuente | **Markdown** |
| Texto de "fuera de alcance" | Usa **"sección de contacto"** (no "formulario") |
| Límite de preguntas por sesión (N) | **10** por defecto, configurable por variable de entorno |
| Modelo de generación específico | Definido en este plan (sección 3, D4) |

---

## 1. Cumplimiento de `constitution.md`

| Regla | Cómo se cumple en este plan |
|---|---|
| 1. Stack mínimo (Astro + Tailwind, sin frameworks UI) | El chat se construye con un componente `.astro` + `<script>` vanilla (sin React/Vue/Svelte). Único paquete nuevo: el adaptador oficial `@astrojs/cloudflare` (necesario para desplegar en Cloudflare Pages con una ruta dinámica; no es un framework UI ni un bundler extra — ver D2). |
| 2. Spec primero | `spec.md` debe residir en `specs/chat-rag/spec.md`. Este `plan.md` y el futuro `tasks.md` viven en la misma carpeta. |
| 3. Spec y código sincronizados | **Acción pendiente antes de codear**: el spec base (RNF-1: "100% estática, sin runtime") queda en tensión con esta feature (un endpoint sí es dinámico). Se recomienda añadir una línea de aclaración al spec base: *"Las páginas de contenido son estáticas; `/api/chat` es la única ruta dinámica, ejecutada como Cloudflare Function."* Esto debe resolverse antes de iniciar `tasks.md`. |
| 4. Test E2E mínimo por página (renderizado y links) | Se extiende el test E2E existente de la página principal para cubrir el nuevo link de navegación y la sección del chat (ver sección 4). |
| 5. Inglés en código | Todos los nombres de archivos, variables, funciones y comentarios de código en inglés (ver árbol de módulos). El *contenido* que Diego redacta en el documento fuente **no** está sujeto a esta regla — es contenido editorial, no código. |
| 6. Cero dependencias runtime innecesarias | Ver tabla de dependencias (sección 5). Ningún paquete de ML/embeddings en el cliente; para tests unitarios se usa el test runner nativo de Node (`node:test`) en vez de sumar Vitest/Jest. |

---

## 2. Estructura de módulos

```
specs/
  chat-rag/
    spec.md
    plan.md
    tasks.md                      # (siguiente entregable)

src/
  components/
    ChatSection.astro             # RF-12 — markup + estilos Tailwind de la sección de chat
  scripts/
    chat-client.ts                # RF-13, RF-15, RF-16, RF-18 — lógica cliente (vanilla, sin framework)
  pages/
    index.astro                   # existente — importa ChatSection entre Proyectos y Hoja de Vida
    api/
      chat.ts                     # RF-14, RF-15, RF-16, RF-17, RF-18 — endpoint Astro (server), corre como Cloudflare Function
  lib/
    rag/
      retrieval.ts                # RF-14 — similitud coseno + selección top-K (función pura)
      prompt.ts                   # RF-15, RF-16, RF-17 — construcción del prompt (sistema + contexto + idioma + marcador de fuera-de-alcance)
      rate-limit.ts                # RF-18 — lectura/escritura del contador de sesión en KV
      types.ts                     # tipos compartidos (Chunk, RagIndex, ChatRequest, ChatResponse)
  data/
    rag-index.json                 # RF-19 — generado en build, importado directamente por chat.ts (no se sirve como asset público)
  content/
    rag-source.md                  # RF-19 — documento único que Diego diligencia (bio, relatos, trayectoria)

scripts/
  build-rag-index.ts               # RF-19 — script de build: lee rag-source.md, chunkea, llama a Workers AI (embeddings) vía REST API, escribe src/data/rag-index.json

tests/
  e2e/
    homepage.spec.ts               # existente (constitution #4) — se extiende con RF-12
    chat.spec.ts                   # RF-13, RF-15, RF-16, RF-17, RF-18, CL-6, CL-7, CL-8
  unit/
    retrieval.spec.ts              # lógica pura de similitud/top-K (adicional al mínimo de la constitution)
    prompt.spec.ts                 # construcción del prompt y detección del marcador de fuera de alcance

wrangler.toml                      # binding AI (Workers AI) + binding KV (rate limiting)
.env.example                       # variables de entorno documentadas (sección 5)
```

### Tabla de cobertura RF → módulo

| RF | Módulo(s) responsable(s) |
|---|---|
| RF-12 (ubicación e integración) | `ChatSection.astro`, entrada en el componente de navegación existente |
| RF-13 (envío de preguntas) | `chat-client.ts` |
| RF-14 (retrieval) | `chat.ts` + `retrieval.ts` + `rag-index.json` |
| RF-15 (streaming) | `chat.ts` (llamada con `stream: true`) + `chat-client.ts` (lectura del stream y render incremental) |
| RF-16 (idioma) | `chat-client.ts` (envía `lang`) + `prompt.ts` (lo inyecta en el system prompt) |
| RF-17 (fuera de alcance) | `prompt.ts` (marcador) + `chat.ts` (intercepta y sustituye por el texto fijo bilingüe) |
| RF-18 (rate limiting) | `rate-limit.ts` + `chat-client.ts` (token de sesión) + `wrangler.toml` (binding KV) |
| RF-19 (generación del índice) | `build-rag-index.ts` + `rag-source.md` + `rag-index.json` |

---

## 3. Decisiones técnicas (con alternativa descartada)

**D1 — UI del chat: componente Astro + script vanilla, sin framework**
Cubre: RF-12, RF-13, RF-15 (render), HU-7/HU-8.
Justificación: la interacción necesaria (formulario, lista de mensajes, deshabilitar input, leer un stream y pintarlo token a token) es manejable con DOM APIs estándar; no hay estado complejo que justifique un framework reactivo.
Alternativa descartada: island de React/Vue/Svelte — prohibido por constitution #1, y además innecesario para esta complejidad de UI.

**D2 — Backend: endpoint nativo de Astro (`src/pages/api/chat.ts`) vía `@astrojs/cloudflare`, salida híbrida**
Cubre: RF-14 a RF-19; toca RNF-1 del spec base (ver sección 1, fila 3).
Justificación: mantiene todo el proyecto en un solo mental model (Astro), con tipado y dev server unificados. El resto del sitio sigue siendo estático (prerender); solo esta ruta es dinámica.
Alternativa descartada: carpeta `/functions` de Cloudflare Pages, independiente de Astro — funciona, pero fragmenta el proyecto en dos configuraciones de despliegue distintas (Astro por un lado, Wrangler Functions por otro), lo que va contra el espíritu de "stack mínimo".

**D3 — Modelo de embeddings: `@cf/baai/bge-m3`**
Cubre: RF-14, RF-19.
Justificación: modelo multilingüe (100+ idiomas) de Cloudflare Workers AI — permite un único índice que sirve tanto para preguntas en español como en inglés, sin duplicar el corpus por idioma.
Alternativa descartada: generar embeddings en el navegador (Transformers.js) — descartado por constitution #1 (agrega un framework/runtime de ML al cliente) y #6 (dependencia pesada e innecesaria cuando el servidor ya lo resuelve gratis y sin fricción para el visitante).

**D4 — Modelo de generación: `@cf/zai-org/glm-4.7-flash`**
Cubre: RF-15, RF-16.
Justificación: es, a la fecha, uno de los modelos vigentes recomendados oficialmente por Cloudflare (no deprecado), descrito como multilingüe y optimizado para velocidad — la variante "flash" implica menor consumo de Neurons por respuesta, lo que hace rendir más la cuota diaria gratuita compartida entre visitantes.
Alternativa descartada: modelos más grandes (Llama 3.3 70B, Gemma 4 26B, Kimi K2.6) — descartados porque, para responder sobre un único documento personal con 3-5 fragmentos de contexto, no aportan calidad adicional relevante y consumen la cuota de Neurons mucho más rápido.
⚠️ Riesgo documentado: el catálogo de Workers AI cambia con frecuencia y Cloudflare ha deprecado varios modelos en los últimos meses. `tasks.md` debe incluir una tarea explícita de verificación del ID exacto del modelo contra la documentación vigente antes de escribir código.

**D5 — Índice de embeddings empaquetado como import estático, no como asset servido por HTTP**
Cubre: RF-14, RF-19.
Justificación: `rag-index.json` es pequeño (un solo documento personal); importarlo directamente en `chat.ts` evita una llamada de red interna adicional dentro de la función, reduciendo latencia.
Alternativa descartada: exponerlo como asset público y hacer `fetch` desde la función en cada request — añade latencia y una fuente más de fallo sin ningún beneficio a esta escala.

**D6 — Generación del índice en build time vía REST API de Workers AI (no el binding `env.AI`)**
Cubre: RF-19; refuerza RNF-7.
Justificación: el binding `env.AI` solo existe dentro del runtime de una Function desplegada/dev; el script de build corre en Node fuera de ese contexto, así que debe llamar a la API REST de Cloudflare con un token de API. Ese token se configura como variable de entorno de build (secreta) en Cloudflare Pages — nunca se commitea ni se expone al cliente (no debe llevar el prefijo `PUBLIC_` que usa Astro para variables del cliente).
Alternativa descartada: generar y pegar los embeddings manualmente — descartado porque viola RNF-8 (Diego debe poder actualizar el contenido sin trabajo técnico adicional).

**D7 — Rate limiting con Cloudflare KV + token de sesión en cliente**
Cubre: RF-18.
Justificación: un contador simple con expiración (`expirationTtl`) es exactamente el caso de uso de KV; el token de sesión se genera en el cliente (`crypto.randomUUID()`, guardado en `sessionStorage`, sin login) y viaja en cada request.
Alternativa descartada: Durable Objects — más potentes de lo necesario para un contador; añaden complejidad de estado que este caso no requiere.

**D8 — Idioma de respuesta explícito, no detectado**
Cubre: RF-16.
Justificación: Diego pidió explícitamente que el chat siga el selector ES/EN del portfolio, no el idioma en que está escrita la pregunta. El cliente envía `lang` junto con la pregunta.
Alternativa descartada: dejar que el modelo detecte el idioma de la pregunta — descartado porque contradice el requisito explícito y sería inconsistente si alguien escribe en un idioma distinto al seleccionado.

**D9 — Marcador interno para el mensaje de "fuera de alcance"**
Cubre: RF-17.
Justificación: se instruye al modelo para que, cuando no encuentre la respuesta en el contexto recuperado, devuelva un marcador reconocible (p. ej. una cadena única poco probable de aparecer en una respuesta normal); el backend detecta ese marcador y sustituye la salida por el texto fijo y exacto ("...sección de contacto") en el idioma correspondiente.
Alternativa descartada: confiar en que el modelo redacte el mensaje de "no sé" con sus propias palabras — descartado porque el spec exige un texto exacto y los LLMs no garantizan reproducir literalmente un texto dado, más aún bajo distintos idiomas.

---

## 4. Estrategia de tests

**Herramienta E2E: Playwright** (nueva dependencia de desarrollo, justificada: es la opción recomendada en el ecosistema Astro y soporta interceptar/mockear respuestas de red — incluyendo streams — algo esencial para probar RF-15/16/17/18 sin depender de llamadas reales a Workers AI en CI, lo que además evita consumir cuota gratuita de Neurons en cada corrida de tests).
Alternativa descartada: Cypress — su soporte para interceptar `ReadableStream`/fetch en streaming es más limitado y hubiera requerido más trabajo de configuración para este caso.

**Cobertura mínima de constitution (#4):**
- `homepage.spec.ts` (existente, se extiende): verifica que el link "Chatea con Diego" aparece en la navegación y que al hacer click hace scroll a la sección del chat (RF-12).

**Cobertura funcional específica de la feature** (`chat.spec.ts`, con `/api/chat` mockeado para evitar no-determinismo y costo):
- Envío de pregunta → la respuesta simulada se renderiza progresivamente, no de una vez (RF-13, RF-15, HU-8).
- Cambiar el selector de idioma y verificar que el parámetro `lang` enviado al backend corresponde (RF-16).
- Mock que devuelve el marcador de fuera de alcance → se verifica el texto bilingüe exacto en pantalla, según idioma activo (RF-17).
- Simular N respuestas consecutivas → el input se deshabilita y aparece el mensaje de límite alcanzado (RF-18, CL-7).
- Mock de error 500 del backend → mensaje de error amigable (CL-6).
- Envío de pregunta vacía → no se dispara ninguna llamada de red (CL-8).

**Tests unitarios (adicionales al mínimo de la constitution, sin sumar dependencia nueva):**
- `retrieval.spec.ts` y `prompt.spec.ts`, usando el test runner nativo de Node (`node:test`) — funciones puras, rápidas, sin red. Se evita agregar Vitest/Jest porque Node ya trae lo necesario para probar esta lógica (constitution #6).

**Verificación de build (no es un test, es una guarda en el propio script):**
- `build-rag-index.ts` debe fallar el build explícitamente si `rag-source.md` no existe o está vacío (CL-9) — no se despliega un chat sin contenido.

---

## 5. Configuración (variables de entorno)

| Variable | Uso | Notas |
|---|---|---|
| `RAG_SESSION_QUESTION_LIMIT` | Límite N de preguntas por sesión (RF-18) | Default: `10`, tal como pidió Diego |
| `WORKERS_AI_EMBEDDING_MODEL` | ID del modelo de embeddings (D3) | Default: `@cf/baai/bge-m3` |
| `WORKERS_AI_GENERATION_MODEL` | ID del modelo de generación (D4) | Default: `@cf/zai-org/glm-4.7-flash` — verificar vigencia antes de implementar |
| `CLOUDFLARE_API_TOKEN` | Solo en el entorno de build, para generar embeddings (D6) | Secreto — nunca `PUBLIC_`, nunca committeado |

---

## 6. Riesgos y pendientes para `tasks.md`

1. Verificar contra la documentación vigente de Workers AI que `@cf/zai-org/glm-4.7-flash` y `@cf/baai/bge-m3` siguen activos antes de implementar (catálogo cambia con frecuencia).
2. Actualizar `spec.md` base (RNF-1) para reflejar que `/api/chat` es la única ruta dinámica del sitio, antes de tocar código (constitution #3).
3. Ubicar `spec.md`, este `plan.md` y el futuro `tasks.md` bajo `specs/chat-rag/`.
4. Definir el tamaño de chunk y overlap por defecto para `build-rag-index.ts` (propuesta de partida: ~300-500 tokens por fragmento, con pequeño solapamiento) — detalle de implementación, no bloquea el plan.
5. Confirmar si `rag-source.md` se redacta solo en español (el modelo multilingüe puede generar la respuesta en inglés a partir de contexto en español) o si Diego prefiere escribirlo también en inglés para mayor fidelidad — asunción de partida: solo español.
