"use client";
import Image from "next/image";
import { SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3300/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        clearAuth();
        router.push("/login");
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex h-16 ${
            isAuthenticated ? "justify-between" : "justify-center"
          }`}
        >
          {isAuthenticated && (
            <div className="text-lg p-4">Olá, {user?.name}</div>
          )}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src={"/textlogo.png"}
              alt={"Logo"}
              width={150}
              height={60}
              className="bg-transparent"
            />
          </div>
          {isAuthenticated && (
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="text-black px-4 py-2 rounded-md hover:bg-background transition cursor-pointer"
              >
                <SignOutIcon
                  className="inline-block mr-2"
                  size={25}
                  alt="Sair"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
