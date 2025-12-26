import { v4 as uuid } from "uuid";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { IS_MOBILE } from "../../lib/platform";
import { useEditorStore } from "../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../stores/editorStores/toolbarStore";
import { useCommandMenuStore } from "../../stores/editorStores/commandMenuStore";
import {
	getCaretPosition,
	setCaretAtEndOfText,
	setCaretPosition,
} from "../../lib/selectionFunctions/getAndSetSelection";

import BlockElement from "./block/BlockElement";
import Toolbar from "./blockActions/Toolbar";
import CommandMenu from "./blockActions/CommandMenu";
import MobileToolBar from "./blockActions/MobileToolbar";

import type React from "react";

const TextEditor = () => {
	const divRefs = useRef<(HTMLDivElement | null)[]>([]);

	const {
		// title
		title,
		updateTitle,

		// blocks
		blocks,
		addBlock,
		deleteBlock,

		// activity
		activeBlockIndex,
		setActiveBlock,
	} = useEditorStore();

	const { isToolbarVisible } = useToolbarStore();
	const { isCommandMenuOpen, setIsCommandMenuOpen } = useCommandMenuStore();

	useEffect(() => {
		if (
			activeBlockIndex !== null &&
			activeBlockIndex !== -1 &&
			divRefs.current[activeBlockIndex]
		) {
			divRefs.current[activeBlockIndex]?.focus();
		}
	}, [activeBlockIndex]);

	type BlockKeyHandler = (e: React.KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;

	const blockKeyHandlers: Record<string, BlockKeyHandler> = {
		Enter(e, blockIndex) {
			if (isCommandMenuOpen) return;

			e.preventDefault();
			addBlock({ uuid: uuid(), type: "paragraph", content: "" }, blockIndex);
		},

		Backspace(e, blockIndex) {
			const block = blocks[blockIndex];

			const blockHaveContentField =
				block.type === "paragraph" || block.type === "code" || block.type === "header";

			if (blockHaveContentField && block.content === "/" && isCommandMenuOpen) {
				setIsCommandMenuOpen(false);
				return;
			}

			if (blockHaveContentField && block.content === "" && blockIndex !== 0) {
				e.preventDefault();
				deleteBlock(blockIndex);
				const prevElement = divRefs.current[blockIndex - 1];
				setCaretAtEndOfText(prevElement);
				return;
			}

			if (block.type === "image" || block.type === "separator") {
				deleteBlock(blockIndex);
				return;
			}
		},

		ArrowUp(e, blockIndex) {
			if (isCommandMenuOpen) return;

			const caretPosition = getCaretPosition(e.currentTarget);
			if (caretPosition > 0) return;

			e.preventDefault();
			const prev = blockIndex - 1;
			setActiveBlock(prev);
			setCaretAtEndOfText(divRefs.current[prev]);
		},

		ArrowDown(e, blockIndex) {
			if (isCommandMenuOpen) return;

			const caretPosition = getCaretPosition(e.currentTarget);
			if (caretPosition < e.currentTarget.innerText.length) return;

			e.preventDefault();
			const next = blockIndex + 1;
			if (!blocks[next]) return;

			const nextElement = divRefs.current[next];
			if (!nextElement) return;

			setActiveBlock(next);
			setCaretPosition(nextElement, 0);
		},

		"/": (_, blockIndex) => {
			const block = blocks[blockIndex];
			if (block.type === "paragraph") {
				if (block.content === "") setIsCommandMenuOpen(true);
				if (block.content === "/") setIsCommandMenuOpen(false);
			}
		},
	};

	const keyDownOnBlock = (e: KeyboardEvent<HTMLDivElement>, blockIndex: number) =>
		blockKeyHandlers[e.key]?.(e, blockIndex);

	return (
		<div className="min-h-96">
			<div className="flex flex-col gap-6">
				<textarea
					className="text-editor-input resize-none overflow-hidden h-auto text-4xl font-bold"
					value={title}
					placeholder={title ? "" : "Title..."}
					rows={1}
					onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
						if (e.key === "Enter") {
							e.preventDefault();
							setActiveBlock(0);
							divRefs.current[0]?.focus();
						}
					}}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
						updateTitle(e.currentTarget.value)
					}
					onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
						const target = e.currentTarget;
						target.style.height = "auto";
						target.style.height = target.scrollHeight + "px";
					}}
				/>

				<div className="flex flex-col gap-4">
					{!IS_MOBILE && isToolbarVisible && <Toolbar />}
					{!IS_MOBILE && isCommandMenuOpen && <CommandMenu />}
					{blocks.map((block, i) => (
						<BlockElement
							key={block.uuid}
							index={i}
							block={block}
							keyDownOnBlock={keyDownOnBlock}
							setRef={(el) => (divRefs.current[i] = el)}
						/>
					))}
				</div>
			</div>
			{IS_MOBILE && <MobileToolBar />}
		</div>
	);
};

export default TextEditor;
