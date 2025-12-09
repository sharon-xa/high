import { create } from "zustand";
import { toggleFormat } from "../../components/editor/helpers";
import { useEditorStore } from "./editorStore";
import type { SelectedText, TextStylesCommand, ToolbarStore } from "../../types/toolbar.types";

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
    toggleStyle: (command: TextStylesCommand) => set((state) => {
        const { start, end } = state.selectedText;
        const { activeBlockIndex, updateBlock } = useEditorStore.getState();

        if (start === end || activeBlockIndex === null || activeBlockIndex === undefined) {
            return state;
        }

        const updatedContent = toggleFormat(state.wholeText, state.selectedText, command);
        updateBlock(activeBlockIndex, updatedContent);

        return {
            wholeText: updatedContent,
            showToolbar: false,
            selectedText: {
                ...state.selectedText,
                isStyled: true,
                typeOfStyle: command
            }
        };
    }),
    applyLink: (url) => set((state) => {
        const { start, end } = state.selectedText;
        const { activeBlockIndex, updateBlock } = useEditorStore.getState();

        if (!url || start === end || activeBlockIndex === null || activeBlockIndex === undefined) {
            return state;
        }

        const updatedContent = toggleFormat(state.wholeText, state.selectedText, "link", url);
        updateBlock(activeBlockIndex, updatedContent);

        return {
            wholeText: updatedContent,
            showToolbar: false,
            selectedText: {
                ...state.selectedText,
                isStyled: true,
                typeOfStyle: "link"
            }
        };
    }),
    insertImage: (url) => set((state) => {
        const { start, end } = state.selectedText;
        const { activeBlockIndex, updateBlock } = useEditorStore.getState();

        if (!url || activeBlockIndex === null || activeBlockIndex === undefined) {
            return state;
        }

        const firstSection = state.wholeText.slice(0, start);
        const secondSection = state.wholeText.slice(end);
        const imgTag = `<img src="${url}" alt="" />`;
        const updatedContent = `${firstSection}${imgTag}${secondSection}`;

        updateBlock(activeBlockIndex, updatedContent);

        return {
            wholeText: updatedContent,
            showToolbar: false,
            selectedText: {
                ...state.selectedText,
                isStyled: false,
                typeOfStyle: null
            }
        };
    }),
    resetSelection: () => set(() => ({
        showToolbar: false,
        selectedText: { isStyled: false, typeOfStyle: null, start: 0, end: 0 }
    })),
}));
