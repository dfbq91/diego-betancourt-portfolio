# PLAN: Portfolio Redesign — Diego Betancourt

Basado en `specs/001-portfolio-mvp/spec.md`.

No contiene código — solo estructura, decisiones de diseño/implementación y estrategia de validación para que `tasks.md` las ejecute.

---

## 0. Resolución de dudas abiertas (entrada para este plan)

| Duda del spec                                                   | Respuesta                                                                                                           |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ¿Las secciones actuales contienen todo el contenido definitivo? | **Sí.** El contenido actual es definitivo y no debe reemplazarse ni inventarse contenido nuevo durante el rediseño. |
| ¿El blog continúa siendo parte del MVP?                         | **Sí.** El blog continúa formando parte del portfolio.                                                              |
| ¿El CV seguirá descargándose desde el repositorio?              | **Sí.** El PDF continúa siendo servido desde el repositorio.                                                        |
| ¿Las URLs de LinkedIn y GitHub ya están configuradas?           | **No.** Mantener temporalmente las URLs actuales del proyecto; no inventar nuevas URLs.                             |
| ¿El deployment continúa en Cloudflare?                          | **Sí.** El despliegue actual sobre Cloudflare debe mantenerse.                                                      |

---

## 1. Objetivo de implementación

El objetivo de esta iteración no es reconstruir el portfolio desde cero ni modificar su arquitectura funcional.

El objetivo es elevar la experiencia visual existente mediante un sistema de diseño coherente basado en:

**Editorial Minimalism + Technical Precision + Subtle Interaction**

El rediseño debe conservar:

* contenido actual
* estructura de navegación
* funcionalidades existentes
* soporte ES/EN
* blog
* descarga de CV
* deployment actual

La principal transformación debe producirse en:

* tipografía
* jerarquía visual
* spacing
* composición
* presentación de experiencia
* presentación de proyectos
* navegación
* microinteracciones
* responsive design

La percepción objetivo es:

> "Esta persona tiene una forma muy clara de pensar."
>
> "Se nota que es senior."
>
> "Quiero entrevistarlo."

---

# 2. Principios de implementación

## P1 — Rediseñar, no reinventar

La implementación debe partir del código y contenido existentes.

Antes de crear nuevos componentes, el agente debe identificar:

* estructura actual
* componentes reutilizables
* estilos existentes
* sistema de responsive
* navegación existente
* fuente de contenido
* implementación del blog
* implementación del CV
* configuración de deployment

Se debe modificar únicamente lo necesario para conseguir el nuevo lenguaje visual.

---

## P2 — Contenido > decoración

El portfolio debe comunicar seniority mediante:

* contenido
* jerarquía
* claridad
* casos técnicos
* trayectoria
* decisiones

No mediante:

* efectos visuales
* gradients
* animaciones llamativas
* gráficos decorativos
* abundancia de componentes UI

---

## P3 — When in doubt, remove rather than add

Cuando existan varias alternativas visuales válidas, priorizar la solución con menos elementos y mayor claridad.

No agregar elementos únicamente para llenar espacios vacíos.

---

## P4 — Seniority through restraint

La sensación de seniority debe surgir de un diseño:

* sobrio
* preciso
* consistente
* intencional
* técnicamente limpio

No debe parecer que el sitio está intentando demostrar que es "cool".

---

# 3. Estructura de módulos

La estructura exacta debe adaptarse a la arquitectura actual del proyecto.

No crear una nueva arquitectura si la existente ya resuelve correctamente la funcionalidad.

Como referencia conceptual:

```text
specs/
  portfolio-redesign/
    spec.md
    plan.md
    tasks.md

src/
  components/
    navigation/
    home/
    about/
    experience/
    projects/
    contact/
    blog/

  styles/
    global.*
    design-tokens.*

  content/
    ...

  pages/
    ...

public/
  ...
```

La estructura final debe respetar las convenciones actuales del proyecto.

### Cobertura conceptual

| Área          | Responsabilidad                                                 |
| ------------- | --------------------------------------------------------------- |
| Design tokens | Typography, spacing, borders, breakpoints y constantes visuales |
| Navigation    | Navegación desktop/mobile y scroll spy                          |
| Home          | Hero y primera impresión                                        |
| About         | Presentación personal/profesional                               |
| Experience    | Trayectoria y progresión                                        |
| Projects      | Casos técnicos y presentación de proyectos                      |
| Contact       | Links profesionales                                             |
| Blog          | Listado y lectura de artículos                                  |
| Global styles | Sistema visual compartido                                       |
| Responsive    | Comportamiento por viewport                                     |

---

# 4. Decisiones de diseño

## D1 — Lenguaje visual: editorial minimalism

Cubre: RD-1, RD-4, RD-5.

La interfaz utilizará una estética editorial con:

* grandes espacios negativos
* fuerte jerarquía tipográfica
* alineación precisa
* contenido cuidadosamente delimitado
* separadores sutiles
* composición asimétrica cuando aporte valor

### Justificación

Este lenguaje permite diferenciar el portfolio sin convertirlo en un portfolio de diseñador.

También permite comunicar seniority mediante claridad y control visual.

### Alternativa descartada

Diseño visual altamente experimental.

Se descarta porque puede aumentar la carga cognitiva y desplazar el foco desde la experiencia técnica hacia el diseño mismo.

---

## D2 — Paleta monocromática

Cubre: RD-2.

Mantener como base:

* blanco
* negro
* grises neutros

No introducir un color de acento fuerte salvo que exista una necesidad clara de accesibilidad, interacción o diferenciación funcional.

### Alternativas descartadas

* gradientes AI
* neon
* múltiples colores de accent
* glassmorphism
* fondos decorativos

---

## D3 — Typography-first design

Cubre: RD-3.

La tipografía será uno de los principales mecanismos visuales.

Definir explícitamente:

* display scale
* heading scale
* body scale
* metadata scale
* line heights
* font weights
* letter spacing

La jerarquía deberá permitir identificar rápidamente:

1. qué sección se está leyendo
2. cuál es la información principal
3. cuál es metadata
4. cuál es información secundaria

### Justificación

La tipografía permite elevar considerablemente la percepción de calidad sin añadir complejidad visual.

---

## D4 — Sistema de spacing centralizado

Cubre: RD-4, RD-5.

Definir una escala de spacing consistente y reutilizable.

Evitar valores arbitrarios diferentes entre secciones.

El sistema debe establecer reglas para:

* separación entre secciones
* separación entre headings y contenido
* separación entre elementos relacionados
* padding de navegación
* spacing mobile
* spacing desktop

### Objetivo

Conseguir que el portfolio se perciba como un único sistema y no como varias páginas diseñadas independientemente.

---

## D5 — Experience como trayectoria editorial

Cubre: RF-6, RD-6, RD-7.

La experiencia profesional no se presentará principalmente mediante cards.

Se priorizará una estructura editorial o timeline donde cada experiencia pueda comunicar:

* empresa
* rol
* fechas
* evolución profesional
* responsabilidades
* impacto
* contexto técnico relevante

### Justificación

El formato debe permitir percibir progresión y seniority.

### Alternativa descartada

Grid de cards.

Se descarta porque reduce experiencias complejas a bloques visuales genéricos y aumenta la sensación de template.

---

## D6 — Projects como technical case studies

Cubre: RF-7, RD-7.

Los proyectos serán tratados como casos técnicos.

La jerarquía conceptual será:

```text
Project
  ↓
Problem / Context
  ↓
Architecture / Approach
  ↓
Technical Decisions
  ↓
Trade-offs
  ↓
Outcome / Impact
```

Las tecnologías se mostrarán como metadata secundaria.

### Justificación

La principal señal de seniority debe ser la capacidad de explicar decisiones y trade-offs, no la cantidad de tecnologías utilizadas.

### Alternativa descartada

Grid de proyectos con:

* imagen
* título
* descripción
* badges
* botón

Se descarta como patrón principal porque es demasiado genérico.

---

## D7 — Hero orientado a posicionamiento profesional

Cubre: RF-4.

El Hero debe responder rápidamente:

* quién es Diego
* qué hace
* qué tipo de problemas resuelve

Debe evitar frases genéricas de developer portfolio.

La composición debe utilizar:

* headline fuerte
* supporting statement breve
* metadata profesional opcional
* CTA únicamente cuando tenga valor real

No utilizar una colección extensa de tecnologías como elemento principal del hero.

---

## D8 — Interacciones discretas

Cubre: RD-6.

Las animaciones deben utilizarse únicamente cuando mejoren:

* orientación
* feedback
* continuidad
* percepción de calidad

Se permiten:

* fade/reveal
* hover transitions
* cambios sutiles de posición
* cambios controlados de opacity
* smooth scrolling

### Alternativa descartada

Animaciones permanentes o altamente expresivas.

No utilizar:

* particle systems
* parallax excesivo
* scroll hijacking
* cursor effects invasivos
* efectos 3D
* animaciones decorativas constantes

---

## D9 — Responsive como diseño, no como adaptación

Cubre: RNF-3.

Mobile no debe ser simplemente la versión vertical del desktop.

El agente debe definir explícitamente cómo cambian:

* typography scale
* spacing
* navigation
* alignment
* project layout
* experience layout

entre mobile y desktop.

---

## D10 — Preservar blog y funcionalidades existentes

Cubre: RF-9, RF-10, RF-11 y funcionalidades existentes.

El blog continúa siendo parte del MVP.

La implementación visual debe integrarlo en el nuevo lenguaje del portfolio sin convertirlo en una experiencia independiente.

El CV continúa descargándose desde el repositorio.

LinkedIn y GitHub deben conservar temporalmente las URLs actuales.

El deployment sobre Cloudflare no debe modificarse como parte de este rediseño.

---

# 5. Sistema de diseño propuesto

Antes de modificar las secciones individualmente, el agente debe establecer un pequeño design system.

## 5.1 Typography

Definir tokens para:

```text
display
h1
h2
h3
body
body-small
metadata
label
navigation
```

Debe existir consistencia entre desktop y mobile.

---

## 5.2 Spacing

Definir una escala reutilizable para:

```text
xs
sm
md
lg
xl
2xl
3xl
section
```

Los valores finales deben determinarse después de inspeccionar la implementación actual.

---

## 5.3 Borders

Utilizar borders extremadamente sutiles para:

* separación
* estructura
* navegación
* metadata

Evitar borders pesados o decorativos.

---

## 5.4 Radius

El radio de componentes debe ser mínimo o inexistente salvo que el componente necesite una forma claramente contenida.

Evitar estética excesivamente redondeada asociada a interfaces SaaS.

---

## 5.5 Shadows

Usar shadows de manera excepcional.

La jerarquía visual debe depender principalmente de:

* espacio
* tipografía
* contraste
* posición

---

# 6. Estrategia de tests y validación

El objetivo de los tests no es únicamente verificar funcionalidad existente, sino garantizar que el rediseño no la rompa.

## 6.1 E2E

Utilizar la herramienta E2E existente en el proyecto.

No introducir una nueva herramienta si la actual ya cubre las necesidades.

### Navegación

Verificar:

* navegación a todas las secciones
* smooth scrolling
* scroll spy desktop
* menú mobile
* cierre del menú mobile después de seleccionar una sección

### Home

Verificar:

* headline visible
* contenido principal renderizado
* links/CTAs existentes funcionando

### Experience

Verificar:

* experiencias renderizadas
* orden cronológico correcto
* experiencia actual muestra Present/Presente

### Projects

Verificar:

* todos los proyectos esperados renderizados
* enlaces presentes cuando corresponda
* enlaces ausentes no generan elementos vacíos

### Blog

Verificar:

* listado de artículos
* navegación a un artículo
* contenido correcto
* comportamiento cuando no existen artículos

### CV

Verificar:

* botón visible
* descarga funcional
* archivo correspondiente disponible

### Contact

Verificar:

* LinkedIn disponible
* GitHub disponible
* apertura de links externos en nueva pestaña

### Idioma

Verificar:

* `?lang=es`
* `?lang=en`
* contenido coherente con idioma activo

---

# 7. Validación visual

Además de tests funcionales, el rediseño debe pasar una revisión visual manual o automatizada.

## Desktop

Revisar como mínimo:

* 1280px
* 1440px
* 1920px

Validar:

* jerarquía
* whitespace
* alignment
* section rhythm
* navegación
* lectura de Experience
* lectura de Projects

## Mobile

Revisar como mínimo:

* 375px
* 390px
* 430px

Validar:

* typography
* menu
* overflow
* project layout
* timeline/experience
* spacing

---

# 8. Checklist de diseño

Antes de finalizar el rediseño, verificar:

* [ ] La interfaz mantiene el lenguaje blanco/negro/grises.
* [ ] La tipografía presenta una jerarquía clara.
* [ ] El layout utiliza espacio negativo intencionalmente.
* [ ] Experience no depende de card grids.
* [ ] Projects no depende de card grids como presentación principal.
* [ ] Projects comunica problemas, decisiones y trade-offs.
* [ ] Las tecnologías son secundarias.
* [ ] Las animaciones son discretas.
* [ ] No existen elementos decorativos sin propósito.
* [ ] El sitio no parece una startup landing page.
* [ ] El sitio no parece un dashboard.
* [ ] El sitio no parece un template de Webflow.
* [ ] El sitio no parece un portfolio de diseñador.
* [ ] El sitio transmite seniority.
* [ ] El sitio transmite claridad de pensamiento.
* [ ] Mobile tiene composición propia.
* [ ] `prefers-reduced-motion` es respetado.

---

# 9. Riesgos y pendientes para tasks.md

1. **No sobre-rediseñar.** El riesgo principal es que el agente interprete "refinar" como "agregar elementos". `tasks.md` debe priorizar modificaciones incrementales.

2. **Preservar contenido definitivo.** El contenido actual es definitivo; el agente no debe reemplazarlo, resumirlo ni inventar información.

3. **Verificar la arquitectura actual antes de introducir nuevos componentes.** El plan define responsabilidades conceptuales, no obliga a crear nuevos archivos si ya existen componentes equivalentes.

4. **Mantener blog.** El rediseño debe incluir el blog dentro del sistema visual y no tratarlo como funcionalidad secundaria eliminable.

5. **Mantener deployment Cloudflare.** No realizar cambios de infraestructura como parte del rediseño.

6. **Mantener URLs actuales de LinkedIn/GitHub.** No inventar URLs ni modificar configuración hasta que se proporcionen las definitivas.

7. **Evitar dependencias nuevas.** No incorporar librerías de animación, iconos, componentes UI u otras dependencias salvo que exista una necesidad justificada.

8. **Validar rendimiento.** El nuevo diseño no debe aumentar significativamente JavaScript, CSS o tiempo de carga únicamente para obtener efectos visuales.

9. **Validar accesibilidad después del rediseño.** Cambios en contraste, hover, focus y navegación deben mantenerse accesibles.

10. **Comparar antes/después.** La implementación final debe revisarse contra el estado inicial para comprobar que las mejoras son realmente de jerarquía, claridad y refinamiento, no simplemente de cantidad de elementos.
