"use client";
import { Container } from "@/app/components/Container";
import { InputText } from "@/app/components/InputText";
import { Modal } from "@/app/components/Modal";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  CaretUpIcon,
  CaretDownIcon,
  CaretLeftIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { mockQuestionnaire } from "@/mocks/questionnaireData";
import { Button } from "@/app/components/Button";
import Link from "next/link";

export default function CriarQuestionario() {
  const [questions, setQuestions] = useState(mockQuestionnaire.questions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const moveQuestionUp = (index: number) => {
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index - 1]] = [
        newQuestions[index - 1],
        newQuestions[index],
      ];
      setQuestions(newQuestions);
    }
  };

  const moveQuestionDown = (index: number) => {
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [
        newQuestions[index + 1],
        newQuestions[index],
      ];
      setQuestions(newQuestions);
    }
  };

  return (
    <Container className="text-blue-logo mt-6 max-w-3xl">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
      <div className="flex gap-2 items-center bg-blue-logo p-4 text-white rounded-t-lg">
        <Link href="/turma" className="hover:bg-gray-600 p-2 rounded-md">
          <CaretLeftIcon size={22} />
        </Link>
        <h1 className="text-3xl font-bold">Novo questionário</h1>
      </div>
      <div className="bg-white  rounded-b-lg p-6 shadow-md mx-auto">
        <form className="space-y-6">
          <InputText
            id="title"
            name="title"
            placeholder="Título do questionário"
            text="Título do questionário"
          />
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-2 min-h-[80px]"
              placeholder="Descrição do questionário"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-logo text-white px-4 py-2 rounded-md hover:bg-purple-logo"
          >
            <PlusIcon size={20} weight="bold" />
            Adicionar Nova Pergunta
          </button>

          <section className="space-y-4 mt-6">
            <h2 className="text-lg font-bold">Perguntas</h2>
            {questions.map((question, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex gap-2">
                    <span className="text-sm text-gray-500">{index + 1}.</span>
                    <h3 className="font-medium">{question.question}</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col">
                      <button
                        title="Mover para cima"
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                        onClick={() => moveQuestionUp(index)}
                        disabled={index === 0}
                      >
                        <CaretUpIcon size={20} />
                      </button>
                      <button
                        title="Mover para baixo"
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                        onClick={() => moveQuestionDown(index)}
                        disabled={index === questions.length - 1}
                      >
                        <CaretDownIcon size={20} />
                      </button>
                    </div>
                    <button
                      title="Editar pergunta"
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <PencilSimpleIcon size={20} />
                    </button>
                    <button
                      title="Excluir pergunta"
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="reset"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-red-500 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-green-logo cursor-pointer"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
