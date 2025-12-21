import { v4 as uuid } from "uuid";
import { useEffect, useRef } from "react";
import { IS_MOBILE } from "../../lib/platform";
import { useEditorStore } from "../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../stores/editorStores/toolbarStore";
import { useCommandMenuStore } from "../../stores/editorStores/commandMenuStore";
import { getCursorPosition, setCursorAtEndOfText, setCursorPosition } from "../../lib/selectionFunctions/getAndSetSelection";

import BlockElement from "./BlockElement";
import Toolbar from "./richTextEditing/Toolbar";
import CommandMenu from "./richTextEditing/CommandMenu";
import MobileToolBar from "./richTextEditing/MobileToolbar";

import type React from "react";

const TextEditor = () => {
    const divRefs = useRef<(HTMLDivElement | null)[]>([]);

    const {
        // title
        title,
        updateTitle,

        // blocks
        blocks,
        addBlock,
        deleteBlock,

        // activity
        activeBlockIndex,
        setActiveBlock,
    } = useEditorStore();

    const { isToolbarVisible } = useToolbarStore();
    const { isCommandMenuOpen, setIsCommandMenuOpen } = useCommandMenuStore();

    useEffect(() => {
        if (activeBlockIndex !== null && activeBlockIndex !== -1 && divRefs.current[activeBlockIndex]) {
            divRefs.current[activeBlockIndex]?.focus();
        }
    }, [activeBlockIndex]);

    const keyDownOnBlock = (e: React.KeyboardEvent<HTMLDivElement>, blockIndex: number) => {
        const cursorPosition = getCursorPosition(e.currentTarget);

        switch (e.key) {
            case "Enter": {
                e.preventDefault();
                addBlock({ uuid: uuid(), type: "paragraph", content: "" }, blockIndex);
                break;
            }
            case "Backspace": {
                const block = blocks[blockIndex];
                const blockHaveContentField = (block.type === "paragraph" || block.type === "code" || block.type === "header");

                if (blockHaveContentField && block.content === "") {
                    if (!isCommandMenuOpen && blockIndex !== 0) {
                        e.preventDefault();
                        deleteBlock(blockIndex);
                        const prevElement = divRefs.current[blockIndex - 1];
                        setCursorAtEndOfText(prevElement);
                    }

                    if (isCommandMenuOpen) setIsCommandMenuOpen(false);
                } else if (block.type === "image" || block.type === "separator") {
                    deleteBlock(blockIndex);
                }
                break;
            }
            case "ArrowUp": {
                const previousBlock = blockIndex - 1;
                if (blockIndex > 0 && cursorPosition <= 0) {
                    e.preventDefault();
                    setActiveBlock(previousBlock);
                    const prevElement = divRefs.current[previousBlock];
                    setCursorAtEndOfText(prevElement);
                }
                break;
            }
            case "ArrowDown": {
                const nextBlock = blockIndex + 1;
                if (blocks.length > nextBlock && cursorPosition >= e.currentTarget.innerText.length) {
                    e.preventDefault();
                    setActiveBlock(nextBlock);
                    const nextElement = divRefs.current[nextBlock];
                    if (nextElement) setCursorPosition(nextElement, 0);
                }
                break;
            }
            case "/": {
                if (blocks[blockIndex].type === "paragraph" && blocks[blockIndex].content === "") {
                    e.preventDefault();
                    setIsCommandMenuOpen(true);
                }
            }
        }
    };

    return (
        <div className="min-h-96">
            <div className="flex flex-col gap-6">
                <textarea
                    className="text-editor-input resize-none overflow-hidden h-auto text-4xl font-bold"
                    value={title}
                    placeholder={title ? "" : "Title..."}
                    rows={1}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            setActiveBlock(0);
                            divRefs.current[0]?.focus();
                        }
                    }}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        updateTitle(e.currentTarget.value)
                    }
                    onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                        const target = e.currentTarget;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                />

                <div className="flex flex-col gap-4">
                    {!IS_MOBILE && isToolbarVisible && <Toolbar />}
                    {!IS_MOBILE && isCommandMenuOpen && <CommandMenu />}
                    {blocks.map((block, i) => (
                        <BlockElement
                            key={block.uuid}
                            index={i}
                            block={block}
                            keyDownOnBlock={keyDownOnBlock}
                            setRef={(el) => divRefs.current[i] = el}
                        />
                    ))}
                </div>
            </div>
            {IS_MOBILE && <MobileToolBar />}
        </div>
    );
};

export default TextEditor;
