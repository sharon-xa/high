import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { IS_MOBILE } from "../../../lib/platform";
import useTextSelection from "./hooks/useTextSelection";
import useContentSync from "./hooks/useContentSync";
import type { CodeBlock as CodeBlockType } from "../../../types/editor/block.types";
import useAutoFocus from "./hooks/useAutoFocus";

type CodeBlockProps = {
	block: CodeBlockType;
	index: number;
	setRef: (el: HTMLElement | null) => void;
	keyDownOnBlock: (e: KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const CodeBlock = ({ block, index, setRef, keyDownOnBlock }: CodeBlockProps) => {
	const { activeBlockIndex, updateBlockContent, setActiveBlock } = useEditorStore();
	const { hideToolbar } = useToolbarStore();
	const { handleTextSelection } = useTextSelection();
	const preRef = useRef<HTMLPreElement>(null);

	useContentSync(block, preRef);
	useAutoFocus(preRef, activeBlockIndex === index);

	return (
		<pre
			ref={(el) => {
				preRef.current = el;
				setRef(el as HTMLElement);
			}}
			contentEditable
			suppressContentEditableWarning
			onKeyDown={(e: KeyboardEvent<HTMLPreElement>) =>
				keyDownOnBlock(e as unknown as KeyboardEvent<HTMLDivElement>, index)
			}
			onInput={(e: FormEvent<HTMLPreElement>) => {
				let content = e.currentTarget.innerText;

				content = content.trim();

				updateBlockContent(index, content);
			}}
			onSelect={handleTextSelection}
			onKeyUp={(e: KeyboardEvent<HTMLPreElement>) => {
				if (["Shift"].includes(e.key)) handleTextSelection();
			}}
			onBlur={() => {
				if (!IS_MOBILE) setTimeout(() => hideToolbar(), 150);
			}}
			onFocus={() => setActiveBlock(index)}
			autoFocus={index === activeBlockIndex}
			className="w-full border-none outline-none"
			style={{
				fontFamily: "var(--font-fira), monospace",
				fontSize: "14px",
				backgroundColor: "rgba(53, 117, 255, 0.1)",
				padding: "12px",
				borderRadius: "4px",
				overflowX: "auto",
				whiteSpace: "pre-wrap",
				wordBreak: "break-word",
			}}
		>
			<code>{block.content}</code>
		</pre>
	);
};

export default CodeBlock;
