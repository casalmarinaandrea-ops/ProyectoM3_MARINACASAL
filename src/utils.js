export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function normalizePath(pathname = "/home") {
  const cleanPath = pathname.replace(/\/+$/, "") || "/home";
  const validPaths = ["/home", "/characters", "/chat", "/about"];
  return validPaths.includes(cleanPath) ? cleanPath : "/home";
}

export function parseGeminiResponse(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map((part) => part.text || "").join("").trim();
}

export function sanitizeMessages(messages, maxMessages = 16) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => ["user", "model"].includes(message?.role) && typeof message?.text === "string")
    .map((message) => ({ role: message.role, text: message.text.trim().slice(0, 1200) }))
    .filter((message) => message.text.length > 0)
    .slice(-maxMessages);
}

export function storageKey(characterId) {
  return `springfield-chat:${characterId}`;
}
