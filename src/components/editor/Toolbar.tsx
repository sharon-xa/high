import { applyFormat } from "./helpers";
import { useEditorStore } from "../../stores/editorStore";


const Toolbar = () => {
    const { selectedText, toolbarPosition } = useEditorStore();

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
                onClick={() => applyFormat(selectedText, "bold")}
                className="px-2 py-1 hover:bg-gray-700 rounded font-bold"
            >
                B
            </button>
            <button
                onClick={() => applyFormat(selectedText, "italic")}
                className="px-2 py-1 hover:bg-gray-700 rounded italic"
            >
                i
            </button>
        </div >
    )
}

export default Toolbar;
