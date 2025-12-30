export function removeEmptyFormatting(root: Node) {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

	const toRemove: Element[] = [];

	let el = walker.nextNode() as Element | null;
	while (el) {
		if (["STRONG", "EM", "CODE", "MARK", "A"].includes(el.tagName)) {
			if (!el.textContent) toRemove.push(el);
		}
		el = walker.nextNode() as Element | null;
	}

	toRemove.forEach((el) => el.remove());
}

export function flattenNestedTags(root: Node, tag: string) {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

	let el = walker.nextNode() as HTMLElement | null;

	while (el) {
		if (el.tagName === tag) {
			const parent = el.parentElement;
			if (parent && parent.tagName === tag) {
				while (el.firstChild) {
					parent.insertBefore(el.firstChild, el);
				}
				el.remove();
			}
		}
		el = walker.nextNode() as HTMLElement | null;
	}
}

export function mergeAdjacentTags(root: Node, tag: string) {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

	let current = walker.nextNode() as HTMLElement | null;

	while (current) {
		if (current.tagName === tag) {
			let next = current.nextSibling;

			while (
				next &&
				next.nodeType === Node.ELEMENT_NODE &&
				(next as HTMLElement).tagName === tag
			) {
				const nextEl = next as HTMLElement;
				while (nextEl.firstChild) {
					current.appendChild(nextEl.firstChild);
				}
				const toRemove = nextEl;
				next = nextEl.nextSibling;
				toRemove.remove();
			}
		}
		current = walker.nextNode() as HTMLElement | null;
	}
}
