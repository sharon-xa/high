import { useRef, useEffect, type FormEvent, type KeyboardEvent, type CSSProperties } from "react";
import { useEditorStore } from "../../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { IS_MOBILE } from "../../../lib/platform";
import { useTextSelection } from "./hooks/useTextSelection";
import { useContentSync } from "./hooks/useContentSync";
import type { HeaderBlock as HeaderBlockType } from "../../../types/editor/block.types";

type HeaderBlockProps = {
    block: HeaderBlockType;
    index: number;
    setRef: (el: HTMLDivElement | null) => void;
    keyDownOnBlock: (e: KeyboardEvent<HTMLDivElement>, blockIndex: number) => void;
};

const HeaderBlock = ({ block, index, setRef, keyDownOnBlock }: HeaderBlockProps) => {
    const { activeBlockIndex, updateBlockContent, setActiveBlock } = useEditorStore();
    const { hideToolbar } = useToolbarStore();
    const { handleTextSelection } = useTextSelection();
    const divRef = useRef<HTMLHeadingElement>(null);
    const level = block.level;

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

    const headerProps = {
        ref: (el: HTMLHeadingElement | null) => {
            divRef.current = el;
            setRef(el as unknown as HTMLDivElement);
        },
        contentEditable: true,
        suppressContentEditableWarning: true,
        onKeyDown: (e: KeyboardEvent<HTMLHeadingElement>) => keyDownOnBlock(e as unknown as KeyboardEvent<HTMLDivElement>, index),
        onInput: (e: FormEvent<HTMLHeadingElement>) => {
            let content = e.currentTarget.innerHTML;

            content = content
                .replace(/^<br>$/, '')
                .replace(/^<div><br><\/div>$/, '')
                .trim();

            updateBlockContent(index, content);
        },
        onSelect: handleTextSelection,
        onKeyUp: (e: KeyboardEvent<HTMLHeadingElement>) => {
            if (['Shift'].includes(e.key)) handleTextSelection();
        },
        onBlur: () => {
            if (!IS_MOBILE) setTimeout(() => hideToolbar(), 150);
        },
        onFocus: () => setActiveBlock(index),
        autoFocus: index === activeBlockIndex,
        className: "text-editor-input",
        style: {
            fontSize: level === 1 ? '2em' : level === 2 ? '1.5em' : '1.25em',
            fontWeight: 'bold',
            margin: '0.5em 0',
        } as CSSProperties,
    };

    if (level === 1) return <h1 {...headerProps} />;
    if (level === 2) return <h2 {...headerProps} />;
    return <h3 {...headerProps} />;
};

export default HeaderBlock;

