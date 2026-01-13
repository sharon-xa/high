import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	loading?: boolean;
	children: ReactNode;
}

const Button: FC<Props> = ({
	variant = "primary",
	size = "md",
	fullWidth = false,
	loading = false,
	disabled = false,
	className = "",
	children,
	...props
}) => {
	const baseStyles =
		"cursor-pointer rounded font-semibold transition-all active:scale-95 touch-manipulation inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

	const variants = {
		primary: "bg-primary border-2 border-primary text-white hover:bg-primary/90",
		secondary: "bg-gray-600 border-2 border-gray-600 text-white hover:bg-gray-700",
		danger: "bg-red-600 border-2 border-red-600 text-white hover:bg-red-700",
		ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
		outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black",
	};

	const sizes = {
		sm: "px-4 py-1 text-sm min-h-[36px]",
		md: "px-8 py-2 text-base min-h-[44px]",
		lg: "px-10 py-4 text-lg min-h-[52px]",
	};

	const widthStyle = fullWidth ? "w-full" : "";

	const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`;

	return (
		<button className={buttonClasses} disabled={disabled || loading} {...props}>
			{loading && (
				<svg
					className="animate-spin h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}
			{children}
		</button>
	);
};

export default Button;
