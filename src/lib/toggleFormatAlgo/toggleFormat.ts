import type { TextStylesCommand } from "../../types/editor/toolbar.types";
import { findCommonFormattingAncestor, hasAncestorWithTag } from "./ancestors";
import { restoreSelection, saveSelection } from "./selectionStateSaveAndRestore";
import { flattenNestedTags, mergeAdjacentTags, removeEmptyFormatting } from "./cleanUpFunctions";
import { unwrapElement, wrapPartial } from "./wrappers";

export function toggleFormat(range: Range, command: TextStylesCommand, href?: string): void {
	if (!range || range.collapsed) return;

	const saved = saveSelection(range);

	let tag: string;
	switch (command) {
		case "bold":
			tag = "STRONG";
			break;
		case "italic":
			tag = "EM";
			break;
		case "code":
			tag = "CODE";
			break;
		case "mark":
			tag = "MARK";
			break;
		case "link":
			tag = "A";
			break;
	}

	const textNodes = getSelectedTextNodes(range);
	if (textNodes.length === 0) return;

	const root =
		range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
			? range.commonAncestorContainer
			: range.commonAncestorContainer.parentElement!;

	// TODO: fix this
	// Bug: when selecting styled text to remove the styles this function give false while it should produce true.
	const shouldUnwrap = textNodes.every(({ node }) => hasAncestorWithTag(node, tag, href));
	console.log("should unwrap:", shouldUnwrap);

	if (shouldUnwrap) {
		const ancestor = findCommonFormattingAncestor(
			textNodes.map((t) => t.node),
			tag,
			href
		);

		if (ancestor) unwrapElement(ancestor);
	} else {
		textNodes.forEach(({ node, start, end }) => {
			wrapPartial(node, start, end, tag, href);
		});
	}

	root.normalize();

	// remove empty formatting elements
	removeEmptyFormatting(root);

	["STRONG", "EM", "CODE", "MARK", "A"].forEach((tag) => {
		// flatten nested identical tags
		flattenNestedTags(root, tag);
		// merge adjacent identical tags
		mergeAdjacentTags(root, tag);
	});

	root.normalize();

	restoreSelection(saved.startMarker, saved.endMarker);
}

function getSelectedTextNodes(range: Range): Array<{ node: Text; start: number; end: number }> {
	const nodes: Array<{ node: Text; start: number; end: number }> = [];

	if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
		const text = range.commonAncestorContainer as Text;
		return [
			{
				node: text,
				start: range.startOffset,
				end: range.endOffset,
			},
		];
	}

	const root =
		range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
			? range.commonAncestorContainer
			: range.commonAncestorContainer.parentElement!;

	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	let current = walker.nextNode() as Text | null;

	while (current) {
		if (range.intersectsNode(current)) {
			const start = current === range.startContainer ? range.startOffset : 0;

			const end = current === range.endContainer ? range.endOffset : current.length;

			nodes.push({ node: current, start, end });
		}

		current = walker.nextNode() as Text | null;
	}

	return nodes;
}
