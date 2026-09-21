import { describe, expect, it } from "vitest";
import { escapeHtml, normalizePath, parseGeminiResponse, sanitizeMessages, storageKey } from "../src/utils.js";

describe("escapeHtml", () => {
  it("escapa etiquetas HTML peligrosas", () => expect(escapeHtml('<script>alert("x")</script>')).not.toContain("<script>"));
});

describe("normalizePath", () => {
  it("acepta una ruta válida", () => expect(normalizePath("/chat")).toBe("/chat"));
  it("elimina la barra final", () => expect(normalizePath("/about/")).toBe("/about"));
  it("redirige rutas desconocidas a home", () => expect(normalizePath("/no-existe")).toBe("/home"));
});

describe("parseGeminiResponse", () => {
  it("extrae y concatena el texto de Gemini", () => {
    const data = { candidates: [{ content: { parts: [{ text: "Hola " }, { text: "Marina" }] } }] };
    expect(parseGeminiResponse(data)).toBe("Hola Marina");
  });
  it("devuelve texto vacío ante una estructura inválida", () => expect(parseGeminiResponse({})).toBe(""));
});

describe("sanitizeMessages", () => {
  it("acepta solo roles y textos válidos", () => {
    const result = sanitizeMessages([{ role: "user", text: " hola " }, { role: "admin", text: "no" }, null]);
    expect(result).toEqual([{ role: "user", text: "hola" }]);
  });
  it("conserva únicamente los mensajes más recientes", () => {
    const messages = Array.from({ length: 20 }, (_, index) => ({ role: "user", text: String(index) }));
    expect(sanitizeMessages(messages, 3).map((message) => message.text)).toEqual(["17", "18", "19"]);
  });
});

describe("storageKey", () => {
  it("crea una clave separada por personaje", () => expect(storageKey("lisa")).toBe("springfield-chat:lisa"));
});
