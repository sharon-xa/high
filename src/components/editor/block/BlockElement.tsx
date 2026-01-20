import { useRef, useState, type DragEvent, type JSX, type KeyboardEvent } from "react";
import { GripVertical, Trash } from "lucide-react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import type { Block } from "../../../types/editor/block.types";

import ParagraphBlock from "./blockElements/ParagraphBlock";
import HeaderBlock from "./blockElements/HeaderBlock";
import CodeBlock from "./blockElements/CodeBlock";
import ImageBlockComponent from "./blockElements/ImageBlock";
import SeparatorBlock from "./blockElements/SeparatorBlock";

type Props = {
	block: Block;
	index: number;
	setRef: (el: HTMLElement | null) => void;
	keyDownOnBlock: (e: KeyboardEvent<HTMLElement>, blockIndex: number) => void;
};

const BlockElement = ({ block, index, setRef, keyDownOnBlock }: Props) => {
	const { blocks, activeBlockIndex, isDragging, setIsDragging, reorderBlocks, deleteBlock } = useEditorStore();
	const [upperOrDowner, setUpperOrDowner] = useState<"upper" | "downer" | null>(null);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const dragImageRef = useRef<HTMLDivElement>(null);
	let blockElement: JSX.Element;

	switch (block.type) {
		case "paragraph":
			blockElement = (
				<ParagraphBlock
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
			break;
		case "header":
			blockElement = (
				<HeaderBlock
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
			break;
		case "code":
			blockElement = (
				<CodeBlock
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
			break;
		case "image":
			blockElement = (
				<ImageBlockComponent
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
			break;
		case "separator":
			blockElement = (
				<SeparatorBlock
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
			break;
		default:
			return null;
	}

	const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
		e.stopPropagation();

		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", index.toString());

		if (dragImageRef.current)
			e.dataTransfer.setDragImage(dragImageRef.current, 0, 0);

		setIsDragging(true);
	};

	const handleDragEnd = (e: DragEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setIsDragging(false);
		setIsHovered(false);
	};

	const handleDragOver = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();

		e.dataTransfer.dropEffect = "move";

		const rect = e.currentTarget.getBoundingClientRect();
		const cursorY = e.clientY;
		const elementMiddle = rect.top + rect.height / 2;

		setUpperOrDowner(prev => {
			const next = cursorY < elementMiddle ? "upper" : "downer";
			return prev === next ? prev : next;
		});

		setIsHovered(prev => (prev ? prev : true));
	};

	const handleDragLeave = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsHovered(false);
		setUpperOrDowner(null);
	};

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
		if (draggedIndex === index) return;

		const destinationIndex =
			upperOrDowner === "upper"
				? index
				: index + 1;

		reorderBlocks(draggedIndex, destinationIndex);

		setIsDragging(false);
		setIsHovered(false);
		setUpperOrDowner(null);
	};

	const handleBlockDeletion = () => {
		deleteBlock(index);
	};

	blockElement = (
		<div
			className={`relative min-h-8 flex items-center ${isDragging ? "opacity-50" : ""} ${upperOrDowner === "upper" ? "border-t-2" : upperOrDowner === "downer" ? "border-b-2" : "border-none"}  ${isHovered ? "border-primary z-1000" : "border-transparent"}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<div
				className={`absolute absolute-ver-center -left-24 ${index === activeBlockIndex && blocks.length > 1 ? "flex" : "hidden"} items-center justify-center gap-4`}
			>
				<button onClick={handleBlockDeletion} className="cursor-pointer active:scale-95">
					<Trash />
				</button>
				<button
					draggable
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					className="cursor-grab active:cursor-grabbing"
				>
					<GripVertical />
				</button>
			</div>
			{blockElement}

			<div ref={dragImageRef} className="hidden">
				Dragging block {index}
			</div>
		</div>
	);

	return blockElement;
};

export default BlockElement;
