import { createContext, useContext, type ReactNode } from "react";
import { useNavigate } from "react-router";

interface NavigationContextType {
	goBack: () => void;
	goBackOrDefault: (fallback?: string) => void;
	navigateTo: (to: string, replace?: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useGlobalNavigation = () => {
	const context = useContext(NavigationContext);
	if (!context) {
		throw new Error("useGlobalNavigation must be used inside NavigationProvider");
	}
	return context;
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
	};

	const goBackOrDefault = (fallback: string = "/") => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate(fallback, { replace: true });
		}
	};

	const navigateTo = (to: string, replace: boolean = false) => {
		navigate(to, { replace });
	};

	return (
		<NavigationContext.Provider value={{ goBack, goBackOrDefault, navigateTo }}>
			{children}
		</NavigationContext.Provider>
	);
};
