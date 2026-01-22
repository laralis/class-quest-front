"use client";
import { CopySimpleIcon, PlusCircleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalEntrarTurma } from "./components/ModalEntrarTurma";
import { useAuthStore } from "@/store/useAuthStore";

interface Class {
  id: number;
  logoUrl: string;
  createdAt: string;
  name: string;
  description: string;
  units: number;
  accessCode: string;
  teacherId: number;
  teacher: {
    id: number;
    name: string;
    email: string;
    role: string;
    registration: string;
  };
  students: [];
  questionnaires: [];
}

export default function CriarTurma() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!isAuthenticated || !token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3300/class/my-classes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [router, isAuthenticated, token]);

  const handleCriarTurma = () => {
    router.push("/criar-turma");
  };

  const handleEntrarTurma = () => {
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Recarregar a lista de turmas
    window.location.reload();
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  if (loading) {
    return <div className="p-10 text-center">Carregando...</div>;
  }

  return (
    <>
      <div className="p-10 max-w-[1250px] m-auto">
        <div className="grid grid-cols-3 gap-10 text-sm m-auto">
          <button
            onClick={
              user?.role === "teacher" ? handleCriarTurma : handleEntrarTurma
            }
            className="border-dotted border-2 border-gray-700 rounded-lg h-[200px] cursor-pointer"
          >
            <div className="flex flex-col justify-center items-center gap-2">
              <h2 className="text-2xl text-center">
                {user?.role === "teacher"
                  ? "Criar nova turma"
                  : "Entrar em uma turma"}
              </h2>
              <PlusCircleIcon size={50} weight="fill" />
            </div>
          </button>
          {classes.map((turma) => (
            <Link
              key={turma.id}
              className="border-dotted border-2 border-gray-700 rounded-lg width-[200px] h-[200px] relative"
              href={`/turma/${turma.accessCode}`}
            >
              <Image
                src={turma.logoUrl || "/cover.jpg"}
                alt="Capa"
                width={200}
                height={200}
                className="object-cover w-full h-full rounded-lg relative blur-[2px]"
              />
              <div className="absolute inset-0 flex flex-col justify-center w-fit mx-auto">
                <div
                  className="bg-white rounded-lg p-2 mx-8"
                  title={turma.name}
                >
                  <div className="w-full">
                    <h2 className="text-2xl text-center line-clamp-2">
                      {turma.name}
                    </h2>
                    <div className="flex justify-center gap-2">
                      <label htmlFor="code">Código:</label>
                      <span id="code">{turma.accessCode}</span>
                      <button
                        onClick={(e) => handleCopyCode(turma.accessCode, e)}
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
      <ModalEntrarTurma
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
      <ToastContainer position="bottom-right" />
    </>
  );
}
