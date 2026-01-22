"use client";
import { InputText } from "@/app/components/InputText";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./components/Button";
import { InputPassword } from "./components/InputPassword";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { CheckIcon, XCircleIcon } from "@phosphor-icons/react";

export default function SignIn() {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const notifySuccess = () => {
    toast(
      () => (
        <span className="text-green-logo font-light">
          Conta criada com sucesso!
        </span>
      ),
      {
        position: "bottom-right",
        autoClose: 3000,
        className: "bg-white",
        icon: <CheckIcon size={22} weight="bold" className="text-green-logo" />,
        onClose: () => router.push("/login"),
      }
    );
  };

  const notifyError = (message: string) => {
    toast(() => <span className="text-red-700 font-light">{message}</span>, {
      position: "bottom-right",
      autoClose: 5000,
      className: "bg-white",
      icon: <XCircleIcon size={22} weight="bold" className="text-red-700" />,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3300/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: userType,
          registration: userType === "student" ? registration : undefined,
        }),
      });

      if (response.ok) {
        notifySuccess();
      } else {
        const data = await response.json();
        const errorMessage = data.message || "Erro ao criar conta";
        setError(errorMessage);
        notifyError(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      const errorMessage = "Erro ao conectar com o servidor";
      setError(errorMessage);
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="items-center justify-center text-blue-logo text-sm min-h-screen p-8 pb-20 sm:p-24 max-w-xl m-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8"
        >
          <Image
            src="/favicon.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto my-[-20px]"
          />
          <h1 className="text-2xl font-bold text-blue-logo text-center">
            Crie sua conta
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <InputText
            type="email"
            id="email"
            placeholder="Email"
            required
            text="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputText
            type="text"
            id="name"
            placeholder="Nome"
            required
            text="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex flex-col gap-2">
            <p>Tipo de usuário:</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="teacher"
                  checked={userType === "teacher"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Professor
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === "student"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Aluno
              </label>
            </div>
          </div>
          {userType === "student" && (
            <InputText
              type="text"
              id="matricula"
              placeholder="Número de matrícula"
              required
              text="Número de matrícula"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
            />
          )}
          <Button
            type="submit"
            className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
            disabled={!userType || loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
          <span className="text-xs">
            Já possui uma conta?{" "}
            <Link className="underline hover:text-purple-logo" href="/login">
              Faça login
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer closeButton theme="colored" position="bottom-right" />
    </>
  );
}
