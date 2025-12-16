import { create } from "zustand";

import type { ToolbarStore } from "../../types/editor/toolbar.types";
import { toggleFormat } from "./toggleFormatAlgo/toggleFormat";
import { getSelectionDetails, isStyledText } from "../../components/editor/helpers";

export const useToolbarStore = create<ToolbarStore>((set, get) => ({
    isToolbarVisible: false,
    toolbarPosition: { top: 0, centerX: 0 },
    range: null,
    selectedText: { isStyled: false, typesOfStyle: new Set },

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
        const { range } = get();
        if (!range) return;

        toggleFormat(range, cmd);

        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) {
            set({ isToolbarVisible: false });
            return null;
        }

        const selection = getSelectionDetails(sel);
        if (selection === null) return;

        const { isStyled, typesOfStyle } = isStyledText(selection.selectedTextElement);
        set({ selectedText: { isStyled, typesOfStyle } });
    },
    applyLink: (url) => {
        const { range } = useToolbarStore.getState();
        if (range) toggleFormat(range, "link", url);
    },
}));
