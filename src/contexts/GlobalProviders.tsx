import type { ReactNode } from "react";
import ModalRoot from "../components/ui/modals/ModalRoot";
import { NavigationProvider } from "./NavigationContext";

interface Props {
	children: ReactNode;
}

const GlobalProviders = ({ children }: Props) => {
	return (
		<NavigationProvider>
			{children}
			<ModalRoot />
		</NavigationProvider>
	);
};

export default GlobalProviders;
