export const mockQuestionnaire = {
  title: "Avaliação de conhecimentos em JavaScript",
  description:
    "Este questionário tem como objetivo avaliar o conhecimento em JavaScript.",
  questions: [
    {
      id: 1,
      question: "Qual é o seu nível de experiência com JavaScript?",
      options: [
        { id: "1a", text: "Avançado" },
        { id: "1b", text: "Intermediário" },
        { id: "1c", text: "Iniciante" },
        { id: "1d", text: "Nenhuma experiência" },
      ],
    },
    {
      id: 2,
      question: "Qual funcionalidade do JavaScript você considera mais útil?",
      options: [
        { id: "2a", text: "Promises/Async/Await" },
        { id: "2b", text: "Manipulação do DOM" },
        { id: "2c", text: "Arrow Functions" },
        { id: "2d", text: "Destructuring" },
      ],
    },
    {
      id: 3,
      question: "Qual framework JavaScript você prefere?",
      options: [
        { id: "3a", text: "React" },
        { id: "3b", text: "Vue.js" },
        { id: "3c", text: "Angular" },
        { id: "3d", text: "Svelte" },
      ],
    },
  ],
};
