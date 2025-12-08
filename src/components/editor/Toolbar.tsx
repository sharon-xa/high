import { toggleFormat } from "./helpers";
import { useEditorStore } from "../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../stores/editorStores/toolbarStore";
import { useEffect, useState } from "react";

const Toolbar = () => {
    const { wholeText, selectedText, toolbarPosition, setShowToolbar } = useToolbarStore();
    const { activeBlockIndex, updateBlock } = useEditorStore();

    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

    useEffect(() => {
        if (!window.visualViewport) return;

        const visualViewport = window.visualViewport;

        const handleResize = () => {
            const viewportHeight = visualViewport.height;
            const windowHeight = window.innerHeight;
            const calculatedKeyboardHeight = windowHeight - viewportHeight;

            setKeyboardHeight(calculatedKeyboardHeight);
        };

        handleResize();

        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', handleResize);

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.visualViewport?.removeEventListener('scroll', handleResize);
        };
    }, []);

    return (
        <div
            className="fixed outline outline-light-border bg-background text-white rounded-lg shadow-lg p-1 flex gap-1 z-50"
            style={{
                ...(isMobile
                    ? {
                        bottom: keyboardHeight > 50 ? `${keyboardHeight + 10}px` : '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }
                    : {
                        top: `${toolbarPosition.top}px`,
                        left: `${toolbarPosition.left}px`,
                        transform: 'translateX(-50%)',
                    }
                ),
                transition: 'bottom 0.2s ease, top 0.2s ease',
            }}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
        >
            <button
                onClick={() => {
                    if (activeBlockIndex === null) {
                        setShowToolbar(false);
                        return;
                    }
                    updateBlock(activeBlockIndex, toggleFormat(wholeText, selectedText, "bold"));
                    setShowToolbar(false);
                }}
                className={`px-2 py-1 ${selectedText.typeOfStyle && selectedText.typeOfStyle === "bold" ? "bg-light-border/25" : ""} hover:bg-light-border/25 rounded font-bold min-w-10 aspect-square text-lg`}
            >
                B
            </button>
            <button
                onClick={() => {
                    if (activeBlockIndex === null) {
                        setShowToolbar(false);
                        return;
                    }
                    updateBlock(activeBlockIndex, toggleFormat(wholeText, selectedText, "italic"));
                    setShowToolbar(false);
                }}
                className={`px-2 py-1 ${selectedText.typeOfStyle && selectedText.typeOfStyle === "italic" ? "bg-light-border/25" : ""} hover:bg-light-border/25 rounded italic min-w-10 aspect-square text-lg`}
            >
                i
            </button>
        </div>
    );
};

export default Toolbar;
