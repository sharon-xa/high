type SelectionDetails = {
    top: number;
    centerX: number;
    range: Range;
};

export const getSelectionDetails = (selection: Selection): SelectionDetails | null => {
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);

    const { top, centerX } = getToolbarPosition(range.getBoundingClientRect());

    return { top, centerX, range };
};


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