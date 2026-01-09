import { create } from "zustand";
import {
	Braces,
	Heading1,
	Heading2,
	Heading3,
	Image,
	SeparatorHorizontal,
	Pilcrow,
} from "lucide-react";
import type { CommandMenuStore } from "../../types/editor/commandMenu.types";
import { useEditorStore } from "./editorStore";
import type {
	Block,
	BlockType,
	CodeBlock,
	HeaderBlock,
	ParagraphBlock,
} from "../../types/editor/block.types";
import { IS_MOBILE } from "../../lib/platform";

export const useCommandMenuStore = create<CommandMenuStore>((set, get) => ({
	isCommandMenuOpen: false,
	selectedCommand: 0,
	commands: [
		{
			id: "paragraph",
			label: "Paragraph",
			icon: Pilcrow,
			action: () => get().handleInsertBlock("paragraph"),
		},
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
	setSelectedCommand: (selectedCommand: number) =>
		set(() => ({
			selectedCommand: selectedCommand,
		})),

	handleInsertBlock: (blockType: BlockType, headerLevel?: 1 | 2 | 3) => {
		const { blocks, activeBlockIndex, createBlock, updateBlock } = useEditorStore.getState();

		if (activeBlockIndex === null) return;

		const currentBlock = blocks[activeBlockIndex];
		const newBlock = createBlock(blockType, headerLevel);

		if (BlockContainsContent(currentBlock) && BlockContainsContent(newBlock))
			newBlock.content =
				currentBlock.content === "/" && IS_MOBILE === false ? "" : currentBlock.content;

		updateBlock(activeBlockIndex, newBlock);

		get().setIsCommandMenuOpen(false);
	},
}));

// This is called a type predicate, check typescript docs for more information:
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
function BlockContainsContent(block: Block): block is ParagraphBlock | HeaderBlock | CodeBlock {
	return block.type === "paragraph" || block.type === "header" || block.type === "code";
}
