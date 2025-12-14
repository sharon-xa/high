import { create } from "zustand";

import type { ToolbarStore } from "../../types/editor/toolbar.types";
import { toggleFormat } from "./toggleFormatAlgo/toggleFormat";

export const useToolbarStore = create<ToolbarStore>((set) => ({
    isToolbarVisible: false,
    toolbarPosition: { top: 0, centerX: 0 },
    range: null,
    selectedText: { isStyled: false, typeOfStyle: null },

    showToolbar: () => set({ isToolbarVisible: true }),
    hideToolbar: () => set({ isToolbarVisible: false }),
    setToolbarPosition: (top, centerX) => set({
        toolbarPosition: { top, centerX }
    }),
    setRange: (range) => set({ range }),
    setSelectedText: (selectedTextProperties) => set({
        selectedText: selectedTextProperties
    }),
    toggleStyle: (cmd) => {
        const { range } = useToolbarStore.getState();
        if (range) toggleFormat(range, cmd);
    },
    applyLink: (url) => {
        const { range } = useToolbarStore.getState();
        if (range) toggleFormat(range, "link", url);
    },
}));
