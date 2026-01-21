import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { useEditorStore } from "../../../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../../../stores/editorStores/toolbarStore";
import { IS_MOBILE } from "../../../../lib/platform";
import { handleUserInput } from "../handleUserInput";

import useTextSelection from "../hooks/useTextSelection";
import useContentSync from "../hooks/useContentSync";
import useAutoFocus from "../hooks/useAutoFocus";

import type { BlockElementProps } from "../blockElementProps";
import type { ParagraphBlock as ParagraphBlockType } from "../../../../types/editor/block.types";

interface ParagraphBlockProps extends BlockElementProps<ParagraphBlockType> { }

const ParagraphBlock = ({ block, index, setRef, keyDownOnBlock }: ParagraphBlockProps) => {
	const { activeBlockIndex, isDragging, updateBlockContent, setActiveBlock } = useEditorStore();
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
			contentEditable={isDragging === true ? "false" : "true"}
			suppressContentEditableWarning
			data-placeholder={IS_MOBILE === true ? "Text here..." : "Write, press '/' for commands..."}
			onKeyDown={(e: KeyboardEvent<HTMLElement>) => keyDownOnBlock(e, index)}
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
			className="min-h-8 w-full border-none outline-none text-paragraph"
		/>
	);
};

export default ParagraphBlock;
