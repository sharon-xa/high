import { useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { IS_MOBILE } from "../../../lib/platform";
import { useTextSelection } from "./hooks/useTextSelection";
import { useContentSync } from "./hooks/useContentSync";
import type { ParagraphBlock as ParagraphBlockType } from "../../../types/editor/block.types";

type ParagraphBlockProps = {
    block: ParagraphBlockType;
    index: number;
    setRef: (el: HTMLDivElement | null) => void;
    keyDownOnBlock: (e: KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const ParagraphBlock = ({ block, index, setRef, keyDownOnBlock }: ParagraphBlockProps) => {
    const { activeBlockIndex, updateBlockContent, setActiveBlock } = useEditorStore();
    const { hideToolbar } = useToolbarStore();
    const { handleTextSelection } = useTextSelection();
    const divRef = useRef<HTMLDivElement>(null);

    useContentSync(block, divRef);

    useEffect(() => {
        if (activeBlockIndex === index) {
            // Use setTimeout to ensure ref is set after render
            const timeoutId = setTimeout(() => {
                if (divRef.current) {
                    divRef.current.focus();
                }
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [activeBlockIndex, index]);

    return (
        <div
            ref={(el) => {
                divRef.current = el;
                setRef(el);
            }}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => keyDownOnBlock(e, index)}
            onInput={(e: FormEvent<HTMLDivElement>) => {
                let content = e.currentTarget.innerHTML;

                // bruh, the browser adds a newline char or <br> tag by default when the contentEditable property is set to true
                content = content
                    .replace(/^<br>$/, '') // remove standalone br
                    .replace(/^<div><br><\/div>$/, '') // remove empty div with br
                    .trim();

                updateBlockContent(index, content);
            }}
            onSelect={handleTextSelection}
            onKeyUp={(e) => {
                if (['Shift'].includes(e.key)) handleTextSelection();
            }}
            onBlur={() => {
                if (!IS_MOBILE) setTimeout(() => hideToolbar(), 150);
            }}
            onFocus={() => setActiveBlock(index)}
            autoFocus={index === activeBlockIndex}
            className="text-editor-input"
        />
    );
};

export default ParagraphBlock;

