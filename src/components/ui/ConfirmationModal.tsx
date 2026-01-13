import Button from "./Button";
import type { ButtonVariant } from "./Button";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	confirmStyle?: ButtonVariant;
}

const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Action",
	message = "Are you sure you want to proceed?",
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmStyle = "primary",
}: Props) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

			{/* Modal */}
			<div className="relative bg-background rounded border-2 border-light-border shadow-xl max-w-md w-full mx-4 p-6">
				<h2 className="text-xl font-semibold mb-3">{title}</h2>

				<p className="mb-6">{message}</p>

				<div className="flex gap-3 justify-end">
					<Button onClick={onClose} variant="outline">
						{cancelText}
					</Button>

					<Button onClick={onConfirm} variant={confirmStyle}>
						{confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
