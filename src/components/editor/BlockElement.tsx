import { useEffect, useRef } from "react";
import { getCursorPosition, getSelectionDetails, isStyledText, setCursorPosition } from "./helpers";
import { useEditorStore } from "../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../stores/editorStores/toolbarStore";

import type React from "react";
import type { Block, CodeBlock, HeaderBlock, ParagraphBlock } from "../../types/editor/block.types";

type Props = {
    block: Block;
    index: number;

    setRef: (el: HTMLDivElement | null) => void;
    keyDownOnBlock: (e: React.KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const BlockElement = ({ block, index, setRef, keyDownOnBlock }: Props) => {
    const { activeBlockIndex, updateBlockContent, setActiveBlock } = useEditorStore();
    const { setSelectedText, showToolbar, hideToolbar, setToolbarPosition, setRange } = useToolbarStore();

    const divRef = useRef<HTMLDivElement>(null);

    const isTextBlock = (b: Block): b is ParagraphBlock | HeaderBlock | CodeBlock =>
        b.type === "paragraph" || b.type === "header" || b.type === "code";

    useEffect(() => {
        if (!isTextBlock(block)) return;
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
    }, [block]);

    const handleTextSelection = () => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) {
            hideToolbar();
            return null;
        }

        const selection = getSelectionDetails(sel);
        if (selection === null) return;

        setRange(selection.range);
        setToolbarPosition(selection.top, selection.centerX);
        showToolbar();

        const { isStyled, typesOfStyle } = isStyledText(selection.selectedTextElement);
        setSelectedText({ isStyled, typesOfStyle });
    };

    if (block.type === "image") {
        return (
            <div
                ref={setRef}
                className="flex justify-center"
                onFocus={() => setActiveBlock(index)}
                tabIndex={0}
            >
                <img src={block.url} alt={block.alt} className="max-w-full rounded" />
            </div>
        );
    } else if (block.type === "separator") {
        return (
            <div ref={setRef} className="my-4">
                <hr className="border-t border-neutral-200" />
            </div>
        );
    } else {
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
                    let content = e.currentTarget.innerHTML;

                    // bruh, the browser adds a newline char or <br> tag by default when the contentEditable property is set to true
                    content = content
                        .replace(/^<br>$/, '') // Remove standalone br
                        .replace(/^<div><br><\/div>$/, '') // Remove empty div with br
                        .trim();

                    updateBlockContent(index, content);
                }}
                onMouseUp={handleTextSelection}
                onTouchEnd={handleTextSelection}
                onKeyUp={(e) => {
                    if (['Shift'].includes(e.key)) {
                        handleTextSelection();
                    }
                }}
                onBlur={() => setTimeout(() => hideToolbar(), 150)}
                onFocus={() => setActiveBlock(index)}
                autoFocus={index === activeBlockIndex}
                className="text-editor-input"
            />
        )
    }
}

export default BlockElement;
