export function hasAncestorWithTag(node: Node, tag: string): boolean {
	let current = node.parentNode;

	while (current && current.nodeType === Node.ELEMENT_NODE) {
		const el = current as HTMLElement;

		if (el.tagName === tag) return true;

		current = current.parentNode;
	}

	return false;
}

export function findCommonFormattingAncestor(nodes: Text[], tag: string): HTMLElement | null {
	let candidate = getFormattingAncestor(nodes[0], tag);
	if (!candidate) return null;

	for (let i = 1; i < nodes.length; i++) {
		const ancestor = getFormattingAncestor(nodes[i], tag);
		if (ancestor !== candidate) return null;
	}

	return candidate;
}

function getFormattingAncestor(node: Text, tag: string): HTMLElement | null {
	let el = node.parentElement;
	while (el) {
		if (el.tagName === tag) {
			return el;
		}
		el = el.parentElement;
	}
	return null;
}
