import { useEffect, type RefObject } from "react";
import {
	getCursorPosition,
	setCursorPosition,
} from "../../../../lib/selectionFunctions/getAndSetSelection";
import type { ParagraphBlock, HeaderBlock, CodeBlock } from "../../../../types/editor/block.types";

type TextBlock = ParagraphBlock | HeaderBlock | CodeBlock;

export const useContentSync = (block: TextBlock, elementRef: RefObject<HTMLElement | null>) => {
	useEffect(() => {
		if (!elementRef.current) return;

		const currentContent = elementRef.current.innerHTML;
		if (currentContent !== block.content) {
			const selection = window.getSelection();
			const element = elementRef.current as HTMLDivElement;
			const cursorPos =
				selection && element.contains(selection.focusNode)
					? getCursorPosition(element)
					: null;

			elementRef.current.innerHTML = block.content;

			if (cursorPos !== null && elementRef.current) {
				setCursorPosition(element, cursorPos);
			}
		}
	}, [block.content, elementRef]);
};
