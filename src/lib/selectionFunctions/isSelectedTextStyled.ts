import type { StyledText } from "../../types/editor/other.types";

export const isSelectedTextStyled = (selection: Selection | null): StyledText => {
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return { isStyled: false, typesOfStyle: new Set() };
    }

    const range = selection.getRangeAt(0);
    const styles: StyledText = { isStyled: false, typesOfStyle: new Set() };

    // Check styles at start of selection
    const checkNodeStyles = (node: Node | null) => {
        if (!node) return;

        let currentNode: Node | null = node;

        // Convert text node to parent
        if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode = currentNode.parentNode;
        }

        if (!currentNode) return;

        // Traverse up the tree
        while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
            const element = currentNode as HTMLElement;

            // Stop at contentEditable boundary
            if (element.contentEditable === 'true') {
                break;
            }

            switch (element.tagName) {
                case "STRONG":
                case "B":
                    styles.typesOfStyle.add("bold");
                    break;
                case "CODE":
                    styles.typesOfStyle.add("code");
                    break;
                case "EM":
                case "I":
                    styles.typesOfStyle.add("italic");
                    break;
                case "A":
                    styles.typesOfStyle.add("link");
                    break;
                case "MARK":
                    styles.typesOfStyle.add("mark");
                    break;
            }

            currentNode = currentNode.parentElement;
        }
    };

    // Check start and end nodes
    checkNodeStyles(range.startContainer);
    checkNodeStyles(range.endContainer);

    // If selection spans multiple nodes, check all text nodes in between
    const iterator = document.createNodeIterator(
        range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                return range.intersectsNode(node)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            }
        }
    );

    let node;
    while (node = iterator.nextNode()) {
        checkNodeStyles(node);
    }

    styles.isStyled = styles.typesOfStyle.size > 0;
    return styles;
};

// export const isSelectedTextStyled = (constNode: Node | null): StyledText => {
//     if (!constNode) return { isStyled: false, typesOfStyle: new Set() };

//     let node: Node | null = constNode;

//     if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

//     if (!node) return { isStyled: false, typesOfStyle: new Set() };

//     const styles: StyledText = { isStyled: false, typesOfStyle: new Set() };

//     while (node && node.nodeType === Node.ELEMENT_NODE) {
//         const element = node as HTMLElement;

//         if (element.contentEditable === 'true') break;

//         switch (element.tagName) {
//             case "STRONG":
//                 styles.typesOfStyle.add("bold");
//                 break;
//             case "CODE":
//                 styles.typesOfStyle.add("code");
//                 break;
//             case "EM":
//                 styles.typesOfStyle.add("italic");
//                 break;
//             case "A":
//                 styles.typesOfStyle.add("link");
//                 break;
//             case "MARK":
//                 styles.typesOfStyle.add("mark");
//                 break;
//         }

//         node = node.parentElement;
//     }

//     styles.isStyled = styles.typesOfStyle.size > 0;
//     return styles;
// };

// export const isSelectedTextStyled = (constNode: Node | null): StyledText => {
//     let node: Node | null = constNode;

//     if (!node)
//         return { isStyled: false, typesOfStyle: new Set() };

//     if (node instanceof HTMLDivElement && node.contentEditable === 'true')
//         return { isStyled: false, typesOfStyle: new Set() };

//     if (!node) return { isStyled: false, typesOfStyle: new Set() };

//     if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

//     if (!node) return { isStyled: false, typesOfStyle: new Set() };

//     const styles: StyledText = { isStyled: false, typesOfStyle: new Set() };

//     while (node && node.nodeType === Node.ELEMENT_NODE) {
//         const element = node as HTMLElement;

//         switch (element.tagName) {
//             case "STRONG":
//                 styles.typesOfStyle.add("bold");
//                 break;
//             case "CODE":
//                 styles.typesOfStyle.add("code");
//                 break;
//             case "EM":
//                 styles.typesOfStyle.add("italic");
//                 break;
//             case "A":
//                 styles.typesOfStyle.add("link");
//                 break;
//             case "MARK":
//                 styles.typesOfStyle.add("mark");
//                 break;
//         }

//         node = node.parentElement;
//     }

//     if (styles.typesOfStyle.size > 0) styles.isStyled = true;

//     return styles;
// };
