import { useRef, useState } from "react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import type { SeparatorBlock as SeparatorBlockType } from "../../../types/editor/block.types";
import useAutoFocus from "./hooks/useAutoFocus";

type SeparatorBlockProps = {
	block: SeparatorBlockType;
	index: number;
	setRef: (el: HTMLElement | null) => void;
	keyDownOnBlock: (e: React.KeyboardEvent<HTMLElement>, blockIndex: number) => void;
};

const SeparatorBlock = ({ index, setRef, keyDownOnBlock }: SeparatorBlockProps) => {
	const { activeBlockIndex, setActiveBlock } = useEditorStore();
	const divRef = useRef<HTMLElement>(null);
	const [isActive, setIsActive] = useState<boolean>(activeBlockIndex === index);

	useAutoFocus(divRef, activeBlockIndex === index, setIsActive);

	return (
		<div
			ref={(el) => {
				divRef.current = el;
				setRef(el);
			}}
			onFocus={() => setActiveBlock(index)}
			onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => keyDownOnBlock(e, index)}
			tabIndex={0}
			className={`w-full border-none p-2 ${isActive ? "outline-2 outline-primary" : ""} rounded`}
		>
			<hr
				style={{
					border: "none",
					borderTop: "2px solid var(--color-border)",
					margin: 0,
				}}
			/>
		</div>
	);
};

export default SeparatorBlock;
