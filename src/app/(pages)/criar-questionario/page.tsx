"use client";
import { Container } from "@/app/components/Container";
import { InputText } from "@/app/components/InputText";
import { Modal } from "./components/Modal";
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
import { ButtonIcon } from "@/app/components/ButtonIcon";
import { InputTextArea } from "@/app/components/InputTextArea";

export default function CriarQuestionario() {
  const [questions, setQuestions] = useState(mockQuestionnaire.questions);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

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
  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <Container className="text-blue-logo mt-6 max-w-3xl">
      <Modal
        type="add"
        isOpen={isModalAddOpen}
        onRequestClose={() => setIsModalAddOpen(false)}
      />
      <Modal
        type="edit"
        isOpen={isModalEditOpen}
        onRequestClose={() => setIsModalEditOpen(false)}
      />
      <div className="flex gap-2 items-center bg-blue-logo p-4 text-white rounded-t-lg">
        <Link href="/turma/1" className="hover:bg-logo-bege p-2 rounded-md">
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
          <InputTextArea
            id="description"
            name="description"
            text="Descrição"
            placeholder="Descrição do questionário"
          />

          <Button
            type="button"
            onClick={() => setIsModalAddOpen(true)}
            className="flex items-center gap-2 bg-blue-logo text-white px-4 py-2 rounded-md hover:bg-purple-logo"
          >
            <PlusIcon size={20} weight="bold" />
            Adicionar nova pergunta
          </Button>

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
                      <ButtonIcon
                        type="button"
                        title="Mover para cima"
                        onClick={() => moveQuestionUp(index)}
                        disabled={index === 0}
                      >
                        <CaretUpIcon size={20} />
                      </ButtonIcon>
                      <ButtonIcon
                        type="button"
                        title="Mover para baixo"
                        onClick={() => moveQuestionDown(index)}
                        disabled={index === questions.length - 1}
                      >
                        <CaretDownIcon size={20} />
                      </ButtonIcon>
                    </div>
                    <ButtonIcon
                      type="button"
                      title="Editar pergunta"
                      onClick={() => setIsModalEditOpen(true)}
                    >
                      <PencilSimpleIcon size={20} />
                    </ButtonIcon>
                    <ButtonIcon
                      type="button"
                      title="Excluir pergunta"
                      onClick={() => deleteQuestion(index)}
                      className="text-red-logo"
                    >
                      <TrashIcon size={20} />
                    </ButtonIcon>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-red-logo hover:text-white cursor-pointer"
              href={"/turma/1"}
            >
              Cancelar
            </Link>
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
