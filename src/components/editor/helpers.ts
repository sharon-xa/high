import type { TextStylesCommand } from "../../types/editor/toolbar.types";

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

export const isStyledText = (constNode: Node | null): { isStyled: boolean, typeOfStyle: TextStylesCommand | null } => {

    if (!constNode)
        return { isStyled: false, typeOfStyle: null };

    let node: Node | null = constNode;
    if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
    }

    if (!node)
        return { isStyled: false, typeOfStyle: null };

    while (node && node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;

        switch (element.tagName) {
            case "STRONG":
            case "B":
                return { isStyled: true, typeOfStyle: "bold" };
            case "CODE":
                return { isStyled: true, typeOfStyle: "code" };
            case "EM":
            case "I":
                return { isStyled: true, typeOfStyle: "italic" };
            case "A":
                return { isStyled: true, typeOfStyle: "link" };
            case "MARK":
                return { isStyled: true, typeOfStyle: "mark" };
        }

        if (element.isContentEditable) {
            break;
        }

        node = node.parentElement;
    }

    return { isStyled: false, typeOfStyle: null };
};

type SelectionDetails = {
    top: number;
    left: number;

    blockElement: HTMLElement;
    selectedTextElement: HTMLElement | null;

    startOfSelection: number;
    endOfSelection: number;
};

export const getSelectionDetails = (onNoSelection?: () => void): SelectionDetails | null => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
        if (onNoSelection) onNoSelection();
        return null;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const selectedText = range.toString().trim();

    let selectedTextElement: HTMLElement | null = null;

    const node: Node = range.startContainer;

    if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || '';
        if (textContent.includes(selectedText)) {
            selectedTextElement = node.parentElement!;
        } else {
            let sibling = node.nextSibling;
            while (sibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE) {
                    const siblingText = sibling.textContent || '';
                    if (siblingText.includes(selectedText)) {
                        selectedTextElement = sibling as HTMLElement;
                        break;
                    }
                }
                if (sibling.nodeType === Node.TEXT_NODE) {
                    const siblingText = sibling.textContent || '';
                    if (siblingText.includes(selectedText)) {
                        selectedTextElement = sibling.parentElement!;
                        break;
                    }
                }
                sibling = sibling.nextSibling;
            }

            if (!selectedTextElement) {
                selectedTextElement = node.parentElement!;
            }
        }
    } else {
        const element = node as HTMLElement;

        if (element.isContentEditable && element.getAttribute('contenteditable') === 'true') {
            const firstChild = element.firstElementChild;
            if (firstChild && firstChild.textContent?.includes(selectedText)) {
                selectedTextElement = firstChild as HTMLElement;
            } else {
                selectedTextElement = element;
            }
        } else {
            selectedTextElement = element;
        }
    }

    if (!selectedTextElement) return null;

    let blockElement: HTMLElement | null = selectedTextElement;
    while (blockElement) {
        if (blockElement.isContentEditable && blockElement.getAttribute('contenteditable') === 'true') {
            break;
        }
        blockElement = blockElement.parentElement;
    }

    if (!blockElement || !blockElement.isContentEditable)
        return null;

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(blockElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;

    return {
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX + rect.width / 2,
        blockElement: blockElement,
        selectedTextElement: selectedTextElement,
        startOfSelection: start,
        endOfSelection: end,
    };
};