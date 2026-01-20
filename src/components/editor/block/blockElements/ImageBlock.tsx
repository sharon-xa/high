import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { useEditorStore } from "../../../../stores/editorStores/editorStore";

import useAutoFocus from "../hooks/useAutoFocus";
import LoadingSpinner from "../../../ui/LoadingSpinner";

import type { BlockElementProps } from "../blockElementProps";
import type { ImageBlock as ImageBlockType } from "../../../../types/editor/block.types";

interface ImageBlockProps extends BlockElementProps<ImageBlockType> { };

const ImageBlock = ({ block, index, setRef, keyDownOnBlock }: ImageBlockProps) => {
	const { activeBlockIndex, isDragging, updateBlock, setActiveBlock } = useEditorStore();
	const [isActive, setIsActive] = useState<boolean>(activeBlockIndex === index);
	const [isImgDragging, setIsImgDragging] = useState<boolean>(false);
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
			} as ImageBlockType);
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
		setIsImgDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsImgDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsImgDragging(false);

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
			onDragOver={!isDragging ? handleDragOver : undefined}
			onDragLeave={!isDragging ? handleDragLeave : undefined}
			onDrop={!isDragging ? handleDrop : undefined}
		>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileInput}
				className="hidden"
			/>
			{block.url ? (
				<div className="relative flex flex-col items-center gap-5">
					<img
						src={block.url}
						alt={block.alt}
						className="max-w-full max-h-[60vh] rounded block"
					/>
					<button
						onClick={handleClick}
						className="self-start px-3 py-1.5 text-sm bg-primary border-none rounded cursor-pointer"
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
					className={`text-white-50 px-8 py-6 text-center cursor-pointer rounded border-2 border-dashed ${isImgDragging ? "border-primary bg-primary-25" : "border-border bg-transparent"}`}
					style={{
						transition: "all 0.2s ease",
					}}
				>
					{isLoading ? (
						<LoadingSpinner size="mid" />
					) : (
						<>
							<div className="mb-2 text-sm">
								{isImgDragging
									? "Drop image here"
									: "Click to upload or drag and drop"}
							</div>
							<div className="text-xs text-white-25">
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
					} as ImageBlockType);
				}}
				onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => keyDownOnBlock(e, index)}
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
					} as ImageBlockType);
				}}
				onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => keyDownOnBlock(e, index)}
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

export default ImageBlock;
