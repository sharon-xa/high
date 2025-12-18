import { Bold, CodeXml, Highlighter, Italic, Link } from "lucide-react";
import ActionButton from "./ActionButton";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";

const MobileToolbarTextStyleActions = () => {
    const { toggleStyle, applyLink, selectedText } = useToolbarStore();

    return (
        <>
            <ActionButton
                action={() => toggleStyle("bold")}
                buttonName="bold"
                className="p-2"
                ButtonContent={Bold}
                isActive={selectedText.typesOfStyle.has("bold")}
            />
            <ActionButton
                action={() => toggleStyle("italic")}
                className="p-2"
                buttonName="italic"
                ButtonContent={Italic}
                isActive={selectedText.typesOfStyle.has("italic")}
            />
            <ActionButton
                action={() => {
                    const url = window.prompt("Link URL");
                    if (url) applyLink(url);
                }}
                className="p-2"
                buttonName="link"
                ButtonContent={Link}
                isActive={selectedText.typesOfStyle.has("link")}
            />
            <ActionButton
                action={() => toggleStyle("code")}
                className="p-2"
                buttonName="code"
                ButtonContent={CodeXml}
                isActive={selectedText.typesOfStyle.has("code")}
            />
            <ActionButton
                action={() => toggleStyle("mark")}
                className="p-2"
                buttonName="mark"
                ButtonContent={Highlighter}
                isActive={selectedText.typesOfStyle.has("mark")}
            />
        </>
    )
}

export default MobileToolbarTextStyleActions;
