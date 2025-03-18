import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { AuthState } from "../constants";
import AuthUser from "../constants/auth/authUser";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token) => {
        const decoded = jwtDecode(token) as AuthUser;
        set({ token, user: decoded, isAuthenticated: true });
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    { name: "auth-storage" }
  )
);
