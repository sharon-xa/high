import { create } from "zustand";
import type { ModalStore } from "../../types/general/modal.types";

export const useModalStore = create<ModalStore>((set, get) => ({
	isOpen: false,
	Content: null,
	contentProps: undefined,
	onCloseAction: undefined,
	onConfirmAction: undefined,

	open: (Content, options) =>
		set({
			isOpen: true,
			Content,
			contentProps: options?.props,
			onCloseAction: options?.onClose,
			onConfirmAction: options?.onConfirm,
		}),

	close: () => {
		get().onCloseAction?.();
		set({
			isOpen: false,
			Content: null,
			contentProps: undefined,
			onCloseAction: undefined,
			onConfirmAction: undefined,
		});
	},

	confirm: () => {
		get().onConfirmAction?.();
		get().close();
	},
}));
