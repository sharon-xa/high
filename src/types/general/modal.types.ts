import type { ComponentType } from "react";

export interface ModalContentProps {
	onClose: () => void;
	onConfirm: () => void;
}

interface ModalState {
	isOpen: boolean;
	Content: ComponentType<any> | null;
	contentProps?: Record<string, any>;

	onCloseAction?: () => void;
	onConfirmAction?: () => void;
}

interface ModalAction {
	open: <T>(
		Content: ComponentType<T>,
		options?: {
			props?: Omit<T, keyof ModalContentProps>;
			onClose?: () => void;
			onConfirm?: () => void;
		}
	) => void;

	close: () => void;
	confirm: () => void;
}

export type ModalStore = ModalState & ModalAction;
