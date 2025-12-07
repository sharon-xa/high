import { create } from "zustand";
import type { SelectedText, ToolbarStore } from "../../types/toolbar.types";

export const useToolbarStore = create<ToolbarStore>((set) => ({
    wholeText: "",
    showToolbar: false,
    toolbarPosition: { top: 0, left: 0 },
    selectedText: { isStyled: false, typeOfStyle: null, start: 0, end: 0 },

    setWholeText: (text: string) => set(() => ({ wholeText: text })),
    setShowToolbar: (show: boolean) => set(() => ({ showToolbar: show })),
    setToolbarPosition: (top: number, left: number) => set(() => ({ toolbarPosition: { top, left } })),
    setSelectedText: (selectedTextProperties: SelectedText) => set(() => ({
        selectedText: { ...selectedTextProperties }
    })),
}));
