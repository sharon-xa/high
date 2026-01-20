import type { Block, BlockType, HeaderLevels } from "./block.types";

export type EditorState = {
	title: string;
	blocks: Block[];
	activeBlockIndex: number;
	isDragging: boolean;
};

export type EditorAction = {
	updateTitle(title: string): void;

	addBlock(block: Block, afterIndex: number | null): void;

	updateBlock(index: number, block: Block): void;
	updateBlockType(index: number, type: BlockType, headerLevel?: HeaderLevels): void;
	updateBlockContent(index: number, content: string): void;
	reorderBlocks(sourceIndex: number, destinationIndex: number): void;
	duplicateBlock(index: number): void;

	deleteBlock(index: number): void;
	flushBlocks(): void;

	setActiveBlock(index: number): void;
	setIsDragging(dragging: boolean): void;

	// 0 state change methods
	createBlock(blockType: BlockType, headerLevel?: 1 | 2 | 3): Block;
};

export type EditorStore = EditorState & EditorAction;
