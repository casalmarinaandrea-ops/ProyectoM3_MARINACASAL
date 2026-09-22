# Springfield Chat 🍩

Una **Single Page Application responsive** que permite conversar con Homero, Lisa o Bart usando **Google Gemini AI**. Desarrollada como Proyecto Integrador del Módulo 3 de Full Stack de Henry.

> 📌 Proyecto educativo no oficial. Los personajes y nombres mencionados pertenecen a sus respectivos titulares.

## 🚀 Demo en producción

https://springfield-chat-6otkzsjdu-marina-7ddb.vercel.app/home

## ✨ Funcionalidades

- 🧭 Rutas `/home`, `/characters`, `/chat` y `/about` sin recargar la página.
- 🍩 Selector de tres personajes, cada uno con su propio *system prompt*: Homero, Lisa y Bart.
- 💬 Chat con mensajes diferenciados, indicador animado de “escribiendo”, scroll automático y manejo de errores.
- 💾 Historial separado por personaje guardado en `localStorage` y botón para borrarlo.
- 🕒 Hora de envío, botón para copiar respuestas y envío con Enter.
- 🌗 Modo claro y oscuro.
- 📱 Diseño *mobile first* adaptable a celular, tablet y escritorio.
- 🔐 Vercel Function que protege la API key de Gemini.
- 🧪 Tests unitarios con Vitest.

## 📂 Estructura

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

## 💻 Ejecutar localmente

### 1. 📋 Requisitos

- Node.js 20 o superior.
- Una API key de [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. ⚙️ Instalar y configurar

Desde la carpeta del proyecto:

```bash
npm install
cp .env.example .env.local
```

Abrí `.env.local` y reemplazá el valor de ejemplo:

```env
GEMINI_API_KEY=tu_clave_real
GEMINI_MODEL=gemini-3.6-flash
```

> 🔒 Nunca subas `.env.local` a GitHub. Ya está incluido en `.gitignore`.

### 3. ▶️ Iniciar la aplicación

```bash
npm run dev
```

Abrí la URL local que informe Vercel CLI, normalmente `http://localhost:3000`.

## 🧪 Tests

Ejecutá:

```bash
npm test
```

El proyecto contiene más de los cuatro tests unitarios exigidos. Se prueban:

- Seguridad de texto.
- Routing.
- Transformación de respuestas.
- Validación del historial.
- Creación del payload para Gemini.

## ☁️ Despliegue en Vercel

1. Creá un repositorio en GitHub y subí el proyecto.
2. En Vercel, seleccioná **Add New → Project** e importá el repositorio.
3. En **Settings → Environment Variables**, agregá `GEMINI_API_KEY` y, opcionalmente, `GEMINI_MODEL`.
4. Hacé clic en **Deploy**.
5. Probá las cuatro rutas, el chat y la recarga directa de cada URL.

## 🤖 Registro del uso de IA

Se utilizó asistencia de IA para:

- Interpretar y organizar los requisitos de la consigna.
- Proponer la arquitectura modular de la SPA.
- Crear una primera versión del código, estilos y tests.
- Revisar seguridad básica, accesibilidad y manejo de errores.

Las sugerencias se revisaron mediante lectura del código, ejecución de tests y prueba de las rutas. Las decisiones finales, la personalización visual, la configuración de credenciales y el despliegue corresponden a la autora del proyecto.

## 🛠️ Decisiones técnicas

- **🔐 Credenciales en el servidor:** la API key vive únicamente en `GEMINI_API_KEY`, dentro del entorno del servidor.
- **🔄 Comunicación con Gemini:** el navegador llama a `/api/chat`; esa función valida los datos y recién entonces llama a Gemini.
- **💬 Contexto reciente:** se envían como máximo los últimos 16 mensajes para limitar tokens y conservar contexto.
- **💾 Historial local:** se limita a 40 mensajes por personaje en el navegador.
- **🛡️ Control de solicitudes:** el rate limit en memoria reduce abuso básico; en un proyecto productivo convendría usar almacenamiento compartido.

## 👩‍💻 Autoría

**Marina Andrea Casal**  
Full Stack Developer

🎓 **Proyecto Integrador — Módulo 3**  
Henry · Full Stack Developer

- 🐙 **GitHub:** [casalmarinaandrea-ops](https://github.com/casalmarinaandrea-ops)
- 💼 **LinkedIn:** [Marina Andrea Casal](https://www.linkedin.com/in/marina-andrea-casal)
- 📧 **Email:** [casal.marina.andrea@gmail.com](mailto:casal.marina.andrea@gmail.com)
