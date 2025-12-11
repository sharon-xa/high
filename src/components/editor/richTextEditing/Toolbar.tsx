import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import ActionButton from "./ActionButton";
import { Bold, Code, Highlighter, Image, Italic, Link } from "lucide-react";

const Toolbar = () => {
    const { selectedText, toolbarPosition, toggleStyle, applyLink } = useToolbarStore();

    return (
        <div
            className="fixed outline-2 outline-light-border bg-background rounded shadow-lg p-1 flex gap-1 z-50"
            style={{
                top: `${toolbarPosition.top}px`,
                left: `${toolbarPosition.left}px`,
                transform: 'translateX(-50%)',
                transition: "bottom 0.2s ease, top 0.2s ease",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
        >
            <ActionButton
                action={() => toggleStyle("bold")}
                className="p-1"
                buttonName="bold"
                ButtonContent={Bold}
                isActive={selectedText.typeOfStyle === "bold"}
            />
            <ActionButton
                action={() => toggleStyle("italic")}
                className="p-1"
                buttonName="italic"
                ButtonContent={Italic}
                isActive={selectedText.typeOfStyle === "italic"}
            />
            <ActionButton
                action={() => toggleStyle("code")}
                className="p-1"
                buttonName="code"
                ButtonContent={Code}
                isActive={selectedText.typeOfStyle === "code"}
            />
            <ActionButton
                action={() => toggleStyle("mark")}
                className="p-1"
                buttonName="mark"
                ButtonContent={Highlighter}
                isActive={selectedText.typeOfStyle === "mark"}
            />
            <ActionButton
                action={() => {
                    const url = window.prompt("Link URL");
                    if (url) applyLink(url);
                }}
                className="p-1"
                buttonName="link"
                ButtonContent={Link}
                isActive={selectedText.typeOfStyle === "link"}
            />
        </div >
    );
};

export default Toolbar;
