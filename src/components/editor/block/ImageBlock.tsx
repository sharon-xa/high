import {
	useRef,
	useState,
	useEffect,
	type ChangeEvent,
	type DragEvent,
	type KeyboardEvent,
} from "react";
import type { ImageBlock } from "../../../types/editor/block.types";
import { useEditorStore } from "../../../stores/editorStores/editorStore";

type ImageBlockProps = {
	block: ImageBlock;
	index: number;
	setRef: (el: HTMLDivElement | null) => void;
	keyDownOnBlock: (e: KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const ImageBlockComponent = ({ block, index, setRef, keyDownOnBlock }: ImageBlockProps) => {
	const { activeBlockIndex, updateBlock, setActiveBlock } = useEditorStore();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const divRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (activeBlockIndex === index) {
			// Use setTimeout to ensure ref is set after render
			const timeoutId = setTimeout(() => {
				if (divRef.current) {
					divRef.current.focus();
				}
			}, 0);
			return () => clearTimeout(timeoutId);
		}
	}, [activeBlockIndex, index]);

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
		if (file) {
			handleFile(file);
		}
		// Reset input so the same file can be selected again
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];
		if (file) {
			handleFile(file);
		}
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
			onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => keyDownOnBlock(e, index)}
			tabIndex={0}
			className="text-editor-input"
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "8px",
				padding: "8px 0",
			}}
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
					style={{
						border: `2px dashed ${
							isDragging ? "var(--color-primary)" : "var(--color-border)"
						}`,
						borderRadius: "4px",
						padding: "32px 24px",
						textAlign: "center",
						color: "var(--color-white-50)",
						cursor: "pointer",
						backgroundColor: isDragging ? "var(--color-primary-25)" : "transparent",
						transition: "all 0.2s ease",
					}}
				>
					{isLoading ? (
						<div>Loading image...</div>
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
					keyDownOnBlock(e as unknown as KeyboardEvent<HTMLDivElement>, index);
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
					keyDownOnBlock(e as unknown as KeyboardEvent<HTMLDivElement>, index);
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
