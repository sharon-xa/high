import { applyFormat } from "./helpers";
import { useEditorStore } from "../../stores/editorStores/editorStore";
import { useToolbarStore } from "../../stores/editorStores/toolbarStore";

const Toolbar = () => {
    const { selectedText, toolbarPosition, setShowToolbar } = useToolbarStore();
    const { updateBlock } = useEditorStore();

    return (
        <div
            className="fixed bg-gray-800 text-white rounded-lg shadow-lg px-2 py-1 flex gap-2 z-50"
            style={{
                top: `${toolbarPosition.top}px`,
                left: `${toolbarPosition.left}px`,
                transform: 'translateX(-50%)',
            }}
            onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
        >
            <button
                onClick={() => {
                    console.log("selected text:", selectedText);
                    updateBlock(0, applyFormat(selectedText, "bold"));
                    setShowToolbar(false);
                }}
                className="px-2 py-1 hover:bg-gray-700 rounded font-bold"
            >
                B
            </button>
            <button
                onClick={() => {
                    updateBlock(0, applyFormat(selectedText, "italic"));
                    setShowToolbar(false);
                }}
                className="px-2 py-1 hover:bg-gray-700 rounded italic"
            >
                i
            </button>
        </div >
    )
}

export default Toolbar;
