"use client";
import { CopySimpleIcon, PlusCircleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const info = [
  {
    title: "Estrutura de dados",
    code: "HGX473",
    cover: "/cover.jpg",
  },
  {
    title: "Lógica de programação",
    code: "RFD945",
    cover: "/cover-2.jpg",
  },
  {
    title: "Lógica de programação para web 2023 com enfoque em responsividade",
    code: "RFD946",
    cover: "/cover-2.jpg",
  },
];

export default function CriarTurma() {
  const router = useRouter();

  const handleCriarTurma = () => {
    router.push("/criar-turma");
  };
  return (
    <div className="p-10 max-w-[1250px] m-auto">
      <div className="grid grid-cols-3 gap-10 text-sm m-auto">
        <button
          onClick={handleCriarTurma}
          className="border-dotted border-2 border-gray-700 rounded-lg h-[200px] cursor-pointer"
        >
          <div className="flex flex-col justify-center items-center gap-2">
            <h2 className="text-2xl text-center">Criar nova turma</h2>
            <PlusCircleIcon size={50} weight="fill" />
          </div>
        </button>
        {info.map((turma) => (
          <Link
            key={turma.code}
            className="border-dotted border-2 border-gray-700 rounded-lg width-[200px] h-[200px] relative"
            href={`/turma/${turma.code}`}
          >
            <Image
              src={turma.cover}
              alt="Capa"
              width={200}
              height={200}
              className="object-cover w-full h-full rounded-lg relative blur-[2px]"
            />
            <div className="absolute inset-0 flex flex-col justify-center w-fit mx-auto">
              <div className="bg-white rounded-lg p-2 mx-8" title={turma.title}>
                <div className="w-full">
                  <h2 className="text-2xl text-center line-clamp-2">
                    {turma.title}
                  </h2>
                  <div className="flex justify-center gap-2">
                    <label htmlFor="code">Código:</label>
                    <span id="code">{turma.code}</span>
                    <button
                      className="p-1 cursor-pointer m-[-1px]"
                      aria-label="Copiar código"
                      title="Copiar código"
                    >
                      <CopySimpleIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
