import type { Block } from "../../../types/editor/block.types";
import { type KeyboardEvent } from "react";
import ParagraphBlock from "./ParagraphBlock";
import HeaderBlock from "./HeaderBlock";
import CodeBlock from "./CodeBlock";
import ImageBlockComponent from "./ImageBlock";
import SeparatorBlock from "./SeparatorBlock";

type Props = {
	block: Block;
	index: number;
	setRef: (el: HTMLDivElement | null) => void;
	keyDownOnBlock: (e: KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const BlockElement = ({ block, index, setRef, keyDownOnBlock }: Props) => {
	switch (block.type) {
		case "paragraph":
			return (
				<ParagraphBlock
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
		case "header":
			return (
				<HeaderBlock
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
		case "code":
			return (
				<CodeBlock
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
		case "image":
			return (
				<ImageBlockComponent
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
		case "separator":
			return (
				<SeparatorBlock
					block={block}
					index={index}
					setRef={setRef}
					keyDownOnBlock={keyDownOnBlock}
				/>
			);
		default:
			return null;
	}
};

export default BlockElement;
