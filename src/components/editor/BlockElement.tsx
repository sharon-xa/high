import type React from "react";
import type { Block } from "../../types/editor.types";
import { useEffect, useRef } from "react";
import { getCursorPosition, setCursorPosition } from "./helpers";
import { useEditorStore } from "../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../stores/editorStores/toolbarStore";

type Props = {
    block: Block;
    index: number;

    setRef: (el: HTMLDivElement | null) => void;
    keyDownOnBlock: (e: React.KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const BlockElement = ({ block, index, setRef, keyDownOnBlock }: Props) => {

    const { activeBlockIndex, updateBlock, setActiveBlock } = useEditorStore();
    const { setSelectedText, setShowToolbar, setToolbarPosition } = useToolbarStore();

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current && divRef.current.innerHTML !== block.content) {
            const selection = window.getSelection();
            const cursorPos = selection && divRef.current.contains(selection.focusNode)
                ? getCursorPosition(divRef.current)
                : null;

            divRef.current.innerHTML = block.content;

            if (cursorPos !== null) {
                setCursorPosition(divRef.current, cursorPos);
            }
        }
    }, [block.content]);

    const handleTextSelection = () => {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed || !selection.rangeCount) {
            setShowToolbar(false);
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setToolbarPosition(
            rect.top + window.scrollY - 50, // 50px above selection
            rect.left + window.scrollX + rect.width / 2
        );
        setShowToolbar(true);
        console.log(selection.anchorNode?.parentNode);
        console.log("whole text:", selection.anchorNode?.textContent);
        console.log("selected text:", selection.toString());

        const wholeText = selection.anchorNode?.textContent;
        if (!wholeText) return;

        // const selectedText = selection.toString();
        setSelectedText(wholeText);
    };

    return (
        <div
            ref={(el) => {
                divRef.current = el;
                setRef(el);
            }}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => keyDownOnBlock(e, index)}
            onInput={(e: React.FormEvent<HTMLDivElement>) => {
                updateBlock(index, e.currentTarget.innerHTML);
            }}
            onMouseUp={handleTextSelection}
            onKeyUp={handleTextSelection}
            onFocus={() => setActiveBlock(index)}
            autoFocus={index === activeBlockIndex}
            className="text-editor-input"
        />
    )
}

export default BlockElement;
