import { describe, expect, it } from "vitest";
import { buildGeminiPayload } from "../api/chat.js";

describe("buildGeminiPayload", () => {
  it("crea el payload para Gemini con el personaje elegido", () => {
    const payload = buildGeminiPayload("homer", [{ role: "user", text: "Hola" }]);
    expect(payload.contents[0].parts[0].text).toBe("Hola");
    expect(payload.systemInstruction.parts[0].text).toContain("Homero Simpson");
  });

  it("rechaza personajes inexistentes", () => {
    expect(() => buildGeminiPayload("burns", [{ role: "user", text: "Hola" }])).toThrow("Personaje inválido");
  });
});
