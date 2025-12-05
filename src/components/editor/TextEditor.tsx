import type React from "react";
import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { useEditorStore } from "../../stores/editorStores/editorStore";
import { getCursorPosition, setCursorPosition } from "./helpers";

import BlockElement from "./BlockElement";
import Toolbar from "./Toolbar";
import { useToolbarStore } from "../../stores/editorStores/toolbarStore";

const TextEditor = () => {
    const divRefs = useRef<(HTMLDivElement | null)[]>([]);

    const {
        // title
        title,
        updateTitle,

        // blocks
        blocks,
        addEmptyBlock,
        deleteBlock,

        // activity
        activeBlockIndex,
        setActiveBlock,

    } = useEditorStore();

    const { showToolbar } = useToolbarStore();

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
                addEmptyBlock("paragraph", blockIndex);
                break;
            }
            case "Backspace": {
                if (blocks[blockIndex].content === "" && blockIndex !== 0) {
                    e.preventDefault();
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
                    if (prevElement) {
                        const textSize = prevElement.innerText.length;
                        setCursorPosition(prevElement, textSize);
                    }
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
        }
    }

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
                    {showToolbar && <Toolbar />}
                    {blocks.map((block, i) => (
                        <BlockElement
                            key={block.uuid}
                            index={i}
                            block={block}
                            keyDownOnBlock={keyDownOnBlock}
                            setRef={(el) => divRefs.current[i] = el}
                        />
                    ))}
                    <button className="bg-primary-50 active:bg-primary py-1.5 flex justify-center items-center rounded cursor-pointer">
                        <Plus size={32} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextEditor;
