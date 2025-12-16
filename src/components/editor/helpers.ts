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

type StyledText = {
    isStyled: boolean;
    typesOfStyle: Set<TextStylesCommand>;
};

export const isStyledText = (constNode: Node | null): StyledText => {
    let node: Node | null = constNode;
    console.log(node);

    if (!node)
        return { isStyled: false, typesOfStyle: new Set() };

    // drill down to text node
    while (node && node.nodeType !== Node.TEXT_NODE) {
        if (node.hasChildNodes())
            node = node.firstChild;
        else break;
    }

    if (!node)
        return { isStyled: false, typesOfStyle: new Set() };

    if (node.nodeType === Node.TEXT_NODE)
        node = node.parentNode;

    if (!node)
        return { isStyled: false, typesOfStyle: new Set() };

    const styles: StyledText = { isStyled: false, typesOfStyle: new Set() };

    while (node && node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;

        switch (element.tagName) {
            case "STRONG":
                styles.typesOfStyle.add("bold");
                break;
            case "CODE":
                styles.typesOfStyle.add("code");
                break;
            case "EM":
                styles.typesOfStyle.add("italic");
                break;
            case "A":
                styles.typesOfStyle.add("link");
                break;
            case "MARK":
                styles.typesOfStyle.add("mark");
                break;
        }

        // if (element.isContentEditable) break;

        node = node.parentElement;
    }

    if (styles.typesOfStyle.size > 0) styles.isStyled = true;

    console.log(styles);
    return styles;
};

type SelectionDetails = {
    top: number;
    centerX: number;
    selectedTextElement: HTMLElement;
    range: Range;
};

export const getSelectionDetails = (selection: Selection): SelectionDetails | null => {
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();

    const selectedTextElement = findSelectedTextElement(range, selectedText);
    if (!selectedTextElement) return null;

    const { top, centerX } = getToolbarPosition(range.getBoundingClientRect());

    return { top, centerX, selectedTextElement, range };
};

function findSelectedTextElement(range: Range, selectedText: string): HTMLElement | null {
    const node = range.startContainer;

    if (node.nodeType === Node.TEXT_NODE) {
        return findElementFromTextNode(node as Text, selectedText);
    }

    return findElementFromElementNode(node as HTMLElement, selectedText);
}

function findElementFromTextNode(textNode: Text, selectedText: string): HTMLElement | null {
    const textContent = textNode.textContent || '';

    if (textContent.includes(selectedText)) {
        return textNode.parentElement;
    }

    let sibling = textNode.nextSibling;
    while (sibling) {
        const siblingText = sibling.textContent || '';

        if (siblingText.includes(selectedText)) {
            return sibling.nodeType === Node.ELEMENT_NODE
                ? sibling as HTMLElement
                : sibling.parentElement;
        }

        sibling = sibling.nextSibling;
    }

    return textNode.parentElement;
}

function findElementFromElementNode(element: HTMLElement, selectedText: string): HTMLElement | null {
    if (element.isContentEditable && element.getAttribute('contenteditable') === 'true') {
        const firstChild = element.firstElementChild;

        if (firstChild && firstChild.textContent?.includes(selectedText)) {
            return firstChild as HTMLElement;
        }
    }

    return element;
}

function getToolbarPosition(rect: DOMRect): { top: number, centerX: number } {
    const top = rect.top + window.scrollY - 50;

    const toolbarSize = 174;
    const halfToolbarSize = toolbarSize / 2;

    let centerX = rect.left + window.scrollX + rect.width / 2;

    if (centerX - halfToolbarSize < 0) centerX = halfToolbarSize + 10;
    if (centerX + halfToolbarSize > window.innerWidth) centerX = window.innerWidth - halfToolbarSize - 10;

    return {
        top,
        centerX
    };
}

export function setCursorAtEndOfText(prevElement: HTMLDivElement | null): void {
    if (!prevElement) return;
    const textSize = prevElement.innerText.length;
    setCursorPosition(prevElement, textSize);
}
