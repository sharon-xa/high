import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";

import type { ImageBlock } from "../../../types/editor/block.types";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import useAutoFocus from "./hooks/useAutoFocus";
import LoadingSpinner from "../../ui/LoadingSpinner";

type ImageBlockProps = {
	block: ImageBlock;
	index: number;
	setRef: (el: HTMLElement | null) => void;
	keyDownOnBlock: (
		e: KeyboardEvent<HTMLElement>,
		blockIndex: number,
		action?: () => void
	) => void;
};

const ImageBlockComponent = ({ block, index, setRef, keyDownOnBlock }: ImageBlockProps) => {
	const { activeBlockIndex, updateBlock, setActiveBlock } = useEditorStore();
	const [isActive, setIsActive] = useState<boolean>(activeBlockIndex === index);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const divRef = useRef<HTMLElement>(null);

	useAutoFocus(divRef, activeBlockIndex === index, setIsActive);

	const handleFile = (file: File) => {
		if (!file.type.startsWith("image/")) {
			alert("Please select an image file");
			return;
		}

		setIsLoading(true);

		const reader = new FileReader();
		reader.onload = (e) => {
			const dataUrl = e.target?.result as string;
			updateBlock(index, {
				...block,
				url: dataUrl,
				alt: block.alt || file.name,
			} as ImageBlock);
			setIsLoading(false);
		};
		reader.onerror = () => {
			alert("Error reading file");
			setIsLoading(false);
		};
		reader.readAsDataURL(file);
	};

	const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
		if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input so the same file can be selected again
	};

	const handleDragOver = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];
		if (file) handleFile(file);
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div
			ref={(el) => {
				divRef.current = el;
				setRef(el);
			}}
			onFocus={() => setActiveBlock(index)}
			onKeyDown={(e: KeyboardEvent<HTMLElement>) => keyDownOnBlock(e, index, handleClick)}
			tabIndex={0}
			className={`w-full p-2 flex flex-col gap-2 border-none ${isActive ? "outline-2 outline-primary" : ""} rounded`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileInput}
				style={{ display: "none" }}
			/>
			{block.url ? (
				<div style={{ position: "relative" }}>
					<img
						src={block.url}
						alt={block.alt}
						style={{
							maxWidth: "100%",
							height: "auto",
							borderRadius: "4px",
							display: "block",
						}}
					/>
					<button
						onClick={handleClick}
						style={{
							marginTop: "8px",
							padding: "6px 12px",
							backgroundColor: "var(--color-primary)",
							color: "var(--color-white)",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							fontSize: "12px",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "var(--color-primary-75)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "var(--color-primary)";
						}}
					>
						Replace Image
					</button>
				</div>
			) : (
				<div
					onClick={handleClick}
					className={`text-white-50 px-8 py-6 text-center cursor-pointer rounded border-2 border-dashed ${isDragging ? "border-primary bg-primary-25" : "border-border bg-transparent"}`}
					style={{
						transition: "all 0.2s ease",
					}}
				>
					{isLoading ? (
						<LoadingSpinner size="mid" />
					) : (
						<>
							<div style={{ marginBottom: "8px", fontSize: "14px" }}>
								{isDragging
									? "Drop image here"
									: "Click to upload or drag and drop"}
							</div>
							<div style={{ fontSize: "12px", color: "var(--color-white-25)" }}>
								Supports: JPG, PNG, GIF, WebP
							</div>
						</>
					)}
				</div>
			)}
			<input
				type="text"
				placeholder="Or paste image URL..."
				value={block.url && !block.url.startsWith("data:") ? block.url : ""}
				onChange={(e) => {
					updateBlock(index, {
						...block,
						url: e.target.value,
					} as ImageBlock);
				}}
				onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
					if (e.key === "Enter") {
						e.preventDefault();
						// Move to next block or create new one
					}
					keyDownOnBlock(e as unknown as KeyboardEvent<HTMLElement>, index);
				}}
				style={{
					backgroundColor: "transparent",
					border: "none",
					borderBottom: "1px solid var(--color-border)",
					outline: "none",
					color: "var(--color-white)",
					fontSize: "14px",
					padding: "4px 0",
				}}
			/>
			<input
				type="text"
				placeholder="Alt text (optional)..."
				value={block.alt}
				onChange={(e) => {
					updateBlock(index, {
						...block,
						alt: e.target.value,
					} as ImageBlock);
				}}
				onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
					if (e.key === "Enter") {
						e.preventDefault();
					}
					keyDownOnBlock(e as unknown as KeyboardEvent<HTMLElement>, index);
				}}
				style={{
					backgroundColor: "transparent",
					border: "none",
					borderBottom: "1px solid var(--color-border)",
					outline: "none",
					color: "var(--color-white-50)",
					fontSize: "12px",
					padding: "4px 0",
				}}
			/>
		</div>
	);
};

export default ImageBlockComponent;
