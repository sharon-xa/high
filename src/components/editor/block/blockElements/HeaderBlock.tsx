import { useRef, type FormEvent, type KeyboardEvent } from "react";

import useTextSelection from "../hooks/useTextSelection";
import useContentSync from "../hooks/useContentSync";
import useAutoFocus from "../hooks/useAutoFocus";

import { useEditorStore } from "../../../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../../../stores/editorStores/toolbarStore";
import { IS_MOBILE } from "../../../../lib/platform";
import { handleUserInput } from "../handleUserInput";

import type { HeaderBlock as HeaderBlockType } from "../../../../types/editor/block.types";
import type { BlockElementProps } from "../blockElementProps";

interface HeaderBlockProps extends BlockElementProps<HeaderBlockType> { };

const HeaderBlock = ({ block, index, setRef, keyDownOnBlock }: HeaderBlockProps) => {
	const { activeBlockIndex, isDragging, updateBlockContent, setActiveBlock } = useEditorStore();
	const { hideToolbar } = useToolbarStore();
	const { handleTextSelection } = useTextSelection();
	const headerRef = useRef<HTMLHeadingElement>(null);
	const level = block.level;

	useContentSync(block, headerRef);
	useAutoFocus(headerRef, activeBlockIndex === index);

	const headerProps = {
		ref: (el: HTMLHeadingElement | null) => {
			headerRef.current = el;
			setRef(el as unknown as HTMLElement);
		},
		contentEditable: isDragging ? false : true,
		suppressContentEditableWarning: true,
		"data-placeholder": `Header ${level}`,
		onKeyDown: (e: KeyboardEvent<HTMLHeadingElement>) =>
			keyDownOnBlock(e as unknown as KeyboardEvent<HTMLElement>, index),
		onInput: (e: FormEvent<HTMLHeadingElement>) =>
			handleUserInput(e, index, updateBlockContent),
		onSelect: handleTextSelection,
		onKeyUp: (e: KeyboardEvent<HTMLHeadingElement>) => {
			if (["Shift"].includes(e.key)) handleTextSelection();
		},
		onBlur: () => {
			if (!IS_MOBILE) setTimeout(() => hideToolbar(), 150);
		},
		onFocus: () => setActiveBlock(index),
		autoFocus: index === activeBlockIndex,
		className: `w-full border-none outline-none text-header font-bold ${level === 1 ? "text-4xl py-3" : level === 2 ? "text-3xl py-2" : "text-2xl py-1.5"}`,
	};

	if (level === 1) return <h1 {...headerProps} />;
	if (level === 2) return <h2 {...headerProps} />;
	return <h3 {...headerProps} />;
};

export default HeaderBlock;
