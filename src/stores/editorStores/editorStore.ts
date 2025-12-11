import { create } from "zustand";
import { immer } from 'zustand/middleware/immer';
import { v4 as uuid } from "uuid";
import type { EditorStore } from "../../types/editor/editor.types";
import type { Block } from "../../types/editor/block.types";

// TODO: what is debouncing? and do I need it?

export const useEditorStore = create<EditorStore>()(
    immer((set) => ({
        title: "",
        blocks: [
            { uuid: uuid(), content: "", type: 'paragraph' }
        ],
        activeBlockIndex: 0,

        updateTitle: (title: string) =>
            set((state) => {
                state.title = title;
            }),

        addBlock(block: Block, afterIndex: number | null) {
            set((state) => {
                if (afterIndex === null) {
                    state.blocks.unshift(block);
                    state.activeBlockIndex = 0;
                } else {
                    state.blocks.splice(afterIndex + 1, 0, block);
                    state.activeBlockIndex = afterIndex + 1;
                }
            });
        },

        updateBlock(index: number, block: Block) {
            set((state) => {
                if (index < 0 || index >= state.blocks.length) return;
                state.blocks[index] = block;
            });
        },

        updateBlockContent(index: number, content: string) {
            set((state) => {
                if (index < 0 || index >= state.blocks.length)
                    return;
                if (
                    state.blocks[index].type !== "image" &&
                    state.blocks[index].type !== "separator"
                )
                    state.blocks[index].content = content;
            });
        },

        deleteBlock(index: number) {
            set((state) => {
                if (index < 0 || index >= state.blocks.length) return;

                if (state.blocks.length <= 1) {
                    state.blocks = [{ uuid: uuid(), content: "", type: "paragraph" }];
                    state.activeBlockIndex = 0;
                } else {
                    state.blocks.splice(index, 1);
                    state.activeBlockIndex = index > 0 ? index - 1 : 0;
                }
            });
        },

        reorderBlocks(sourceIndex: number, destinationIndex: number) {
            set((state) => {
                const [movedBlock] = state.blocks.splice(sourceIndex, 1);
                state.blocks.splice(destinationIndex, 0, movedBlock);

                if (state.activeBlockIndex === sourceIndex) {
                    state.activeBlockIndex = destinationIndex;
                }
            });
        },

        setActiveBlock(index: number) {
            set((state) => {
                state.activeBlockIndex = index;
            });
        },

        duplicateBlock(index: number) {
            set((state) => {
                const blockToDuplicate = state.blocks[index];
                if (!blockToDuplicate) return;

                const duplicatedBlock = { ...blockToDuplicate, uuid: uuid() };
                state.blocks.splice(index + 1, 0, duplicatedBlock);
                state.activeBlockIndex = index + 1;
            });
        },
    }))
);
