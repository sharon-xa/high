import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthActions, AuthState } from "../../types/auth/auth.types";

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			isAuthenticated: false,

			setAuth: (user, token) => {
				set({
					user,
					token,
					isAuthenticated: true,
				});
			},

			clearAuth: () => {
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				});
			},

			updateUser: (userData) => {
				const currentUser = get().user;
				if (currentUser) {
					set({ user: { ...currentUser, ...userData } });
				}
			},
		}),
		{
			name: "auth-storage",
		}
	)
);
