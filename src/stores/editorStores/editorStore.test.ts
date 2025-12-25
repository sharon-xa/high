import { describe, it, expect, beforeEach } from "vitest";
import { create } from "zustand";
import { v4 as uuid } from "uuid";
// import type { EditorStore, Block, HeaderBlock, ImageBlock, ParagraphBlock } from '../types/editor.types';
import type {
	EditorStore,
	Block,
	ParagraphBlock,
	HeaderBlock,
	ImageBlock,
} from "../types/editor.types";

// Helper to create a fresh store for each test
const createTestStore = () => {
	return create<EditorStore>((set) => ({
		title: "",
		blocks: [{ uuid: uuid(), content: "", type: "paragraph" }],
		activeBlockIndex: 0,

		updateTitle: (title: string) => set(() => ({ title: title })),

		addBlock(block: Block, afterIndex: number | null) {
			const newBlock = { ...block, uuid: uuid() };

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
				if (!state.blocks[index]) return state;
				state.blocks[index].content = content;
				return { blocks: [...state.blocks] };
			});
		},
		deleteBlock(index: number) {
			set((state) => {
				if (!state.blocks[index]) return state;

				return {
					blocks:
						state.blocks.length <= 1
							? [{ uuid: uuid(), content: "", type: "paragraph" }]
							: state.blocks.toSpliced(index, 1),
					activeBlockIndex: index > 0 ? index - 1 : 0,
				};
			});
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
				if (!blockToDuplicate) return state;

				const duplicatedBlock = { ...blockToDuplicate, uuid: uuid() };

				const newBlocks = state.blocks.toSpliced(index + 1, 0, duplicatedBlock);

				return { blocks: newBlocks, activeBlockIndex: index + 1 };
			});
		},
		convertBlockType(index: number, newType: Block) {
			set((state) => {
				const blockToConvert = state.blocks[index];
				if (!blockToConvert) return state;

				const convertedBlock = {
					...blockToConvert,
					type: newType.type,
					metadata: newType.metadata || {},
				};

				const newBlocks = state.blocks;
				newBlocks[index] = convertedBlock;

				return { blocks: newBlocks };
			});
		},
	}));
};

describe("EditorStore Actions", () => {
	let store: ReturnType<typeof createTestStore>;

	beforeEach(() => {
		store = createTestStore();
	});

	// describe('updateTitle', () => {
	//     it('should update the title', () => {
	//         store.getState().updateTitle('New Blog Post');
	//         expect(store.getState().title).toBe('New Blog Post');
	//     });

	//     it('should handle empty string', () => {
	//         store.getState().updateTitle('');
	//         expect(store.getState().title).toBe('');
	//     });

	//     it('should overwrite previous title', () => {
	//         store.getState().updateTitle('First Title');
	//         store.getState().updateTitle('Second Title');
	//         expect(store.getState().title).toBe('Second Title');
	//     });
	// });

	// describe('addBlock', () => {
	//     it('should add a paragraph block after specified index', () => {
	//         const initialLength = store.getState().blocks.length;
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'paragraph',
	//             content: ''
	//         };

	//         store.getState().addBlock(paragraphBlock, 0);

	//         console.log(store.getState().blocks);
	//         expect(store.getState().blocks.length).toBe(initialLength + 1);
	//         expect(store.getState().blocks[1].type).toBe('paragraph');
	//     });

	//     it('should add a header block with correct type and metadata', () => {
	//         const headerBlock: HeaderBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'HeaderOne',
	//             content: '',
	//             metadata: { headerLevel: 1 }
	//         };

	//         store.getState().addBlock(headerBlock, 0);
	//         const newBlock = store.getState().blocks[1];

	//         expect(newBlock.type).toBe('HeaderOne');
	//         if (newBlock.type !== 'paragraph') {
	//             expect(newBlock.metadata).toBeDefined();
	//         }
	//     });

	//     it('should add an image block with metadata', () => {
	//         const imageBlock: ImageBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'image',
	//             content: '',
	//             metadata: { url: '', alt: '' }
	//         };

	//         store.getState().addBlock(imageBlock, 0);
	//         const newBlock = store.getState().blocks[1];

	//         expect(newBlock.type).toBe('image');
	//         if (newBlock.type === 'image') {
	//             expect(newBlock.metadata).toBeDefined();
	//         }
	//     });

	//     it('should generate unique uuid for new block', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'paragraph',
	//             content: ''
	//         };

	//         store.getState().addBlock(paragraphBlock, 0);
	//         store.getState().addBlock(paragraphBlock, 1);

	//         const blocks = store.getState().blocks;
	//         console.log(blocks);
	//         const uuids = blocks.map((b: Block) => b.uuid);
	//         const uniqueUuids = new Set(uuids);

	//         expect(uniqueUuids.size).toBe(uuids.length);
	//     });

	//     it('should set new block index as active', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'paragraph',
	//             content: ''
	//         };

	//         store.getState().addBlock(paragraphBlock, 0);

	//         expect(store.getState().activeBlockIndex).toBe(1);
	//     });

	//     it('should add block at the end when afterIndex is last index', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'paragraph',
	//             content: ''
	//         };

	//         const lastIndex = store.getState().blocks.length - 1;
	//         store.getState().addBlock(paragraphBlock, lastIndex);

	//         const blocks = store.getState().blocks;
	//         expect(blocks[blocks.length - 1].type).toBe('paragraph');
	//     });

	//     it('should add block at beginning when afterIndex is -1', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'paragraph',
	//             content: ''
	//         };

	//         store.getState().addBlock(paragraphBlock, -1);

	//         expect(store.getState().blocks[0].type).toBe('paragraph');
	//     });

	//     it('should have empty content for new blocks', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'paragraph',
	//             content: ''
	//         };

	//         store.getState().addBlock(paragraphBlock, 0);
	//         const newBlock = store.getState().blocks[1];

	//         expect(newBlock.content).toBe('');
	//     });

	//     it('should ignore the uuid from input block and generate new one', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'should-be-ignored',
	//             type: 'paragraph',
	//             content: 'test'
	//         };

	//         store.getState().addBlock(paragraphBlock, 0);
	//         const newBlock = store.getState().blocks[1];

	//         expect(newBlock.uuid).not.toBe('should-be-ignored');
	//     });

	//     it('should handle paragraph blocks with optional metadata', () => {
	//         const paragraphWithMetadata: ParagraphBlock = {
	//             uuid: 'temp-uuid',
	//             type: 'paragraph',
	//             content: 'test',
	//             metadata: { headerLevel: 1 }
	//         };

	//         store.getState().addBlock(paragraphWithMetadata, 0);
	//         const newBlock = store.getState().blocks[1];

	//         expect(newBlock.type).toBe('paragraph');
	//         if (newBlock.type === 'paragraph' && newBlock.metadata) {
	//             expect(newBlock.metadata).toBeDefined();
	//         }
	//     });
	// });

	// describe('updateBlock', () => {
	//     it('should update content of block at specified index', () => {
	//         store.getState().updateBlock(0, 'Updated content');

	//         expect(store.getState().blocks[0].content).toBe('Updated content');
	//     });

	//     it('should not affect other blocks', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp',
	//             type: 'paragraph',
	//             content: ''
	//         };
	//         store.getState().addBlock(paragraphBlock, 0);

	//         const secondBlockBefore = { ...store.getState().blocks[1] };

	//         store.getState().updateBlock(0, 'First block updated');
	//         const secondBlockAfter = store.getState().blocks[1];

	//         expect(secondBlockAfter.uuid).toBe(secondBlockBefore.uuid);
	//         expect(secondBlockAfter.content).toBe(secondBlockBefore.content);
	//     });

	//     it('should handle empty string content', () => {
	//         store.getState().updateBlock(0, '');

	//         expect(store.getState().blocks[0].content).toBe('');
	//     });

	//     it('should not crash with invalid index', () => {
	//         expect(() => {
	//             store.getState().updateBlock(999, 'content');
	//         }).not.toThrow();
	//     });

	//     it('should not modify array length', () => {
	//         const lengthBefore = store.getState().blocks.length;
	//         store.getState().updateBlock(0, 'content');

	//         expect(store.getState().blocks.length).toBe(lengthBefore);
	//     });

	//     it('should work with all block types', () => {
	//         const headerBlock: HeaderBlock = {
	//             uuid: 'temp',
	//             type: 'HeaderTwo',
	//             content: '',
	//             metadata: { headerLevel: 2 }
	//         };
	//         store.getState().addBlock(headerBlock, 0);

	//         store.getState().updateBlock(1, 'Header content');

	//         expect(store.getState().blocks[1].content).toBe('Header content');
	//     });

	//     it('should preserve block type and metadata when updating content', () => {
	//         const headerBlock: HeaderBlock = {
	//             uuid: 'temp',
	//             type: 'HeaderThree',
	//             content: '',
	//             metadata: { headerLevel: 3 }
	//         };
	//         store.getState().addBlock(headerBlock, 0);

	//         const blockBefore = store.getState().blocks[1];
	//         store.getState().updateBlock(1, 'New content');
	//         const blockAfter = store.getState().blocks[1];

	//         expect(blockAfter.type).toBe(blockBefore.type);
	//         if (blockAfter.type !== 'paragraph') {
	//             expect(blockAfter.metadata).toEqual((blockBefore as HeaderBlock | ImageBlock).metadata);
	//         }
	//     });
	// });

	// describe('deleteBlock', () => {
	//     beforeEach(() => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp',
	//             type: 'paragraph',
	//             content: ''
	//         };
	//         const headerBlock: HeaderBlock = {
	//             uuid: 'temp',
	//             type: 'HeaderOne',
	//             content: '',
	//             metadata: { headerLevel: 1 }
	//         };

	//         store.getState().addBlock(paragraphBlock, 0);
	//         store.getState().addBlock(headerBlock, 1);
	//     });

	//     it('should remove block at specified index', () => {
	//         const lengthBefore = store.getState().blocks.length;
	//         console.log(store.getState().blocks);
	//         store.getState().deleteBlock(1);
	//         console.log(store.getState().blocks);

	//         expect(store.getState().blocks.length).toBe(lengthBefore - 1);
	//     });

	//     it('should move focus to previous index when deleting middle block', () => {
	//         store.getState().deleteBlock(2);

	//         expect(store.getState().activeBlockIndex).toBe(1);
	//     });

	//     it('should move focus to next block (index 0) when deleting first block', () => {
	//         console.log(store.getState().activeBlockIndex);
	//         store.getState().deleteBlock(0);
	//         console.log(store.getState().activeBlockIndex);

	//         expect(store.getState().activeBlockIndex).toBe(0);
	//     });

	//     it('should never leave blocks array empty', () => {
	//         const blocks = store.getState().blocks;

	//         for (let i = blocks.length - 1; i >= 0; i--) {
	//             store.getState().deleteBlock(0);
	//         }

	//         expect(store.getState().blocks.length).toBeGreaterThan(0);
	//     });

	//     it('should create new empty paragraph when deleting last block', () => {
	//         while (store.getState().blocks.length > 1) {
	//             store.getState().deleteBlock(0);
	//         }

	//         store.getState().deleteBlock(0);

	//         const blocks = store.getState().blocks;
	//         expect(blocks.length).toBe(1);
	//         expect(blocks[0].type).toBe('paragraph');
	//         expect(blocks[0].content).toBe('');
	//     });

	//     it('should not crash with invalid index', () => {
	//         expect(() => {
	//             store.getState().deleteBlock(999);
	//         }).not.toThrow();

	//         expect(() => {
	//             store.getState().deleteBlock(-5);
	//         }).not.toThrow();
	//     });

	//     it('should set new block index as active when last block is deleted', () => {
	//         while (store.getState().blocks.length > 1) {
	//             store.getState().deleteBlock(0);
	//         }

	//         store.getState().deleteBlock(0);

	//         expect(store.getState().activeBlockIndex).toBe(0);
	//     });

	//     it('should handle deleting the currently active block', () => {
	//         store.getState().setActiveBlock(1);
	//         const lengthBefore = store.getState().blocks.length;

	//         store.getState().deleteBlock(1);

	//         expect(store.getState().blocks.length).toBe(lengthBefore - 1);
	//         expect(store.getState().activeBlockIndex).not.toBe(null);
	//     });
	// });

	// describe('reorderBlocks', () => {
	//     beforeEach(() => {
	//         const blocks: Block[] = [
	//             { uuid: 'temp', type: 'paragraph', content: 'para1' } as ParagraphBlock,
	//             { uuid: 'temp', type: 'HeaderOne', content: 'h1', metadata: { headerLevel: 1 } } as HeaderBlock,
	//             { uuid: 'temp', type: 'HeaderTwo', content: 'h2', metadata: { headerLevel: 2 } } as HeaderBlock
	//         ];

	//         blocks.forEach((block, i) => {
	//             store.getState().addBlock(block, i);
	//         });
	//     });

	//     it('should move block from source to destination index', () => {
	//         const blocks = store.getState().blocks;
	//         const movedBlockUuid = blocks[0].uuid;

	//         store.getState().reorderBlocks(0, 2);

	//         expect(store.getState().blocks[2].uuid).toBe(movedBlockUuid);
	//     });

	//     it('should move block forward in array', () => {
	//         const blocks = store.getState().blocks;
	//         const firstBlockUuid = blocks[0].uuid;
	//         const firstBlockContent = blocks[0].content;

	//         store.getState().reorderBlocks(0, 3);

	//         expect(store.getState().blocks[3].uuid).toBe(firstBlockUuid);
	//         expect(store.getState().blocks[3].content).toBe(firstBlockContent);
	//     });

	//     it('should move block backward in array', () => {
	//         const blocks = store.getState().blocks;
	//         const lastIndex = blocks.length - 1;
	//         const lastBlockUuid = blocks[lastIndex].uuid;
	//         const lastBlockContent = blocks[lastIndex].content;

	//         store.getState().reorderBlocks(lastIndex, 0);

	//         expect(store.getState().blocks[0].uuid).toBe(lastBlockUuid);
	//         expect(store.getState().blocks[0].content).toBe(lastBlockContent);
	//     });

	//     it('should preserve all block data during move', () => {
	//         store.getState().updateBlock(1, 'Test content');
	//         const blockBefore = { ...store.getState().blocks[1] };

	//         store.getState().reorderBlocks(1, 3);
	//         const blockAfter = store.getState().blocks[3];

	//         expect(blockAfter.content).toBe(blockBefore.content);
	//         expect(blockAfter.uuid).toBe(blockBefore.uuid);
	//         expect(blockAfter.type).toBe(blockBefore.type);
	//     });

	//     it('should not change array length', () => {
	//         const lengthBefore = store.getState().blocks.length;
	//         store.getState().reorderBlocks(0, 2);

	//         expect(store.getState().blocks.length).toBe(lengthBefore);
	//     });

	//     it('should handle reordering to same position', () => {
	//         const blocksBefore = store.getState().blocks.map((b: Block) => b.uuid);
	//         store.getState().reorderBlocks(1, 1);
	//         const blocksAfter = store.getState().blocks.map((b: Block) => b.uuid);

	//         expect(blocksAfter).toEqual(blocksBefore);
	//     });

	//     it('should update activeBlockIndex if reordering the active block', () => {
	//         store.getState().setActiveBlock(1);
	//         store.getState().reorderBlocks(1, 3);

	//         expect(store.getState().activeBlockIndex).toBe(3);
	//     });

	//     it('should not crash with invalid indices', () => {
	//         expect(() => {
	//             store.getState().reorderBlocks(999, 0);
	//         }).not.toThrow();

	//         expect(() => {
	//             store.getState().reorderBlocks(0, 999);
	//         }).not.toThrow();
	//     });

	//     it('should preserve metadata during reorder for header blocks', () => {
	//         const headerIndex = store.getState().blocks.findIndex(
	//             (b: Block) => b.type === 'HeaderOne'
	//         );
	//         const headerBefore = store.getState().blocks[headerIndex] as HeaderBlock;

	//         store.getState().reorderBlocks(headerIndex, 0);
	//         const headerAfter = store.getState().blocks[0] as HeaderBlock;

	//         expect(headerAfter.metadata).toEqual(headerBefore.metadata);
	//     });

	//     it('should preserve metadata during reorder for image blocks', () => {
	//         const imageBlock: ImageBlock = {
	//             uuid: 'temp',
	//             type: 'image',
	//             content: 'img.jpg',
	//             metadata: { url: 'img.jpg', alt: 'Image' }
	//         };
	//         store.getState().addBlock(imageBlock, 0);

	//         const imageIndex = store.getState().blocks.findIndex(
	//             (b: Block) => b.type === 'image'
	//         );
	//         const imageBefore = store.getState().blocks[imageIndex] as ImageBlock;

	//         store.getState().reorderBlocks(imageIndex, 0);
	//         const imageAfter = store.getState().blocks[0] as ImageBlock;

	//         expect(imageAfter.metadata).toEqual(imageBefore.metadata);
	//     });
	// });

	// describe('setActiveBlock', () => {
	//     it('should set active block by index', () => {
	//         store.getState().setActiveBlock(0);

	//         expect(store.getState().activeBlockIndex).toBe(0);
	//     });

	//     it('should change active block to different index', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp',
	//             type: 'paragraph',
	//             content: ''
	//         };
	//         store.getState().addBlock(paragraphBlock, 0);

	//         store.getState().setActiveBlock(1);

	//         expect(store.getState().activeBlockIndex).toBe(1);
	//     });

	//     it('should handle setting to null (deselect)', () => {
	//         store.getState().setActiveBlock(null!);

	//         expect(store.getState().activeBlockIndex).toBe(null);
	//     });

	//     it('should handle out of bounds index gracefully', () => {
	//         expect(() => {
	//             store.getState().setActiveBlock(999);
	//         }).not.toThrow();
	//     });

	//     it('should handle negative index gracefully', () => {
	//         expect(() => {
	//             store.getState().setActiveBlock(-1);
	//         }).not.toThrow();
	//     });

	//     it('should accept valid indices within range', () => {
	//         const paragraphBlock: ParagraphBlock = {
	//             uuid: 'temp',
	//             type: 'paragraph',
	//             content: ''
	//         };
	//         store.getState().addBlock(paragraphBlock, 0);
	//         store.getState().addBlock(paragraphBlock, 1);

	//         store.getState().setActiveBlock(2);

	//         expect(store.getState().activeBlockIndex).toBe(2);
	//     });
	// });

	// describe('duplicateBlock', () => {
	//     beforeEach(() => {
	//         store.getState().updateBlock(0, 'Original content');
	//     });

	//     it('should create a copy of the block at index', () => {
	//         const lengthBefore = store.getState().blocks.length;

	//         store.getState().duplicateBlock(0);

	//         expect(store.getState().blocks.length).toBe(lengthBefore + 1);
	//     });

	//     it('should insert duplicate right after original', () => {
	//         const originalBlock = store.getState().blocks[0];
	//         store.getState().duplicateBlock(0);

	//         const duplicateBlock = store.getState().blocks[1];
	//         expect(duplicateBlock.content).toBe(originalBlock.content);
	//         expect(duplicateBlock.type).toBe(originalBlock.type);
	//     });

	//     it('should generate new uuid for duplicate', () => {
	//         const originalBlock = store.getState().blocks[0];
	//         store.getState().duplicateBlock(0);

	//         const duplicateBlock = store.getState().blocks[1];
	//         expect(duplicateBlock.uuid).not.toBe(originalBlock.uuid);
	//     });

	//     it('should copy content exactly', () => {
	//         store.getState().duplicateBlock(0);

	//         const duplicateBlock = store.getState().blocks[1];
	//         expect(duplicateBlock.content).toBe('Original content');
	//     });

	//     it('should copy metadata for header blocks', () => {
	//         const headerBlock: HeaderBlock = {
	//             uuid: 'temp',
	//             type: 'HeaderOne',
	//             content: 'Header',
	//             metadata: { headerLevel: 1 }
	//         };
	//         store.getState().addBlock(headerBlock, 0);

	//         store.getState().duplicateBlock(1);

	//         const duplicate = store.getState().blocks[2] as HeaderBlock;
	//         const original = store.getState().blocks[1] as HeaderBlock;

	//         expect(duplicate.metadata).toEqual(original.metadata);
	//     });

	//     it('should copy metadata for image blocks', () => {
	//         const imageBlock: ImageBlock = {
	//             uuid: 'temp',
	//             type: 'image',
	//             content: 'test.jpg',
	//             metadata: { url: 'test.jpg', alt: 'Test image' }
	//         };
	//         store.getState().addBlock(imageBlock, 0);

	//         store.getState().duplicateBlock(1);

	//         const duplicate = store.getState().blocks[2] as ImageBlock;

	//         expect(duplicate.metadata).toEqual({ url: 'test.jpg', alt: 'Test image' });
	//     });

	//     it('should set duplicate index as active', () => {
	//         store.getState().duplicateBlock(0);

	//         expect(store.getState().activeBlockIndex).toBe(1);
	//     });

	//     it('should not crash with invalid index', () => {
	//         expect(() => {
	//             store.getState().duplicateBlock(999);
	//         }).not.toThrow();
	//     });

	//     it('should handle duplicating blocks with optional metadata', () => {
	//         const paragraphWithMetadata: ParagraphBlock = {
	//             uuid: 'temp',
	//             type: 'paragraph',
	//             content: 'test',
	//             metadata: { headerLevel: 1 }
	//         };
	//         store.getState().addBlock(paragraphWithMetadata, 0);

	//         store.getState().duplicateBlock(1);

	//         const duplicate = store.getState().blocks[2] as ParagraphBlock;
	//         const original = store.getState().blocks[1] as ParagraphBlock;

	//         if (original.metadata) {
	//             expect(duplicate.metadata).toEqual(original.metadata);
	//         }
	//     });
	// });

	describe("Integration scenarios", () => {
		it("should maintain state consistency after complex workflow", () => {
			const blocks: Block[] = [
				{
					uuid: "temp",
					type: "HeaderOne",
					content: "h1",
					metadata: { headerLevel: 1 },
				} as HeaderBlock,
				{ uuid: "temp", type: "paragraph", content: "p1" } as ParagraphBlock,
				{
					uuid: "temp",
					type: "image",
					content: "img.jpg",
					metadata: { url: "img.jpg", alt: "Img" },
				} as ImageBlock,
			];

			blocks.forEach((block, i) => {
				store.getState().addBlock(block, i + 1);
			});

			// Reorder
			store.getState().reorderBlocks(0, 3);

			// Update
			store.getState().updateBlock(0, "Updated");

			// Delete
			store.getState().deleteBlock(2);

			const resultBlocks = store.getState().blocks;

			expect(resultBlocks.length).toBeGreaterThan(0);
			expect(resultBlocks.every((b: Block) => b.uuid)).toBe(true);
			expect(store.getState().activeBlockIndex).not.toBe(undefined);
		});

		it("should handle type guards correctly", () => {
			const headerBlock: HeaderBlock = {
				uuid: "temp",
				type: "HeaderTwo",
				content: "Header",
				metadata: { headerLevel: 2 },
			};
			store.getState().addBlock(headerBlock, 0);
			const block = store.getState().blocks[1];

			if (block.type !== "paragraph") {
				expect(block.metadata).toBeDefined();
				expect("headerLevel" in block.metadata || "url" in block.metadata).toBe(true);
			}
		});
	});
});
