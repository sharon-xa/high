import { create } from "zustand";
import { Braces, Heading1, Heading2, Heading3, Image, SeparatorHorizontal } from "lucide-react";
import type { CommandMenuStore } from "../../types/editor/commandMenu.types";
import { useEditorStore } from "./editorStore";
import type { BlockType } from "../../types/editor/block.types";

export const useCommandMenuStore = create<CommandMenuStore>((set, get) => ({
    isCommandMenuOpen: false,
    selectedCommand: 0,
    commands: [
        {
            id: "heading1",
            label: "Heading 1",
            icon: Heading1,
            action: () => get().handleInsertBlock("header", 1),
        },
        {
            id: "heading2",
            label: "Heading 2",
            icon: Heading2,
            action: () => get().handleInsertBlock("header", 2),
        },
        {
            id: "heading3",
            label: "Heading 3",
            icon: Heading3,
            action: () => get().handleInsertBlock("header", 3),
        },
        {
            id: "image",
            label: "Image",
            icon: Image,
            action: () => get().handleInsertBlock("image"),
        },
        {
            id: "separator",
            label: "Separator",
            icon: SeparatorHorizontal,
            action: () => get().handleInsertBlock("separator"),
        },
        {
            id: "code",
            label: "Code Block",
            icon: Braces,
            action: () => get().handleInsertBlock("code"),
        },
    ],
    setIsCommandMenuOpen: (isOpen: boolean) => set(() => ({ isCommandMenuOpen: isOpen })),
    setSelectedCommand: (selectedCommand: number) => set(() => ({ selectedCommand: selectedCommand })),
    handleInsertBlock: (blockType: BlockType, headerLevel?: 1 | 2 | 3) => {
        const { blocks, activeBlockIndex, createBlock, updateBlock, addBlock } = useEditorStore.getState();

        if (activeBlockIndex === null) return;

        const currentBlock = blocks[activeBlockIndex];
        const newBlock = createBlock(blockType, headerLevel);

        // If current block is empty paragraph, replace it; otherwise insert after
        if (currentBlock.type === "paragraph" && (currentBlock.content === "" || currentBlock.content === "/"))
            updateBlock(activeBlockIndex, newBlock);
        else
            addBlock(newBlock, activeBlockIndex);

        get().setIsCommandMenuOpen(false);
    },
}));