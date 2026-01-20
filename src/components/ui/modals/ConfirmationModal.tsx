import type { ModalContentProps } from "../../../types/general/modal.types";
import Button from "../Button";
import type { ButtonVariant } from "../Button";

interface Props extends ModalContentProps {
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	confirmStyle?: ButtonVariant;
}

const ConfirmationModal = ({
	onClose,
	onConfirm,
	title = "Confirm Action",
	message = "Are you sure you want to proceed?",
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmStyle = "primary",
}: Props) => {
	return (
		<>
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
		</>
	);
};

export default ConfirmationModal;
