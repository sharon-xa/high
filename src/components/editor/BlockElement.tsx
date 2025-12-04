import type React from "react";
import type { Block } from "../../types/editor.types";
import { useEffect, useRef } from "react";
import { getCursorPosition, setCursorPosition } from "./helpers";
import { useEditorStore } from "../../stores/editorStore";

type Props = {
    block: Block;
    index: number;

    setRef: (el: HTMLDivElement | null) => void;
    keyDownOnBlock: (e: React.KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const BlockElement = ({ block, index, setRef, keyDownOnBlock }: Props) => {

    const { activeBlockIndex, updateBlock, setActiveBlock, setShowToolbar, setToolbarPosition } = useEditorStore();

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
            setShowToolbar(true);
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setToolbarPosition(
            rect.top + window.scrollY - 50, // 50px above selection
            rect.left + window.scrollX + rect.width / 2
        );
        setShowToolbar(true);
    };

    return (
        <>
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
        </>
    )
}

export default BlockElement;
