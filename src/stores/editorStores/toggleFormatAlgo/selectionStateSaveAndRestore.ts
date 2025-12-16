export function saveSelection(range: Range) {
    const startMarker = document.createElement("span");
    const endMarker = document.createElement("span");

    startMarker.dataset.selection = "start";
    endMarker.dataset.selection = "end";

    startMarker.style.display = "none";
    endMarker.style.display = "none";

    const startRange = range.cloneRange();
    startRange.collapse(true);
    startRange.insertNode(startMarker);

    const endRange = range.cloneRange();
    endRange.collapse(false);
    endRange.insertNode(endMarker);

    return { startMarker, endMarker };
}

export function restoreSelection(startMarker: HTMLElement, endMarker: HTMLElement) {
    const range = document.createRange();
    const selection = window.getSelection();
    if (!selection) return;

    range.setStartAfter(startMarker);
    range.setEndBefore(endMarker);

    startMarker.remove();
    endMarker.remove();

    selection.removeAllRanges();
    selection.addRange(range);
}