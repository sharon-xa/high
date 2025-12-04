import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type { EditorStore, Block, BlockType } from "../types/editor.types";

// TODO: what is debouncing? and why do I need it?

export const useEditorStore = create<EditorStore>((set) => ({
    title: "",
    blocks: [
        { uuid: uuid(), content: "", type: 'paragraph' }
    ],
    activeBlockIndex: 0, // -1 == title

    // Toolbar
    showToolbar: false,
    selectedText: "",
    toolbarPosition: { top: 0, left: 0 },

    updateTitle: (title: string) => set(() => ({ title: title })),

    addEmptyBlock(type: BlockType, afterIndex: number | null) {
        const newBlock: Block = {
            uuid: uuid(),
            content: "",
            type: type,
            metadata: {}
        };

        if (afterIndex === null) {
            set((state) => {
                return { blocks: [newBlock, ...state.blocks], activeBlockIndex: 0 };
            });
        } else {
            set((state) => {
                const newBlocks = [...state.blocks];
                newBlocks.splice(afterIndex + 1, 0, newBlock);

                return { blocks: newBlocks, activeBlockIndex: afterIndex + 1 };
            });
        }
    },
    updateBlock(index: number, content: string) {
        set((state) => {
            if (!state.blocks[index])
                return state;
            state.blocks[index].content = content;
            return { blocks: [...state.blocks] };
        })
    },
    deleteBlock(index: number) {
        set((state) => {
            if (!state.blocks[index])
                return state;

            return {
                blocks: state.blocks.length <= 1
                    ? [{ uuid: uuid(), content: "", type: "paragraph" }]
                    : state.blocks.toSpliced(index, 1),
                activeBlockIndex: index > 0 ? index - 1 : 0 // one step backward
            };
        })
    },
    reorderBlocks(sourceIndex: number, destinationIndex: number) {
        const moveItem = (arr: Block[], from: number, to: number) => {
            const newArr = [...arr];
            const item = newArr.splice(from, 1)[0];
            newArr.splice(to, 0, item);
            return newArr;
        };

        set((state) => {
            const newBlocks = moveItem(state.blocks, sourceIndex, destinationIndex);
            if (state.activeBlockIndex === sourceIndex)
                return { blocks: newBlocks, activeBlockIndex: destinationIndex };
            return { blocks: newBlocks };
        });
    },
    setActiveBlock(index: number) {
        set(() => ({ activeBlockIndex: index }));
    },
    duplicateBlock(index: number) {
        set((state) => {
            const blockToDuplicate = state.blocks[index];
            if (!blockToDuplicate)
                return state;

            const duplicatedBlock = { ...blockToDuplicate, uuid: uuid() };

            const newBlocks = state.blocks
                .toSpliced(index + 1, 0, duplicatedBlock);

            return { blocks: newBlocks, activeBlockIndex: index + 1 }
        });
    },

    setShowToolbar: (show: boolean) => set(() => ({ showToolbar: show })),
    setSelectedText: (text: string) => set(() => ({ selectedText: text })),
    setToolbarPosition: (top: number, left: number) => set(() => ({ toolbarPosition: { top: top, left: left } })),
}));
