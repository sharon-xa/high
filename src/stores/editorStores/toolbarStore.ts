import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { toggleFormat } from "./toggleFormat";
import { useEditorStore } from "./editorStore";
import type { SelectedText, TextStylesCommand, ToolbarStore } from "../../types/editor/toolbar.types";

export const useToolbarStore = create<ToolbarStore>()(
    immer((set) => ({
        html: "",
        showToolbar: false,
        toolbarPosition: { top: 0, left: 0 },
        selectedText: { isStyled: false, typeOfStyle: null, start: 0, end: 0 },

        setHtml: (html: string) => set((draft) => {
            draft.html = html;
        }),
        setShowToolbar: (show: boolean) => set((draft) => {
            draft.showToolbar = show;
        }),
        setToolbarPosition: (top: number, left: number) => set((draft) => {
            draft.toolbarPosition.top = top;
            draft.toolbarPosition.left = left;
        }),
        setSelectedText: (selectedTextProperties: SelectedText) => set((draft) => {
            draft.selectedText = { ...selectedTextProperties };
        }),
        toggleStyle: (command: TextStylesCommand) => set((draft) => {
            const { start, end } = draft.selectedText;
            const { activeBlockIndex, updateBlockContent } = useEditorStore.getState();

            if (start === end || activeBlockIndex === null || activeBlockIndex === undefined) {
                return;
            }

            const updatedContent = toggleFormat(command);
            updateBlockContent(activeBlockIndex, updatedContent);

            draft.html = updatedContent;
            draft.showToolbar = false;
            draft.selectedText.isStyled = true;
            draft.selectedText.typeOfStyle = command;

            draft.selectedText = { start: 0, end: 0, isStyled: false, typeOfStyle: null };
        }),
        applyLink: (url) => set((draft) => {
            const { start, end } = draft.selectedText;
            const { activeBlockIndex, updateBlockContent } = useEditorStore.getState();

            if (!url || start === end || activeBlockIndex === null || activeBlockIndex === undefined) {
                return;
            }

            const updatedContent = toggleFormat("link", url);
            updateBlockContent(activeBlockIndex, updatedContent);

            draft.html = updatedContent;
            draft.showToolbar = false;
            draft.selectedText.isStyled = true;
            draft.selectedText.typeOfStyle = "link";

            draft.selectedText = { start: 0, end: 0, isStyled: false, typeOfStyle: null };
        }),
        resetSelection: () => set((draft) => {
            draft.showToolbar = false;
            draft.selectedText = { isStyled: false, typeOfStyle: null, start: 0, end: 0 };
        }),
    }))
);
