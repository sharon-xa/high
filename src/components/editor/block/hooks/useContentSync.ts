import { useLayoutEffect, type RefObject } from "react";
import { getCaretPosition, setCaretPosition } from "../../../../lib/selectionFunctions";
import type { ParagraphBlock, HeaderBlock, CodeBlock } from "../../../../types/editor/block.types";

type TextBlock = ParagraphBlock | HeaderBlock | CodeBlock;

const useContentSync = (block: TextBlock, elementRef: RefObject<HTMLElement | null>) => {
	useLayoutEffect(() => {
		if (!elementRef.current) return;
		const currentContent = elementRef.current.innerHTML;

		if (currentContent !== block.content) {
			const selection = window.getSelection();
			const element = elementRef.current as HTMLElement;
			const caretPos =
				selection && element.contains(selection.focusNode)
					? getCaretPosition(element)
					: null;

			elementRef.current.innerHTML = block.content;

			if (caretPos !== null && elementRef.current) {
				const maxPos = elementRef.current.textContent?.length || 0;
				const safePos = Math.min(caretPos, maxPos);

				setCaretPosition(element, safePos);
			}
		} else {
			setCaretPosition(elementRef.current, currentContent.length);
		}
	}, [elementRef.current, block.content]);
};

export default useContentSync;
