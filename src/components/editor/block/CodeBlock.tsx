import { useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { IS_MOBILE } from "../../../lib/platform";
import { useTextSelection } from "./hooks/useTextSelection";
import { useContentSync } from "./hooks/useContentSync";
import type { CodeBlock as CodeBlockType } from "../../../types/editor/block.types";

type CodeBlockProps = {
    block: CodeBlockType;
    index: number;
    setRef: (el: HTMLDivElement | null) => void;
    keyDownOnBlock: (e: KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const CodeBlock = ({ block, index, setRef, keyDownOnBlock }: CodeBlockProps) => {
    const { activeBlockIndex, updateBlockContent, setActiveBlock } = useEditorStore();
    const { hideToolbar } = useToolbarStore();
    const { handleTextSelection } = useTextSelection();
    const divRef = useRef<HTMLPreElement>(null);

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
        <pre
            ref={(el) => {
                divRef.current = el;
                setRef(el as unknown as HTMLDivElement);
            }}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={(e: KeyboardEvent<HTMLPreElement>) => keyDownOnBlock(e as unknown as KeyboardEvent<HTMLDivElement>, index)}
            onInput={(e: FormEvent<HTMLPreElement>) => {
                let content = e.currentTarget.innerText; // Use innerText for code to preserve formatting

                content = content.trim();

                updateBlockContent(index, content);
            }}
            onSelect={handleTextSelection}
            onKeyUp={(e: KeyboardEvent<HTMLPreElement>) => {
                if (['Shift'].includes(e.key)) handleTextSelection();
            }}
            onBlur={() => {
                if (!IS_MOBILE) setTimeout(() => hideToolbar(), 150);
            }}
            onFocus={() => setActiveBlock(index)}
            autoFocus={index === activeBlockIndex}
            className="text-editor-input"
            style={{
                fontFamily: 'var(--font-fira), monospace',
                fontSize: '14px',
                backgroundColor: 'rgba(53, 117, 255, 0.1)',
                padding: '12px',
                borderRadius: '4px',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
            }}
        >
            <code>{block.content}</code>
        </pre>
    );
};

export default CodeBlock;

