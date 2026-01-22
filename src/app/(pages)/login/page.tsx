"use client";
import { InputText } from "@/app/components/InputText";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { InputPassword } from "@/app/components/InputPassword";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
  const router = useRouter();
  const { setAuth, isAuthenticated, initAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initAuth();
    if (isAuthenticated) {
      router.push("/turmas");
    }
  }, [isAuthenticated, initAuth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3300/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Decodificar token para obter dados do usuário
        const payload = JSON.parse(atob(token.split(".")[1]));

        setAuth(token, {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          registration: payload.registration,
        });

        router.push("/turmas");
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[320px] text-blue-logo text-sm sm:p-24 max-w-xl m-auto min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8"
      >
        <Image
          src="/favicon.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto my-[-20px]"
        />
        <h1 className="text-2xl font-bold text-blue-logo text-center">
          Fazer login
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
          text="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        <Link
          href="/"
          className="flex justify-center text-blue-logo p-2 px-4 py-2 border border-gray-300 rounded-md bg-gradient-to-r hover:from-secondary-purple hover:to-purple-logo hover:text-white cursor-pointer bg-transparent"
        >
          Criar nova conta
        </Link>
      </form>
    </div>
  );
}
