import { createContext, useContext, type ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	loginSchema,
	registerSchema,
	type LoginFormData,
	type RegisterFormData,
} from "../schemas/authSchemas";

interface AuthFormsContextType {
	loginForm: UseFormReturn<LoginFormData, any, LoginFormData>;
	registerForm: UseFormReturn<RegisterFormData, any, RegisterFormData>;
}

const AuthFormsContext = createContext<AuthFormsContextType | null>(null);

export const AuthFormsProvider = ({ children }: { children: ReactNode }) => {
	const loginForm = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const registerForm = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			birthdate: "",
			gender: "female",
			password: "",
			confirmPassword: "",
		},
	});

	return (
		<AuthFormsContext.Provider value={{ loginForm, registerForm }}>
			{children}
		</AuthFormsContext.Provider>
	);
};

export const useAuthForms = () => {
	const context = useContext(AuthFormsContext);
	if (!context) {
		throw new Error("useAuthForms must be used within AuthFormsProvider");
	}
	return context;
};
