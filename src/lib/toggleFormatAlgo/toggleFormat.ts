/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TextStylesCommand } from "../../types/editor/toolbar.types";
import { findCommonFormattingAncestor, hasAncestorWithTag } from "./ancestors";
import { restoreSelection, saveSelection } from "./selectionStateSaveAndRestore";
import { flattenNestedTags, mergeAdjacentTags, removeEmptyFormatting } from "./cleanUpFunctions";
import { unwrapElement, wrapPartial } from "./wrappers";

// comparePoint method determines whether a specified point is before, within, or after the Range.
// and it returns one of these 3 values:
const BEFORE_RANGE = -1;
const INSIDE_RANGE = 0;
const AFTER_RANGE = 1;

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

	let root: Node = range.commonAncestorContainer;
	while (root.nodeType !== Node.ELEMENT_NODE && root.parentElement) root = root.parentElement;

	const shouldUnwrap = checkIfShouldUnwrap(range, textNodes, tag, href, root);

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

type SelectedNode = {
	node: Text;
	start: number;
	end: number
};

function getSelectedTextNodes(range: Range): SelectedNode[] {
	const nodes: SelectedNode[] = [];

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

	let root: Node = range.commonAncestorContainer;
	while (root.nodeType !== Node.ELEMENT_NODE && root.parentElement) root = root.parentElement;

	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	let current = walker.nextNode() as Text | null;

	while (current) {
		if (current.textContent === "") {
			current = walker.nextNode() as Text | null;
			continue
		}

		const isStartNode = current === range.startContainer;
		const isEndNode = current === range.endContainer;
		const isBetween =
			range.comparePoint(current, 0) >= INSIDE_RANGE &&
			range.comparePoint(current, current.length) <= INSIDE_RANGE;

		if (isStartNode || isEndNode || isBetween) {
			const start = isStartNode ? range.startOffset : 0;
			const end = isEndNode ? range.endOffset : current.length;

			if (start < end) nodes.push({ node: current, start, end });
		}

		current = walker.nextNode() as Text | null;
	}

	return nodes;
}

function checkIfShouldUnwrap(
	range: Range,
	textNodes: SelectedNode[],
	tag: string,
	href: string | undefined,
	root: Node
): boolean {
	// 1: check if all text nodes have the ancestor
	const ancestorResults = textNodes.map(({ node }) => hasAncestorWithTag(node, tag, href));

	const allHaveAncestor = ancestorResults.every(result => result);
	if (allHaveAncestor) return true;

	// 2: check if the common ancestor itself is the formatting tag
	let commonAncestor = range.commonAncestorContainer;
	if (commonAncestor.nodeType === Node.TEXT_NODE) {
		commonAncestor = commonAncestor.parentElement!;
	}

	let current = commonAncestor as HTMLElement | null;
	let depth = 0;
	while (current && current !== root) {
		if (current.tagName === tag) {
			if (tag !== "A") return true;

			const elementHref = current.getAttribute("href");
			if (elementHref === href) return true;
		}
		current = current.parentElement;
		depth++;
	}

	// 3: check if there's a single formatting element containing the entire selection
	const formattingElements = new Set<HTMLElement>();
	textNodes.forEach(({ node }) => {
		let parent = node.parentElement;
		let nodeDepth = 0;
		while (parent && parent !== root) {
			if (parent.tagName === tag) {
				if (tag !== "A") {
					formattingElements.add(parent);
				} else {
					const elementHref = parent.getAttribute("href");
					if (elementHref === href) formattingElements.add(parent);
				}
			}
			parent = parent.parentElement;
			nodeDepth++;
		}
	});

	if (formattingElements.size === 1) {
		const [element] = formattingElements;
		return textNodes.every(({ node }) => element.contains(node));
	}

	return false;
}
