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
	const divRefs = useRef<(HTMLElement | null)[]>([]);

	const {
		// title
		title,
		updateTitle,

		// blocks
		blocks,
		addBlock,
		deleteBlock,
		updateBlockType,

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
		)
			divRefs.current[activeBlockIndex]?.focus();
	}, [activeBlockIndex]);

	// Make sure that the element is caret dependent and if it shouldn't be moved yet.
	const isCaretDependent = (blockIndex: number) => {
		return blocks[blockIndex].type === "paragraph" || blocks[blockIndex].type === "header";
	};

	const isCaretAfterStart = (e: KeyboardEvent<HTMLElement>) => {
		return getCaretPosition(e.currentTarget) > 0;
	};

	const isCaretAtTheStart = (e: KeyboardEvent<HTMLElement>) => {
		return getCaretPosition(e.currentTarget) === 0;
	};

	const isCaretBeforeEnd = (e: KeyboardEvent<HTMLElement>) => {
		return getCaretPosition(e.currentTarget) < e.currentTarget.innerText.length;
	};

	const isCaretAtTheEnd = (e: KeyboardEvent<HTMLElement>) => {
		return getCaretPosition(e.currentTarget) === e.currentTarget.innerText.length;
	};

	type BlockKeyHandler = (e: React.KeyboardEvent<HTMLElement>, blockIndex: number) => void;

	const blockKeyHandlers: Record<string, BlockKeyHandler> = {
		Enter(e, blockIndex) {
			if (isCommandMenuOpen) return;
			if (blocks[blockIndex].type === "code") return;

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
				if (divRefs.current[blockIndex] === document.activeElement) {
					e.preventDefault();
					deleteBlock(blockIndex);
					if (
						blocks[blockIndex - 1] &&
						(blocks[blockIndex - 1].type === "paragraph" ||
							blocks[blockIndex - 1].type === "header")
					) {
						const prevElement = divRefs.current[blockIndex - 1];
						setCaretAtEndOfText(prevElement);
					}
				}
				return;
			}
		},

		ArrowUp(e, blockIndex) {
			if (isCommandMenuOpen) return;

			if (blocks[blockIndex].type === "code" && !isCaretAtTheStart(e)) return;

			if (isCaretDependent(blockIndex) && isCaretAfterStart(e)) return;

			e.preventDefault();
			const prev = blockIndex - 1;
			setActiveBlock(prev);
			setCaretAtEndOfText(divRefs.current[prev]);
		},

		ArrowDown(e, blockIndex) {
			if (isCommandMenuOpen) return;

			if (blocks[blockIndex].type === "code" && !isCaretAtTheEnd(e)) return;

			if (isCaretDependent(blockIndex) && isCaretBeforeEnd(e)) return;

			e.preventDefault();
			const next = blockIndex + 1;
			if (!blocks[next]) return;

			const nextElement = divRefs.current[next];
			if (!nextElement) return;

			setActiveBlock(next);
			setCaretPosition(nextElement, 0);
		},

		Tab(e, blockIndex) {
			const block = blocks[blockIndex];
			if (block.type === "code") {
				e.preventDefault();
				// add 4 spaces after caret and move the caret
			}
			console.log(e);
			console.log(blockIndex);
			return;
		},

		"/": (_, blockIndex) => {
			const block = blocks[blockIndex];
			if (block.type === "paragraph" || block.type === "header") {
				if (block.content === "") setIsCommandMenuOpen(true);
				if (block.content === "/") setIsCommandMenuOpen(false);
			}
		},

		"`": (_, blockIndex) => {
			const block = blocks[blockIndex];
			if (block.type === "paragraph" && block.content === "``")
				updateBlockType(blockIndex, "code");
		},

		" ": (_, blockIndex) => {
			const block = blocks[blockIndex];
			if (block.type === "image" && divRefs.current[blockIndex] === document.activeElement) {
				console.log(document.activeElement);
			}
		},
	};

	const keyDownOnBlock = (e: KeyboardEvent<HTMLElement>, blockIndex: number) =>
		blockKeyHandlers[e.key]?.(e, blockIndex);

	return (
		<div className="min-h-96">
			<div className="flex flex-col gap-6">
				<textarea
					className="w-full border-none outline-none resize-none overflow-hidden h-auto text-4xl font-bold"
					value={title}
					placeholder={title ? "" : "Title..."}
					name="title"
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
