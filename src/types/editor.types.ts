export type Metadata = {
    headerLevel?: 1 | 2 | 3;
    alt?: string; // for images
    url?: string; // for images
};

export type ParagraphBlock = {
    uuid: string;
    type: "paragraph";
    content: string;
    metadata?: Metadata;
}

export type HeaderBlock = {
    uuid: string;
    type: "headerOne" | "headerTwo" | "headerThree";
    content: string;
    metadata: Metadata;
}

export type ImageBlock = {
    uuid: string;
    type: "image";
    content: string;
    metadata: Metadata;
}

// We need to add the following:
//  1. code block
//  2. iframe
//  3. separator
export type BlockType = "headerOne" | "headerTwo" | "headerThree" | "paragraph" | "image";
export type Block = ParagraphBlock | HeaderBlock | ImageBlock;

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
