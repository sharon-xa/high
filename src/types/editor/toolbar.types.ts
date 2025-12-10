export type TextStylesCommand = "bold" | "italic" | "code" | "mark" | "link";

export type ToolbarPosition = {
    top: number;
    left: number;
};

export type SelectedText = {
    isStyled: boolean;
    typeOfStyle: TextStylesCommand | null;

    start: number;
    end: number;
};

type ToolbarState = {
    showToolbar: boolean;
    toolbarPosition: ToolbarPosition;
    wholeText: string;
    selectedText: SelectedText;
};

type ToolbarAction = {
    setShowToolbar(show: boolean): void;
    setToolbarPosition(top: number, left: number): void;
    setWholeText(text: string): void;
    setSelectedText(selectedTextProperties: SelectedText): void;

    toggleStyle(command: TextStylesCommand): void;
    applyLink(url: string): void;
    insertImage(url: string): void;
    resetSelection(): void;
};

export type ToolbarStore = ToolbarState & ToolbarAction;