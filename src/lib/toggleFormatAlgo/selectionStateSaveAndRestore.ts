export function saveSelection(range: Range) {
	const startMarker = document.createElement("span");
	const endMarker = document.createElement("span");

	startMarker.dataset.selection = "start";
	endMarker.dataset.selection = "end";
	startMarker.style.display = "none";
	endMarker.style.display = "none";

	const endRange = range.cloneRange();
	endRange.collapse(false);
	endRange.insertNode(endMarker);

	const startRange = range.cloneRange();
	startRange.collapse(true);
	startRange.insertNode(startMarker);

	return { startMarker, endMarker };
}

export function restoreSelection(startMarker: HTMLElement, endMarker: HTMLElement) {
	const selection = window.getSelection();
	if (!selection) return;

	try {
		const range = document.createRange();

		range.setStartAfter(startMarker);
		range.setEndBefore(endMarker);

		const startParent = startMarker.parentNode;
		const endParent = endMarker.parentNode;

		startMarker.remove();
		endMarker.remove();

		selection.removeAllRanges();
		selection.addRange(range);

		startParent?.normalize();
		if (endParent && endParent !== startParent) {
			endParent.normalize();
		}
	} catch (error) {
		console.error("Failed to restore selection:", error);
		startMarker.remove();
		endMarker.remove();
	}
}
