import { useRef, type FormEvent, type KeyboardEvent, type CSSProperties } from "react";

import useTextSelection from "./hooks/useTextSelection";
import useContentSync from "./hooks/useContentSync";

import { useEditorStore } from "../../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { IS_MOBILE } from "../../../lib/platform";
import { handleUserInput } from "./handleUserInput";

import type { HeaderBlock as HeaderBlockType } from "../../../types/editor/block.types";
import useAutoFocus from "./hooks/useAutoFocus";

type HeaderBlockProps = {
	block: HeaderBlockType;
	index: number;
	setRef: (el: HTMLElement | null) => void;
	keyDownOnBlock: (e: KeyboardEvent<HTMLElement>, blockIndex: number) => void;
};

const HeaderBlock = ({ block, index, setRef, keyDownOnBlock }: HeaderBlockProps) => {
	const { activeBlockIndex, updateBlockContent, setActiveBlock } = useEditorStore();
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
		contentEditable: true,
		"data-placeholder": `Header ${level}`,
		suppressContentEditableWarning: true,
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
		className: "w-full border-none outline-none text-header",
		style: {
			fontSize: level === 1 ? "2em" : level === 2 ? "1.5em" : "1.25em",
			fontWeight: "bold",
			margin: "0.5em 0",
		} as CSSProperties,
	};

	if (level === 1) return <h1 {...headerProps} />;
	if (level === 2) return <h2 {...headerProps} />;
	return <h3 {...headerProps} />;
};

export default HeaderBlock;
