import type React from "react";
import type { Block } from "../../types/editor.types";
import { useEffect, useRef } from "react";
import { getCursorPosition, getSelectionDetails, isStyledText, setCursorPosition } from "./helpers";
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
    const { setWholeText, setSelectedText, setShowToolbar, setToolbarPosition } = useToolbarStore();

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
        const selection = getSelectionDetails(() => setShowToolbar(false));
        if (selection === null)
            return;

        setToolbarPosition(selection.top, selection.left);
        setShowToolbar(true);

        const { isStyled, typeOfStyle } = isStyledText(selection.selectedTextElement);

        const wholeText = selection.blockElement.innerText;
        setWholeText(wholeText);
        setSelectedText({
            isStyled,
            typeOfStyle,
            start: selection.startOfSelection,
            end: selection.endOfSelection
        });
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
                let content = e.currentTarget.innerHTML;

                // bruh, the browser adds a newline char or <br> tag by default when the contentEditable property is set to true
                content = content
                    .replace(/^<br>$/, '') // Remove standalone br
                    .replace(/^<div><br><\/div>$/, '') // Remove empty div with br
                    .trim();

                updateBlock(index, content);
            }}
            onSelect={handleTextSelection}
            onBlur={() => setTimeout(() => setShowToolbar(false), 150)}
            onFocus={() => setActiveBlock(index)}
            onPaste={(e: React.ClipboardEvent<HTMLDivElement>) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            }}
            autoFocus={index === activeBlockIndex}
            className="text-editor-input"
        />
    )
}

export default BlockElement;
