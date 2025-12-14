export function wrapPartial(node: Text, start: number, end: number, tag: string, href?: string): void {
    if (start === 0 && end === node.length) {
        wrap(node, tag, href);
        return;
    }

    // Split the text node if needed
    const textContent = node.textContent || '';

    if (start > 0) {
        const beforeText = textContent.substring(0, start);
        const beforeNode = document.createTextNode(beforeText);
        node.parentNode?.insertBefore(beforeNode, node);
    }

    const selectedText = textContent.substring(start, end);
    const selectedNode = document.createTextNode(selectedText);
    node.parentNode?.insertBefore(selectedNode, node);
    wrap(selectedNode, tag, href);

    if (end < textContent.length) {
        const afterText = textContent.substring(end);
        const afterNode = document.createTextNode(afterText);
        node.parentNode?.insertBefore(afterNode, node);
    }

    node.parentNode?.removeChild(node);
}

function wrap(node: Text, tag: string, href?: string): void {
    if (hasAncestorWithTag(node, tag, href)) return;

    const parent = node.parentNode;
    if (!parent) return;

    const wrapper = document.createElement(tag);
    if (tag === "A" && href) wrapper.setAttribute("href", href);

    parent.insertBefore(wrapper, node);
    wrapper.appendChild(node);
}

export function unwrap(node: Text): void {
    const parent = node.parentNode as HTMLElement;
    if (!parent) return;

    const grandParent = parent.parentNode;
    if (!grandParent) return;

    grandParent.insertBefore(node, parent);
    if (parent.childNodes.length === 0) {
        grandParent.removeChild(parent);
    }
}

function hasAncestorWithTag(node: Node, tag: string, href?: string): boolean {
    let current = node.parentNode;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
        const el = current as HTMLElement;

        if (el.tagName === tag) {
            if (tag !== "A") return true;
            return el.getAttribute("href") === href;
        }

        current = current.parentNode;
    }

    return false;
}
