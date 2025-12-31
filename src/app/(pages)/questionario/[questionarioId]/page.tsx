"use client";

import { useEffect, useState } from "react";
import { mockQuestionnaire } from "@/mocks/questionnaireData";
import { ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import { Timer } from "./components/Timer";

interface Question {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
}

interface QuestionnaireProps {
  title: string;
  description: string;
  questions: Question[];
}

export default function QuestionnairePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireProps | null>(
    null
  );

  useEffect(() => {
    setQuestionnaire(mockQuestionnaire);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  if (!questionnaire) return <div>Loading...</div>;

  const currentQ = questionnaire.questions[currentQuestion];

  const handleNext = () => {
    if (currentQuestion < questionnaire.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(45);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-navy-900 bg-blue-logo text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-3">{questionnaire.title}</h1>
          <div className="flex items-center gap-4">
            <span>{`${currentQuestion + 1} / ${
              questionnaire.questions.length
            } questões`}</span>
            <button
              title="Fechar"
              className="bg-transparent hover:bg-white hover:text-red-logo cursor-pointer rounded-md p-1"
            >
              <XIcon size={22} weight="bold" />
            </button>
          </div>
        </div>
        <p className="text-sm mt-1 mb-2">{questionnaire.description}</p>
      </div>
      <Timer timeLeft={timeLeft} />

      <div className="bg-white p-8 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-semibold mb-6">
          {currentQuestion + 1}. {currentQ.question}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {currentQ.options.map((option) => (
            <button
              key={option.id}
              className="p-4 border rounded-lg text-left hover:bg-bege-logo cursor-pointer transition-colors"
            >
              {option.text}
            </button>
          ))}
        </div>
        <div className="flex justify-end absolute bottom-1/3 left-[-30] right-[-30]">
          <button
            onClick={handleNext}
            disabled={currentQuestion === questionnaire.questions.length - 1}
            className="p-3 rounded-full bg-blue-logo text-white cursor-pointer hover:bg-green-logo disabled:hidden"
          >
            <ArrowRightIcon size={25} alt="Próxima questão" />
          </button>
        </div>
      </div>
    </div>
  );
}
