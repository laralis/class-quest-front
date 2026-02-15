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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div
          className={`flex h-14 sm:h-16 items-center ${
            isAuthenticated ? "justify-between" : "justify-center"
          }`}
        >
          {isAuthenticated && (
            <div className="text-xs sm:text-sm md:text-base lg:text-lg p-2 sm:p-3 md:p-4 truncate max-w-[30%] sm:max-w-none">
              Olá, {user?.name}
            </div>
          )}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src={"/textlogo.png"}
              alt={"Logo"}
              width={150}
              height={60}
              className="bg-transparent w-24 h-auto sm:w-32 md:w-40 lg:w-[150px]"
            />
          </div>
          {isAuthenticated && (
            <div className="p-2 sm:p-3 md:p-4">
              <button
                onClick={handleLogout}
                className="text-black px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md hover:bg-background transition cursor-pointer"
                title="Sair"
              >
                <SignOutIcon
                  className="inline-block sm:mr-2"
                  size={20}
                  alt="Sair"
                />
                <span className="hidden sm:inline text-sm md:text-base">
                  Sair
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
