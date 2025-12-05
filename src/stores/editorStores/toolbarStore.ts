import { create } from "zustand";
import type { ToolbarStore } from "../../types/toolbar.types";

export const useToolbarStore = create<ToolbarStore>((set) => ({
    selectedText: "",
    showToolbar: false,
    toolbarPosition: { top: 0, left: 0 },

    setShowToolbar: (show: boolean) => set(() => ({ showToolbar: show })),
    setSelectedText: (text: string) => set(() => ({ selectedText: text })),
    setToolbarPosition: (top: number, left: number) => set(() => ({ toolbarPosition: { top: top, left: left } })),
}))