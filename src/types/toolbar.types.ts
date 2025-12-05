export type TextModeificationCommand = "bold" | "italic" | "code" | "mark" | "link";

export type ToolbarPosition = {
    top: number;
    left: number;
};

type ToolbarState = {
    showToolbar: boolean;
    toolbarPosition: ToolbarPosition;
    selectedText: string;
};

type ToolbarAction = {
    setShowToolbar(show: boolean): void;
    setSelectedText(text: string): void;
    setToolbarPosition(top: number, left: number): void;
};

export type ToolbarStore = ToolbarState & ToolbarAction;