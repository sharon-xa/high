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
    addBlock(block: Block, afterIndex: number | null): void;
    updateBlock(index: number, block: Block): void;
    updateBlockContent(index: number, content: string): void;
    deleteBlock(index: number): void;
    reorderBlocks(sourceIndex: number, destinationIndex: number): void;
    setActiveBlock(index: number): void;
    duplicateBlock(index: number): void;

    // 0 state change methods
    createBlock(blockType: BlockType, headerLevel?: 1 | 2 | 3): Block;
};

export type EditorStore = EditorState & EditorAction;
