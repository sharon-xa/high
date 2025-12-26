import { useRef, useEffect } from "react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import type { SeparatorBlock as SeparatorBlockType } from "../../../types/editor/block.types";

type SeparatorBlockProps = {
	block: SeparatorBlockType;
	index: number;
	setRef: (el: HTMLDivElement | null) => void;
	keyDownOnBlock: (e: React.KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const SeparatorBlock = ({ block, index, setRef, keyDownOnBlock }: SeparatorBlockProps) => {
	const { activeBlockIndex, setActiveBlock } = useEditorStore();
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (activeBlockIndex === index) {
			// Use setTimeout to ensure ref is set after render
			const timeoutId = setTimeout(() => {
				if (divRef.current) divRef.current.focus();
			}, 0);
			return () => clearTimeout(timeoutId);
		}
	}, [activeBlockIndex, index]);

	return (
		<div
			ref={(el) => {
				divRef.current = el;
				setRef(el);
			}}
			onFocus={() => setActiveBlock(index)}
			onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => keyDownOnBlock(e, index)}
			tabIndex={0}
			className="text-editor-input"
			style={{
				padding: "16px 0",
			}}
		>
			<hr
				style={{
					border: "none",
					borderTop: "1px solid var(--color-border)",
					margin: 0,
				}}
			/>
		</div>
	);
};

export default SeparatorBlock;
