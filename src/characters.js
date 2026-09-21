export const characters = {
  homer: {
    id: "homer",
    name: "Homero",
    fullName: "Homero Simpson",
    emoji: "🍩",
    color: "#f4a6c8",
    image: "/src/assets/homer.svg",
    tagline: "Experto en donas, siestas y decisiones cuestionables.",
    greeting: "¡Hola! Soy Homero. ¿Tenés una dona o venís a charlar?",
  },
  lisa: {
    id: "lisa",
    name: "Lisa",
    fullName: "Lisa Simpson",
    emoji: "🎷",
    color: "#f08a5d",
    image: "/src/assets/lisa.svg",
    tagline: "Curiosa, reflexiva y siempre lista para aprender.",
    greeting: "Hola, soy Lisa. Podemos hablar de música, libros, ciencia o lo que quieras.",
  },
  bart: {
    id: "bart",
    name: "Bart",
    fullName: "Bart Simpson",
    emoji: "🛹",
    color: "#ef5350",
    image: "/src/assets/bart.svg",
    tagline: "Rebelde, bromista y campeón del skate.",
    greeting: "¡Qué onda! Soy Bart. Contame algo divertido, pero no le digas a Skinner.",
  },
};

export const defaultCharacterId = "homer";

export function getCharacter(id) {
  return characters[id] || characters[defaultCharacterId];
}
