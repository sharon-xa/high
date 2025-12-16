import { Bold, Code, Highlighter, Italic, Link } from "lucide-react";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { useEffect, useState } from "react";
import ActionButton from "./ActionButton";

const MobileToolBar = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const [keyboardInset, setKeyboardInset] = useState(0);
    const { toggleStyle, applyLink, selectedText } = useToolbarStore();

    useEffect(() => {
        const visualViewport = window.visualViewport;

        if (!visualViewport) return;

        const handleResize = () => {
            const viewportHeight = visualViewport.height;
            const windowHeight = window.innerHeight;
            const offsetTop = visualViewport.offsetTop || 0;
            const inset = windowHeight - (viewportHeight + offsetTop);

            if (inset > 50) {
                setKeyboardInset(inset);
            } else {
                setKeyboardInset(0);
            }
        };
        handleResize();

        visualViewport.addEventListener('resize', handleResize);
        visualViewport.addEventListener('scroll', handleResize);

        return () => {
            visualViewport.removeEventListener('resize', handleResize);
            visualViewport.removeEventListener('scroll', handleResize);
        };
    }, [isMobile]);

    return (
        <div
            className="fixed bottom-0 left-0 right-0 bg-background/10 backdrop-blur-lg border-t-2 border-border z-50"
            style={{
                bottom: keyboardInset > 0 ? `${keyboardInset}px` : '0px',
                transition: 'bottom 0.1s ease'
            }}
        >
            <div className="flex items-center justify-center gap-2 py-1">
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
                    ButtonContent={Code}
                    isActive={selectedText.typesOfStyle.has("code")}
                />
                <ActionButton
                    action={() => toggleStyle("mark")}
                    className="p-2"
                    buttonName="mark"
                    ButtonContent={Highlighter}
                    isActive={selectedText.typesOfStyle.has("mark")}
                />
            </div>
        </div>
    )
}

export default MobileToolBar;
