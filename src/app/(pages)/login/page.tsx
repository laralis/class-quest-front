"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginForm } from "./components/LoginForm";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    if (isAuthenticated) {
      router.push("/turmas");
    }
  }, [isAuthenticated, initAuth, router]);

  return (
    <div className="min-w-[320px] text-blue-logo text-sm sm:p-24 max-w-xl m-auto min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
