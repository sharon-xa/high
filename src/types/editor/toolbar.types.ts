export type TextStylesCommand = "bold" | "italic" | "code" | "mark" | "link";

export type ToolbarPosition = {
    top: number;
    centerX: number;
};

export type SelectedText = {
    isStyled: boolean;
    typesOfStyle: Set<TextStylesCommand>;
};

type ToolbarState = {
    isToolbarVisible: boolean;
    toolbarPosition: ToolbarPosition;
    range: Range | null;
    selectedText: SelectedText;
};

type ToolbarAction = {
    showToolbar(): void;
    hideToolbar(): void;
    setToolbarPosition(top: number, centerX: number): void;

    setRange(range: Range | null): void;
    setSelectedText(selectedTextProperties: SelectedText): void;

    toggleStyle(command: TextStylesCommand): void;
    applyLink(url: string): void;
};

export type ToolbarStore = ToolbarState & ToolbarAction;