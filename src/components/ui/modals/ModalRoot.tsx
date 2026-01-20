import { useEffect } from "react";
import { useModalStore } from "../../../stores/general/modal";

// This modal lacks:
// 1. modal stacking for multi modal views.
// 2. async confirm + loading

const ModalRoot = () => {
	const { isOpen, Content, contentProps, close, confirm } = useModalStore();

	useEffect(() => {
		if (!isOpen || !Content) return;

		const handler = (e: KeyboardEvent) => (e.key === "Escape" ? close() : undefined);
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [isOpen, close]);

	if (!isOpen || !Content) return null;

	return (
		<div className="fixed inset-0 z-800 flex items-center justify-center">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-900" onClick={close} />

			{/* Modal */}
			<div className="relative bg-background rounded border-2 border-light-border shadow-xl max-w-md w-full mx-4 p-6 z-1000">
				<Content {...contentProps} onClose={close} onConfirm={confirm} />
			</div>
		</div>
	);
};

export default ModalRoot;
