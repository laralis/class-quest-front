"use client";
import { Container } from "@/app/components/Container";
import { InputText } from "@/app/components/InputText";
import { Modal } from "@/app/components/Modal";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

export default function CriarQuestionario() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Container className="text-blue-logo mt-6 max-w-3xl">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
      <div className="flex items-start justify-between bg-blue-logo p-6 py-4 text-white rounded-t-lg">
        <h1 className="text-3xl font-bold">Novo questionário</h1>
        <button className="hover:bg-white rounded-md hover:text-red-500 cursor-pointer">
          <XIcon size={24} weight="bold" />
        </button>
      </div>
      <div className="bg-white  rounded-b-lg p-6 shadow-md mx-auto">
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Título do Questionário
            </label>
            <InputText
              id="title"
              name="title"
              className="w-full bg-gray-50 border border-gray-200"
              placeholder="Pesquisa de Satisfação - Q3/2025"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full bg-gray-50 border border-gray-200 rounded-md p-2 min-h-[80px]"
              placeholder="Questionário para avaliar as experiencia do cliente após o uso produto X"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-logo text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <PlusIcon size={20} weight="bold" />
            Adicionar Nova Pergunta
          </button>

          <section className="space-y-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">1.</span>
                  <h3 className="font-medium">Qual seu nível de satisfação?</h3>
                  <p className="text-sm text-gray-500">
                    Tipo: Múltipla Escolha
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    title="Editar pergunta"
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <PencilSimpleIcon size={20} />
                  </button>
                  <button
                    title="Excluir pergunta"
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <TrashIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="reset"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-blue-600"
            >
              Salvar Questionário
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
