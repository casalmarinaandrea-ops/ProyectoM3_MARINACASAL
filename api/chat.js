import { parseGeminiResponse, sanitizeMessages } from "../src/utils.js";

const characterPrompts = {
  homer: `Sos Homero Simpson en una experiencia educativa para fans. Respondé siempre en español rioplatense, con humor ingenuo, entusiasmo por las donas, la comida, dormir y la taberna. Sos cariñoso aunque distraído. Usá ocasionalmente expresiones como "¡D'oh!" sin repetirlas en exceso. No digas que sos una IA. Mantené respuestas breves, naturales y aptas para todo público. No inventes datos personales del usuario y no des consejos profesionales peligrosos.`,
  lisa: `Sos Lisa Simpson en una experiencia educativa para fans. Respondé siempre en español rioplatense. Sos inteligente, empática, curiosa, ética y amante del jazz, los libros y la ciencia. Explicá con claridad sin sonar pedante. Podés discrepar con respeto. No digas que sos una IA. Mantené respuestas breves, naturales y aptas para todo público. No inventes datos personales del usuario y no des consejos profesionales peligrosos.`,
  bart: `Sos Bart Simpson en una experiencia educativa para fans. Respondé siempre en español rioplatense, con energía, picardía y humor de bromista. Te gustan el skate y las travesuras, pero nunca propongas daño, delitos ni acoso. Podés mencionar a Milhouse o al director Skinner cuando sea natural. No digas que sos una IA. Mantené respuestas breves, naturales y aptas para todo público. No inventes datos personales del usuario.`,
};

const requestLog = new Map();

export function checkRateLimit(ip, now = Date.now()) {
  const windowMs = 60_000;
  const maxRequests = 15;
  const recent = (requestLog.get(ip) || []).filter((timestamp) => now - timestamp < windowMs);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length <= maxRequests;
}

export function buildGeminiPayload(characterId, rawMessages) {
  const messages = sanitizeMessages(rawMessages);
  if (!characterPrompts[characterId]) throw new Error("Personaje inválido.");
  if (messages.length === 0) throw new Error("El mensaje está vacío.");
  return {
    systemInstruction: { parts: [{ text: characterPrompts[characterId] }] },
    contents: messages.map(({ role, text }) => ({ role, parts: [{ text }] })),
    generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
  };
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Método no permitido." });
  if (!process.env.GEMINI_API_KEY) return response.status(500).json({ error: "Falta configurar GEMINI_API_KEY." });

  const ip = request.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(ip)) return response.status(429).json({ error: "Demasiados mensajes. Esperá un minuto." });

  try {
    const { characterId, messages } = request.body || {};
    const payload = buildGeminiPayload(characterId, messages);
    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify(payload),
    });
    const data = await geminiResponse.json();
    if (!geminiResponse.ok) throw new Error(data?.error?.message || "Gemini no respondió correctamente.");
    const reply = parseGeminiResponse(data);
    if (!reply) throw new Error("La respuesta llegó vacía.");
    return response.status(200).json({ reply });
  } catch (error) {
    const isInputError = ["Personaje inválido.", "El mensaje está vacío."].includes(error.message);
    return response.status(isInputError ? 400 : 502).json({ error: error.message });
  }
}
