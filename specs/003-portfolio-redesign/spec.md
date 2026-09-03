# SPEC: Portfolio MVP - Diego Betancourt Software Engineer

## Contexto y Objetivo

**Contexto**: Portafolio personal de Diego Betancourt, Software Engineer y Software Architect, orientado a presentar experiencia profesional, proyectos técnicos y capacidad de diseño de sistemas.

El sitio actualmente utiliza una estética minimalista basada principalmente en blanco y negro. El objetivo de esta evolución es mantener la simplicidad actual, pero elevar significativamente la calidad visual, la jerarquía de información y la percepción de seniority.

**Objetivo**: Crear un portfolio profesional con una estética **editorial, minimalista, sofisticada y técnicamente precisa**, que comunique una combinación equilibrada entre Software Engineering y Software Architecture.

La experiencia debe transmitir principalmente:

> "Esta persona tiene una forma muy clara de pensar."
>
> "Se nota que es senior."
>
> "Quiero entrevistarlo."

La estructura funcional del portfolio debe permanecer convencional y fácil de entender.

La diferenciación debe estar principalmente en el diseño visual, la composición, la tipografía, el espacio, la jerarquía y las microinteracciones.

---

## Historias de Usuario

### HU-1: Visitante entiende rápidamente el perfil profesional

Como visitante, quiero identificar rápidamente quién es Diego, qué hace y cuál es su nivel profesional.

### HU-2: Visitante percibe seniority y criterio técnico

Como hiring manager o entrevistador técnico, quiero poder identificar experiencia, responsabilidad, impacto y capacidad de razonamiento técnico.

### HU-3: Visitante explora la trayectoria profesional

Como visitante, quiero consultar la experiencia profesional de Diego de manera clara y cronológica.

### HU-4: Visitante comprende cómo piensa Diego

Como visitante, quiero conocer no solamente qué proyectos realizó, sino también los problemas que resolvió, las decisiones que tomó y los trade-offs involucrados.

### HU-5: Visitante navega fluidamente por el portfolio

Como visitante, quiero recorrer las diferentes secciones mediante una navegación clara, consistente y fluida.

### HU-6: Visitante consume el portfolio en desktop y mobile

Como visitante, quiero disfrutar de la misma calidad visual y facilidad de navegación independientemente del dispositivo.

### HU-7: Visitante puede consultar contenido en español o inglés

Como visitante, quiero visualizar todo el contenido disponible en español o inglés.

---

# Requisitos Funcionales

### RF-1: Estructura principal

* **CUANDO** el usuario accede al portfolio
* **EL** sistema muestra las secciones principales:

  * Home
  * About
  * Experience
  * Projects
  * Contact
* **Y** la navegación permite desplazarse entre ellas mediante scroll suave.
* **Y** la estructura debe mantenerse simple y convencional.

### RF-2: Navegación desktop

* **CUANDO** el usuario utiliza desktop (≥768px)
* **EL** sistema muestra navegación persistente o contextual.
* **Y** la navegación permanece visualmente secundaria respecto al contenido.
* **Y** la sección activa se identifica mediante scroll spy.
* **Y** la navegación no debe ocupar más protagonismo visual que el contenido principal.

### RF-3: Navegación móvil

* **CUANDO** el usuario utiliza un viewport <768px
* **EL** sistema oculta la navegación desktop.
* **Y** muestra un menú móvil accesible.
* **Y** la navegación móvil permite acceder a todas las secciones.
* **Y** al seleccionar una sección, el menú se cierra.
* **Y** el desplazamiento hacia la sección correspondiente es suave.

### RF-4: Sección Home

* **CUANDO** el usuario carga el portfolio
* **EL** sistema muestra una introducción clara de Diego.
* **Y** comunica explícitamente su perfil como Software Engineer / Software Architect.
* **Y** presenta una propuesta de valor breve y clara.
* **Y** prioriza identidad profesional sobre listado de tecnologías.
* **Y** evita lenguaje genérico de portfolio como "passionate developer".
* **Y** utiliza una composición visual con amplio espacio negativo.
* **Y** la primera pantalla debe transmitir seniority, claridad y confianza.

### RF-5: Sección About

* **CUANDO** el usuario visualiza About
* **EL** sistema muestra una descripción breve del perfil profesional.
* **Y** el contenido enfatiza:

  * forma de pensar
  * ingeniería de software
  * arquitectura
  * sistemas
  * resolución de problemas
* **Y** el contenido debe priorizar lectura y claridad sobre cantidad de información.
* **Y** no debe utilizar una estructura excesivamente fragmentada en tarjetas.

### RF-6: Sección Experience

* **CUANDO** el usuario visualiza Experience
* **EL** sistema muestra las experiencias profesionales en orden cronológico inverso.
* **Y** cada experiencia incluye:

  * empresa
  * posición
  * fecha inicial
  * fecha final o Present
  * descripción
  * responsabilidades e impacto relevantes
* **Y** la presentación visual debe priorizar un layout editorial o timeline estructurado.
* **Y** la información debe ser fácilmente escaneable.
* **Y** el diseño debe transmitir progresión profesional y aumento de responsabilidad.
* **Y** las tecnologías deben ser información secundaria frente a responsabilidades, decisiones e impacto.

### RF-7: Sección Projects

* **CUANDO** el usuario visualiza Projects
* **EL** sistema muestra los proyectos definidos en el contenido.
* **Y** cada proyecto debe presentar:

  * nombre
  * problema o contexto
  * descripción
  * arquitectura o aproximación técnica
  * decisiones relevantes
  * trade-offs cuando existan
  * resultado o impacto
  * tecnologías utilizadas
  * enlaces opcionales
* **Y** los proyectos deben presentarse como casos técnicos y no como un simple grid de tarjetas.
* **Y** la información visualmente más importante debe ser el problema, razonamiento técnico e impacto.
* **Y** las tecnologías deben tener jerarquía secundaria.

### RF-8: Sección Contact

* **CUANDO** el usuario llega a Contact
* **EL** sistema muestra formas de contacto profesional.
* **Y** incluye enlaces configurados a LinkedIn y GitHub.
* **Y** los enlaces externos se abren en una nueva pestaña.
* **Y** el diseño debe permanecer minimalista.
* **Y** no debe existir un formulario de contacto salvo que posteriormente sea incorporado explícitamente.

### RF-9: Selector de idioma

* **CUANDO** el usuario cambia el idioma
* **EL** sistema cambia todo el contenido de la interfaz al idioma seleccionado.
* **Y** se soportan ES y EN.
* **Y** la preferencia puede mantenerse mediante `?lang=es` o `?lang=en`.

### RF-10: Contenido bilingüe

* **CUANDO** se renderiza cualquier sección
* **EL** sistema presenta contenido disponible en el idioma seleccionado.
* **Y** ningún contenido principal debe quedar parcialmente traducido.

---

# Requisitos de Diseño

### RD-1: Dirección visual

El diseño debe seguir la filosofía:

**Editorial Minimalism + Technical Precision + Subtle Interaction**

Debe sentirse:

* sofisticado
* minimalista
* refinado
* técnico
* moderno
* sobrio
* intencional
* confiado

### RD-2: Paleta cromática

* El diseño debe conservar una estética predominantemente monocromática.
* Colores principales:

  * blanco
  * negro
  * grises neutros
* El color no debe ser utilizado como principal mecanismo de diferenciación visual.

Evitar:

* gradientes intensos
* purple/AI gradients
* colores neón
* glassmorphism
* fondos excesivamente coloridos

### RD-3: Tipografía

La tipografía debe ser uno de los principales elementos visuales.

Debe existir una jerarquía clara entre:

* display headings
* section headings
* body text
* metadata
* labels
* navigation
* technical information

Utilizar diferencias de:

* tamaño
* peso
* line-height
* letter-spacing

antes que recurrir a efectos decorativos.

### RD-4: Espacio y composición

El diseño debe utilizar espacio negativo generosamente.

Priorizar:

* márgenes amplios
* alineación precisa
* composición editorial
* contenido cuidadosamente delimitado
* ritmo vertical consistente
* separadores extremadamente sutiles

No llenar espacios vacíos artificialmente.

### RD-5: Sistema visual

Todas las secciones deben parecer parte del mismo sistema de diseño.

Los elementos compartidos deben mantener consistencia en:

* spacing
* tipografía
* bordes
* iconografía
* estados hover
* transiciones
* alineación
* responsive behavior

No implementar cada sección como un diseño independiente.

### RD-6: Microinteracciones

Las interacciones deben ser discretas.

Se permiten:

* hover states refinados
* reveal animations
* cambios sutiles de posición
* transiciones de opacidad
* transiciones tipográficas
* navegación suave

Evitar:

* scroll hijacking
* parallax excesivo
* animaciones permanentes
* efectos 3D
* partículas
* cursor effects invasivos
* transiciones llamativas

La animación debe percibirse como polish y no como contenido.

### RD-7: Diseño orientado a seniority

El diseño debe favorecer la percepción de:

* experiencia
* criterio
* claridad
* precisión
* capacidad arquitectónica

Por lo tanto:

**contenido > decoración**

**claridad > novedad**

**jerarquía > cantidad de elementos**

**precisión > efectos visuales**

---

# Requisitos No Funcionales

### RNF-1: Rendimiento

* Tiempo de carga inicial objetivo <2 segundos.
* Evitar JavaScript innecesario.
* Las animaciones no deben degradar el rendimiento.
* Priorizar contenido estático y renderizado eficiente.

### RNF-2: Accesibilidad

* Navegación completa mediante teclado.
* Focus states visibles.
* Contraste suficiente.
* Elementos interactivos semánticos.
* Soporte para `prefers-reduced-motion`.

### RNF-3: Responsive

* Soporte completo desde mobile hasta desktop.
* Breakpoint principal: 768px.
* El diseño mobile debe considerarse una composición propia.
* No limitarse a apilar elementos del desktop.

### RNF-4: Consistencia visual

* Todas las secciones deben utilizar el mismo sistema visual.
* No deben existir componentes visualmente inconsistentes sin una justificación clara.

### RNF-5: Mantenibilidad

* Separar contenido de presentación cuando la arquitectura existente lo permita.
* Evitar duplicación innecesaria.
* Mantener componentes simples y reutilizables.

---

# Casos Límite

### CL-1: Experiencia sin fecha final

* Si una experiencia está activa, mostrar:

  * `Present` en inglés
  * `Presente` en español

### CL-2: Proyecto sin enlace

* Si un proyecto no posee demo o repositorio, no renderizar el enlace.

### CL-3: Contenido insuficiente

* Si un proyecto no tiene información suficiente para una sección determinada, no inventar contenido.
* Reducir visualmente la sección en lugar de introducir texto artificial.

### CL-4: Idioma no especificado

* Si no existe `?lang`, detectar idioma del navegador cuando sea posible.
* Utilizar español como fallback.

### CL-5: Preferencia por reduced motion

* Si `prefers-reduced-motion: reduce` está activo:

  * reducir o desactivar animaciones no esenciales
  * mantener navegación y funcionalidad intactas

### CL-6: Viewport extremadamente pequeño

* El contenido no debe generar overflow horizontal.
* La jerarquía tipográfica debe mantenerse legible.

---

# Restricciones de Diseño

El agente **NO DEBE**:

* convertir el sitio en un dashboard
* utilizar un grid de tarjetas como estructura principal
* introducir glassmorphism
* introducir gradientes de IA
* utilizar blobs decorativos
* utilizar partículas
* utilizar exceso de sombras
* utilizar ilustraciones genéricas
* utilizar stock photography
* saturar el sitio con iconos
* convertir tecnologías en el foco visual
* utilizar badges excesivos
* convertir cada sección en una colección de cards
* usar estilos que parezcan un template genérico de Webflow
* imitar el estilo de una startup SaaS
* hacer que el sitio parezca un portfolio de diseñador gráfico
* sacrificar legibilidad para conseguir innovación visual
* añadir animaciones únicamente porque "se ven cool"

**Regla principal:**

> When in doubt, remove rather than add.

---

# Fuera de Alcance

* Rediseñar completamente la arquitectura funcional del sitio.
* Cambiar la estructura principal de navegación.
* Crear un dashboard.
* Crear un CMS.
* Añadir autenticación.
* Añadir backend salvo funcionalidades ya existentes.
* Sistema de comentarios.
* Formularios de contacto con backend.
* Analytics/tracking no existentes.
* Soporte para más de dos idiomas.
* Rediseñar completamente el contenido profesional sin necesidad.
* Introducir dependencias únicamente para efectos visuales.

---

# Estrategia de Implementación

### Fase 1: Auditoría

Antes de modificar código:

* inspeccionar la estructura actual
* identificar componentes existentes
* identificar sistema de estilos actual
* identificar problemas visuales
* identificar inconsistencias de spacing y typography
* identificar oportunidades de mejora sin modificar innecesariamente la arquitectura

### Fase 2: Sistema de Diseño

Definir primero:

* typography scale
* spacing scale
* content widths
* breakpoints
* border treatment
* interaction patterns
* heading hierarchy
* layout rules

### Fase 3: Rediseño

Aplicar el sistema de diseño a:

1. Home
2. About
3. Experience
4. Projects
5. Contact
6. Navigation

### Fase 4: Refinamiento

Realizar una revisión global buscando:

* elementos innecesarios
* exceso de decoración
* inconsistencias
* problemas de jerarquía
* spacing excesivo o insuficiente
* animaciones innecesarias
* componentes repetitivos

Eliminar antes de agregar.

### Fase 5: Responsive

Revisar específicamente:

* mobile
* tablet
* desktop
* pantallas grandes

Garantizando que la composición mantenga la misma identidad visual.

---

# Criterios de Finalización

* [ ] La estructura Home / About / Experience / Projects / Contact permanece clara.
* [ ] El diseño mantiene una estética predominantemente blanco/negro.
* [ ] La tipografía tiene una jerarquía visual fuerte y consistente.
* [ ] El espacio negativo es utilizado intencionalmente.
* [ ] Experience utiliza una presentación editorial/timeline en lugar de card grid.
* [ ] Projects se presentan como casos técnicos y no como tarjetas genéricas.
* [ ] La experiencia comunica progresión y seniority.
* [ ] Las tecnologías no dominan visualmente el contenido.
* [ ] Las animaciones son sutiles y funcionales.
* [ ] No existen elementos decorativos innecesarios.
* [ ] El sitio no parece un dashboard.
* [ ] El sitio no parece una landing page de startup.
* [ ] El sitio no parece un template genérico de Webflow.
* [ ] El sitio no parece un portfolio de diseñador.
* [ ] La navegación desktop funciona correctamente.
* [ ] La navegación mobile funciona correctamente.
* [ ] Scroll spy funciona correctamente.
* [ ] Responsive funciona correctamente.
* [ ] `prefers-reduced-motion` es respetado.
* [ ] El contenido ES/EN funciona correctamente.
* [ ] No existe overflow horizontal.
* [ ] Las interacciones mantienen buen rendimiento.
* [ ] La experiencia completa transmite claridad, seniority y criterio técnico.

---

# Dudas Abiertas

* **NECESITA_ACLARACION**: ¿Las secciones actuales contienen todo el contenido definitivo o existen contenidos provisionales? Respuesta: Todo el definitivo
* **NECESITA_ACLARACION**: ¿El blog continúa siendo parte del MVP actual o debe considerarse una funcionalidad posterior? Respuesta: Continua siendo parte.
* **NECESITA_ACLARACION**: ¿El CV seguirá descargándose como PDF desde el repositorio? Respuesta: Si.
* **NECESITA_ACLARACION**: ¿Las URLs de LinkedIn y GitHub ya están configuradas en el proyecto? Respuesta: No, más adelante, deja las actuales.
* **NECESITA_ACLARACION**: ¿El deployment continuará utilizando Cloudflare? Respuesta: Si
