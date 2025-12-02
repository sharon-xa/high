import type React from "react";
import { useEditorStore } from "../../stores/editorStore";
import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";

const TextEditor = () => {
    const inputRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

    const {
        // title
        title,
        updateTitle,

        // blocks
        blocks,
        addEmptyBlock,
        updateBlock,
        deleteBlock,

        // activity
        activeBlockIndex,
        setActiveBlock,
    } = useEditorStore();

    useEffect(() => {
        if (activeBlockIndex !== null && activeBlockIndex !== -1 && inputRefs.current[activeBlockIndex]) {
            inputRefs.current[activeBlockIndex]?.focus();
        }
    }, [activeBlockIndex]);

    const keyDownOnBlock = (e: React.KeyboardEvent<HTMLTextAreaElement>, blockIndex: number) => {
        const cursorPosition = e.currentTarget.selectionStart;

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
                    const textSize = inputRefs.current[previousBlock]?.value.length;
                    inputRefs.current[previousBlock]?.setSelectionRange(textSize || 0, textSize || 0);
                }
                break;
            }
            case "ArrowDown": {
                const nextBlock = blockIndex + 1;
                if (blocks.length > nextBlock && cursorPosition >= e.currentTarget.value.length) {
                    e.preventDefault();
                    setActiveBlock(nextBlock);
                    inputRefs.current[nextBlock]?.setSelectionRange(0, 0);
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
                            inputRefs.current[0]?.focus();
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
                    {blocks.map((block, i) => {
                        const baseProps = {
                            value: block.content,
                            ref: (el: HTMLTextAreaElement | null) => {
                                inputRefs.current[i] = el;
                            },
                            autoFocus: i === activeBlockIndex,
                            onFocus: () => setActiveBlock(i),
                            onInput: (e: React.FormEvent<HTMLTextAreaElement>) => {
                                const target = e.currentTarget;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                            }
                        };

                        if (block.type === "paragraph")
                            return (
                                <textarea
                                    key={block.uuid}
                                    {...baseProps}
                                    placeholder={!block.content && activeBlockIndex === i ? "Something..." : ""}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => keyDownOnBlock(e, i)}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateBlock(i, e.currentTarget.value)}
                                    rows={1}
                                    className="text-editor-input resize-none overflow-hidden h-auto"
                                />
                            );
                        else if (block.type === "headerOne")
                            return <input type="text" />;
                        else if (block.type === "headerTwo")
                            return <input type="text" />;
                        else if (block.type === "headerThree")
                            return <input type="text" />;
                        else if (block.type === "image")
                            return <input type="text" />;
                    })}
                    <button className="bg-primary-50 active:bg-primary py-1.5 flex justify-center items-center rounded cursor-pointer">
                        <Plus size={32} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextEditor;
