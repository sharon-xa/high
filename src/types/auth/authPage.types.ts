import type { LoginFormData, RegisterFormData } from "../../schemas/authSchemas";
import type { UseMutationResult } from "@tanstack/react-query";

export type TabType = "login" | "signup";

interface AuthPageState {
	userEmail: string;
	activeTab: TabType;
	showOtpVerification: boolean;

	loginMutation: UseMutationResult<any, any, LoginFormData, unknown> | null;
	registerMutation: UseMutationResult<any, any, RegisterFormData, unknown> | null;
}

interface AuthPageActions {
	setUserEmail: (email: string) => void;
	setActiveTab: (activeTab: TabType) => void;
	setShowOtpVerification: (show: boolean) => void;

	setLoginMutation: (mutation: UseMutationResult<any, any, LoginFormData, unknown>) => void;
	setRegisterMutation: (mutation: UseMutationResult<any, any, RegisterFormData, unknown>) => void;
}

export type AuthPageStore = AuthPageState & AuthPageActions;
