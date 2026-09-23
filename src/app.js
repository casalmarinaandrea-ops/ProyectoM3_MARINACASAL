import { characters, defaultCharacterId, getCharacter } from "./characters.js";
import { createChatController } from "./chat.js";
import { escapeHtml, normalizePath, storageKey } from "./utils.js";

const app = document.querySelector("#app");
const nav = document.querySelector("#main-nav");
const menuButton = document.querySelector("#menu-button");
const themeButton = document.querySelector("#theme-button");

let selectedCharacterId =
  localStorage.getItem("springfield:selected-character") || defaultCharacterId;

function navigate(path) {
  const normalized = normalizePath(path);

  if (window.location.pathname !== normalized) {
    history.pushState({}, "", normalized);
  }

  renderRoute();
}

function characterCards() {
  return Object.values(characters)
    .map(
      (character) => `
        <article
          class="character-card ${selectedCharacterId === character.id ? "selected" : ""}"
          style="--character-color:${character.color}"
        >
          <div class="character-image-wrap">
            <img
              src="${character.image}"
              alt="Retrato ilustrado de ${character.fullName}"
            />
          </div>

          <div class="character-card-body">
            <span class="character-emoji" aria-hidden="true">
              ${character.emoji}
            </span>

            <h2>${character.fullName}</h2>
            <p>${character.tagline}</p>

            <button
              class="primary-button choose-character"
              data-character="${character.id}"
            >
              ${
                selectedCharacterId === character.id
                  ? "Elegido ✓"
                  : `Chatear con ${character.name}`
              }
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function homeView() {
  return `
    <section class="hero page-shell">
      <div class="hero-copy">
        <span class="eyebrow">IA + Springfield</span>

        <h1>Tu personaje favorito tiene algo que decirte.</h1>

        <p>
          Elegí un habitante de Springfield y mantené una conversación
          con su personalidad, humor y estilo.
        </p>

        <div class="button-row">
          <a class="primary-button nav-link" href="/characters">
            Elegir personaje
          </a>

          <a class="secondary-button nav-link" href="/about">
            Conocer el proyecto
          </a>
        </div>

        <ul class="feature-list" aria-label="Características">
          <li>⚡ Respuestas con Gemini AI</li>
          <li>🔒 API key protegida</li>
          <li>📱 Diseño responsive</li>
        </ul>
      </div>

      <div class="hero-family">
        <img
          src="/src/assets/familia-simpson.png"
          alt="La familia Simpson sentada en el sillón de su living"
        />
      </div>
    </section>

    <section class="page-shell preview-section">
      <h2>¿Con quién querés hablar hoy?</h2>

      <div class="characters-grid compact">
        ${characterCards()}
      </div>
    </section>
  `;
}

function charactersView() {
  return `
    <section class="page-shell inner-page">
      <p class="section-kicker">GALERÍA DE SPRINGFIELD</p>
      <h1>Elegí tu personaje</h1>

      <p class="lead">
        Cada uno responde con una personalidad y un tono diferentes.
      </p>

      <div class="characters-grid">
        ${characterCards()}
      </div>
    </section>
  `;
}

function chatView() {
  const character = getCharacter(selectedCharacterId);
  const hasHistory = Boolean(
    localStorage.getItem(storageKey(character.id)),
  );

  return `
    <section
      class="chat-page page-shell"
      style="--character-color:${character.color}"
    >
      <aside class="chat-profile">
        <img src="${character.image}" alt="${character.fullName}" />

        <div>
          <span class="online-dot"></span>
          En línea
        </div>

        <h1>${character.fullName}</h1>
        <p>${character.tagline}</p>

        ${
          hasHistory
            ? '<span class="history-badge">Historial guardado</span>'
            : ""
        }

        <a class="secondary-button nav-link" href="/characters">
          Cambiar personaje
        </a>
      </aside>

      <div class="chat-panel">
        <div class="chat-heading">
          <div>
            <span>Conversación con</span>
            <strong>${character.name}</strong>
          </div>

          <button id="clear-history" class="danger-button">
            Borrar historial
          </button>
        </div>

        <div id="messages" class="messages" aria-live="polite"></div>

        <form id="chat-form" class="chat-form">
          <label class="sr-only" for="message-input">
            Escribí tu mensaje
          </label>

          <textarea
            id="message-input"
            maxlength="1200"
            rows="1"
            placeholder="Escribile algo a ${character.name}…"
            required
          ></textarea>

          <button
            id="send-button"
            class="send-button"
            type="submit"
            aria-label="Enviar mensaje"
          >
            ➤
          </button>
        </form>

        <p class="chat-note">
          La IA puede cometer errores. No compartas información sensible.
        </p>
      </div>
    </section>
  `;
}

function aboutView() {
  return `
    <section class="page-shell inner-page about-page">
      <p class="section-kicker">ACERCA DEL PROYECTO</p>
      <h1>Cómo funciona Springfield Chat</h1>

      <p class="lead">
        Una Single Page Application creada como Proyecto Integrador
        del Módulo 3 de Full Stack.
      </p>

      <div class="about-grid">
        <article>
          <span>01</span>
          <h2>Frontend SPA</h2>
          <p>
            JavaScript modular, History API y vistas dinámicas
            sin recargar la página.
          </p>
        </article>

        <article>
          <span>02</span>
          <h2>Gemini AI</h2>
          <p>
            Cada personaje tiene instrucciones propias para conservar
            su tono durante la conversación.
          </p>
        </article>

        <article>
          <span>03</span>
          <h2>API protegida</h2>
          <p>
            Una Vercel Function realiza las consultas sin exponer
            la clave secreta en el frontend.
          </p>
        </article>

        <article>
          <span>04</span>
          <h2>Mobile first</h2>
          <p>
            La interfaz se adapta a celular, tablet y escritorio
            mediante Flexbox, Grid y media queries.
          </p>
        </article>
      </div>

      <div class="tech-strip">
        <b>HTML5</b>
        <b>CSS3</b>
        <b>JavaScript</b>
        <b>Gemini</b>
        <b>Vitest</b>
        <b>Vercel</b>
      </div>
    </section>
  `;
}

function bindViewEvents(path) {
  document.querySelectorAll(".choose-character").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCharacterId = button.dataset.character;

      localStorage.setItem(
        "springfield:selected-character",
        selectedCharacterId,
      );

      navigate("/chat");
    });
  });

  if (path === "/chat") {
    createChatController({
      container: app,
      characterId: selectedCharacterId,
    });
  }
}

function renderRoute() {
  const path = normalizePath(window.location.pathname);

  if (path !== window.location.pathname) {
    history.replaceState({}, "", path);
  }

  const views = {
    "/home": homeView,
    "/characters": charactersView,
    "/chat": chatView,
    "/about": aboutView,
  };

  app.innerHTML = views[path]();

  document.querySelectorAll("nav .nav-link").forEach((link) => {
    link.classList.toggle("active", link.pathname === path);
  });

  bindViewEvents(path);
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a.nav-link");

  if (!link || link.origin !== window.location.origin) return;

  event.preventDefault();
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");

  navigate(link.pathname);
});

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("springfield:theme", theme);
}

themeButton.addEventListener("click", () => {
  applyTheme(
    document.documentElement.dataset.theme === "dark" ? "light" : "dark",
  );
});

window.addEventListener("popstate", renderRoute);

applyTheme(localStorage.getItem("springfield:theme") || "light");
renderRoute();

export { navigate, renderRoute };