import type { TextStylesCommand } from "../../../types/editor/toolbar.types";
import { flattenNestedTags, mergeAdjacentTags, removeEmptyFormatting } from "./toggleFormatCleanUpFunctions";
import { unwrap, wrapPartial } from "./wrappers";

export function toggleFormat(
    range: Range,
    command: TextStylesCommand,
    href?: string
): void {
    if (!range || range.collapsed)
        return;

    let tag: string;
    switch (command) {
        case "bold": tag = "STRONG"; break;
        case "italic": tag = "EM"; break;
        case "code": tag = "CODE"; break;
        case "mark": tag = "MARK"; break;
        case "link": tag = "A"; break;
    }

    normalizeStart(range);
    normalizeEnd(range);

    const textNodes = getSelectedTextNodes(range);
    console.log(textNodes);
    if (textNodes.length === 0) return;

    const shouldUnwrap = textNodes.every((info) =>
        info.node.parentElement?.tagName === tag &&
        (tag !== "A" || info.node.parentElement.getAttribute("href") === href)
    );

    console.log("should unwrap:", shouldUnwrap);

    if (shouldUnwrap) {
        textNodes.forEach((info) => unwrap(info.node));
    } else {
        textNodes.forEach((info) => {
            wrapPartial(info.node, info.start, info.end, tag, href);
        });
    }

    // clean up iife
    (() => {
        const root =
            range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                ? range.commonAncestorContainer
                : range.commonAncestorContainer.parentElement!;

        // remove empty formatting elements
        removeEmptyFormatting(root);

        ["STRONG", "EM", "CODE", "MARK", "A"].forEach(tag => {
            // flatten nested identical tags
            flattenNestedTags(root, tag);
            // merge adjacent identical tags
            mergeAdjacentTags(root, tag);
        });
    })();
}

function getSelectedTextNodes(
    range: Range
): Array<{ node: Text; start: number; end: number }> {
    const nodes: Array<{ node: Text; start: number; end: number }> = [];

    if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
        const text = range.commonAncestorContainer as Text;
        return [{
            node: text,
            start: range.startOffset,
            end: range.endOffset,
        }];
    }

    const root =
        range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
            ? range.commonAncestorContainer
            : range.commonAncestorContainer.parentElement!;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode() as Text | null;

    while (current) {
        if (range.intersectsNode(current)) {
            const start =
                current === range.startContainer ? range.startOffset : 0;

            const end =
                current === range.endContainer ? range.endOffset : current.length;

            nodes.push({ node: current, start, end });
        }

        current = walker.nextNode() as Text | null;
    }

    return nodes;
}

function normalizeStart(range: Range): void {
    let node = range.startContainer;
    const offset = range.startOffset;

    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.childNodes.length === 0) return;

    if (offset === node.childNodes.length) {
        node = node.childNodes[offset - 1];
        while (node.nodeType !== Node.TEXT_NODE) {
            node = node.lastChild!;
        }
        range.setStart(node, (node as Text).length);
        return;
    }

    node = node.childNodes[offset];
    while (node.nodeType !== Node.TEXT_NODE) {
        node = node.firstChild!;
    }

    range.setStart(node, 0);
}

function normalizeEnd(range: Range): void {
    let node = range.endContainer;
    const offset = range.endOffset;

    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.childNodes.length === 0) return;

    if (offset === node.childNodes.length) {
        node = node.childNodes[offset - 1];
        while (node.nodeType !== Node.TEXT_NODE) {
            node = node.lastChild!;
        }
        range.setEnd(node, (node as Text).length);
        return;
    }

    node = node.childNodes[offset];
    while (node.nodeType !== Node.TEXT_NODE) {
        node = node.firstChild!;
    }

    range.setEnd(node, 0);
}
