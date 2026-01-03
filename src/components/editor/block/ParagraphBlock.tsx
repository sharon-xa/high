import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { IS_MOBILE } from "../../../lib/platform";
import useTextSelection from "./hooks/useTextSelection";
import useContentSync from "./hooks/useContentSync";
import type { ParagraphBlock as ParagraphBlockType } from "../../../types/editor/block.types";
import { handleUserInput } from "./handleUserInput";
import useAutoFocus from "./hooks/useAutoFocus";

type ParagraphBlockProps = {
	block: ParagraphBlockType;
	index: number;
	setRef: (el: HTMLDivElement | null) => void;
	keyDownOnBlock: (e: KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const ParagraphBlock = ({ block, index, setRef, keyDownOnBlock }: ParagraphBlockProps) => {
	const { activeBlockIndex, updateBlockContent, setActiveBlock } = useEditorStore();
	const { hideToolbar } = useToolbarStore();
	const { handleTextSelection } = useTextSelection();
	const divRef = useRef<HTMLElement>(null);

	useContentSync(block, divRef);
	useAutoFocus(divRef, activeBlockIndex === index);

	return (
		<div
			ref={(el) => {
				divRef.current = el;
				setRef(el);
			}}
			contentEditable
			suppressContentEditableWarning
			data-placeholder="Press / for the command menu"
			onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => keyDownOnBlock(e, index)}
			onInput={(e: FormEvent<HTMLElement>) => handleUserInput(e, index, updateBlockContent)}
			onSelect={handleTextSelection}
			onKeyUp={(e) => {
				if (["Shift"].includes(e.key)) handleTextSelection();
			}}
			onBlur={() => {
				if (!IS_MOBILE) setTimeout(() => hideToolbar(), 150);
			}}
			onFocus={() => setActiveBlock(index)}
			autoFocus={index === activeBlockIndex}
			className="text-editor-input"
		/>
	);
};

export default ParagraphBlock;
