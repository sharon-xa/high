type SelectionDetails = {
    top: number;
    centerX: number;
    range: Range;
};

export const getSelectionDetails = (selection: Selection): SelectionDetails | null => {
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);

    const toolbarWidth = 174;
    const toolbarHeight = 50;
    const { top, centerX } = getObjectPosition(range.getBoundingClientRect(), toolbarWidth, toolbarHeight);

    return { top, centerX, range };
};


export function getObjectPosition(rect: DOMRect, objectWidth: number, objectHeight: number): { top: number, centerX: number } {
    const top = rect.top + window.scrollY - objectHeight;

    const halfObjectWidth = objectWidth / 2;

    let centerX = rect.left + window.scrollX + rect.width / 2;

    if (centerX - halfObjectWidth < 0) centerX = halfObjectWidth + 10;
    if (centerX + halfObjectWidth > window.innerWidth) centerX = window.innerWidth - halfObjectWidth - 10;

    return {
        top,
        centerX
    };
}

export function getObjectPositionXY(
    rect: DOMRect,
    objectWidth: number,
    objectHeight: number
): { centerX: number; centerY: number } {
    const margin = 10;

    const halfObjectWidth = objectWidth / 2;
    let centerX = rect.left + rect.width / 2;

    if (centerX - halfObjectWidth < margin) {
        centerX = halfObjectWidth + margin;
    }

    if (centerX + halfObjectWidth > window.innerWidth - margin) {
        centerX = window.innerWidth - halfObjectWidth - margin;
    }

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    let centerY: number;

    if (spaceAbove >= objectHeight + margin) {
        centerY = rect.top - objectHeight / 2 - margin;
    } else if (spaceBelow >= objectHeight + margin) {
        centerY = rect.bottom + objectHeight / 2 + margin;
    } else {
        centerY = window.innerHeight / 2;
    }

    return {
        centerX,
        centerY
    };
}
