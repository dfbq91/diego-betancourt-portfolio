# SPEC: Portfolio MVP - Diego Betancourt Software Engineer

## Contexto y Objetivo

**Contexto**: Portafolio personal estático para mostrar la trayectoria profesional de Diego Betancourt como Software Engineer. Diseño minimalista con enfoque en contenido y legibilidad.

**Objetivo**: Crear una página estática que presente información profesional de manera clara, con navegación fluida entre secciones y soporte bilingüe ES/EN.

---

## Historias de Usuario

### HU-1: Visitante ve perfil profesional
Como visitante, quiero ver información sobre Diego Betancourt para conocer su perfil profesional.

### HU-2: Visitante navega entre secciones
Como visitante, quiero navegar fluidamente entre secciones del portafolio para encontrar la información que busco.

### HU-3: Visitante descarga CV
Como visitante, quiero descargar la hoja de vida en PDF para tener el CV disponible offline.

### HU-4: Visitante ve proyectos
Como visitante, quiero ver los proyectos realizados para evaluar el trabajo técnico.

### HU-5: Visitante lee blog
Como visitante, quiero leer artículos del blog para consumir contenido técnico.

### HU-6: Visitante cambia idioma
Como visitante, quiero ver el contenido en español o inglés según mi preferencia.

---

## Requisitos Funcionales

### RF-1: Sidebar de navegación
- **CUANDO** el usuario está en desktop (≥768px)
- **EL** sidebar permanece visible en el lado izquierdo
- **Y** contiene enlaces a: Acerca de Mí, Experiencia, Proyectos, Hoja de Vida, Contacto, Blog
- **Y** al hacer clic en un enlace, hace scroll suave a la sección correspondiente
- **Y** la sección activa se resalta dinámicamente mientras el usuario hace scroll (scroll spy)

### RF-2: Menú móvil
- **CUANDO** el usuario está en móvil (<768px)
- **EL** sidebar se oculta
- **Y** aparece un botón hamburguesa en el header
- **Y** al hacer clic, se despliega un menú con los mismos enlaces de navegación
- **Y** al seleccionar un enlace, el menú se cierra y hace scroll a la sección

### RF-3: Sección "Acerca de Mí"
- **CUANDO** el usuario visualiza la sección
- **EL** sistema muestra: nombre completo, bio profesional (con soporte Markdown), ubicación
- **Y** el contenido se muestra en el idioma seleccionado

### RF-4: Sección "Experiencia"
- **CUANDO** el usuario visualiza la sección
- **EL** sistema muestra una lista de 2 a 4 experiencias laborales
- **Y** cada experiencia incluye: empresa, puesto, fechas de inicio y fin, descripción en bullet points
- **Y** la descripción soporta formato Markdown
- **Y** las experiencias se muestran en orden cronológico inverso (más reciente primero)

### RF-5: Sección "Proyectos"
- **CUANDO** el usuario visualiza la sección
- **EL** sistema muestra exactamente 3 proyectos
- **Y** cada proyecto incluye: nombre, descripción, lista de tecnologías
- **Y** cada proyecto puede tener enlaces opcionales a demo y repositorio
- **Y** los enlaces ausentes no se muestran

### RF-6: Sección "Hoja de Vida"
- **CUANDO** el usuario visualiza la sección
- **EL** sistema muestra un botón para descargar el PDF del CV
- **Y** al hacer clic, se descarga el archivo sin abrir en otra pestaña

### RF-7: Sección "Contacto"
- **CUANDO** el usuario visualiza la sección o el header
- **EL** sistema muestra iconos con enlaces a LinkedIn y GitHub
- **Y** los iconos abren el perfil correspondiente en una nueva pestaña
- **Y** los iconos están presentes tanto en el header como en la sección

### RF-8: Blog
- **CUANDO** el usuario hace clic en "Blog" en la navegación
- **EL** sistema muestra una lista de artículos disponibles
- **Y** cada artículo muestra: título, fecha de publicación, excerpt
- **Y** los artículos se ordenan por fecha descendente
- **Y** al hacer clic en un artículo, se muestra el contenido completo

### RF-9: Blog - Gestión de artículos
- **CUANDO** se crea un archivo Markdown en la carpeta de artículos
- **EL** sistema detecta automáticamente el artículo
- **Y** lo incluye en el listado del blog
- **Y** el frontmatter del archivo define: título, fecha, excerpt, idioma (opcional)

### RF-10: Selector de idioma
- **CUANDO** el usuario cambia el selector de idioma
- **EL** sistema recarga la página con el idioma seleccionado
- **Y** toda la interfaz y contenido se muestran en el idioma elegido
- **Y** la preferencia de idioma se mantiene en URL (?lang=es o ?lang=en)
- **Y** ambos idiomas (ES/EN) están completamente implementados

### RF-11: Contenido bilingüe
- **CUANDO** se carga cualquier página
- **EL** todo el contenido visible está disponible en ambos idiomas
- **Y** no existe contenido sin traducción en ninguno de los dos idiomas

---

## Requisitos No Funcionales

### RNF-1: Renderizado
- La página debe ser 100% estática (SSG de Astro)
- Sin dependencias de base de datos en runtime

### RNF-2: Accesibilidad
- Navegación por teclado funcional
- Contraste de color suficiente para legibilidad

### RNF-3: Rendimiento
- Tiempo de carga inicial < 2 segundos
- Sin JavaScript innecesario en producción

### RNF-4: Responsive
- Diseño adaptable de móvil a desktop
- Breakpoint principal: 768px

---

## Casos Límite

### CL-1: Blog vacío
- Si no hay artículos, mostrar mensaje: "No hay artículos disponibles" / "No articles available"

### CL-2: Experiencia sin fechas de fin
- Si es trabajo actual, mostrar "Presente" / "Present" en lugar de fecha

### CL-3: URLs inválidas
- Si un enlace demo/repo está vacío o es inválido, no renderizar el enlace

### CL-4: Artículo sin excerpt
- Si no hay excerpt en frontmatter, usar los primeros 150 caracteres del contenido

### CL-5: Selector de idioma sin parámetro
- Si la URL no tiene ?lang, detectar el idioma del navegador o usar español como default

---

## Fuera de Alcance

- Sistema de comentarios en blog
- Formulario de contacto con envío de emails
- Panel de administración para editar contenido
- Búsqueda de artículos
- Soporte para más de 2 idiomas
- Analytics o tracking de visitas
- Optimización de imágenes automatizada
- Integración con CMS externo

---

## Criterios de Finalización

- [ ] Todas las secciones del portfolio son navegables
- [ ] Scroll spy funciona correctamente en desktop
- [ ] Menú hamburguesa funciona en móvil
- [ ] Contenido de ejemplo está en ambos idiomas
- [ ] Selector de idioma cambia toda la interfaz
- [ ] Blog lista artículos desde archivos Markdown
- [ ] Botón de descarga de CV funciona
- [ ] Enlaces a LinkedIn y GitHub son funcionales
- [ ] La página pasa pruebas E2E básicas

---

## Dudas Abiertas

- **NECESITA_ACLARACION**: ¿El PDF del CV está en el repositorio o se fetchea de una URL externa?
- **NECESITA_ACLARACION**: ¿Las URLs de LinkedIn y GitHub son fija o deben configurarse?
- **NECESITA_ACLARACION**: ¿Hay un dominio/hosting específico donde se desplegará?
