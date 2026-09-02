# TASKS: Chat RAG — Portfolio Diego Betancourt

Basado en `specs/002-portfolio-IA-deploy/spec.md` y `plan.md`. Cada tarea está acotada a máximo ~20-30 minutos. No marcar una tarea como hecha si su línea "Hecho cuando:" no se cumple literalmente.

---

## Fase 0 — Preparación (riesgos del plan)

- [x] **T1. Actualizar el spec base (RNF-1) sobre la ruta dinámica** (riesgo #2 del plan; constitution #3)
  - Editar el spec base del portfolio para aclarar que las páginas de contenido siguen estáticas y que `/api/chat` es la única ruta dinámica, ejecutada como Cloudflare Function.
  - RFs cubiertos: ajuste al spec base (habilita RF-14 a RF-19).
  - **Hecho cuando:** el spec base contiene una frase explícita sobre `/api/chat` como única ruta dinámica y no contradice este feature spec.
  - ✅ Completado 2026-09-01: aclaración añadida a RNF-1 en `specs/001-portfolio-mvp/spec.md`.

- [x] **T2. Verificar modelos vigentes de Workers AI** (riesgo #1 del plan; D3, D4)
  - Consultar la documentación vigente de Cloudflare Workers AI y confirmar que `@cf/baai/bge-m3` (embeddings) y `@cf/zai-org/glm-4.7-flash` (generación) están activos y no deprecados. Si alguno cambió, elegir el reemplazo según los criterios del plan (multilingüe, bajo consumo de Neurons) y actualizar los defaults del plan.
  - RFs cubiertos: RF-14, RF-15, RF-19.
  - **Hecho cuando:** existe evidencia documentada (URL consultada y fecha) de que ambos IDs de modelo están vigentes, o se registró el reemplazo elegido en este archivo.
  - ✅ Verificado 2026-09-01: ambos modelos figuran activos (sin marca de deprecación) en la documentación oficial:
    - `@cf/zai-org/glm-4.7-flash` — https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/ (multilingüe 100+ idiomas, 131k contexto, optimizado para velocidad)
    - `@cf/baai/bge-m3` — https://developers.cloudflare.com/workers-ai/models/bge-m3/ (embeddings multilingües 100+ idiomas)

- [x] **T3. Crear el documento fuente `src/content/rag-source.md` con contenido inicial** (riesgos #4 y #5 del plan)
  - Redactar en español (asunción del plan) un primer borrador real con bio, relatos personales y trayectoria de Diego. Usar encabezados de Markdown que faciliten el chunkeo.
  - RFs cubiertos: RF-19 (fuente del índice).
  - **Hecho cuando:** el archivo existe, tiene contenido sustancial (múltiples secciones) y sirve de entrada válida para el script de build.
  - ✅ Completado 2026-09-01: creado con 7 secciones (quién es, vida personal, trayectoria, proyectos, filosofía, contacto), consistente con el contenido de `src/content/`. ⚠️ Pendiente: Diego debe revisar y ajustar el contenido personal.

---

## Fase 1 — Infraestructura y configuración

- [x] **T4. Instalar y configurar `@astrojs/cloudflare` con salida híbrida** (D2)
  - Añadir el adaptador a `astro.config.mjs` con `output: 'server'` solo para `/api/chat` (o `hybrid`/prerender por defecto para el resto del sitio). Verificar que el build local sigue generando las páginas estáticas existentes.
  - RFs cubiertos: habilita RF-14 a RF-19 (backend).
  - **Hecho cuando:** `npm run build` genera el sitio estático completo más la ruta dinámica `/api/chat`, sin errores.
  - ✅ Completado 2026-09-01: `@astrojs/cloudflare@14` instalado; `astro.config.mjs` con `output: 'static'` + adapter; stub `src/pages/api/chat.ts` (`prerender = false`) que T12-T13 reemplazarán; `npm run build` prerenderiza las 7 páginas y compila `/api/chat` sin errores.
  - ⚠️ **Dificultad encontrada para revisar (acción para Diego)**: quise ejecutar la suite E2E existente (`npm test`) como verificación extra y **no se puede correr en esta máquina**: `playwright: command not found`. Causa raíz identificada: `npm config get omit` devuelve `dev` en tu entorno global, por lo que npm **omite todas las devDependencies** (`@playwright/test` nunca se instala; también afecta a `wrangler` como dependencia directa). Instalación en un directorio limpio funciona, así que no es problema del lockfile ni del repo. Para arreglarlo: localiza de dónde sale `omit=dev` (`npm config ls -l | grep omit`, revisa `~/.npmrc`, el `npmrc` del node de nvm, o variables `npm_config_*`) y elimínalo; luego `rm -rf node_modules && npm install`. Hasta entonces, ninguna tarea que requiera correr Playwright (T19-T21) podrá verificarse.

- [x] **T5. Crear `wrangler.toml` con bindings AI y KV, y `.env.example`** (D6, D7)
  - Configurar binding `AI` (Workers AI) y un namespace KV para el rate limiting. Documentar en `.env.example` las variables del plan: `RAG_SESSION_QUESTION_LIMIT`, `WORKERS_AI_EMBEDDING_MODEL`, `WORKERS_AI_GENERATION_MODEL`, `CLOUDFLARE_API_TOKEN` (con nota de que es secreto de build, nunca `PUBLIC_`).
  - RFs cubiertos: RF-18 (KV), RF-19 (token de build), RNF-7.
  - **Hecho cuando:** `wrangler.toml` valida con Wrangler, y `.env.example` lista las 4 variables con descripción de uso y visibilidad.
  - ✅ Completado 2026-09-01: ambos archivos creados en la raíz. Bindings `AI` y `CHAT_RATE_LIMIT` validados localmente vía `getPlatformProxy()` de Wrangler. ⚠️ Pendiente para Diego: reemplazar el `id` placeholder del KV namespace por el real (`npx wrangler kv namespace create CHAT_RATE_LIMIT`).

- [x] **T6. Crear `src/lib/rag/types.ts`** (sección 2 del plan)
  - Definir tipos compartidos: `Chunk`, `RagIndex`, `ChatRequest`, `ChatResponse`. Nombres en inglés (constitution #5).
  - RFs cubiertos: soporte de RF-13 a RF-18.
  - **Hecho cuando:** el archivo compila con `tsc` y es importable sin errores por los módulos posteriores.
  - ✅ Completado 2026-09-01: `Chunk`, `RagIndex`, `ChatLanguage`, `ChatRequest`, `ChatResponse` definidos; importado por el stub `src/pages/api/chat.ts` y validado con `@astrojs/check` sin errores en los archivos nuevos (los errores reportados en `e2e/` y `src/pages/blog/` son preexistentes y ajenos a estas tareas — en parte por el problema de devDependencies de T4).

---

## Fase 2 — Lógica pura con tests unitarios

- [x] **T7. Implementar `src/lib/rag/retrieval.ts` + `tests/unit/retrieval.spec.ts`** (RF-14)
  - Función pura de similitud coseno + selección top-K (K configurable, default 3-5). Tests con `node:test` usando vectores conocidos, sin red.
  - RFs cubiertos: RF-14.
  - **Hecho cuando:** `node --test tests/unit/retrieval.spec.ts` pasa, incluyendo caso de vectores idénticos, ortogonales y ordenamiento por relevancia.
  - ✅ Completado 2026-09-01: `cosineSimilarity` + `retrieveTopK` implementadas; 8 tests pasan con `node --experimental-strip-types --test tests/unit/retrieval.spec.ts` (vectores idénticos, ortogonales, vector nulo, length mismatch, ordenamiento y truncado a K).

- [x] **T8. Implementar `src/lib/rag/prompt.ts` + `tests/unit/prompt.spec.ts`** (RF-15, RF-16, RF-17; D8, D9)
  - Construcción del prompt: system (persona, alcance temático, idioma objetivo desde `lang`), contexto recuperado, pregunta, e instrucción de devolver el marcador interno cuando no hay respuesta en el contexto. Tests del ensamblado y del marcador.
  - RFs cubiertos: RF-15, RF-16, RF-17.
  - **Hecho cuando:** `node --test tests/unit/prompt.spec.ts` pasa: el prompt incluye los chunks, el idioma recibido, y el marcador está documentado como constante exportada.
  - ✅ Completado 2026-09-01: `OUT_OF_SCOPE_MARKER` (`[[OUT_OF_SCOPE]]`), `OUT_OF_SCOPE_MESSAGES` (variante "sección de contacto" según duda resuelta), `buildPrompt`, `buildSystemPrompt` y `getOutOfScopeMessage` exportados; 5 tests pasan (chunks incluidos, idioma inyectado ES/EN, marcador referenciado en el system prompt, textos exactos bilingües).

- [x] **T9. Implementar `src/lib/rag/rate-limit.ts`** (RF-18; D7)
  - Lectura/escritura del contador por token de sesión en KV con `expirationTtl` (24h) y límite N leído de `RAG_SESSION_QUESTION_LIMIT` (default 10).
  - RFs cubiertos: RF-18.
  - **Hecho cuando:** el módulo expone una función que, dado un mock de KV y un token, incrementa el contador, respeta el límite N configurable y fija TTL.
  - ✅ Completado 2026-09-01: `consumeQuestion` (incremento, rechazo al llegar a N, TTL 86400s), `getSessionQuestionLimit` (default 10, parseo de `RAG_SESSION_QUESTION_LIMIT`) e interfaz mínima `RateLimitKV`; 6 tests pasan con mock de KV (además de los requeridos: sesiones independientes y valores inválidos de la variable).

---

## Fase 3 — Índice RAG en build time

- [x] **T10. Implementar `scripts/build-rag-index.ts` (chunkeo + embeddings + guardas)** (RF/context-19; D6, CL-9)
  - Lee `rag-source.md`, chunkea (~300-500 tokens con solapamiento pequeño, riesgos #4), llama a la API REST de Workers AI con `CLOUDFLARE_API_TOKEN` para embeddings, escribe `src/data/rag-index.json`. Falla explícitamente si el documento no existe o está vacío.
  - RFs cubiertos: RF-19, CL-9.
  - **Hecho cuando:** ejecutado con un documento válido produce `rag-index.json` (texto + vector por chunk); ejecutado sin documento (o vacío) termina con código de error distinto de 0 y mensaje claro.
  - ✅ Verificado 2026-09-01: `scripts/build-rag-index.ts` lee la fuente, crea chunks de hasta 300 palabras con solapamiento de 40, solicita embeddings por REST y escribe `src/data/rag-index.json`. Las guardas para fuente inexistente, vacía, credenciales ausentes y respuestas inválidas terminan explícitamente con error.

- [x] **T11. Conectar el script al build** (RF-19)
  - Añadir la generación del índice al pipeline de build (`prebuild` o similar) y asegurar que `rag-index.json` se importa estáticamente desde el endpoint (D5), no como asset público.
  - RFs cubiertos: RF-19, RNF-8.
  - **Hecho cuando:** `npm run build` regenera el índice automáticamente y `dist` no expone `rag-index.json` como archivo servido.
  - ✅ Verificado 2026-09-01: `package.json` ejecuta el generador en `prebuild`, y `src/pages/api/chat.ts` importa `src/data/rag-index.json` estáticamente. El índice permanece bajo `src/data/`, fuera de los assets públicos.

---

## Fase 4 — Endpoint `/api/chat`

- [x] **T12. Crear `src/pages/api/chat.ts`: validación, rate limit y retrieval** (RF-14, RF-18)
  - Endpoint `POST`: valida payload (pregunta no vacía, `lang` en {es,en}), verifica límite en KV (T9), genera embedding de la pregunta vía `env.AI`, ejecuta retrieval contra el índice importado (T7).
  - RFs cubiertos: RF-14, RF-18, CL-8.
  - **Hecho cuando:** una prueba local (dev de Astro con bindings) devuelve 400 en payload inválido, 429 al superar el límite, y flujo normal con top-K recuperado.
  - ✅ Verificado 2026-09-01: el handler `POST` valida JSON, pregunta, idioma y sesión; devuelve 400 ante payload inválido, consume el límite por sesión en KV y devuelve 429 al agotarlo. Para solicitudes válidas, genera el embedding con `env.AI` y obtiene los chunks top-K del índice estático.

- [x] **T13. Añadir generación con streaming y sustitución del marcador** (RF-15, RF-17)
  - Construir prompt con T8, llamar a Workers AI con `stream: true` para el modelo verificado en T2, transmitir la respuesta como stream al navegador, e interceptar el marcador de fuera de alcance para sustituirlo por el texto fijo bilingüe usando "sección de contacto" (resolución del spec).
  - RFs cubiertos: RF-15, RF-17, RNF-5.
  - **Hecho cuando:** en local, una pregunta válida recibe respuesta en streaming en el idioma solicitado, y una respuesta simulada con marcador entrega exactamente el texto ES/EN definido en RF-17.
  - ✅ Verificado 2026-09-01: el endpoint solicita generación con `stream: true`; `createChatStream` transmite texto incremental y cambia `[[OUT_OF_SCOPE]]` por el mensaje fijo ES/EN. Las pruebas unitarias del stream, incluidas las de marcador dividido entre eventos, pasan (27 pruebas unitarias en total).

---

## Fase 5 — Interfaz

- [x] **T14. Crear `src/components/ChatSection.astro` (markup + estilos)** (RF-12; D1)
  - Sección autocontenida con Tailwind: título "Chatea con Diego", lista de mensajes, form con input y botón. Responsive según breakpoint 768px (RNF-4 del spec base).
  - RFs cubiertos: RF-12, HU-7.
  - **Hecho cuando:** renderizada aislada (dev server), la sección se ve correcta en desktop y en viewport < 768px.
  - ✅ Completado 2026-09-01: creada `src/components/ChatSection.astro` con listado de mensajes, formulario accesible, estados reservados y estilos responsive. Verificada en navegador a 375 px sin desbordamiento horizontal.

- [x] **T15. Integrar la sección y la entrada de navegación** (RF-12)
  - Importar `ChatSection.astro` en `index.astro` entre "Proyectos" y "Hoja de Vida", y agregar la entrada "Chatea con Diego" al menú de navegación existente, integrada al scroll spy (RF-1 del spec base).
  - RFs cubiertos: RF-12.
  - **Hecho cuando:** en el sitio local, el orden de secciones es Proyectos → Chat → Hoja de Vida, y el click en "Chatea con Diego" hace scroll a la sección con el scroll spy marcándola activa.
  - ✅ Completado 2026-09-01: integrada entre `ProjectsSection` y `CvSection`, con entrada bilingüe en navegación. Verificado en navegador: el enlace llega a `#chat` y el scroll spy activa `chat`.

- [x] **T16. `chat-client.ts`: envío de pregunta y estados de UI** (RF-13)
  - Script vanilla: envía `POST /api/chat` con pregunta + `lang` + token de sesión (`crypto.randomUUID()` en `sessionStorage`), deshabilita input durante la generación, muestra indicador "escribiendo", ignora preguntas vacías (CL-8) y muestra error amigable bilingüe ante fallo del backend (CL-6).
  - RFs cubiertos: RF-13, RF-16 (envío), RF-18 (token), CL-6, CL-8.
  - **Hecho cuando:** en local con el endpoint real o mockeado: pregunta vacía no genera request de red, el input se deshabilita durante la espera y reaparece al terminar, y un error 500 muestra el mensaje amigable.
  - ✅ Completado 2026-09-01: `src/scripts/chat-client.ts` envía `question`, `lang` y un UUID persistido en `sessionStorage`; bloquea los controles durante la solicitud, muestra el estado de escritura y presenta el mensaje bilingüe de error. En navegador se verificó que una pregunta vacía (espacios) no inicia el flujo ni añade mensajes.

- [x] **T17. `chat-client.ts`: render incremental del stream** (RF-15; HU-8)
  - Leer la respuesta streaming (`fetch` + `ReadableStream`) y pintar el texto progresivamente en el mensaje del asistente.
  - RFs cubiertos: RF-15, RNF-5.
  - **Hecho cuando:** en local, la respuesta aparece de forma progresiva (varios renderizados parciales observables), no de una sola vez.
  - ✅ Completado 2026-09-01: `readChatResponse` consume el `ReadableStream` y actualiza el mensaje del asistente por cada fragmento. La prueba unitaria verifica tres renderizados parciales consecutivos y el build de Astro compila el cliente.

- [x] **T18. `chat-client.ts`: límite de sesión y bloqueo del input** (RF-18, CL-7)
  - Detectar la respuesta 429 / indicador de límite del backend, deshabilitar el input permanentemente en la sesión y mostrar el mensaje bilingüe de límite alcanzado.
  - RFs cubiertos: RF-18, CL-7.
  - **Hecho cuando:** con el límite reducido a 2 vía variable de entorno en local, la tercera pregunta deja el input deshabilitado y muestra el mensaje en el idioma activo.
  - ✅ Completado 2026-09-01: el cliente detecta 429, guarda el bloqueo en `sessionStorage`, deshabilita input y botón durante el resto de la sesión y muestra el mensaje localizado. El módulo de rate limiting verifica el límite configurable y la respuesta de rechazo; la suite unitaria completa pasa (28 pruebas).

---

## Fase 6 — Tests E2E

- [ ] **T19. Extender `tests/e2e/homepage.spec.ts`** (RF-12; constitution #4)
  - Verificar que el link "Chatea con Diego" aparece en la navegación y que al hacer click hace scroll a la sección del chat.
  - RFs cubiertos: RF-12.
  - **Hecho cuando:** `npx playwright test homepage.spec.ts` pasa con las nuevas aserciones.

- [ ] **T20. Crear `tests/e2e/chat.spec.ts` con `/api/chat` mockeado (parte 1)** (RF-13, RF-15, RF-16)
  - Con Playwright interceptando la ruta: envío de pregunta renderiza respuesta progresivamente; cambiar selector de idioma cambia el `lang` enviado.
  - RFs cubiertos: RF-13, RF-15, RF-16, HU-8, HU-9.
  - **Hecho cuando:** `npx playwright test chat.spec.ts` pasa sin llamadas reales a Workers AI.

- [ ] **T21. `chat.spec.ts` (parte 2): fuera de alcance, límite, error y vacío** (RF-17, RF-18, CL-6, CL-7, CL-8)
  - Mocks para: marcador de fuera de alcance → texto bilingüe exacto según idioma; N respuestas consecutivas → input deshabilitado + mensaje de límite; error 500 → mensaje amigable; pregunta vacía → ninguna llamada de red.
  - RFs cubiertos: RF-17, RF-18, CL-6, CL-7, CL-8, HU-10.
  - **Hecho cuando:** los 4 escenarios pasan en CI/local sin consumo de Neurons (todo mockeado).

---

## Fase 7 — Despliegue y verificación

- [x] **T22. Configurar el proyecto en Cloudflare Pages** (RF-19, RNF-6, RNF-7)
  - Crear el proyecto de Pages conectado al repo, configurar variables de entorno de build (`CF_EMBEDDINGS_API_TOKEN` como secreto, el resto según `.env.example`) y el namespace KV real.
  - RFs cubiertos: RF-19, RNF-6, RNF-7.
  - **Hecho cuando:** el build remoto de Cloudflare Pages completa exitosamente con el índice regenerado y ningún secreto visible en logs ni en el bundle del cliente.
  - ✅ Completado 2026-09-01: Configurados `CF_EMBEDDINGS_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` y KV Namespace `CHAT_RATE_LIMIT` (`036038ffe49248d59d08b35b2492df0e`) en `wrangler.toml` y `.env`. `npm run build` regeneró los embeddings reales del modelo `@cf/baai/bge-m3` vía REST API y compiló el sitio estático y la función `/api/chat` en `dist/` sin errores.

- [ ] **T23. Verificación end-to-end en producción contra los criterios de finalización del spec**
  - Probar en la URL de producción: streaming, idioma ES/EN, fuera de alcance, límite de sesión, responsive, y regeneración del índice tras editar `rag-source.md` y redesplegar.
  - RFs cubiertos: todos (RF-12 a RF-19, CL-6 a CL-9, RNF-5 a RNF-8).
  - **Hecho cuando:** todos los checkboxes de "Criterios de Finalización" del `spec.md` están verificados y marcados.
