/**
 * Returns the character offset of the caret (text cursor) within the given HTML element.
 * Useful for determining the caret position during editing operations.
 *
 * @param {HTMLElement} element - The target HTML element (typically contentEditable) to examine.
 * @returns {number} The character offset of the caret inside the element, or 0 if no selection is present.
 */
export const getCaretPosition = (element: HTMLElement): number => {
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount) return 0;

	const range = selection.getRangeAt(0);
	const preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(element);
	preCaretRange.setEnd(range.endContainer, range.endOffset);

	return preCaretRange.toString().length;
};

/**
 * Sets the caret (text cursor) to a specific character position within the given HTML element.
 *
 * @param {HTMLElement} element - The target HTMLElement to set the caret in (should be contentEditable or similar).
 * @param {number} position - The character offset at which to place the caret.
 * @returns {void}
 *
 * If the position is out of bounds, nothing happens; otherwise,
 * this will move the user's caret to the specified spot.
 */
export const setCaretPosition = (element: HTMLElement, position: number): void => {
	const range = document.createRange();
	const selection = window.getSelection();

	if (!selection) return;

	let charCount = 0;
	let found = false;

	/**
	 * Recursively traverses the node tree, updating the range when the correct
	 * text node and offset are found to match the desired caret position.
	 *
	 * @param {Node} node - The current DOM node.
	 * @returns {boolean} True if the matching node/offset was found, otherwise false.
	 */
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

/**
 * Places the caret (text cursor) at the end of the provided contenteditable element.
 *
 * @param {HTMLElement | null} prevElement - The element in which to place the caret at the end.
 *   If null, the function does nothing.
 * @returns {void}
 */
export function setCaretAtEndOfText(prevElement: HTMLElement | null): void {
	if (!prevElement) return;
	const textSize = prevElement.innerText.length;
	setCaretPosition(prevElement, textSize);
}

/**
 * Returns the deepest child node under the current caret position,
 * if it is not a text node and is not contenteditable.
 *
 * @returns {Node | null} The deepest child node under the caret, or null if not found.
 */
export function getDeepestChildUnderCaret(): Node | null {
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount) return null;

	const focusNodeParent = selection.focusNode?.parentElement;
	if (
		focusNodeParent &&
		focusNodeParent.nodeType !== Node.TEXT_NODE &&
		focusNodeParent.contentEditable !== "true"
	) {
		return focusNodeParent;
	}

	return null;
}