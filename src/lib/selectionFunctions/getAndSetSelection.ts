export const getCursorPosition = (element: HTMLDivElement): number => {
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount) return 0;

	const range = selection.getRangeAt(0);
	const preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(element);
	preCaretRange.setEnd(range.endContainer, range.endOffset);

	return preCaretRange.toString().length;
};

export const setCursorPosition = (element: HTMLDivElement, position: number): void => {
	const range = document.createRange();
	const selection = window.getSelection();

	if (!selection) return;

	let charCount = 0;
	let found = false;

	const traverseNodes = (node: Node): boolean => {
		if (node.nodeType === Node.TEXT_NODE) {
			const textLength = node.textContent?.length || 0;
			if (charCount + textLength >= position) {
				range.setStart(node, position - charCount);
				range.collapse(true);
				found = true;
				return true;
			}
			charCount += textLength;
		} else {
			for (let i = 0; i < node.childNodes.length; i++) {
				if (traverseNodes(node.childNodes[i])) return true;
			}
		}
		return false;
	};

	traverseNodes(element);

	if (found) {
		selection.removeAllRanges();
		selection.addRange(range);
	}
};

export function setCursorAtEndOfText(prevElement: HTMLDivElement | null): void {
	if (!prevElement) return;
	const textSize = prevElement.innerText.length;
	setCursorPosition(prevElement, textSize);
}
