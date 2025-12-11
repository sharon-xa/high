export type TextStylesCommand = "bold" | "italic" | "code" | "mark" | "link";

export type ToolbarPosition = {
    top: number;
    left: number;
};

type ToolbarState = {
    showToolbar: boolean;
    toolbarPosition: ToolbarPosition;
    range: Range | null;
};

type ToolbarAction = {
    showToolbar(): void;
    hideToolbar(): void;
    setToolbarPosition(top: number, left: number): void;

    setRange(range: Range | null): void;

    toggleStyle(command: TextStylesCommand): void;
    applyLink(url: string): void;
    resetSelection(): void;
};

export type ToolbarStore = ToolbarState & ToolbarAction;