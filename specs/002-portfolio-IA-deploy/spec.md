# SPEC: Chat RAG — Portfolio Diego Betancourt

## Relación con el spec base

Este documento **extiende** el spec existente *"Portfolio MVP - Diego Betancourt Software Engineer"* (HU-1 a HU-6, RF-1 a RF-11, RNF-1 a RNF-4). No modifica ninguna sección de ese spec salvo lo indicado explícitamente en "Ajustes al spec base". El agente que ejecute este spec debe tener ambos documentos disponibles.

## Contexto y Objetivo

**Contexto**: El portfolio ya define secciones estáticas (Acerca de Mí, Experiencia, Proyectos, Hoja de Vida, Contacto, Blog). Se añade una funcionalidad conversacional para que un visitante pueda preguntar directamente sobre Diego — su trayectoria, quién es, y su vida personal — sin depender de un backend propio con servidores dedicados, usando exclusivamente infraestructura gratuita de Cloudflare.

**Objetivo**: Implementar una interfaz de chat autocontenida y responsive, ubicada justo después de la sección "Proyectos", que responda preguntas en streaming, en el idioma activo del portfolio (ES/EN), usando como única fuente de verdad un documento personal que Diego mantiene y actualiza.

---

## Arquitectura (decisión delegada a Claude — justificación incluida)

**Pipeline 100% del lado del servidor, en una sola Cloudflare Pages Function.** No hay procesamiento de embeddings ni búsqueda vectorial en el navegador.

Justificación: el corpus es un único documento personal, muy por debajo de cualquier escala que justifique un pipeline distribuido (embeddings en cliente + backend separado) o un servicio de RAG gestionado. Mantener todo en una función simplifica el mantenimiento y evita que el visitante descargue modelos pesados en su navegador.

**Etapas:**

1. **Build-time** (script Node, se ejecuta en cada build de Cloudflare Pages):
   - Lee el documento fuente único de Diego.
   - Lo divide en fragmentos (chunks).
   - Genera el embedding de cada fragmento llamando a Workers AI con el modelo **`@cf/baai/bge-m3`** (multilingüe, soporta 100+ idiomas — cubre ES/EN sin necesidad de duplicar el índice por idioma).
   - Guarda el resultado (texto + vector por fragmento) como un archivo JSON estático, empaquetado junto con la Function.

2. **Runtime** — endpoint `POST /api/chat`:
   - Verifica el límite de uso de la sesión (ver RF-18) antes de procesar.
   - Genera el embedding de la pregunta del visitante con el mismo modelo (`bge-m3`).
   - Calcula similitud coseno contra el índice JSON cargado en memoria (cómputo trivial dado el tamaño del corpus; muy por debajo del límite de CPU del plan gratuito de Workers).
   - Construye el prompt: instrucciones de sistema (persona, alcance temático, idioma objetivo) + fragmentos recuperados + pregunta.
   - Llama al modelo de generación de Workers AI con `stream: true`.
   - Retorna la respuesta como stream (`ReadableStream` / `text/event-stream`) directo al navegador.

**Por qué NO se usa Cloudflare Vectorize ni AI Search (AutoRAG):** con un solo documento fuente, una base de datos vectorial gestionada no aporta beneficio real y agrega una dependencia más. Adicionalmente, AI Search factura actualmente bajo términos de beta ("gratis durante el beta abierto"), lo que introduce incertidumbre de costo a futuro que Workers AI (cuota diaria de Neurons, gratuita de forma estable) no tiene.

**Modelo de generación:** a confirmar en `plan.md`, verificando el catálogo vigente de Workers AI en el momento de implementar (el catálogo cambia con frecuencia y algunos modelos se deprecan). Criterios de selección: soporte multilingüe confiable en español, buen desempeño conversacional, y consumo moderado de Neurons por respuesta (para que la cuota diaria gratuita compartida rinda para múltiples visitantes). Familias candidatas a evaluar al momento de implementar: Gemma 3 o Llama en tamaños pequeño-mediano, evitando modelos ya marcados como deprecados en la documentación oficial.

---

## Ajustes al spec base

- El chat se integra como una nueva sección en el flujo de scroll, entre "Proyectos" y "Hoja de Vida". **Asunción**: se agrega también como entrada en el sidebar de navegación (RF-1), integrada al scroll spy existente — confirmar con Diego (ver Dudas Abiertas).
- El mensaje de "fuera de alcance" del chat (RF-17) menciona un "formulario de contacto". El spec base excluye explícitamente un formulario de contacto con envío de emails (solo hay iconos de LinkedIn/GitHub en RF-7). Se documenta el texto exacto solicitado por Diego y una variante ajustada que no promete una funcionalidad inexistente — ver RF-17 y Dudas Abiertas.

---

## Historias de Usuario (nuevas)

**HU-7**: Como visitante, quiero hacer preguntas sobre Diego en un chat para conocer su trayectoria, quién es y su vida personal sin tener que leer todo el portfolio.

**HU-8**: Como visitante, quiero ver la respuesta aparecer progresivamente (streaming) para tener una experiencia de conversación natural.

**HU-9**: Como visitante, quiero que el chat responda en el mismo idioma que estoy usando en el portfolio.

**HU-10**: Como visitante, quiero recibir una respuesta clara cuando pregunto algo que el chat no puede responder, para saber cómo contactar a Diego directamente.

---

## Requisitos Funcionales (nuevos)

### RF-12: Ubicación e integración del chat
- **CUANDO** el visitante navega el portfolio
- **EL** componente de chat se muestra en una sección autocontenida, inmediatamente después de "Proyectos" y antes de "Hoja de Vida"
- **Y** el componente es responsive, siguiendo el breakpoint de 768px definido en RNF-4 del spec base

### RF-13: Envío de preguntas
- **CUANDO** el visitante escribe una pregunta y la envía
- **EL** sistema deshabilita el input mientras se genera la respuesta
- **Y** muestra un indicador de "escribiendo"/loading antes de que llegue el primer fragmento de texto

### RF-14: Recuperación de información (retrieval)
- **CUANDO** se recibe una pregunta
- **EL** backend genera el embedding de la pregunta y lo compara contra los fragmentos precomputados del documento fuente
- **Y** selecciona los K fragmentos más relevantes como contexto (K por defecto sugerido: 3–5, ajustable en configuración)

### RF-15: Generación de la respuesta (streaming)
- **CUANDO** se han recuperado los fragmentos relevantes
- **EL** backend construye el prompt con el contexto recuperado, el idioma activo del portfolio y la pregunta
- **Y** llama al modelo de generación con streaming habilitado
- **Y** la respuesta se transmite al navegador progresivamente, renderizándose en tiempo real en la interfaz

### RF-16: Idioma de respuesta
- **CUANDO** el visitante hace una pregunta
- **EL** backend recibe el idioma activo del portfolio (ES/EN, ver RF-10 del spec base) como parámetro de la solicitud
- **Y** instruye al modelo para responder en ese idioma, independientemente del idioma en que esté escrita la pregunta

### RF-17: Manejo de preguntas fuera de alcance
- **CUANDO** el modelo determina que la pregunta no puede responderse con la información disponible sobre Diego
- **EL** sistema responde con el siguiente mensaje, según idioma activo:
  - **ES** (texto tal como lo definió Diego): *"¡Ups! No tengo respuesta a esa pregunta. Puedes escribirle a Diego directamente desde el formulario de contacto."*
  - **EN**: *"Oops! I don't have an answer to that question. You can reach out to Diego directly through the contact form."*
- **Nota de ajuste pendiente de confirmar**: dado que el spec base no incluye un formulario de contacto (RF-7 solo tiene iconos de LinkedIn/GitHub), se sugiere la variante: *"...desde la sección de Contacto."* / *"...through the Contact section."* — confirmar cuál usar antes de implementar (ver Dudas Abiertas).

### RF-18: Control de uso (rate limiting)
- **CUANDO** un visitante realiza preguntas dentro de una misma sesión
- **EL** sistema limita el número de preguntas a un máximo N por sesión (valor sugerido por defecto: 10 — confirmar con Diego)
- **Y** al alcanzar el límite, deshabilita el input y muestra un mensaje bilingüe indicando que se alcanzó el límite para esta sesión
- **Y** el conteo se asocia a un identificador de sesión generado en el cliente (sin login), almacenado en Cloudflare KV con expiración (TTL sugerido: 24 horas)

### RF-19: Generación del índice del RAG desde el proyecto
- **CUANDO** Diego actualiza el documento fuente único
- **EL** proceso de build genera automáticamente los fragmentos y sus embeddings correspondientes
- **Y** el resultado se empaqueta junto con el despliegue de la Cloudflare Function, sin pasos manuales adicionales
- **Y** el código de la Function (endpoints necesarios) se genera y mantiene como parte del repositorio del proyecto, versionado junto al resto del código de Astro

---

## Requisitos No Funcionales (nuevos)

**RNF-5 — Latencia percibida**: el primer fragmento de la respuesta en streaming debe empezar a mostrarse en menos de ~3 segundos desde el envío de la pregunta, en condiciones normales de red.

**RNF-6 — Costo**: la funcionalidad completa debe operar dentro de las capas gratuitas de Cloudflare Pages Functions (100.000 solicitudes/día, 10ms CPU/solicitud) y Workers AI (10.000 Neurons/día), sin tarjeta de crédito ni upgrade de plan, bajo el tráfico esperado de un portfolio personal.

**RNF-7 — Sin credenciales expuestas**: ninguna API key debe quedar visible en el bundle del cliente ni en el código fuente del repositorio; el acceso a Workers AI se realiza exclusivamente mediante el binding nativo de Cloudflare (`env.AI`).

**RNF-8 — Mantenibilidad del contenido**: Diego debe poder actualizar el documento fuente del RAG sin tocar código — el build regenera los embeddings automáticamente.

---

## Casos Límite (nuevos)

- **CL-6**: Si la Function falla o Workers AI no responde, el chat muestra un mensaje de error amigable (bilingüe) e invita a reintentar.
- **CL-7**: Al alcanzar el límite de preguntas por sesión (RF-18), el input se deshabilita y se muestra el mensaje correspondiente.
- **CL-8**: Si la pregunta está vacía o es demasiado corta, el sistema no envía la solicitud al backend.
- **CL-9**: Si el documento fuente no existe o está vacío al momento del build, el build debe fallar explícitamente — no se despliega un chat sin contenido.

---

## Fuera de Alcance (adicional al spec base)

- Formulario de contacto con envío real de emails (se mantiene la exclusión del spec base — el chat referencia la sección de Contacto existente, no una nueva funcionalidad)
- Autenticación de usuarios o cuentas
- Historial de conversación persistente entre sesiones o dispositivos (vive solo en memoria del navegador durante la sesión activa)
- Analítica o tracking de las preguntas realizadas (consistente con la exclusión de analytics del spec base)
- Adjuntar archivos o imágenes en el chat
- Moderación de contenido más allá del control de alcance temático (RF-17)
- Uso de Cloudflare Vectorize o AI Search (ver justificación en Arquitectura)

---

## Dudas Abiertas

- **NECESITA_ACLARACIÓN**: ¿El chat se agrega como entrada navegable en el sidebar (con scroll spy), o es una sección inline sin entrada propia en el menú? Se asumió que sí se agrega — confirmar o corregir. Respuesta: si, se agrega como entrada en el header o sidebar con el título: "Chatea con Diego".
- **NECESITA_ACLARACIÓN**: Formato final del documento fuente único que Diego diligenciará (Markdown es la recomendación por facilidad de edición y versionado en git) — confirmar antes de iniciar el plan de ejecución. Respuesta: Markdown.
- **NECESITA_ACLARACIÓN**: Texto exacto del mensaje de "fuera de alcance" — ¿"formulario de contacto" (tal como se pidió) o "sección de Contacto" (ajustado a lo que el spec base realmente implementa)? Respuesta: sección de contacto
- **NECESITA_ACLARACIÓN**: Valor exacto de N en el límite de preguntas por sesión (RF-18) — se propuso 10 como default. Respuesta: 10 está bien pero crea variable de entorno para definirlo.
- **NECESITA_ACLARACIÓN**: Modelo específico de generación de Workers AI — se definirá en `plan.md`, verificando el catálogo vigente al momento de implementar.

---

## Criterios de Finalización

- [ ] El chat aparece justo después de "Proyectos", es responsive y autocontenido
- [ ] Las respuestas se generan y muestran en streaming
- [ ] El chat responde en el idioma activo del portfolio (ES/EN)
- [ ] Las preguntas fuera de alcance devuelven el mensaje bilingüe definido en RF-17
- [ ] El límite de preguntas por sesión funciona y muestra el mensaje correspondiente al alcanzarlo
- [ ] Ninguna API key o credencial queda expuesta en el cliente ni en el repositorio
- [ ] El pipeline completo (embeddings, retrieval, generación) corre dentro de las capas gratuitas de Cloudflare bajo tráfico normal de portfolio personal
- [ ] Actualizar el documento fuente y volver a desplegar regenera el índice de embeddings automáticamente, sin pasos manuales
- [ ] El código de la Cloudflare Function (endpoints) queda versionado en el repositorio del proyecto