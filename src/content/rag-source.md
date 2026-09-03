# Diego Betancourt — Documento fuente del chat

Este documento es la única fuente de verdad que el chat ("Chatea con Diego") usa para responder preguntas sobre Diego: quién es, su trayectoria profesional y su vida personal. Cada vez que se actualiza este archivo y se redespliega el sitio, el índice de respuestas se regenera automáticamente.

## Quién es Diego

Diego Fernando Betancourt Quintero es un ingeniero de software colombiano, Senior Software Engineer con más de 6 años de experiencia diseñando y escalando sistemas distribuidos y orientados a eventos en AWS. Vive en Bogotá, Colombia, pero nació en Cali y trabaja actualmente como Senior Software Engineer en Banco de Bogotá. Se especializa en identidad digital, arquitectura en la nube (especialmente con AWS) y sistemas distribuidos, operando dentro de un entorno altamente regulado.

Su experiencia abarca desde plataformas de identidad y autenticación digital de alta concurrencia que procesan millones de peticiones en tiempo real, hasta capas de orquestación serverless que coordinan flujos multi-paso complejos a escala. Le apasiona resolver problemas complejos con soluciones elegantes y escribir código limpio, testeable y bien documentado. Domina español (nativo) e inglés (B2).

Actualmente se encuentra aprendiendo y aplicando soluciones en AI a través de LLM y todo su ciclo (evals, guardrails, rag, langchain, etc.)

## Trayectoria profesional

Diego es actualmente Senior Software Engineer en Banco de Bogotá (Bogotá, Colombia, modalidad híbrida). Sus logros más destacados allí incluyen:

- Liderar la arquitectura y entrega de una plataforma de identidad digital multi-factor que sirve a millones de usuarios bancarios, gestionando un equipo de ingeniería multifuncional de 9 personas.
- Diseñar y desplegar un sistema de reconocimiento facial y onboarding biométrico (MediaPipe, TensorFlow, arquitectura de microfrontends), llevando el equipo desde el PoC hasta producción y logrando una tasa de conversión del 53% en el lanzamiento.
- Arquitectar una capa de orquestación serverless y orientada a eventos (AWS EventBridge, SQS FIFO, Lambda, DynamoDB) para coordinar flujos de autenticación multi-paso de alta concurrencia con garantías de baja latencia bajo carga de producción.
- Construir una capa de detección de fraude en tiempo real usando perfilado de usuarios, huella digital y procesamiento concurrente de peticiones, reduciendo el tiempo de revisión en un 60%.
- Liderar la migración de infraestructura AWS administrada manualmente a Infrastructure as Code (Terraform), mejorando la consistencia de despliegues y reduciendo los costos cloud en un 13%.
- Instrumentar el embudo completo de autenticación (Grafana, Elasticsearch, Hotjar, AWS CloudWatch) para impulsar decisiones de UX basadas en datos, aumentando la conversión en un 11%.

Antes, Diego trabajó 2 años y 5 meses como Full Stack Developer en Banco de Bogotá, donde construyó microservicios de autenticación en Python (Flask) y TypeScript (Express) integrados con flujos de identidad en la nube, desarrolló frontends en Angular y React para flujos de alta demanda, e implementó pipelines de CI/CD (CircleCI, GitHub Actions) que redujeron el overhead manual de releases y aumentaron la frecuencia de despliegue.

### Experiencia previa (pre-ingeniería de software)

- Process Engineer en MS Consultores SAS (ago 2018 – ago 2019): optimización de procesos basada en datos y análisis estadístico de flujos de producción para empresas de software y servicios, alineando las operaciones con KPIs estratégicos. Basicamente asesoraba empresas en gestión de calidad e implementación de normal ISO 9001, lo que le dio experiencia en manejo de clientes.
- Quality Business Analyst en Taxis Libres (abr 2017 – ago 2018): optimización de procesos de negocio, auditoría de cumplimiento y automatización de KPIs para una plataforma de movilidad impulsada por tecnología. Esto le aportó vision estratégica y capacidad para generar análsis y reportes que generasen accionables para la alta dirección.

### Datos curiosos o personales
- Su hobbie es jugar futbol. Es competitivo. También le gusta armar rompecabezas de muchas piezas. Es hincha acérrimo del deportivo Cali como equipo de futbol.

## Educación y certificaciones

Diego estudió Ingeniería Industrial en la Universidad de San Buenaventura (2016). Sin embargo hizo la transición a la industria de la tecnología porque el pago era mejor y desde antes ya venía programando. Es AWS Certified Cloud Practitioner, y cuenta con certificación en arquitectura de nube AWS. Su base en ingeniería industrial le aporta una perspectiva orientada a datos, estrategia y procesos que aplica al diseño de software.

## Habilidades técnicas

Diego domina lenguajes como TypeScript, JavaScript, Python, Java, Go y SQL, y frameworks backend como Node.js, Express.js, Fastify, Flask, FastAPI, Spring Boot y Go Fiber. En frontend trabaja con React y Angular. Sus habilidades de AWS incluyen ECS, EC2, Lambda, API Gateway, DynamoDB, Aurora, RDS, SQS, SNS, EventBridge, Rekognition, Cognito, CloudWatch y S3. También maneja DevOps e IaC con Terraform y Docker, pipelines CI/CD con GitHub Actions y CircleCI, bases de datos como PostgreSQL y Redis, búsqueda con Elasticsearch, y observabilidad con Grafana, AWS CloudWatch y OpenTelemetry. En identidad, seguridad y cumplimiento trabaja con MFA, autenticación biométrica, OAuth 2.0, JWT y KYC.

## Proyectos personales

### Ingenioempresa.com (2017 – presente)
Plataforma independiente de contenido sobre mejora de procesos y gestión empresarial (blog + YouTube). Diego la fundó y la hizo crecer desde cero hasta 20.000 visitas orgánicas diarias, a través de estrategia de contenido, SEO, análisis de datos (Google Tag Manager, Google Analytics) y redacción técnica. Demuestra su capacidad de crear producto, posicionamiento orgánico y análisis de datos.

### Diego Betancourt Portfolio
Este mismo sitio web es otro de sus proyectos: lo construyó con Astro y Tailwind CSS, aplicando un flujo de desarrollo guiado por especificaciones (spec-driven development), con tests end-to-end (Playwright) y despliegue en Cloudflare. Incluye un chat con RAG (Retrieval-Augmented Generation) usando Cloudflare Workers AI.

## Filosofía de trabajo

Diego prefiere soluciones simples sobre soluciones inteligentes: si algo se puede resolver con menos código y menos dependencias, esa es la ruta. Le gusta trabajar en equipos donde la comunicación es directa y el feedback es honesto.

Cree que la documentación y los tests no son opcionales, sino parte del producto. Por eso este portfolio tiene especificaciones versionadas en el repositorio y pruebas automatizadas que validan cada página.

Tiene 5 principios que guia su mindset:

[01]
~/principle
La curiosidad lo es todo
El deseo de aprender es lo que más valoro en un profesional de tecnología. Es un deleite escuchar a alguien que habla con pasión genuina por aprender.

[02]
~/principle
Humildad intelectual
Es algo que no debemos perder: ser conscientes de lo poco que sabemos y de lo mucho que nos falta por aprender es lo que nos mantiene en movimiento. Decir 'no sé' no está mal; es el punto de partida de todo aprendizaje.

[03]
~/principle
El desorden nace arriba
El desorden de la estrategia de la alta dirección se refleja en toda la organización. Basta ver cómo la falta de un norte claro en los líderes termina convirtiéndose en ruido, caos y desconexión en cada equipo.

[04]
~/principle
Primero las preguntas, luego la solución
Nada se resuelve bien sin antes entender bien el problema. Antes de proponer una solución, me tomo el tiempo de hacer preguntas y comprender el contexto real.

[05]
~/principle
Aprende a decir NO
Es más fácil responder 'espera, lo reviso': reduzco la incertidumbre, te doy un tiempo estimado y, si no se puede, te lo diré con un no claro. Decir no a tiempo protege tu foco y el del equipo.

## Cómo contactarlo

La mejor forma de contactar a Diego es a través de su correo dfbq91@gmail.com, su perfil de LinkedIn (linkedin.com/in/diegofernandobetancourtquintero). Los enlaces están en la sección de Contacto de este portfolio. También se puede descargar su hoja de vida en PDF desde la sección correspondiente para conocer el detalle de su experiencia.
