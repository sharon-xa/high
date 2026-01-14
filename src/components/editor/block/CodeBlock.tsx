import { useEffect, useRef, type KeyboardEvent } from "react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import type { CodeBlock as CodeBlockType } from "../../../types/editor/block.types";
import useAutoFocus from "./hooks/useAutoFocus";
import { getCaretPosition, setCaretPosition } from "../../../lib/selectionFunctions";

type CodeBlockProps = {
	block: CodeBlockType;
	index: number;
	setRef: (el: HTMLElement | null) => void;
	keyDownOnBlock: (e: KeyboardEvent<HTMLElement>, blockIndex: number) => void;
};

const CodeBlock = ({ block, index, setRef, keyDownOnBlock }: CodeBlockProps) => {
	const { activeBlockIndex, updateBlockContent, setActiveBlock } = useEditorStore();
	const preRef = useRef<HTMLPreElement>(null);

	useEffect(() => {
		if (!preRef.current) return;
		const currentContent = preRef.current.innerHTML;

		if (currentContent === block.content) return;

		const selection = window.getSelection();
		const element = preRef.current as HTMLElement;
		const caretPos =
			selection && element.contains(selection.focusNode) ? getCaretPosition(element) : null;

		preRef.current.innerHTML = block.content;

		if (caretPos !== null && preRef.current) {
			const maxPos = preRef.current.textContent?.length || 0;
			const safePos = Math.min(caretPos, maxPos);

			setCaretPosition(element, safePos);
		}
	}, [preRef.current, block.content]);

	useAutoFocus(preRef, activeBlockIndex === index);

	return (
		<pre
			ref={(el) => {
				preRef.current = el;
				setRef(el as HTMLElement);
			}}
			contentEditable
			suppressContentEditableWarning
			onKeyDown={(e: KeyboardEvent<HTMLPreElement>) => keyDownOnBlock(e, index)}
			onFocus={() => setActiveBlock(index)}
			onInput={(e) => {
				let content = e.currentTarget.innerHTML;
				content = content.replace(/^<br>$/, "").replace(/^<div><br><\/div>$/, "");

				updateBlockContent(index, content);
			}}
			autoFocus={index === activeBlockIndex}
			className="w-full border-none outline-none bg-primary/15 font-fira p-3 rounded whitespace-pre-wrap overflow-x-auto"
		>
			<code>{block.content}</code>
		</pre>
	);
};

export default CodeBlock;
