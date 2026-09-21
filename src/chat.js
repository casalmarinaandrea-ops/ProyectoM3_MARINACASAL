import { getCharacter } from "./characters.js";
import { escapeHtml, formatTime, storageKey } from "./utils.js";

export function createChatController({ container, characterId }) {
  const character = getCharacter(characterId);
  const messagesElement = container.querySelector("#messages");
  const form = container.querySelector("#chat-form");
  const input = container.querySelector("#message-input");
  const submitButton = container.querySelector("#send-button");
  const clearButton = container.querySelector("#clear-history");
  let messages = loadMessages(character.id);

  if (messages.length === 0) {
    messages = [{ role: "model", text: character.greeting, time: formatTime() }];
    saveMessages(character.id, messages);
  }

  function renderMessages() {
    messagesElement.innerHTML = messages
      .map(
        (message, index) => `
          <article class="message ${message.role === "user" ? "message-user" : "message-character"}">
            <div class="message-meta">
              <strong>${message.role === "user" ? "Vos" : escapeHtml(character.name)}</strong>
              <time>${escapeHtml(message.time || "")}</time>
            </div>
            <p>${escapeHtml(message.text)}</p>
            ${message.role === "model" ? `<button class="copy-button" data-copy-index="${index}" aria-label="Copiar respuesta">Copiar</button>` : ""}
          </article>`,
      )
      .join("");
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    input.disabled = isLoading;
    const current = messagesElement.querySelector(".typing");
    if (isLoading && !current) {
      messagesElement.insertAdjacentHTML(
        "beforeend",
        `<div class="typing" role="status"><span></span><span></span><span></span><em>${character.name} está escribiendo…</em></div>`,
      );
      messagesElement.scrollTop = messagesElement.scrollHeight;
    } else if (!isLoading) {
      current?.remove();
    }
  }

  async function sendMessage(text) {
    messages.push({ role: "user", text, time: formatTime() });
    saveMessages(character.id, messages);
    renderMessages();
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character.id,
          messages: messages.map(({ role, text: content }) => ({ role, text: content })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");
      messages.push({ role: "model", text: data.reply, time: formatTime() });
    } catch (error) {
      messages.push({
        role: "error",
        text: `${error.message} Probá nuevamente en unos segundos.`,
        time: formatTime(),
      });
    } finally {
      saveMessages(character.id, messages);
      setLoading(false);
      renderMessages();
      input.focus();
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  clearButton.addEventListener("click", () => {
    if (!window.confirm(`¿Querés borrar la conversación con ${character.name}?`)) return;
    messages = [{ role: "model", text: character.greeting, time: formatTime() }];
    saveMessages(character.id, messages);
    renderMessages();
  });

  messagesElement.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-index]");
    if (!button) return;
    const message = messages[Number(button.dataset.copyIndex)];
    await navigator.clipboard.writeText(message.text);
    button.textContent = "¡Copiado!";
    window.setTimeout(() => (button.textContent = "Copiar"), 1200);
  });

  renderMessages();
  input.focus();
}

export function loadMessages(characterId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(characterId)) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMessages(characterId, messages) {
  localStorage.setItem(storageKey(characterId), JSON.stringify(messages.slice(-40)));
}
