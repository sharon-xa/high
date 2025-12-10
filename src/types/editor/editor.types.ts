import type { Block, BlockType } from "./block.types";

export type EditorState = {
    title: string;
    blocks: Block[];
    activeBlockIndex: number | null;
};

export type EditorAction = {
    // title
    updateTitle(title: string): void;

    // Blocks
    addEmptyBlock(type: BlockType, afterIndex: number | null): void;
    updateBlock(index: number, content: string): void;
    deleteBlock(index: number): void;
    reorderBlocks(sourceIndex: number, destinationIndex: number): void;
    setActiveBlock(index: number): void;
    duplicateBlock(index: number): void;
};

export type EditorStore = EditorState & EditorAction;
