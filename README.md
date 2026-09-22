# Springfield Chat 🍩

Es una single Page Application responsive que permite conversar con Homero, Lisa o Bart usando Google Gemini AI. Fue desarrollada como Proyecto Integrador del Módulo 3 de Full Stack.

> Proyecto educativo no oficial. Los personajes y nombres mencionados pertenecen a sus respectivos titulares.

## Demo en producción
https://springfield-chat-p6gjuscus-marina-7ddb.vercel.app 

## Funcionalidades

- Rutas `/home`, `/characters`, `/chat` y `/about` sin recargar la página.
- Selector de tres personajes, cada uno con su propio *system prompt*.
- Chat con mensajes diferenciados, indicador animado de “escribiendo”, scroll automático y manejo de errores.
- Historial separado por personaje guardado en `localStorage` y botón para borrarlo.
- Hora de envío, botón para copiar respuestas, envío con Enter y modo claro/oscuro.
- Diseño *mobile first* adaptable a celular, tablet y escritorio.
- Vercel Function que protege la API key de Gemini.
- Tests unitarios con Vitest.

## Estructura

```text
springfield-chat/
├── api/
│   └── chat.js
├── src/
│   ├── assets/
│   ├── app.js
│   ├── characters.js
│   ├── chat.js
│   ├── index.html
│   ├── styles.css
│   └── utils.js
├── tests/
│   ├── api.test.js
│   └── utils.test.js
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

## Ejecutar localmente

### 1. Requisitos

- Node.js 20 o superior.
- Una API key de [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Instalar y configurar

```bash
npm install
cp .env.example .env.local
```

Abrí `.env.local` y reemplazá el valor de ejemplo:

```env
GEMINI_API_KEY=tu_clave_real
GEMINI_MODEL=gemini-3.6-flash
```

Nunca subas `.env.local` a GitHub. Ya está incluido en `.gitignore`.

### 3. Iniciar la aplicación

```bash
npm run dev
```

Abrí la URL local que informe Vercel CLI, normalmente `http://localhost:3000`.

## Tests

```bash
npm test
```

El proyecto contiene más de los cuatro tests unitarios exigidos. Se prueban las funciones de seguridad de texto, routing, transformación de respuestas, validación del historial y creación del payload para Gemini.

## Despliegue en Vercel

1. Creá un repositorio en GitHub y subí el proyecto.
2. En Vercel, seleccioná **Add New → Project** e importá el repositorio.
3. En **Settings → Environment Variables**, agregá `GEMINI_API_KEY` y, opcionalmente, `GEMINI_MODEL`.
4. Hacé clic en **Deploy**.
5. Probá las cuatro rutas, el chat y la recarga directa de cada URL.

## Registro del uso de IA

Se utilizó asistencia de IA para:

- Interpretar y organizar los requisitos de la consigna.
- Proponer la arquitectura modular de la SPA.
- Crear una primera versión del código, estilos y tests.
- Revisar seguridad básica, accesibilidad y manejo de errores.

Las sugerencias se revisaron mediante lectura del código, ejecución de tests y prueba de las rutas. Las decisiones finales, la personalización visual, la configuración de credenciales y el despliegue corresponden a la autora del proyecto.

## Decisiones técnicas

- La API key vive únicamente en `GEMINI_API_KEY`, dentro del entorno del servidor.
- El navegador llama a `/api/chat`; esa función valida los datos y recién entonces llama a Gemini.
- Se envían como máximo los últimos 16 mensajes para limitar tokens y conservar contexto reciente.
- El historial se limita a 40 mensajes por personaje en el navegador.
- El rate limit en memoria reduce abuso básico; en un proyecto productivo convendría usar almacenamiento compartido.

## Autoria
Marina Andrea Casal

Full Stack Developer

Proyecto Integrador — Módulo 3
Henry Full Stack Developer

GitHub: https://github.com/casalmarinaandrea-ops
LinkedIn: www.linkedin.com/in/marina-andrea-casal
Email: casal.marina.andrea@gmail.com
