import { api } from "./axiosConfig";
import type { AuthResponse, User } from "../types/auth/auth.types";
import type { LoginFormData, RegisterFormData } from "../schemas/authSchemas";

export const authApi = {
	login: async (credentials: LoginFormData): Promise<AuthResponse> => {
		const { data } = await api.post<AuthResponse>("/auth/login", credentials);
		return data;
	},

	register: async (userData: RegisterFormData): Promise<AuthResponse> => {
		const { data } = await api.post<AuthResponse>("/auth/register", userData);
		return data;
	},

	verifyOtp: async (otp: string, email: string) => {
		const { data } = await api.post("/auth/verify-email", { otp, email });
		return data;
	},

	verifyToken: async (): Promise<{ user: User }> => {
		const { data } = await api.get<{ user: User }>("/auth/verify");
		return data;
	},

	logout: async (): Promise<void> => {
		await api.post("/auth/logout");
	},

	resendOtp: async (email: string): Promise<void> => {
		await api.post("/auth/resend-otp", { email });
	},
};
