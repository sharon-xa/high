import { useRef, useState } from "react";
import { useEditorStore } from "../../../../stores/editorStores/editorStore";
import useAutoFocus from "../hooks/useAutoFocus";
import type { SeparatorBlock as SeparatorBlockType } from "../../../../types/editor/block.types";
import type { BlockElementProps } from "../blockElementProps";

interface SeparatorBlockProps extends BlockElementProps<SeparatorBlockType> { }

const SeparatorBlock = ({ index, setRef, keyDownOnBlock }: SeparatorBlockProps) => {
	const { activeBlockIndex, setActiveBlock } = useEditorStore();
	const [isActive, setIsActive] = useState<boolean>(activeBlockIndex === index);
	const divRef = useRef<HTMLElement>(null);

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
			<hr className="w-full h-0.5 bg-border border-none rounded-2xl" />
		</div>
	);
};

export default SeparatorBlock;
