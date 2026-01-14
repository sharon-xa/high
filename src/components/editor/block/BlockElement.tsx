import { useRef, useState, type DragEvent, type JSX, type KeyboardEvent } from "react";
import { GripVertical, Trash } from "lucide-react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import type { Block } from "../../../types/editor/block.types";

import ParagraphBlock from "./ParagraphBlock";
import HeaderBlock from "./HeaderBlock";
import CodeBlock from "./CodeBlock";
import ImageBlockComponent from "./ImageBlock";
import SeparatorBlock from "./SeparatorBlock";

type Props = {
	block: Block;
	index: number;
	setRef: (el: HTMLElement | null) => void;
	keyDownOnBlock: (e: KeyboardEvent<HTMLElement>, blockIndex: number) => void;
};

const BlockElement = ({ block, index, setRef, keyDownOnBlock }: Props) => {
	const { blocks, activeBlockIndex, reorderBlocks, deleteBlock } = useEditorStore();
	const [isDragging, setIsDragging] = useState<boolean>(false);
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

		if (dragImageRef.current) {
			e.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
		}

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
		setIsHovered(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsHovered(false);
	};

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
		reorderBlocks(draggedIndex, index);

		setIsDragging(false);
		setIsHovered(false);
	};

	const handleBlockDeletion = () => {
		deleteBlock(index);
	};

	blockElement = (
		<div
			className={`relative py-1 ${isDragging ? "opacity-50" : ""} border-b-2 ${isHovered ? "border-primary" : "border-transparent"}`}
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
