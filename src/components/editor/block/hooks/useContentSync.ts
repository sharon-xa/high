import { useEffect, type RefObject } from "react";
import {
	getCaretPosition,
	setCaretPosition,
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
			const caretPos =
				selection && element.contains(selection.focusNode)
					? getCaretPosition(element)
					: null;

			elementRef.current.innerHTML = block.content;

			if (caretPos !== null && elementRef.current) {
				setCaretPosition(element, caretPos);
			}
		}
	}, [block.content, elementRef]);
};
