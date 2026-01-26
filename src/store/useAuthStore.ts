import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  role: "teacher" | "student";
  registration?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token: string, user: User) => {
        localStorage.setItem("token", token);
        set({ token, user, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null, isAuthenticated: false });
      },

      initAuth: () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));

            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTime) {
              localStorage.removeItem("token");
              set({ token: null, user: null, isAuthenticated: false });
              return;
            }

            set({
              token,
              user: {
                id: payload.id,
                name: payload.name,
                email: payload.email,
                role: payload.role,
                registration: payload.registration,
              },
              isAuthenticated: true,
            });
          } catch (error) {
            localStorage.removeItem("token");
            set({ token: null, user: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
