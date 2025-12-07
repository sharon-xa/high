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

        const visualViewport = window.visualViewport; // Store in const

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
            className="fixed bg-gray-800 text-white rounded-lg shadow-lg px-2 py-1 flex gap-2 z-50"
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
                className={`px-2 py-1 hover:bg-gray-700 rounded font-bold ${isMobile ? 'min-w-11 min-h-11 text-lg' : ''}`}
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
                className={`px-2 py-1 hover:bg-gray-700 rounded italic ${isMobile ? 'min-w-11 min-h-11 text-lg' : ''}`}
            >
                i
            </button>
        </div>
    );

    // return (
    //     <div
    //         className="fixed bg-gray-800 text-white rounded-lg shadow-lg px-2 py-1 flex gap-2 z-50"
    //         style={{
    //             top: `${toolbarPosition.top}px`,
    //             left: `${toolbarPosition.left}px`,
    //             transform: 'translateX(-50%)',
    //         }}
    //         onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
    //     >
    //         <button
    //             onClick={() => {
    //                 if (activeBlockIndex === null) {
    //                     setShowToolbar(false);
    //                     return;
    //                 }
    //                 updateBlock(activeBlockIndex, toggleFormat(wholeText, selectedText, "bold"));
    //                 setShowToolbar(false);
    //             }}
    //             className="px-2 py-1 hover:bg-gray-700 rounded font-bold"
    //         >
    //             B
    //         </button>
    //         <button
    //             onClick={() => {
    //                 if (activeBlockIndex === null) {
    //                     setShowToolbar(false);
    //                     return;
    //                 }
    //                 updateBlock(activeBlockIndex, toggleFormat(wholeText, selectedText, "italic"));
    //                 setShowToolbar(false);
    //             }}
    //             className="px-2 py-1 hover:bg-gray-700 rounded italic"
    //         >
    //             i
    //         </button>
    //     </div>
    // );
};

export default Toolbar;
