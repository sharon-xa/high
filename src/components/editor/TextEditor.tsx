import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
import ConfirmationModal from "../ui/ConfirmationModal";
import Button from "../ui/Button";

const TextEditor = () => {
	const divRefs = useRef<(HTMLElement | null)[]>([]);
	const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);

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

	const handleDiscard = () => {};

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

	type BlockKeyHandler = (
		e: React.KeyboardEvent<HTMLElement>,
		blockIndex: number,
		action?: () => void
		// this parameter was added to give the "KeyDownOnBlock" consumer the ability to insert their own action,
		// whatever that action is.
		// it's limited because the consumer can't change the behavior for example based on the clicked button.
		// make it more powerful when needed.
	) => void;

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

			if (blockHaveContentField && block.content === "") {
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
			if (block.type !== "code") return;

			e.preventDefault();

			const selection = window.getSelection();
			if (!selection || selection.rangeCount <= 0) return;

			const range = selection.getRangeAt(0);

			const tabSpaces = document.createTextNode("\t");

			range.deleteContents();
			range.insertNode(tabSpaces);

			range.setStartAfter(tabSpaces);
			range.setEndAfter(tabSpaces);
			selection.removeAllRanges();
			selection.addRange(range);

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

		" ": (_, blockIndex, action) => {
			const block = blocks[blockIndex];
			if (block.type === "image" && divRefs.current[blockIndex] === document.activeElement) {
				// TODO: simulate clicking the image placeholder to open the file picker
				action?.();
			}
		},
	};

	const ctrlShortcuts: Record<string, BlockKeyHandler> = {
		Enter(_, blockIndex) {
			const next = blockIndex + 1;
			addBlock({ uuid: uuid(), type: "paragraph", content: "" }, blockIndex);
			setActiveBlock(next);
		},
	};

	const keyDownOnBlock = (
		e: KeyboardEvent<HTMLElement>,
		blockIndex: number,
		action?: () => void
	) => {
		if (e.ctrlKey) ctrlShortcuts[e.key]?.(e, blockIndex, action);
		else blockKeyHandlers[e.key]?.(e, blockIndex, action);
	};

	return (
		<main className="w-[90%] mx-auto lg:w-[60%] lg:text-lg flex flex-col min-h-[calc(100dvh-14rem)]">
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
			<div className="flex justify-center items-center gap-6 pb-8 mt-auto pt-10">
				<Button variant="primary" onClick={() => {}}>
					Upload
				</Button>

				<Button variant="outline" onClick={() => setShowDiscardModal(true)}>
					Discard
				</Button>
			</div>
			<ConfirmationModal
				isOpen={showDiscardModal}
				onClose={() => setShowDiscardModal(false)}
				onConfirm={handleDiscard}
				title="Discard Post"
				message="Are you sure you want to discard this post? This action cannot be undone."
				confirmText="Discard"
				cancelText="Cancel"
				confirmStyle="danger"
			/>
			{IS_MOBILE && <MobileToolBar />}
		</main>
	);
};

export default TextEditor;
